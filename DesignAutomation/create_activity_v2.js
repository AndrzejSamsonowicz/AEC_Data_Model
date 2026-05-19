// create_activity_v2.js — creates DA activity v2 with result output parameter
const https = require('https');
const qs = require('querystring');
const settings = require('../server-settings.json');

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function run() {
  // Get 2-legged token
  const tokenBody = qs.stringify({ grant_type: 'client_credentials', scope: 'code:all', client_id: settings.clientId, client_secret: settings.clientSecret });
  const tr = await httpRequest({ hostname: 'developer.api.autodesk.com', path: '/authentication/v2/token', method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(tokenBody) } }, tokenBody);
  const token = JSON.parse(tr.body).access_token;
  console.log('Token obtained');

  const actId = settings.daActivityId;
  const daBase = '/da/us-east/v3';

  // Build activity definition with result output
  const cmdLine = '$(engine.path)\\revitcoreconsole.exe /i "$(args[rvtFile].path)" /al "$(appbundles[UpdateParams_1778499147].path)"';
  const actDef = {
    commandLine: [cmdLine],
    parameters: {
      rvtFile: { verb: 'get', description: 'Input Revit file', required: true,  localName: 'input.rvt' },
      params:  { verb: 'get', description: 'Parameter changes JSON', required: true, localName: 'params.json' },
      result:  { verb: 'put', description: 'Output modified Revit file', required: false, localName: 'result.rvt' }
    },
    engine: 'Autodesk.Revit+2026',
    appbundles: [`P2NZ27MFnq8SDruej5JBA5fFCb51nLTrR0fkPIS3YmoiBfAd.UpdateParams_1778499147+prod`],
    description: 'Update Revit element parameters — AEC Data Model Viewer'
  };
  const actBody = JSON.stringify(actDef);

  const ar = await httpRequest({ hostname: 'developer.api.autodesk.com', path: `${daBase}/activities/${actId}/versions`, method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(actBody) } }, actBody);
  const act = JSON.parse(ar.body);
  if (!act.version) { console.error('Failed to create activity version:', ar.body); process.exit(1); }
  console.log(`Activity v${act.version} created. Parameters: ${JSON.stringify(Object.keys(act.parameters || {}))}`);

  // Update prod alias to new version
  const aliasBody = JSON.stringify({ version: act.version });
  const alr = await httpRequest({ hostname: 'developer.api.autodesk.com', path: `${daBase}/activities/${actId}/aliases/prod`, method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(aliasBody) } }, aliasBody);
  const alias = JSON.parse(alr.body);
  console.log(`Alias prod -> v${alias.version}`);
}

run().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
