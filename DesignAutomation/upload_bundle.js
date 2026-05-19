const fs = require('fs');
const https = require('https');
const qs = require('querystring');

const settings = JSON.parse(fs.readFileSync('./server-settings.json', 'utf8'));
const zipPath = './DesignAutomation/UpdateParams/UpdateParamsBundle.zip';

async function run() {
  // Step 1: Get 2-legged token
  const tokenBody = qs.stringify({
    grant_type: 'client_credentials',
    scope: 'code:all',
    client_id: settings.clientId,
    client_secret: settings.clientSecret
  });
  const tokenData = await httpPost('developer.api.autodesk.com', '/authentication/v2/token', tokenBody, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(tokenBody)
  });
  const token = JSON.parse(tokenData).access_token;
  console.log('Token obtained');

  const daBase = '/da/us-east/v3';
  const bundleId = settings.daBundleId;

  // Step 2: Check current versions
  const versData = await httpGet('developer.api.autodesk.com', `${daBase}/appbundles/${bundleId}/versions`, { Authorization: `Bearer ${token}` });
  const versions = JSON.parse(versData);
  console.log('Current version count:', versions.data ? versions.data.length : 'N/A');

  // Step 3: Create new version
  const createBody = JSON.stringify({ engine: settings.revitEngine, description: 'correct .bundle folder structure' });
  const versionData = await httpPost('developer.api.autodesk.com', `${daBase}/appbundles/${bundleId}/versions`, createBody, {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(createBody)
  });
  const vResp = JSON.parse(versionData);
  console.log('Created version:', vResp.version);

  const formData = vResp.uploadParameters.formData;
  const uploadUrl = vResp.uploadParameters.endpointURL;
  const urlObj = new URL(uploadUrl);

  // Step 4: Upload zip via multipart
  const zipBytes = fs.readFileSync(zipPath);
  console.log('Zip size:', zipBytes.length, 'bytes');

  const boundary = '----FormBoundary' + Date.now().toString(16);
  const CRLF = '\r\n';
  const partBuffers = [];
  for (const [key, val] of Object.entries(formData)) {
    partBuffers.push(Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="${key}"${CRLF}${CRLF}${val}${CRLF}`));
  }
  partBuffers.push(Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="UpdateParamsBundle.zip"${CRLF}Content-Type: application/octet-stream${CRLF}${CRLF}`));
  partBuffers.push(zipBytes);
  partBuffers.push(Buffer.from(`${CRLF}--${boundary}--${CRLF}`));
  const body = Buffer.concat(partBuffers);

  const uploadStatus = await new Promise((resolve, reject) => {
    const opts = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + (urlObj.search || ''),
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode !== 200) reject(new Error(`S3 upload failed: ${res.statusCode} ${d.substring(0, 300)}`));
        else resolve(res.statusCode);
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
  console.log('S3 upload status:', uploadStatus, '- OK');

  // Step 5: Update alias
  const aliasBody = JSON.stringify({ version: vResp.version });
  const aliasData = await httpPatch('developer.api.autodesk.com', `${daBase}/appbundles/${bundleId}/aliases/prod`, aliasBody, {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(aliasBody)
  });
  const alias = JSON.parse(aliasData);
  console.log('Alias prod updated to v' + alias.version);
}

function httpGet(hostname, path, headers) {
  return new Promise((resolve, reject) => {
    https.get({ hostname, path, headers }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

function httpPost(hostname, path, body, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname, path, method: 'POST', headers }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function httpPatch(hostname, path, body, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname, path, method: 'PATCH', headers }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

run().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
