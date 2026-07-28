const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(__dirname));

// Store settings in a JSON file
const SETTINGS_FILE = path.join(__dirname, 'server-settings.json');

// Load settings
function loadSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
    return {
        clientId: '',
        clientSecret: '',
        callbackUrl: `http://localhost:${PORT}/api/callback`,
        region: 'US'
    };
}

// Save settings
function saveSettings(settings) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

let settings = loadSettings();

// Temporary storage for OAuth states and tokens (in production, use Redis or database)
const oauthStates = new Map();
const userTokens = new Map();

// Dev-mode session persistence — survives server restarts
const SESSION_FILE = path.join(__dirname, '.dev-sessions.json');
(function loadPersistedSessions() {
    try {
        if (fs.existsSync(SESSION_FILE)) {
            const obj = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
            for (const [k, v] of Object.entries(obj)) userTokens.set(k, v);
            console.log(`Dev: loaded ${userTokens.size} persisted session(s).`);
        }
    } catch (e) { /* ignore */ }
})();
function persistSessions() {
    const obj = {};
    for (const [k, v] of userTokens) obj[k] = v;
    try { fs.writeFileSync(SESSION_FILE, JSON.stringify(obj), 'utf8'); } catch (e) { /* ignore */ }
}

// API Routes

// Get current settings (without exposing client secret)
app.get('/api/settings', (req, res) => {
    res.json({
        clientId: settings.clientId,
        callbackUrl: settings.callbackUrl,
        region: settings.region,
        configured: !!(settings.clientId && settings.clientSecret)
    });
});

// Update settings
app.post('/api/settings', (req, res) => {
    const { clientId, clientSecret, callbackUrl, region } = req.body;
    
    settings = {
        clientId: clientId || settings.clientId,
        clientSecret: clientSecret || settings.clientSecret,
        callbackUrl: callbackUrl || settings.callbackUrl,
        region: region || settings.region
    };
    
    if (saveSettings(settings)) {
        res.json({ success: true, message: 'Settings saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to save settings' });
    }
});

// Initiate OAuth flow
app.get('/api/login', (req, res) => {
    if (!settings.clientId) {
        return res.status(400).json({ error: 'Client ID not configured' });
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    oauthStates.set(state, { timestamp: Date.now() });

    // Clean up old states (older than 10 minutes)
    for (const [key, value] of oauthStates.entries()) {
        if (Date.now() - value.timestamp > 600000) {
            oauthStates.delete(key);
        }
    }

    // Construct authorization URL
    const authUrl = new URL('https://developer.api.autodesk.com/authentication/v2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', settings.clientId);
    authUrl.searchParams.append('redirect_uri', settings.callbackUrl);
    authUrl.searchParams.append('scope', 'data:create data:read data:write viewables:read code:all openid account:read');
    authUrl.searchParams.append('state', state);

    res.json({ authUrl: authUrl.toString() });
});

// OAuth callback endpoint
app.get('/api/callback', async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.redirect(`/?error=${encodeURIComponent(error)}`);
    }

    // Verify state
    if (!state || !oauthStates.has(state)) {
        return res.redirect('/?error=invalid_state');
    }

    oauthStates.delete(state);

    if (!code) {
        return res.redirect('/?error=no_code');
    }

    try {
        // Exchange authorization code for access token
        const tokenResponse = await axios.post(
            'https://developer.api.autodesk.com/authentication/v2/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                client_id: settings.clientId,
                client_secret: settings.clientSecret,
                redirect_uri: settings.callbackUrl
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        // Generate a session ID
        const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Store token with expiration
        userTokens.set(sessionId, {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt: Date.now() + (expires_in * 1000)
        });
        persistSessions();

        // Redirect back to the app with session ID
        res.redirect(`/?session=${sessionId}`);
    } catch (error) {
        console.error('Error exchanging code for token:', error.response?.data || error.message);
        res.redirect(`/?error=${encodeURIComponent('token_exchange_failed')}`);
    }
});

// Get access token for a session
app.get('/api/token/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const tokenData = userTokens.get(sessionId);

    if (!tokenData) {
        return res.status(401).json({ error: 'Invalid session' });
    }

    // Check if token is expired
    if (Date.now() >= tokenData.expiresAt) {
        // Try to refresh the token
        try {
            const refreshResponse = await axios.post(
                'https://developer.api.autodesk.com/authentication/v2/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: tokenData.refreshToken,
                    client_id: settings.clientId,
                    client_secret: settings.clientSecret
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            const { access_token, refresh_token, expires_in } = refreshResponse.data;

            // Update stored token
            userTokens.set(sessionId, {
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: Date.now() + (expires_in * 1000)
            });

            return res.json({ accessToken: access_token });
        } catch (error) {
            console.error('Error refreshing token:', error.response?.data || error.message);
            userTokens.delete(sessionId);
            return res.status(401).json({ error: 'Token refresh failed' });
        }
    }

    res.json({ accessToken: tokenData.accessToken });
});

// Logout endpoint
app.post('/api/logout/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    userTokens.delete(sessionId);
    res.json({ success: true });
});

// Get access token for viewer (POST with sessionId in body)
app.post('/api/token', async (req, res) => {
    const { sessionId } = req.body;
    console.log('Token request received for sessionId:', sessionId);
    console.log('Available sessions:', Array.from(userTokens.keys()));
    
    const tokenData = userTokens.get(sessionId);

    if (!tokenData) {
        console.error('No token data found for session:', sessionId);
        return res.status(401).json({ error: 'Invalid session' });
    }

    console.log('Token found, expires at:', new Date(tokenData.expiresAt).toISOString());

    // Check if token is expired
    if (Date.now() >= tokenData.expiresAt) {
        // Try to refresh the token
        try {
            const refreshResponse = await axios.post(
                'https://developer.api.autodesk.com/authentication/v2/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: tokenData.refreshToken,
                    client_id: settings.clientId,
                    client_secret: settings.clientSecret
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            const { access_token, refresh_token, expires_in } = refreshResponse.data;

            // Update stored token
            userTokens.set(sessionId, {
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: Date.now() + (expires_in * 1000)
            });

            return res.json({ 
                access_token: access_token,
                token_type: 'Bearer',
                expires_in: expires_in
            });
        } catch (error) {
            console.error('Error refreshing token:', error.response?.data || error.message);
            userTokens.delete(sessionId);
            return res.status(401).json({ error: 'Token refresh failed' });
        }
    }

    // Calculate remaining time until expiry
    const expiresIn = Math.floor((tokenData.expiresAt - Date.now()) / 1000);

    res.json({ 
        access_token: tokenData.accessToken,
        token_type: 'Bearer',
        expires_in: expiresIn
    });
});

// Debug logging endpoint
app.post('/api/log', (req, res) => {
    const { level, message, timestamp, context } = req.body;
    
    // Use provided timestamp or current time if not provided
    const logTime = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    const contextText = context ? ` ${JSON.stringify(context)}` : '';
    const logEntry = `[${logTime}] [${level.toUpperCase()}] ${message}${contextText}\n`;
    
    // Append to debug.log file
    fs.appendFile(path.join(__dirname, 'debug.log'), logEntry, (err) => {
        if (err) {
            console.error('Error writing to debug.log:', err);
            return res.status(500).json({ error: 'Failed to write log' });
        }
        res.json({ success: true });
    });
});

// Clear debug log endpoint
app.post('/api/log/clear', (req, res) => {
    const logPath = path.join(__dirname, 'debug.log');
    fs.writeFile(logPath, '', (err) => {
        if (err) {
            console.error('Error clearing debug.log:', err);
            return res.status(500).json({ error: 'Failed to clear log' });
        }
        res.json({ success: true });
    });
});

// Proxy endpoint for GraphQL requests (to avoid CORS issues)
app.post('/api/graphql', async (req, res) => {
    const { query, variables, sessionId, region } = req.body;

    if (!sessionId) {
        return res.status(401).json({ error: 'No session ID provided' });
    }

    const tokenData = userTokens.get(sessionId);
    if (!tokenData) {
        return res.status(401).json({ error: 'Invalid session' });
    }

    try {
        // Use region from request, or fallback to settings region, or default to US
        const requestRegion = region || settings.region || 'US';
        
        console.log('GraphQL Request:', {
            region: requestRegion,
            query: query.substring(0, 150) + '...',
            variables
        });

        const response = await axios.post(
            'https://developer.api.autodesk.com/aec/graphql',
            { query, variables },
            {
                headers: {
                    'Authorization': `Bearer ${tokenData.accessToken}`,
                    'Content-Type': 'application/json',
                    'Region': requestRegion
                }
            }
        );

        console.log('GraphQL Response:', response.status, response.data.errors ? 'HAS ERRORS' : 'SUCCESS');
        
        if (response.data.errors) {
            console.error('GraphQL Errors:', JSON.stringify(response.data.errors, null, 2));
        }

        res.json(response.data);
    } catch (error) {
        console.error('GraphQL request error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || { message: error.message }
        });
    }
});

// REST API proxy for Data Management API - Get Hubs
app.get('/api/rest/hubs', async (req, res) => {
    const sessionId = req.query.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'No session ID provided' });
    }

    const tokenData = userTokens.get(sessionId);
    if (!tokenData) {
        return res.status(401).json({ error: 'Invalid session' });
    }

    try {
        console.log('REST API Request: GET /project/v1/hubs');

        const response = await axios.get(
            'https://developer.api.autodesk.com/project/v1/hubs',
            {
                headers: {
                    'Authorization': `Bearer ${tokenData.accessToken}`
                },
                params: req.query.filter ? { 'filter[extension.type]': req.query.filter } : {}
            }
        );

        console.log('REST API Response:', response.status, `${response.data.data?.length || 0} hubs`);
        res.json(response.data);
    } catch (error) {
        console.error('REST API error (hubs):', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || { message: error.message }
        });
    }
});

// REST API proxy for Data Management API - Get Projects
app.get('/api/rest/hubs/:hub_id/projects', async (req, res) => {
    const sessionId = req.query.sessionId;
    const hubId = req.params.hub_id;

    if (!sessionId) {
        return res.status(401).json({ error: 'No session ID provided' });
    }

    const tokenData = userTokens.get(sessionId);
    if (!tokenData) {
        return res.status(401).json({ error: 'Invalid session' });
    }

    try {
        console.log('REST API Request: GET /project/v1/hubs/' + hubId + '/projects');

        const response = await axios.get(
            `https://developer.api.autodesk.com/project/v1/hubs/${hubId}/projects`,
            {
                headers: {
                    'Authorization': `Bearer ${tokenData.accessToken}`
                }
            }
        );

        console.log('REST API Response:', response.status, `${response.data.data?.length || 0} projects`);
        res.json(response.data);
    } catch (error) {
        console.error('REST API error (projects):', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || { message: error.message }
        });
    }
});

// REST API proxy - Get top folders for a project
app.get('/api/rest/hubs/:hub_id/projects/:project_id/topFolders', async (req, res) => {
    const sessionId = req.query.sessionId;
    const { hub_id, project_id } = req.params;

    if (!sessionId) return res.status(401).json({ error: 'No session ID provided' });
    const tokenData = userTokens.get(sessionId);
    if (!tokenData) return res.status(401).json({ error: 'Invalid session' });

    try {
        console.log(`REST API Request: GET topFolders for hub=${hub_id} project=${project_id}`);
        const response = await axios.get(
            `https://developer.api.autodesk.com/project/v1/hubs/${hub_id}/projects/${project_id}/topFolders`,
            { headers: { 'Authorization': `Bearer ${tokenData.accessToken}` } }
        );
        console.log(`REST API Response: ${response.data.data?.length || 0} top folders`);
        res.json(response.data);
    } catch (error) {
        console.error('REST API error (topFolders):', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || { message: error.message }
        });
    }
});

// REST API proxy - Search a folder for Revit files (folderId passed as query param to avoid URN encoding issues)
app.get('/api/rest/projects/:project_id/folder-search', async (req, res) => {
    const { sessionId, folderId } = req.query;
    const projectId = req.params.project_id;

    if (!sessionId) return res.status(401).json({ error: 'No session ID provided' });
    if (!folderId) return res.status(400).json({ error: 'folderId query parameter required' });
    const tokenData = userTokens.get(sessionId);
    if (!tokenData) return res.status(401).json({ error: 'Invalid session' });

    try {
        const params = {};
        if (req.query['filter[extension.type]']) {
            params['filter[extension.type]'] = req.query['filter[extension.type]'];
        }
        if (req.query['page[number]']) {
            params['page[number]'] = req.query['page[number]'];
        }

        console.log(`REST API Request: folder search project=${projectId} folder=${folderId.substring(0, 50)}...`);
        const response = await axios.get(
            `https://developer.api.autodesk.com/data/v1/projects/${projectId}/folders/${encodeURIComponent(folderId)}/search`,
            {
                headers: { 'Authorization': `Bearer ${tokenData.accessToken}` },
                params
            }
        );
        console.log(`REST API Response: ${response.data.data?.length || 0} items found`);
        res.json(response.data);
    } catch (error) {
        console.error('REST API error (folder search):', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || { message: error.message }
        });
    }
});

// REST API proxy - Get folder contents (folderId passed as query param to avoid URN encoding issues)
app.get('/api/rest/projects/:project_id/folder-contents', async (req, res) => {
    const { sessionId, folderId } = req.query;
    const projectId = req.params.project_id;

    if (!sessionId) return res.status(401).json({ error: 'No session ID provided' });
    if (!folderId) return res.status(400).json({ error: 'folderId query parameter required' });
    const tokenData = userTokens.get(sessionId);
    if (!tokenData) return res.status(401).json({ error: 'Invalid session' });

    try {
        const params = {};
        if (req.query['page[number]']) params['page[number]'] = req.query['page[number]'];

        console.log(`REST API Request: folder contents project=${projectId} folder=${folderId.substring(0, 50)}...`);
        const response = await axios.get(
            `https://developer.api.autodesk.com/data/v1/projects/${projectId}/folders/${encodeURIComponent(folderId)}/contents`,
            {
                headers: { 'Authorization': `Bearer ${tokenData.accessToken}` },
                params
            }
        );
        console.log(`REST API Response: ${response.data.data?.length || 0} items in folder`);
        res.json(response.data);
    } catch (error) {
        console.error('REST API error (folder-contents):', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || { message: error.message }
        });
    }
});

// ─── Design Automation Routes ────────────────────────────────────────────────

const DA_BASE = 'https://developer.api.autodesk.com/da/us-east/v3';

// Cache 2-legged token
let _da2Legged = null;
let _da2LeggedExpiry = 0;

async function get2LeggedToken() {
    if (_da2Legged && Date.now() < _da2LeggedExpiry - 60000) return _da2Legged;
    const resp = await axios.post(
        'https://developer.api.autodesk.com/authentication/v2/token',
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: settings.clientId,
            client_secret: settings.clientSecret,
            scope: 'code:all data:read data:write data:create bucket:create bucket:read'
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    _da2Legged = resp.data.access_token;
    _da2LeggedExpiry = Date.now() + resp.data.expires_in * 1000;
    return _da2Legged;
}

// ── DA params large-payload helper ───────────────────────────────────────────────────────────
// The DA /workitems body has a ~64KB limit.  When the encoded params JSON exceeds ~50KB
// (common with large `changes` arrays) we store it in a temporary DM storage slot and pass
// a signed download URL instead of a data: URI.  This reuses the same proven
// signeds3upload/signeds3download flow used for the single-user output file.

async function _uploadParamsToDM(paramsObj, dmProjectId, itemId, userToken) {
    // 1. Create a temporary DM storage slot (same API as single-user output storage)
    const storageResp = await axios.post(
        `https://developer.api.autodesk.com/data/v1/projects/${dmProjectId}/storage`,
        { jsonapi: { version: '1.0' },
          data: { type: 'objects',
                  attributes: { name: 'da-params.json' },
                  relationships: { target: { data: { type: 'items', id: itemId } } } } },
        { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/vnd.api+json' } }
    );
    const storageUrn = storageResp.data.data.id;  // urn:adsk.objects:os.object:bucket/key
    const ossPath    = storageUrn.replace('urn:adsk.objects:os.object:', '');
    const slashIdx   = ossPath.indexOf('/');
    const bucket     = ossPath.substring(0, slashIdx);
    const objKey     = decodeURIComponent(ossPath.substring(slashIdx + 1));
    const body       = Buffer.from(JSON.stringify(paramsObj), 'utf8');

    // 2. Get a pre-signed S3 upload URL
    const initResp = await axios.get(
        `https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${encodeURIComponent(objKey)}/signeds3upload?parts=1`,
        { headers: { 'Authorization': `Bearer ${userToken}` } }
    );
    const { uploadKey, urls: [s3Url] } = initResp.data;

    // 3. Upload directly to S3 (no Authorization header — pre-signed URL)
    await axios.put(s3Url, body, { headers: { 'Content-Type': 'application/octet-stream' } });

    // 4. Complete the upload so OSS registers the object
    await axios.post(
        `https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${encodeURIComponent(objKey)}/signeds3upload`,
        { uploadKey, contentType: 'application/json' },
        { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' } }
    );

    // 5. Get a signed download URL for DA to fetch during job execution
    const dlResp = await axios.get(
        `https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${encodeURIComponent(objKey)}/signeds3download`,
        { headers: { 'Authorization': `Bearer ${userToken}` } }
    );
    console.log(`DA: params uploaded to DM storage (bucket=${bucket})`);
    return dlResp.data.url;
}

// Return a data: URI for small payloads; for large ones upload via DM storage and return a signed URL.
async function _getParamsUrl(paramsObj, dmProjectId, itemId, userToken) {
    const json = JSON.stringify(paramsObj);
    if (Buffer.byteLength(json, 'utf8') <= 50000) {
        return `data:application/json,${encodeURIComponent(json)}`;
    }
    console.log(`DA: params JSON ${Buffer.byteLength(json, 'utf8')} bytes — uploading to DM storage to avoid 413`);
    return _uploadParamsToDM(paramsObj, dmProjectId, itemId, userToken);
}
// ─────────────────────────────────────────────────────────────────────────────────────────────

// Generate unique bundle/activity IDs using Unix timestamp — guaranteed never to collide with prior sessions.
// DA enforces a permanent 100-version-per-name limit that survives DELETE, so names can never be reused.
function generateFreshDAIds() {
    const ts = Math.floor(Date.now() / 1000);
    return { bundleId: `UpdateParams_${ts}`, activityId: `UpdateRevitParams_${ts}` };
}

// Ensure DA AppBundle and Activity exist (idempotent).
// Returns the pinned activity version number so the workitem can reference it directly
// (avoids race condition where alias update hasn't propagated before workitem submission)
async function ensureDASetup(appToken, nickname, revitEngine, _retryDepth = 0) {
    if (_retryDepth > 5) throw new Error('DA: Too many retries — check server logs for 403 errors.');
    const headers = { 'Authorization': `Bearer ${appToken}`, 'Content-Type': 'application/json' };

    // Ensure we have stored unique IDs — generate fresh timestamp-based ones if missing.
    if (!settings.daBundleId || !settings.daActivityId) {
        const fresh = generateFreshDAIds();
        settings.daBundleId   = fresh.bundleId;
        settings.daActivityId = fresh.activityId;
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
        console.log(`DA: Generated fresh IDs — bundle: ${settings.daBundleId}, activity: ${settings.daActivityId}`);
    }

    // When a name is permanently exhausted (403 after delete+recreate), generate new timestamp IDs and retry.
    async function exhaustCurrentAndFindClean() {
        const fresh = generateFreshDAIds();
        settings.daBundleId   = fresh.bundleId;
        settings.daActivityId = fresh.activityId;
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
        console.log(`DA [scan] Exhausted — fresh IDs: ${fresh.bundleId} / ${fresh.activityId} — retrying automatically.`);
        return ensureDASetup(appToken, nickname, revitEngine, _retryDepth + 1);
    }

    const bundleName = settings.daBundleId;
    const activityId = settings.daActivityId;

    // Helper: create or patch an alias
    async function ensureAlias(resource, shortName, version) {
        const aliasUrl = `${DA_BASE}/${resource}/${shortName}/aliases`;
        console.log(`DA [alias] POST ${aliasUrl} → { id:'prod', version:${version} }`);
        try {
            await axios.post(aliasUrl, { id: 'prod', version }, { headers });
            console.log(`DA [alias] ✓ ${resource} '${shortName}' alias 'prod' → v${version} created.`);
        } catch (e) {
            const st = e.response?.status;
            const bd = JSON.stringify(e.response?.data);
            console.log(`DA [alias] POST returned HTTP ${st}: ${bd}`);
            if (st === 409) {
                const patchUrl = `${DA_BASE}/${resource}/${shortName}/aliases/prod`;
                console.log(`DA [alias] PATCH ${patchUrl} → { version:${version} }`);
                try {
                    await axios.patch(patchUrl, { version }, { headers });
                    console.log(`DA [alias] ✓ ${resource} '${shortName}' alias 'prod' → v${version} updated.`);
                } catch (pe) {
                    console.error(`DA [alias] PATCH failed HTTP ${pe.response?.status}: ${JSON.stringify(pe.response?.data)}`);
                    throw pe;
                }
            } else throw e;
        }
    }

    // Helper: get latest existing version number (null if not found)
    async function getLatestVersion(resource, qualifiedName) {
        try {
            const resp = await axios.get(`${DA_BASE}/${resource}/${qualifiedName}/versions`, { headers });
            const versions = (resp.data?.data || []).map(Number).filter(n => n > 0);
            return versions.length > 0 ? Math.max(...versions) : null;
        } catch (e) {
            if (e.response?.status === 404 || e.response?.status === 400) return null;
            throw e; // propagate unexpected errors (403, 500, etc.)
        }
    }

    // ── AppBundle ──────────────────────────────────────────────────────────
    const zipPath = settings.daAppBundleZipPath;
    if (!zipPath || !fs.existsSync(zipPath)) {
        throw new Error(
            `AppBundle zip not found at '${zipPath || '(not set)'}'. ` +
            `Build the C# project and set 'daAppBundleZipPath' in server-settings.json.`
        );
    }

    // Helper: create new bundle version, upload zip, and alias it
    async function uploadAndAlias(createRespData) {
        const ver = createRespData.version;
        console.log(`DA: AppBundle '${bundleName}' at v${ver} — uploading zip.`);
        const up = createRespData.uploadParameters;
        const fd = new FormData();
        Object.entries(up.formData).forEach(([k, v]) => fd.append(k, v));
        fd.append('file', new Blob([fs.readFileSync(zipPath)]), path.basename(zipPath));
        await axios.post(up.endpointURL, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        console.log(`DA: AppBundle zip uploaded.`);
        await ensureAlias('appbundles', bundleName, ver);
        console.log(`DA: AppBundle '${bundleName}' prod alias → v${ver}.`);
    }

    console.log(`DA [Bundle:1] GET alias: ${DA_BASE}/appbundles/${nickname}.${bundleName}+prod`);
    try {
        const r = await axios.get(`${DA_BASE}/appbundles/${nickname}.${bundleName}+prod`, { headers });
        const existingBundleEngine = r.data.engine;
        if (existingBundleEngine === revitEngine) {
            console.log(`DA [Bundle:1] ✓ AppBundle '${bundleName}' prod alias exists at v${r.data.version} (engine=${existingBundleEngine}).`);
        } else {
            console.log(`DA [Bundle:1] Engine mismatch — existing=${existingBundleEngine} wanted=${revitEngine} — creating new bundle version.`);
            const newBundleVerResp = await axios.post(`${DA_BASE}/appbundles/${bundleName}/versions`, {
                engine: revitEngine,
                description: 'Update Revit element parameters — AEC Data Model Viewer'
            }, { headers });
            console.log(`DA [Bundle:1] ✓ New bundle version v${newBundleVerResp.data?.version} created.`);
            await uploadAndAlias(newBundleVerResp.data);
        }
    } catch (e) {
        const eStatus = e.response?.status;
        const eBody   = JSON.stringify(e.response?.data);
        console.log(`DA [Bundle:1] HTTP ${eStatus}: ${eBody}`);
        if (eStatus !== 404 && eStatus !== 400) throw e;

        // Alias missing — create (or recreate) the bundle
        console.log(`DA [Bundle:2] Alias missing — POST /appbundles (engine=${revitEngine}).`);
        let createResp;
        try {
            createResp = await axios.post(`${DA_BASE}/appbundles`, {
                id: bundleName, engine: revitEngine,
                description: 'Update Revit element parameters — AEC Data Model Viewer'
            }, { headers });
            console.log(`DA [Bundle:2] ✓ Created v${createResp.data?.version}`);
        } catch (ce) {
            const ceStatus = ce.response?.status;
            const ceBody   = JSON.stringify(ce.response?.data);
            console.error(`DA [Bundle:2!] POST /appbundles failed — HTTP ${ceStatus}: ${ceBody}`);
            if (ceStatus === 403 || ceStatus === 409) {
                // Version limit (403) or bundle exists without alias (409) — delete entirely and recreate clean
                console.log(`DA [Bundle:2D] Deleting AppBundle '${bundleName}' (all versions + aliases).`);
                try {
                    await axios.delete(`${DA_BASE}/appbundles/${bundleName}`, { headers });
                    console.log(`DA [Bundle:2D] ✓ Delete succeeded.`);
                } catch (de) {
                    console.error(`DA [Bundle:2D!] Delete failed — HTTP ${de.response?.status}: ${JSON.stringify(de.response?.data)}`);
                    if (de.response?.status !== 404) throw de;
                    console.log(`DA [Bundle:2D] Bundle was already gone (404).`);
                }
                console.log(`DA [Bundle:2R] POST /appbundles (fresh recreate, engine=${revitEngine}).`);
                try {
                    createResp = await axios.post(`${DA_BASE}/appbundles`, {
                        id: bundleName, engine: revitEngine,
                        description: 'Update Revit element parameters — AEC Data Model Viewer'
                    }, { headers });
                    console.log(`DA [Bundle:2R] ✓ Recreated at v${createResp.data?.version}`);
                } catch (re) {
                    const reStatus = re.response?.status;
                    console.error(`DA [Bundle:2R!] Recreate POST failed — HTTP ${reStatus}: ${JSON.stringify(re.response?.data)}`);
                    if (reStatus === 403) {
                        // Name permanently exhausted — scan for next clean generation and auto-retry
                        return exhaustCurrentAndFindClean();
                    }
                    throw re;
                }
            } else throw ce;
        }
        await uploadAndAlias(createResp.data);
    }

    // ── Activity ──────────────────────────────────────────────────────────
    const activityBody = {
        commandLine: [
            `$(engine.path)\\revitcoreconsole.exe /al "$(appbundles[${bundleName}].path)"`
        ],
        parameters: {
            params:     { verb: 'get', description: 'Parameter changes + cloud model GUIDs', required: true,  localName: 'params.json' },
            inputFile:  { verb: 'get', description: 'Revit file to process (single-user download/upload flow)', required: false, localName: 'input.rvt' },
            outputFile: { verb: 'put', description: 'Processed Revit file to upload back to ACC',               required: false, localName: 'output.rvt' },
        },
        engine: revitEngine,
        appbundles: [`${nickname}.${bundleName}+prod`],
        description: 'Update Revit element parameters — AEC Data Model Viewer'
        // No settings block — dasOpenNetwork is reserved and auto-injected by DA; any attempt to declare it causes HTTP 400.
    };

    // Check alias: skip if already OK with matching engine and correct parameters
    console.log(`DA [Activity:1] GET alias: ${DA_BASE}/activities/${nickname}.${activityId}+prod`);
    let activityOk = false;
    let pinnedActivityVersion = null;  // set to the specific version to use in workitem
    try {
        const actResp = await axios.get(`${DA_BASE}/activities/${nickname}.${activityId}+prod`, { headers });
        const aliasData = actResp.data;
        const existingParams = Object.keys(aliasData.parameters || {}).sort().join(',');
        const wantedParams   = Object.keys(activityBody.parameters).sort().join(',');
        const existingCmd    = (aliasData.commandLine || []).join('|');
        const wantedCmd      = (activityBody.commandLine || []).join('|');
        console.log(`DA [Activity:1] existing: engine=${aliasData.engine}, version=${aliasData.version}, params=[${existingParams}], cmd=${existingCmd.slice(0,80)}`);
        console.log(`DA [Activity:1] wanted:   engine=${revitEngine}, params=[${wantedParams}], cmd=${wantedCmd.slice(0,80)}`);
        // Check settings: ignore reserved/auto-injected keys (dasOpenNetwork, showDetailedHeuristics).
        // Any user-defined settings beyond those indicate a stale activity version.
        const reservedSettingKeys = new Set(['dasOpenNetwork', 'showDetailedHeuristics']);
        const existingSettingsKeys = Object.keys(aliasData.settings || {}).filter(k => !reservedSettingKeys.has(k));
        const settingsOk = existingSettingsKeys.length === 0;
        if (aliasData.engine === revitEngine && existingParams === wantedParams && existingCmd === wantedCmd && settingsOk) {
            console.log(`DA [Activity:1] ✓ Activity '${activityId}' prod alias OK — skipping update.`);
            pinnedActivityVersion = aliasData.version;
            activityOk = true;
        } else if (aliasData.engine !== revitEngine) {
            console.log(`DA [Activity:1] Engine mismatch — updating.`);
        } else if (existingParams !== wantedParams) {
            console.log(`DA [Activity:1] Parameter mismatch: existing=[${existingParams}], wanted=[${wantedParams}] — updating.`);
        } else if (!settingsOk) {
            console.log(`DA [Activity:1] Settings mismatch — extra user settings [${existingSettingsKeys.join(',')}] — updating.`);
        } else {
            console.log(`DA [Activity:1] CommandLine mismatch — updating.`);
        }
    } catch (e) {
        const eStatus = e.response?.status;
        const eBody   = JSON.stringify(e.response?.data);
        console.log(`DA [Activity:1] HTTP ${eStatus}: ${eBody}`);
        if (eStatus !== 404 && eStatus !== 400) throw e;
        console.log(`DA [Activity:1] Alias not found — will create activity from scratch.`);
    }

    if (!activityOk) {
        let createResp;
        console.log(`DA [Activity:2] POST /activities (id=${activityId}, engine=${revitEngine}).`);
        try {
            createResp = await axios.post(`${DA_BASE}/activities`,
                { id: activityId, ...activityBody }, { headers });
            console.log(`DA [Activity:2] ✓ Created at v${createResp.data?.version}`);
        } catch (ce) {
            const ceStatus = ce.response?.status;
            const ceBody   = JSON.stringify(ce.response?.data);
            console.error(`DA [Activity:2!] POST /activities failed — HTTP ${ceStatus}: ${ceBody}`);
            if (ceStatus === 409) {
                // Activity exists — create new version via POST /:id/versions (documented endpoint)
                console.log(`DA [Activity:3] POST /activities/${activityId}/versions (engine=${revitEngine}).`);
                try {
                    createResp = await axios.post(`${DA_BASE}/activities/${activityId}/versions`, activityBody, { headers });
                    console.log(`DA [Activity:4] New version created: v${createResp.data?.version}`);
                } catch (pe) {
                    const peStatus = pe.response?.status;
                    const peBody   = JSON.stringify(pe.response?.data ?? pe.message);
                    console.error(`DA [Activity:3!] POST /versions failed — HTTP ${peStatus}: ${peBody}`);
                    if (peStatus === 403 || peStatus === 404) {
                        // Version limit (403) or engine unavailable (404) — delete entire activity and recreate
                        console.log(`DA [Activity:3D] Deleting activity '${activityId}' (all versions + aliases).`);
                        try {
                            await axios.delete(`${DA_BASE}/activities/${activityId}`, { headers });
                            console.log(`DA [Activity:3D] Delete succeeded.`);
                        } catch (de) {
                            console.error(`DA [Activity:3D!] Delete failed — HTTP ${de.response?.status}: ${JSON.stringify(de.response?.data)}`);
                            if (de.response?.status !== 404) throw de;
                        }
                        console.log(`DA [Activity:3R] POST /activities (fresh recreate).`);
                        try {
                            createResp = await axios.post(`${DA_BASE}/activities`,
                                { id: activityId, ...activityBody }, { headers });
                            console.log(`DA [Activity:3R] Recreated at v${createResp.data?.version}`);
                        } catch (re) {
                            if (re.response?.status === 403) {
                                console.error(`DA [Activity:3R!] Still 403 — name permanently exhausted. Scanning forward.`);
                                return exhaustCurrentAndFindClean();
                            }
                            throw re;
                        }
                    } else throw pe;
                }
            } else if (ceStatus === 403) {
                // Version limit on POST (shouldn't happen for new resource, but handle it)
                console.log(`DA [Activity:2D] Version limit on POST — deleting '${activityId}' and recreating.`);
                try {
                    await axios.delete(`${DA_BASE}/activities/${activityId}`, { headers });
                    console.log(`DA [Activity:2D] ✓ Delete succeeded.`);
                } catch (de) {
                    console.error(`DA [Activity:2D!] Delete failed — HTTP ${de.response?.status}: ${JSON.stringify(de.response?.data)}`);
                    if (de.response?.status !== 404) throw de;
                }
                console.log(`DA [Activity:2R] POST /activities (fresh recreate).`);
                try {
                    createResp = await axios.post(`${DA_BASE}/activities`,
                        { id: activityId, ...activityBody }, { headers });
                    console.log(`DA [Activity:2R] ✓ Recreated at v${createResp.data?.version}`);
                } catch (re) {
                    if (re.response?.status === 403) {
                        console.error(`DA [Activity:2R!] Still 403 — name permanently exhausted. Scanning forward.`);
                        return exhaustCurrentAndFindClean();
                    }
                    throw re;
                }
            } else throw ce;
        }
        if (createResp) {
            const ver = createResp.data.version;
            console.log(`DA [Activity:5] Aliasing v${ver} as 'prod'.`);
            try {
                await ensureAlias('activities', activityId, ver);
            } catch (ae) {
                if (ae.response?.status !== 404) throw ae;
                // DA rejected the version we just created — fall back to the actual latest
                console.warn(`DA: Activity v${ver} returned 404 during aliasing — trying latest available version.`);
                const latestVer = await getLatestVersion('activities', activityId);
                if (latestVer !== null && latestVer !== ver) {
                    await ensureAlias('activities', activityId, latestVer);
                    pinnedActivityVersion = latestVer;
                } else {
                    throw new Error(`DA: Cannot alias Activity — v${ver} not found and no valid fallback version exists.`);
                }
            }
            if (!pinnedActivityVersion) pinnedActivityVersion = ver;
        }
    }
    return { pinnedActivityVersion };
}

// GET /api/da/resolve-project?sessionId=...&hubId=...&fileVersionUrn=...
// Finds the ACC projectId by scanning the hub's projects via GraphQL,
// then matching against each project's element groups.
app.get('/api/da/resolve-project', async (req, res) => {
    const { sessionId, hubId, fileVersionUrn, region } = req.query;
    const gqlRegion = region || 'US';

    if (!sessionId) return res.status(401).json({ error: 'No session ID' });
    const tokenData = userTokens.get(sessionId);
    if (!tokenData) return res.status(401).json({ error: 'Invalid session' });
    if (!hubId || !fileVersionUrn) return res.status(400).json({ error: 'hubId and fileVersionUrn required' });

    const userToken = tokenData.accessToken;
    try {
        // Use GraphQL to get projects (same hubId format as used everywhere else)
        const projectsQuery = `query GetProjects($hubId: ID!) { projects(hubId: $hubId) { results { id name } } }`;
        const projectsResp = await axios.post(
            'https://developer.api.autodesk.com/aec/graphql',
            { query: projectsQuery, variables: { hubId } },
            { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json', 'Region': gqlRegion } }
        );
        const projects = projectsResp.data?.data?.projects?.results || [];
        console.log(`DA resolve-project: scanning ${projects.length} projects for fileVersionUrn`);

        // For each project, scan element groups to find one with matching fileVersionUrn
        const egQuery = `
            query GetEGs($projectId: ID!, $pagination: PaginationInput) {
                elementGroupsByProject(projectId: $projectId, pagination: $pagination) {
                    pagination { cursor }
                    results { id alternativeIdentifiers { fileVersionUrn } }
                }
            }`;

        for (const project of projects) {
            let cursor = null;
            do {
                const egResp = await axios.post(
                    'https://developer.api.autodesk.com/aec/graphql',
                    { query: egQuery, variables: { projectId: project.id, pagination: { limit: 100, ...(cursor ? { cursor } : {}) } } },
                    { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json', 'Region': gqlRegion } }
                );
                const data = egResp.data?.data?.elementGroupsByProject;
                const match = (data?.results || []).find(eg => eg.alternativeIdentifiers?.fileVersionUrn === fileVersionUrn);
                if (match) {
                    console.log(`DA resolve-project: found in project ${project.id} (${project.name})`);
                    return res.json({ projectId: project.id, projectName: project.name });
                }
                cursor = data?.pagination?.cursor || null;
            } while (cursor);
        }

        res.status(404).json({ error: 'File version not found in any project of this hub.' });
    } catch (err) {
        const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
        console.error('DA resolve-project error:', detail);
        res.status(err.response?.status || 500).json({ error: detail });
    }
});

// GET /api/da/diagnose
// Returns the current state of the AppBundle and Activity in DA — no changes made.
app.get('/api/da/diagnose', async (req, res) => {
    try {
        const appToken = await get2LeggedToken();
        const headers  = { 'Authorization': `Bearer ${appToken}`, 'Content-Type': 'application/json' };

        const meResp   = await axios.get(`${DA_BASE}/forgeapps/me`, { headers: { 'Authorization': `Bearer ${appToken}` } });
        const nickname = typeof meResp.data === 'string' ? meResp.data.trim() : (meResp.data.id || meResp.data.nickname || '');

        const gen        = settings.daBundleId  || 'UpdateParams';
        const bundleName = settings.daBundleId  || 'UpdateParams';
        const activityId = settings.daActivityId || 'UpdateRevitParams';
        const result = { nickname, bundleName, activityId, engine: settings.revitEngine, appbundle: {}, activity: {} };

        // AppBundle alias
        try {
            const r = await axios.get(`${DA_BASE}/appbundles/${nickname}.${bundleName}+prod`, { headers });
            result.appbundle.alias = { version: r.data.version, engine: r.data.engine };
        } catch (e) { result.appbundle.aliasError = `HTTP ${e.response?.status}: ${JSON.stringify(e.response?.data)}`; }

        // AppBundle versions list (uses unqualified id — your own resources)
        try {
            const r = await axios.get(`${DA_BASE}/appbundles/${bundleName}/versions`, { headers });
            const vers = (r.data?.data || []).map(Number).filter(n => n > 0);
            result.appbundle.versions = vers;
            result.appbundle.versionCount = vers.length;
            result.appbundle.atLimit = vers.length >= 100;
        } catch (e) { result.appbundle.versionsError = `HTTP ${e.response?.status}: ${JSON.stringify(e.response?.data)}`; }

        // Activity alias
        try {
            const r = await axios.get(`${DA_BASE}/activities/${nickname}.${activityId}+prod`, { headers });
            result.activity.alias = { version: r.data.version, engine: r.data.engine, params: Object.keys(r.data.parameters || {}) };
        } catch (e) { result.activity.aliasError = `HTTP ${e.response?.status}: ${JSON.stringify(e.response?.data)}`; }

        // Activity versions list (uses unqualified id — your own resources)
        try {
            const r = await axios.get(`${DA_BASE}/activities/${activityId}/versions`, { headers });
            const vers = (r.data?.data || []).map(Number).filter(n => n > 0);
            result.activity.versions = vers;
            result.activity.versionCount = vers.length;
            result.activity.atLimit = vers.length >= 100;
        } catch (e) { result.activity.versionsError = `HTTP ${e.response?.status}: ${JSON.stringify(e.response?.data)}`; }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

// POST /api/da/cleanup
// Hard-deletes both AppBundle and Activity (all versions + aliases). Use to reset after version-limit issues.
app.post('/api/da/cleanup', async (req, res) => {
    try {
        const appToken = await get2LeggedToken();
        const headers  = { 'Authorization': `Bearer ${appToken}`, 'Content-Type': 'application/json' };
        const bundleName = settings.daBundleId  || 'UpdateParams';
        const activityId = settings.daActivityId || 'UpdateRevitParams';
        const results  = {};

        for (const [label, url] of [
            ['activity',  `${DA_BASE}/activities/${activityId}`],
            ['appbundle', `${DA_BASE}/appbundles/${bundleName}`]
        ]) {
            try {
                await axios.delete(url, { headers });
                results[label] = 'deleted';
                console.log(`DA cleanup: ${label} deleted.`);
            } catch (e) {
                results[label] = e.response?.status === 404 ? 'not found (already clean)' : `error HTTP ${e.response?.status}: ${JSON.stringify(e.response?.data)}`;
                console.log(`DA cleanup: ${label} → ${results[label]}`);
            }
        }

        res.json({ message: 'DA cleanup complete — next submission will recreate from scratch.', results });
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

// POST /api/da/nuke
// Deletes EVERY appbundle and activity in the account to clear global DA quota.
// Safe to run multiple times. Resets daBundleId/daActivityId so next submission creates fresh ones.
app.post('/api/da/nuke', async (req, res) => {
    try {
        const appToken = await get2LeggedToken();
        const headers  = { 'Authorization': `Bearer ${appToken}`, 'Content-Type': 'application/json' };
        const deleted  = { appbundles: [], activities: [], errors: [] };

        // Helper: paginate through all items and collect their ids
        async function listAll(resource) {
            const ids = [];
            let url   = `${DA_BASE}/${resource}`;
            while (url) {
                const r  = await axios.get(url, { headers });
                const data = r.data?.data || [];
                data.forEach(item => {
                    // items are qualified ids like "nickname.Name" — extract the short name
                    const short = typeof item === 'string' ? item.split('.').pop().replace(/\+.*$/, '') : null;
                    if (short) ids.push(short);
                });
                url = r.data?.paginationToken
                    ? `${DA_BASE}/${resource}?page[cursor]=${r.data.paginationToken}`
                    : null;
            }
            return [...new Set(ids)]; // deduplicate
        }

        for (const resource of ['appbundles', 'activities']) {
            console.log(`DA nuke: listing ${resource}...`);
            let ids;
            try { ids = await listAll(resource); }
            catch (e) { deleted.errors.push(`list ${resource}: ${e.response?.status} ${e.message}`); continue; }
            console.log(`DA nuke: found ${ids.length} ${resource}: ${ids.join(', ')}`);
            for (const id of ids) {
                try {
                    await axios.delete(`${DA_BASE}/${resource}/${id}`, { headers });
                    deleted[resource].push(id);
                    console.log(`DA nuke: deleted ${resource}/${id}`);
                } catch (e) {
                    const msg = `${resource}/${id}: HTTP ${e.response?.status}`;
                    deleted.errors.push(msg);
                    console.log(`DA nuke: ${msg}`);
                }
            }
        }

        // Reset stored IDs so next submission generates fresh ones
        settings.daBundleId   = '';
        settings.daActivityId = '';
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
        console.log(`DA nuke: complete. Deleted ${deleted.appbundles.length} bundles, ${deleted.activities.length} activities.`);
        res.json({ message: 'DA nuke complete — all bundles and activities deleted. Submit again to recreate fresh.', deleted });
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

// POST /api/da/submit
// Body: { sessionId, changes, fileVersionUrn, projectId, hubId, revitEngine }
app.post('/api/da/submit', async (req, res) => {
    const { sessionId, changes, fileVersionUrn, projectId, hubId, revitEngine } = req.body;

    if (!sessionId) return res.status(401).json({ error: 'No session ID' });
    const tokenData = userTokens.get(sessionId);
    if (!tokenData) return res.status(401).json({ error: 'Invalid session' });
    if (!changes?.length) return res.status(400).json({ error: 'No changes provided' });
    if (!fileVersionUrn || !projectId) return res.status(400).json({ error: 'fileVersionUrn and projectId required' });

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`DA SUBMIT REQUEST`);
    console.log(`  fileVersionUrn : ${fileVersionUrn}`);
    console.log(`  projectId (AEC): ${projectId}`);
    console.log(`  hubId          : ${hubId || '(not provided)'}`);
    console.log(`  changes        : ${changes.length} change(s)`);
    console.log(`${'─'.repeat(60)}\n`);

    // Refresh user token if expired or within 2 minutes of expiry
    let userToken = tokenData.accessToken;
    if (Date.now() >= tokenData.expiresAt - 120000) {
        console.log('DA submit: token expired or near expiry — refreshing...');
        try {
            const refreshResponse = await axios.post(
                'https://developer.api.autodesk.com/authentication/v2/token',
                new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenData.refreshToken,
                                      client_id: settings.clientId, client_secret: settings.clientSecret }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            const { access_token, refresh_token, expires_in } = refreshResponse.data;
            userTokens.set(sessionId, { accessToken: access_token, refreshToken: refresh_token,
                                        expiresAt: Date.now() + expires_in * 1000 });
            userToken = access_token;
            console.log('DA submit: token refreshed successfully.');
        } catch (refreshErr) {
            console.warn('DA submit: token refresh failed — proceeding with possibly-expired token:', refreshErr.response?.data || refreshErr.message);
        }
    }
    let engine      = revitEngine || settings.revitEngine || 'Autodesk.Revit+2025';
    let _step = 'init';

    try {
        _step = '2-legged token';
        const appToken = await get2LeggedToken();
        console.log('DA: 2-legged token obtained.');

        _step = 'get nickname';
        const meResp = await axios.get(`${DA_BASE}/forgeapps/me`, {
            headers: { 'Authorization': `Bearer ${appToken}` }
        });
        // /forgeapps/me returns the nickname as a plain string
        const nickname = typeof meResp.data === 'string' ? meResp.data.trim()
                       : (meResp.data.id || meResp.data.nickname || '');
        if (!nickname) throw new Error(`Could not determine DA nickname from /forgeapps/me response: ${JSON.stringify(meResp.data)}`);
        console.log(`DA: Nickname = ${nickname}`);

        _step = 'ensure AppBundle+Activity';
        let { pinnedActivityVersion } = await ensureDASetup(appToken, nickname, engine);

        // 3. Resolve the Revit file to a downloadable HTTPS URL via DM API (using user's 3-legged token).
        //    Step A: derive a candidate DM project ID from the AEC project ID (urn:adsk.workspace:prod.project:{uuid} → b.{uuid})
        //    Step B: if that 404s, scan hub projects to find the real DM project ID.
        //    Step C: get version storage and build OSS download URL.
        const fileName = req.body.fileName || 'model.rvt';
        console.log(`DA: Resolving download URL for ${fileName}`);
        console.log(`DA: projectId=${projectId}  hubId=${hubId}  fileVersionUrn=${fileVersionUrn}`);

        _step = 'resolve DM project ID';
        const aecProjMatch = projectId?.match(/urn:adsk\.workspace:prod\.project:([0-9a-f-]+)/i);
        const aecProjUuid  = aecProjMatch?.[1] || null;
        let dmProjectId = aecProjUuid ? `b.${aecProjUuid}` : null;
        console.log(`DA: Candidate DM project ID: ${dmProjectId}`);

        const encodedVersionId = encodeURIComponent(fileVersionUrn);

        // Helper: try to get version metadata from DM for a given DM project ID
        const tryGetVersion = async (pid) => {
            const r = await axios.get(
                `https://developer.api.autodesk.com/data/v1/projects/${pid}/versions/${encodedVersionId}`,
                { headers: { 'Authorization': `Bearer ${userToken}` } }
            );
            return r.data;
        };

        let versionData = null;

        // Step A: try direct conversion b.{uuid}
        if (dmProjectId) {
            try {
                versionData = await tryGetVersion(dmProjectId);
                console.log(`DA: DM version found via direct project ID: ${dmProjectId}`);
            } catch (e) {
                const status = e.response?.status;
                const body   = e.response?.data ? JSON.stringify(e.response.data) : e.message;
                console.warn(`DA: Direct DM project ID ${dmProjectId} failed (HTTP ${status}): ${body}`);
            }
        }

        // Step B: scan ALL accessible DM hubs+projects
        let detectedHubRegion = null; // will be set when version is found via hub scan
        if (!versionData) {
            _step = 'hub scan';
            console.log(`DA: Scanning all accessible DM hubs for the file version...`);
            try {
                const hubsResp = await axios.get(
                    'https://developer.api.autodesk.com/project/v1/hubs',
                    { headers: { 'Authorization': `Bearer ${userToken}` } }
                );
                const allHubs = hubsResp.data?.data || [];
                console.log(`DA: Found ${allHubs.length} DM hubs.`);

                outer:
                for (const hub of allHubs) {
                    const projsResp = await axios.get(
                        `https://developer.api.autodesk.com/project/v1/hubs/${hub.id}/projects`,
                        { headers: { 'Authorization': `Bearer ${userToken}` } }
                    );
                    const projects = projsResp.data?.data || [];
                    console.log(`DA: Hub ${hub.id} (${hub.attributes?.name}) has ${projects.length} projects.`);

                    // Prioritise project whose UUID matches the AEC project UUID
                    const sorted = aecProjUuid
                        ? [...projects].sort((a, b) => (a.id.includes(aecProjUuid) ? -1 : b.id.includes(aecProjUuid) ? 1 : 0))
                        : projects;

                    for (const proj of sorted) {
                        try {
                            versionData = await tryGetVersion(proj.id);
                            dmProjectId = proj.id;
                            detectedHubRegion = hub.attributes?.region || null;
                            console.log(`DA: DM version found — hub=${hub.id} (region=${detectedHubRegion}) project=${proj.id} (${proj.attributes?.name})`);
                            break outer;
                        } catch (e) {
                            if (e.response?.status === 404 || e.response?.status === 403) continue;
                            console.warn(`DA: version lookup error for project ${proj.id}: HTTP ${e.response?.status}`);
                        }
                    }
                }
            } catch (hubErr) {
                const status = hubErr.response?.status;
                const body   = hubErr.response?.data ? JSON.stringify(hubErr.response.data) : hubErr.message;
                console.error(`DA: Hub scan failed (HTTP ${status}): ${body}`);
            }
        }

        if (!versionData) {
            throw new Error(
                `Cannot find DM version for fileVersionUrn="${fileVersionUrn}". ` +
                `Tried direct project "${dmProjectId}" and scanned all accessible hubs. ` +
                `Check that the file is accessible with your token.`
            );
        }

        // Step C: Extract item ID, cloud model GUIDs, and file name for the workitem.
        _step = 'extract version info';
        const itemId      = versionData?.data?.relationships?.item?.data?.id;
        const extData     = versionData?.data?.attributes?.extension?.data || {};
        const extType     = versionData?.data?.attributes?.extension?.type;
        console.log(`DA: Version extension type=${extType}, data=${JSON.stringify(extData)}`);
        let projectGuid = extData.projectGuid;
        let modelGuid   = extData.modelGuid;
        const modelType         = extData.modelType || null;  // 'singleuser' | 'collaborativeBIM360' | etc.
        const revitProjectVersion = extData.revitProjectVersion;  // e.g. 2026, 2027
        if (revitProjectVersion) {
            const fileEngine = `Autodesk.Revit+${revitProjectVersion}`;
            if (fileEngine !== engine) {
                console.log(`DA: File is Revit ${revitProjectVersion} — re-setup with engine ${engine} → ${fileEngine}`);
                engine = fileEngine;
                _step = 'ensure AppBundle+Activity (file engine)';
                ({ pinnedActivityVersion } = await ensureDASetup(appToken, nickname, engine));
            } else {
                console.log(`DA: File is Revit ${revitProjectVersion} — engine matches (${engine}).`);
            }
        } else {
            console.log(`DA: revitProjectVersion not in extData — using engine=${engine}`);
        }

        // Fallback: some versions nest GUIDs differently or use relationships
        if (!projectGuid || !modelGuid) {
            // Try included resources or relationships
            const included = versionData?.included || [];
            for (const inc of included) {
                if (inc.attributes?.extension?.data?.projectGuid) projectGuid = inc.attributes.extension.data.projectGuid;
                if (inc.attributes?.extension?.data?.modelGuid)   modelGuid   = inc.attributes.extension.data.modelGuid;
            }
        }

        // Determine whether this is a single-user file (download/upload) or a workshared C4R cloud model.
        // Rules (in priority order):
        //   1. extData.modelType === 'singleuser'  → always singleuser
        //   2. No cloud GUIDs found in extData/included AND a storage URN exists → treat as singleuser
        //      (prevents falling back to wrong GUIDs from server-settings.json)
        //   3. Otherwise → cloud model (SynchronizeWithCentral)
        const storageUrnForCheck = versionData?.data?.relationships?.storage?.data?.id;
        const hasCloudGuids      = !!(projectGuid && modelGuid);
        const revitVerNum        = parseInt(revitProjectVersion || '0', 10);

        // Route singleuser RCM to cloud path (SaveCloudModel) only when DA engine supports it.
        // Revit 2026 DA engine: cloud path works for RCM.
        // Revit 2027 DA engine: cloud path fails with failedInstructions (newly released, not yet supported).
        // Without cloud GUIDs: download/upload regardless of version.
        const rcmCloudPathSupported = modelType === 'singleuser' && hasCloudGuids
            && revitVerNum > 0 && revitVerNum <= 2026;

        const isSingleUser = (modelType === 'singleuser' && !rcmCloudPathSupported)
            || (!hasCloudGuids && !!storageUrnForCheck);

        const cloudPathType = isSingleUser ? 'DOWNLOAD/UPLOAD'
            : modelType === 'singleuser' ? `CLOUD MODEL (SaveCloudModel — RCM ${revitVerNum})`
            : 'CLOUD MODEL (SynchronizeWithCentral — C4R)';
        console.log(`DA: isSingleUser=${isSingleUser} (modelType="${modelType}", revit=${revitVerNum}, hasCloudGuids=${hasCloudGuids}) → ${cloudPathType}`);

        // Apply settings GUID fallback ONLY for genuine cloud model path.
        if (!isSingleUser) {
            if (!projectGuid) projectGuid = settings.projectGuid;
            if (!modelGuid)   modelGuid   = settings.modelGuid;

            if (!projectGuid || !modelGuid) {
                throw new Error(
                    `Cannot determine cloud model GUIDs. ` +
                    `extension.type=${extType}, data=${JSON.stringify(extData)}. ` +
                    `Add 'projectGuid' and 'modelGuid' to server-settings.json as fallback.`
                );
            }
            console.log(`DA: Cloud model GUIDs — projectGuid=${projectGuid}, modelGuid=${modelGuid}`);
        }

        // 4. Submit WorkItem.
        // For single-user cloud models: use download/upload pattern —
        //   download input.rvt via DM, process locally, upload output.rvt back as a new DM version.
        // For workshared C4R models: open via cloud GUIDs using adsk3LeggedToken (RCW auth context).
        _step = 'submit WorkItem';

        // region: "US" for North America, "EU" for EMEA — must match where the BIM360/ACC account is hosted.
        let cloudRegion = settings.cloudRegion || 'EU';
        if (detectedHubRegion) {
            const regionMap = { 'US': 'US', 'EMEA': 'EMEA', 'EU': 'EMEA', 'AUS': 'US' };
            const mapped = regionMap[detectedHubRegion.toUpperCase()];
            if (mapped) { cloudRegion = mapped; console.log(`DA: Hub region '${detectedHubRegion}' → cloudRegion='${cloudRegion}'`); }
        }

        console.log(`\nDA RESOLVED MODEL:`);
        console.log(`  DM projectId   : ${dmProjectId}`);
        console.log(`  itemId         : ${itemId}`);
        console.log(`  modelType      : ${modelType} → ${cloudPathType} path`);
        console.log(`  revitVersion   : ${extData.revitProjectVersion || '(unknown)'}`);
        console.log(`  extensionType  : ${extType}`);
        console.log();
        let outputStorageObjectId = null;
        let uploadKey = null, outBucket = null, outObjKey = null;
        let wiArguments;

        if (isSingleUser) {
            // ── Download/upload mode (single-user cloud model) ────────────────────────────────
            // DA Revit cannot open single-user BIM360 models via ConvertCloudGUIDsToCloudPath
            // (no RCW session support for single-user models in DA).  Use the standard
            // download→process→upload pattern instead.
            _step = 'get input download URL';
            const storageUrn = versionData?.data?.relationships?.storage?.data?.id;
            if (!storageUrn) throw new Error('Version has no storage URN — cannot get download URL');
            const ossInPath   = storageUrn.replace('urn:adsk.objects:os.object:', '');
            const inSlashIdx  = ossInPath.indexOf('/');
            const inBucket    = ossInPath.substring(0, inSlashIdx);
            const inObjKey    = decodeURIComponent(ossInPath.substring(inSlashIdx + 1));
            const dlResp = await axios.get(
                `https://developer.api.autodesk.com/oss/v2/buckets/${inBucket}/objects/${encodeURIComponent(inObjKey)}/signeds3download`,
                { headers: { 'Authorization': `Bearer ${userToken}` } }
            );
            const inputDownloadUrl = dlResp.data.url;
            console.log(`DA: Got input download URL (bucket=${inBucket})`);

            _step = 'create output DM storage';
            const storagePayload = {
                jsonapi: { version: '1.0' },
                data: {
                    type: 'objects',
                    attributes: { name: fileName },
                    relationships: { target: { data: { type: 'items', id: itemId } } }
                }
            };
            const storageResp = await axios.post(
                `https://developer.api.autodesk.com/data/v1/projects/${dmProjectId}/storage`,
                storagePayload,
                { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/vnd.api+json' } }
            );
            outputStorageObjectId = storageResp.data.data.id;
            const ossOutPath  = outputStorageObjectId.replace('urn:adsk.objects:os.object:', '');
            const outSlashIdx = ossOutPath.indexOf('/');
            outBucket = ossOutPath.substring(0, outSlashIdx);
            outObjKey = decodeURIComponent(ossOutPath.substring(outSlashIdx + 1));
            console.log(`DA: Output storage created — bucket=${outBucket}`);

            _step = 'initiate signeds3upload';
            const s3InitResp = await axios.get(
                `https://developer.api.autodesk.com/oss/v2/buckets/${outBucket}/objects/${encodeURIComponent(outObjKey)}/signeds3upload?parts=1&minutesExpiration=60`,
                { headers: { 'Authorization': `Bearer ${userToken}` } }
            );
            uploadKey = s3InitResp.data.uploadKey;
            const outputUploadUrl = s3InitResp.data.urls[0];
            console.log(`DA: signeds3upload initiated (uploadKey=${uploadKey})`);

            const paramsPayloadSingle = { projectGuid, modelGuid, region: cloudRegion, changes,
                sourceFileName: extData.sourceFileName || extData.compositeParentFile || fileName || null };
            _step = 'prepare params';
            const paramsUrlSingle = await _getParamsUrl(paramsPayloadSingle, dmProjectId, itemId, userToken);
            wiArguments = {
                params:     { url: paramsUrlSingle,   verb: 'get', localName: 'params.json' },
                inputFile:  { url: inputDownloadUrl,  verb: 'get', localName: 'input.rvt'   },
                outputFile: { url: outputUploadUrl,   verb: 'put', localName: 'output.rvt'  }
            };
        } else {
            // ── Workshared C4R cloud model: open via cloud GUIDs, sync with central ──────────
            const paramsPayload = { projectGuid, modelGuid, region: cloudRegion, changes, token: userToken };
            _step = 'prepare params';
            const paramsUrl     = await _getParamsUrl(paramsPayload, dmProjectId, itemId, userToken);
            wiArguments = {
                params:           { url: paramsUrl, verb: 'get', localName: 'params.json' },
                // adsk3LeggedToken: plain access token string — the only format DA accepts.
                // DA injects this into ADSK_3LEGGED_TOKEN env var before Revit starts,
                // which is used by ModelPathUtils.ConvertCloudGUIDsToCloudPath + OpenDocumentFile.
                adsk3LeggedToken: userToken
            };
        }

        console.log(`DA: Submitting WorkItem (cloud model mode) — ${changes.length} change(s) to ${fileName}`);
        const activityRef = `${nickname}.${settings.daActivityId || 'UpdateRevitParams'}+prod`;
        console.log(`DA: Using activityId: ${activityRef}`);
        const wiResp = await axios.post(`${DA_BASE}/workitems`, {
            activityId: activityRef,
            arguments:  wiArguments
        }, { headers: { 'Authorization': `Bearer ${appToken}`, 'Content-Type': 'application/json' } });

        const versionExtType = versionData?.data?.attributes?.extension?.type || null;
        const versionExtData = versionData?.data?.attributes?.extension?.data || null;
        console.log(`DA: WorkItem ${wiResp.data.id} submitted.`);
        res.json({
            workItemId:          wiResp.data.id,
            projectId:           dmProjectId,
            itemId,
            fileName,
            modelType,
            storageObjectId:     outputStorageObjectId || null,
            versionExtType:      versionExtType,
            versionExtData:      versionExtData,
            uploadKey:           uploadKey || null,
            outBucket:           outBucket || null,
            outObjKey:           outObjKey || null
        });

    } catch (err) {
        const respData = err.response?.data;
        const detail   = respData
            ? (typeof respData === 'string' ? respData : JSON.stringify(respData))
            : err.message;
        const httpStatus = err.response?.status || 500;
        console.error(`DA submit error at step "${_step}" (HTTP ${httpStatus}):`, detail);
        // DA_RETRY: bundle name was permanently exhausted — generation was bumped, ask user to retry
        if (err.message?.startsWith('DA_RETRY:')) {
            return res.status(503).json({ error: err.message, retry: true });
        }
        res.status(500).json({ error: `[${_step}] HTTP ${httpStatus}: ${detail}` });
    }
});

// GET /api/da/workitem/:id
app.get('/api/da/workitem/:id', async (req, res) => {
    const sessionId = req.query.sessionId;
    if (!sessionId || !userTokens.has(sessionId)) return res.status(401).json({ error: 'Invalid session' });

    try {
        const appToken = await get2LeggedToken();
        const wiResp = await axios.get(`${DA_BASE}/workitems/${req.params.id}`, {
            headers: { 'Authorization': `Bearer ${appToken}` }
        });
        const wiData = wiResp.data;

        // Auto-fetch and log the report whenever a workitem reaches a terminal failure state
        const failStates = ['failedDownload', 'failedInstructions', 'failedUpload', 'failed', 'cancelled'];
        if (failStates.includes(wiData.status) && wiData.reportUrl) {
            // Only fetch once (check if already fetched by looking at a flag on the object)
            if (!wiData.__reportFetched) {
                setImmediate(async () => {
                    try {
                        const rptResp = await axios.get(wiData.reportUrl, { responseType: 'text' });
                        console.log(`\n===== DA REPORT (${wiData.id}) status=${wiData.status} =====\n${rptResp.data}\n=================================================\n`);
                    } catch (rptErr) {
                        console.warn(`DA: Could not fetch report for ${wiData.id}: ${rptErr.message}`);
                    }
                });
            }
        }

        res.json(wiData);
    } catch (err) {
        console.error('DA workitem status error:', err.response?.data || err.message);
        res.status(err.response?.status || 500).json({
            error: err.response?.data || { message: err.message }
        });
    }
});

// POST /api/da/publish
// After the DA workitem completes (Revit saved changes back to cloud via SynchronizeWithCentral/SaveCloudModel),
// call C4RModelPublish to create a new published version in ACC.
app.post('/api/da/publish', async (req, res) => {
    const { sessionId, projectId, itemId } = req.body;

    if (!sessionId) return res.status(401).json({ error: 'No session ID' });
    const tokenData = userTokens.get(sessionId);
    if (!tokenData) return res.status(401).json({ error: 'Invalid session' });

    // Refresh token if expired or within 2 minutes of expiry (DA jobs can take 10-30 min)
    let userToken = tokenData.accessToken;
    if (Date.now() >= tokenData.expiresAt - 120000) {
        console.log('DA publish: token expired or near expiry — refreshing...');
        try {
            const refreshResponse = await axios.post(
                'https://developer.api.autodesk.com/authentication/v2/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: tokenData.refreshToken,
                    client_id: settings.clientId,
                    client_secret: settings.clientSecret
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            const { access_token, refresh_token, expires_in } = refreshResponse.data;
            userTokens.set(sessionId, {
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: Date.now() + (expires_in * 1000)
            });
            userToken = access_token;
            console.log('DA publish: token refreshed successfully.');
        } catch (refreshErr) {
            console.error('DA publish: token refresh failed:', refreshErr.response?.data || refreshErr.message);
        }
    }
    console.log(`DA publish: using token prefix=${userToken?.substring(0, 20)}... projectId=${projectId} itemId=${itemId}`);

    try {
        // Call C4RModelPublish command — publishes the unpublished changes that the DA addin
        // saved via SynchronizeWithCentral / SaveCloudModel.
        // itemId must be the lineage URN (strip ?version= if present).
        const lineageId = itemId?.includes('?version=') ? itemId.split('?')[0] : itemId;

        const payload = {
            jsonapi: { version: '1.0' },
            data: {
                type: 'commands',
                attributes: {
                    extension: {
                        type: 'commands:autodesk.bim360:C4RModelPublish',
                        version: '1.0.0'
                    }
                },
                relationships: {
                    resources: {
                        data: [{ type: 'items', id: lineageId }]
                    }
                }
            }
        };

        const response = await axios.post(
            `https://developer.api.autodesk.com/data/v1/projects/${projectId}/commands`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/vnd.api+json'
                }
            }
        );

        const commandId = response.data.data.id;
        const status    = response.data.data.attributes?.status;
        console.log(`DA: C4RModelPublish command=${commandId} status=${status}`);
        res.json({ success: true, commandId, status });

    } catch (err) {
        const errBody = err.response?.data;
        console.error('DA publish error status:', err.response?.status);
        console.error('DA publish error body:', JSON.stringify(errBody, null, 2) || err.message);
        const msg = errBody?.errors?.[0]?.detail || errBody?.errors?.[0]?.title || errBody?.message || err.message;
        res.status(err.response?.status || 500).json({ error: msg, detail: JSON.stringify(errBody) });
    }
});

// POST /api/test/storage-headers — create fresh DM storage slot, inspect headers, try signeds3upload with app token
app.post('/api/test/storage-headers', async (req, res) => {
    const { sessionId, projectId, itemId } = req.body;
    const tokenData = userTokens.get(sessionId);
    if (!tokenData) return res.status(401).json({ error: 'Invalid session' });
    const userTok = tokenData.accessToken;

    // Get 2-legged app token
    let appTok;
    try {
        const appTokResp = await axios.post(
            'https://developer.api.autodesk.com/authentication/v2/token',
            new URLSearchParams({ grant_type: 'client_credentials', client_id: settings.clientId,
                                  client_secret: settings.clientSecret, scope: 'data:write data:read' }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        appTok = appTokResp.data.access_token;
    } catch (e) {
        return res.json({ error: 'Failed to get app token: ' + e.message });
    }

    // Create fresh DM storage slot (user token, target = itemId)
    const fileName = `test-${Date.now()}.rvt`;
    const storageBody = {
        jsonapi: { version: '1.0' },
        data: {
            type: 'objects',
            attributes: { name: fileName },
            relationships: { target: { data: { type: 'items', id: itemId } } }
        }
    };
    let storageResp;
    try {
        storageResp = await axios.post(
            `https://developer.api.autodesk.com/data/v1/projects/${projectId}/storage`,
            storageBody,
            { headers: { Authorization: `Bearer ${userTok}`, 'Content-Type': 'application/vnd.api+json' } }
        );
    } catch (e) {
        return res.json({ storageError: e.message, storageStatus: e.response?.status, storageHeaders: e.response?.headers, storageBody: e.response?.data });
    }

    const storageId = storageResp.data.data.id; // urn:adsk.objects:os.object:wip.dm.prod/{uuid}.rvt
    const ossPath   = storageId.replace('urn:adsk.objects:os.object:', '');
    const slashIdx  = ossPath.indexOf('/');
    const bucket    = ossPath.substring(0, slashIdx);
    const objKey    = decodeURIComponent(ossPath.substring(slashIdx + 1));
    const s3url     = `https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${encodeURIComponent(objKey)}/signeds3upload`;

    // Try initiation with USER token (3-legged)
    const tryInit = (label, tok, body, ct) => new Promise(resolve => {
        const https = require('https');
        const u = new URL(s3url + '?parts=1');
        const bodyBuf = body != null ? Buffer.from(body, 'utf8') : Buffer.alloc(0);
        const hdrs = { 'Authorization': `Bearer ${tok}`, 'Accept': 'application/json', 'Content-Length': bodyBuf.length };
        if (ct) hdrs['Content-Type'] = ct;
        const opt = { hostname: u.hostname, path: u.pathname + u.search, method: 'POST', headers: hdrs };
        const r = https.request(opt, resp => {
            let d = ''; resp.on('data', c => d += c);
            resp.on('end', () => resolve({ label, status: resp.statusCode, responseHeaders: resp.headers, body: d }));
        });
        r.on('error', e => resolve({ label, error: e.message }));
        if (bodyBuf.length > 0) r.write(bodyBuf); r.end();
    });

    const results = {
        storageResponseHeaders: storageResp.headers,
        storageBody: storageResp.data,
        bucket, objKey,
        userTokenInit_emptyBody:  await tryInit('user token, ?parts=1, body={}',  userTok, '{}', 'application/json'),
        appTokenInit_emptyBody:   await tryInit('app token,  ?parts=1, body={}',  appTok,  '{}', 'application/json'),
        appTokenInit_nullBody:    await tryInit('app token,  ?parts=1, null body', appTok, null, 'application/json'),
    };

    // Also try signed resources (POST .../signed?access=write) with user token
    const trySigned = (tok) => new Promise(resolve => {
        const https = require('https');
        const u = new URL(`https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${encodeURIComponent(objKey)}/signed?access=write`);
        const hdrs = { 'Authorization': `Bearer ${tok}`, 'Content-Type': 'application/json', 'Content-Length': 0 };
        const opt = { hostname: u.hostname, path: u.pathname + u.search, method: 'POST', headers: hdrs };
        const r = https.request(opt, resp => {
            let d = ''; resp.on('data', c => d += c);
            resp.on('end', () => resolve({ status: resp.statusCode, body: d }));
        });
        r.on('error', e => resolve({ error: e.message }));
        r.end();
    });
    results.signedResourcesUserToken = await trySigned(userTok);
    results.signedResourcesAppToken  = await trySigned(appTok);

    res.json(results);
});

// POST /api/test/s3upload — temporary diagnostic endpoint
app.post('/api/test/s3upload', async (req, res) => {
    const { sessionId, bucket, objKey } = req.body;
    const tokenData = userTokens.get(sessionId);
    if (!tokenData) return res.status(401).json({ error: 'Invalid session' });
    const tok = tokenData.accessToken;
    const url = `https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${encodeURIComponent(objKey)}/signeds3upload`;
    const results = {};
    // Test each variant using Node.js https directly so we control every byte
    const doReq = (label, bodyStr, contentType) => new Promise(resolve => {
        const https = require('https');
        const u = new URL(url);
        const bodyBuf = bodyStr != null ? Buffer.from(bodyStr, 'utf8') : null;
        const headers = { 'Authorization': `Bearer ${tok}`, 'Accept': 'application/json' };
        if (contentType) headers['Content-Type'] = contentType;
        if (bodyBuf) headers['Content-Length'] = bodyBuf.length;
        else headers['Content-Length'] = 0;
        const opt = { hostname: u.hostname, path: u.pathname + u.search, method: 'POST', headers };
        const req2 = https.request(opt, r2 => {
            let d = ''; r2.on('data', c => d += c); r2.on('end', () => resolve({ label, status: r2.statusCode, body: d }));
        });
        req2.on('error', e => resolve({ label, error: e.message }));
        if (bodyBuf && bodyBuf.length > 0) req2.write(bodyBuf);
        req2.end();
    });
    // Variant that sends NO Content-Length header at all (just Content-Type)
    const doReqNoLen = (label, contentType) => new Promise(resolve => {
        const https = require('https');
        const u = new URL(url);
        const headers = { 'Authorization': `Bearer ${tok}`, 'Accept': 'application/json' };
        if (contentType) headers['Content-Type'] = contentType;
        // Note: no Content-Length set at all
        const opt = { hostname: u.hostname, path: u.pathname + u.search, method: 'POST', headers };
        const req2 = https.request(opt, r2 => {
            let d = ''; r2.on('data', c => d += c); r2.on('end', () => resolve({ label, status: r2.statusCode, body: d }));
        });
        req2.on('error', e => resolve({ label, error: e.message }));
        req2.end();
    });
    results.noBodyNoCT   = await doReq('no body, no CT',               null, null);
    results.noBodyWithCT = await doReq('no body, CT=app/json',         null, 'application/json');
    results.emptyBodyCT  = await doReq('body={}, CT=app/json',         '{}', 'application/json');
    results.nullBodyCT   = await doReq('body=null, CT=app/json',       'null', 'application/json');
    // Key new tests: no Content-Length header at all (server infers no body)
    results.noLenAppJson  = await doReqNoLen('no Content-Length, CT=app/json',  'application/json');
    results.noLenTextJson = await doReqNoLen('no Content-Length, CT=text/json', 'text/json');
    results.noLenNoCT     = await doReqNoLen('no Content-Length, no CT',        null);
    // Try sending a self-generated uploadKey — wip.dm.prod may require client-supplied key
    const selfKey = require('crypto').randomUUID();
    results.selfKeyBody     = await doReq('body={uploadKey:uuid}, CT=app/json',         JSON.stringify({ uploadKey: selfKey }), 'application/json');
    // Try the object key itself (with and without extension) as the uploadKey
    results.objKeyWithExt   = await doReq('body={uploadKey:objKey.rvt}',                JSON.stringify({ uploadKey: objKey }), 'application/json');
    results.objKeyNoExt     = await doReq('body={uploadKey:objKey-uuid}',               JSON.stringify({ uploadKey: objKey.replace(/\.[^.]+$/, '') }), 'application/json');
    // Try OSS v2 resumable PUT with a small body to see if the endpoint is accessible at all
    const testResumable = () => new Promise(resolve => {
        const https = require('https');
        const u = new URL(`https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${encodeURIComponent(objKey)}/resumable`);
        const body = Buffer.alloc(0);
        const headers = {
            'Authorization': `Bearer ${tok}`,
            'Content-Range': 'bytes 0-0/1',
            'Session-Id': require('crypto').randomUUID(),
            'Content-Type': 'application/octet-stream',
            'Content-Length': '0'
        };
        const opt = { hostname: u.hostname, path: u.pathname, method: 'PUT', headers };
        const r2 = https.request(opt, resp => {
            let d = ''; resp.on('data', c => d += c); resp.on('end', () => resolve({ status: resp.statusCode, body: d.substring(0, 200) }));
        });
        r2.on('error', e => resolve({ error: e.message }));
        r2.end();
    });
    results.resumablePut = await testResumable();

    // Try simple PUT (NOT resumable) to see if legacy simple upload still works for wip.dm.prod
    const testSimplePut = () => new Promise(resolve => {
        const https = require('https');
        const body = Buffer.from('APSTEST', 'utf8');
        const u = new URL(`https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${encodeURIComponent(objKey)}`);
        const headers = {
            'Authorization': `Bearer ${tok}`,
            'Content-Type': 'application/octet-stream',
            'Content-Length': String(body.length)
        };
        const opt = { hostname: u.hostname, path: u.pathname, method: 'PUT', headers };
        const r2 = https.request(opt, resp => {
            let d = ''; resp.on('data', c => d += c);
            resp.on('end', () => resolve({ status: resp.statusCode, headers: resp.headers, body: d.substring(0, 300) }));
        });
        r2.on('error', e => resolve({ error: e.message }));
        r2.write(body);
        r2.end();
    });
    results.simplePut = await testSimplePut();

    // Try initiation WITH query params (?parts=1&minutesExpiration=60) — body stays empty/{}
    const doReqWithQuery = (label, queryStr, bodyStr, contentType) => new Promise(resolve => {
        const https = require('https');
        const u = new URL(url + queryStr);
        const bodyBuf = bodyStr != null ? Buffer.from(bodyStr, 'utf8') : null;
        const headers = { 'Authorization': `Bearer ${tok}`, 'Accept': 'application/json' };
        if (contentType) headers['Content-Type'] = contentType;
        headers['Content-Length'] = bodyBuf ? bodyBuf.length : 0;
        const opt = { hostname: u.hostname, path: u.pathname + u.search, method: 'POST', headers };
        const req3 = https.request(opt, r3 => {
            let d = ''; r3.on('data', c => d += c); r3.on('end', () => resolve({ label, status: r3.statusCode, body: d }));
        });
        req3.on('error', e => resolve({ label, error: e.message }));
        if (bodyBuf && bodyBuf.length > 0) req3.write(bodyBuf);
        req3.end();
    });
    results.parts1NullBody   = await doReqWithQuery('?parts=1, null body',         '?parts=1',                          null, 'application/json');
    results.parts1EmptyBody  = await doReqWithQuery('?parts=1, body={}',            '?parts=1',                          '{}', 'application/json');
    results.parts1MinExp     = await doReqWithQuery('?parts=1&minutesExpiration=60, body={}', '?parts=1&minutesExpiration=60', '{}', 'application/json');
    results.minExpOnly       = await doReqWithQuery('?minutesExpiration=60, null',  '?minutesExpiration=60',             null, 'application/json');

    res.json(results);
});

// POST /api/da/finalize
// Creates a new DM version from the output OSS object uploaded by the DA workitem.
// Used for single-user cloud models (download/upload pattern) after workitem success.
app.post('/api/da/finalize', async (req, res) => {
    const { sessionId, projectId, itemId, storageObjectId, fileName, versionExtType, versionExtData,
            uploadKey, outBucket, outObjKey } = req.body;

    if (!sessionId) return res.status(401).json({ error: 'No session ID' });
    const tokenData = userTokens.get(sessionId);
    if (!tokenData) return res.status(401).json({ error: 'Invalid session' });

    let userToken = tokenData.accessToken;
    // Refresh if expired or near expiry
    if (Date.now() >= tokenData.expiresAt - 120000) {
        try {
            const refreshResponse = await axios.post(
                'https://developer.api.autodesk.com/authentication/v2/token',
                new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenData.refreshToken,
                                      client_id: settings.clientId, client_secret: settings.clientSecret }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            const { access_token, refresh_token, expires_in } = refreshResponse.data;
            userTokens.set(sessionId, { accessToken: access_token, refreshToken: refresh_token, expiresAt: Date.now() + expires_in * 1000 });
            userToken = access_token;
        } catch (e) { console.warn('DA finalize: token refresh failed:', e.message); }
    }

    if (!projectId || !itemId) {
        return res.status(400).json({ error: 'projectId and itemId are required.' });
    }

    // Cloud model mode: storageObjectId is null because doc.SaveCloudModel() already created
    // the new BIM360 version inside the workitem — just query the item for the latest version.
    if (!storageObjectId) {
        console.log(`DA finalize (cloud mode): workitem published version — querying latest for itemId=${itemId}`);
        try {
            const versionsResp = await axios.get(
                `https://developer.api.autodesk.com/data/v1/projects/${projectId}/items/${itemId}/versions?page[number]=0&page[limit]=1`,
                { headers: { 'Authorization': `Bearer ${userToken}` } }
            );
            const latest = versionsResp.data?.data?.[0];
            const newVersionId  = latest?.id;
            const newVersionNum = latest?.attributes?.versionNumber;
            console.log(`DA finalize (cloud mode): ✓ Version ${newVersionNum} — ${newVersionId}`);
            return res.json({ success: true, versionId: newVersionId, versionNumber: newVersionNum });
        } catch (err) {
            const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
            console.error('DA finalize (cloud mode) query error:', detail);
            return res.status(err.response?.status || 500).json({ error: detail });
        }
    }

    console.log(`DA finalize: creating DM version — projectId=${projectId} itemId=${itemId} storageObjectId=${storageObjectId}`);
    try {
        // Complete the signed S3 upload before creating the DM version.
        // Required when the workitem used a presigned S3 URL for output (OSS signeds3upload flow).
        if (uploadKey && outBucket && outObjKey) {
            const correctMimeType = versionExtData?.mimeType || 'application/vnd.autodesk.r360';
            console.log(`DA finalize: completing signeds3upload with contentType=${correctMimeType}...`);
            try {
                await axios.post(
                    `https://developer.api.autodesk.com/oss/v2/buckets/${outBucket}/objects/${encodeURIComponent(outObjKey)}/signeds3upload`,
                    { uploadKey, contentType: correctMimeType },
                    { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' } }
                );
                console.log(`DA finalize: signeds3upload completed — OSS object registered with MIME ${correctMimeType}.`);
            } catch (s3Err) {
                const s3Body = s3Err.response?.data;
                const s3Code = s3Body?.errorCode || s3Body?.code || s3Err.response?.status;
                if (String(s3Code).toLowerCase().includes('invalid') || s3Err.response?.status === 400) {
                    console.warn(`DA finalize: S3 completion already done (${s3Code}) — continuing.`);
                } else {
                    throw s3Err;
                }
            }

            // Note: direct PUT to wip.dm.prod is deprecated ("Legacy endpoint is deprecated").
            // contentType is set via the signeds3upload complete body above instead.
        }

        // For singleuser C4RModel files: POST /versions always fails (403 whitelist for C4RModel schema,
        // 400 MIME mismatch for File schema). Skip both and go straight to the File-item fallback.
        const isSingleUserC4R = versionExtType === 'versions:autodesk.bim360:C4RModel'
            && versionExtData?.modelType === 'singleuser';
        const effectiveExtType = isSingleUserC4R
            ? 'versions:autodesk.bim360:File'
            : (versionExtType || 'versions:autodesk.bim360:C4RModel');
        const effectiveExtData = isSingleUserC4R
            ? null
            : versionExtData;
        if (isSingleUserC4R) {
            console.log(`DA finalize: singleuser C4RModel — skipping POST /versions (always fails), going straight to File-item fallback.`);
        }

        const versionPayload = {
            jsonapi: { version: '1.0' },
            data: {
                type: 'versions',
                attributes: {
                    name: fileName || 'model.rvt',
                    extension: {
                        type:    effectiveExtType,
                        version: effectiveExtType === 'versions:autodesk.bim360:File' ? '1.0' : '1.0.0',
                        data:    effectiveExtData ? { ...effectiveExtData } : undefined
                    }
                },
                relationships: {
                    item:    { data: { type: 'items',   id: itemId         } },
                    storage: { data: { type: 'objects', id: storageObjectId } }
                }
            }
        };
        // Remove undefined data field if not provided
        if (!versionPayload.data.attributes.extension.data) {
            delete versionPayload.data.attributes.extension.data;
        }

        let versionResp;
        try {
            if (isSingleUserC4R) {
                // Skip POST /versions — singleuser C4R always fails (403 whitelist for C4RModel schema,
                // 400 MIME mismatch for File schema). Throw directly into the File-item fallback.
                const bypass = new Error('Bypassed for singleuser C4R — going to File-item fallback');
                bypass._bypass = true;
                throw bypass;
            }
            versionResp = await axios.post(
                `https://developer.api.autodesk.com/data/v1/projects/${projectId}/versions`,
                versionPayload,
                { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/vnd.api+json' } }
            );
        } catch (vErr) {
            const vBody = vErr.response?.data;
            const vMsg  = vBody?.message || JSON.stringify(vBody) || vErr.message;
            // For singleuser C4R files: POST /versions always fails (either 403 whitelist or 400 MIME mismatch).
            // Fall back to creating a new File-type item in the same folder.
            const isWhitelistBlocked = vErr.response?.status === 403 && vMsg && vMsg.toLowerCase().includes('whitelist');
            if (vErr._bypass || isWhitelistBlocked || isSingleUserC4R) {
                const reason = vErr._bypass ? 'singleuser C4R bypass' : isWhitelistBlocked ? `whitelist: ${vMsg.substring(0, 120)}` : `${vErr.response?.status || ''} ${vMsg.substring(0, 120)}`;
                console.warn(`DA finalize: version POST failed for singleuser C4R (${reason}) — falling back to new-item creation.`);

                // Get the parent folder of the original item
                const itemResp = await axios.get(
                    `https://developer.api.autodesk.com/data/v1/projects/${projectId}/items/${encodeURIComponent(itemId)}`,
                    { headers: { 'Authorization': `Bearer ${userToken}` } }
                );
                const folderId = itemResp.data?.data?.relationships?.parent?.data?.id;
                if (!folderId) throw new Error('Could not determine parent folder for fallback item creation.');
                console.log(`DA finalize (fallback): parent folder = ${folderId}`);

                let newName  = fileName || 'model.rvt';
                const newItemPayload = {
                    jsonapi: { version: '1.0' },
                    data: {
                        type: 'items',
                        attributes: {
                            displayName: newName,
                            extension: { type: 'items:autodesk.bim360:File', version: '1.0' }
                        },
                        relationships: {
                            tip:    { data: { type: 'versions', id: '1' } },
                            parent: { data: { type: 'folders', id: folderId } }
                        }
                    },
                    included: [{
                        type: 'versions',
                        id:   '1',
                        attributes: {
                            name: newName,
                            extension: { type: 'versions:autodesk.bim360:File', version: '1.0' }
                        },
                        relationships: {
                            storage: { data: { type: 'objects', id: storageObjectId } }
                        }
                    }]
                };
                let newItemId, newVersionId, newVersionNum;
                try {
                    const newItemResp = await axios.post(
                        `https://developer.api.autodesk.com/data/v1/projects/${projectId}/items`,
                        newItemPayload,
                        { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/vnd.api+json' } }
                    );
                    newItemId    = newItemResp.data?.data?.id;
                    newVersionId = newItemResp.data?.included?.[0]?.id;
                    console.log(`DA finalize (fallback): ✓ Created new item ${newItemId} / version ${newVersionId} named "${newName}"`);
                } catch (itemErr) {
                    const itemBody   = itemErr.response?.data;
                    const itemMsg    = itemBody?.errors?.[0]?.detail || itemBody?.errors?.[0]?.title
                                    || JSON.stringify(itemBody) || itemErr.message;
                    const isConflict = itemErr.response?.status === 409
                                    || (itemMsg && itemMsg.toLowerCase().includes('entity id already existed'));
                    if (!isConflict) throw itemErr;

                    // Item already exists in this folder — find it and add a new version instead
                    console.warn(`DA finalize (fallback): POST /items conflict ("${itemMsg}") — searching folder for existing item...`);
                    const contentsResp = await axios.get(
                        `https://developer.api.autodesk.com/data/v1/projects/${projectId}/folders/${folderId}/contents`,
                        { headers: { 'Authorization': `Bearer ${userToken}` } }
                    );
                    // Prefer a File-type item with the original name (not the C4RModel original).
                    let existingItem = contentsResp.data?.data?.find(
                        i => i.type === 'items' && i.attributes?.displayName === newName
                            && i.attributes?.extension?.type === 'items:autodesk.bim360:File'
                    ) || contentsResp.data?.data?.find(
                        i => i.type === 'items' && i.attributes?.displayName === newName
                            && i.id !== itemId  // not the original C4RModel item
                    );

                    // If the only conflicting item is the original C4RModel, the File item doesn't exist yet.
                    // Retry creation with a derived name (base + _updated) that won't clash with the C4RModel item.
                    if (!existingItem) {
                        const ext         = path.extname(newName);
                        const base        = path.basename(newName, ext);
                        const derivedName = `${base}_updated${ext}`;
                        console.warn(`DA finalize (fallback): name "${newName}" blocked by C4RModel — trying derived name "${derivedName}"`);

                        // Check if the derived item already exists (from a previous DA run)
                        existingItem = contentsResp.data?.data?.find(
                            i => i.type === 'items' && i.attributes?.displayName === derivedName
                        ) || null;

                        if (!existingItem) {
                            // Create new item with derived name
                            const derivedPayload = {
                                jsonapi: { version: '1.0' },
                                data: {
                                    type: 'items',
                                    attributes: {
                                        displayName: derivedName,
                                        extension: { type: 'items:autodesk.bim360:File', version: '1.0' }
                                    },
                                    relationships: {
                                        tip:    { data: { type: 'versions', id: '1' } },
                                        parent: { data: { type: 'folders', id: folderId } }
                                    }
                                },
                                included: [{
                                    type: 'versions',
                                    id:   '1',
                                    attributes: {
                                        name: derivedName,
                                        extension: { type: 'versions:autodesk.bim360:File', version: '1.0' }
                                    },
                                    relationships: {
                                        storage: { data: { type: 'objects', id: storageObjectId } }
                                    }
                                }]
                            };
                            const dResp  = await axios.post(
                                `https://developer.api.autodesk.com/data/v1/projects/${projectId}/items`,
                                derivedPayload,
                                { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/vnd.api+json' } }
                            );
                            newItemId    = dResp.data?.data?.id;
                            newVersionId = dResp.data?.included?.[0]?.id;
                            newName      = derivedName;
                            console.log(`DA finalize (fallback): ✓ Created "${newName}" — item ${newItemId} / version ${newVersionId}`);
                        } else {
                            newName = derivedName; // use derived name for add-version below
                        }
                    }

                    // Add a new version to an existing File item (either original-name or derived-name)
                    if (!newItemId) {
                        newItemId = existingItem.id;
                        newName   = existingItem.attributes?.displayName || newName;
                        console.log(`DA finalize (fallback): found existing File item ${newItemId} ("${newName}") — adding new version`);

                        const addVersionPayload = {
                            jsonapi: { version: '1.0' },
                            data: {
                                type: 'versions',
                                attributes: {
                                    name: newName,
                                    extension: { type: 'versions:autodesk.bim360:File', version: '1.0' }
                                },
                                relationships: {
                                    item:    { data: { type: 'items',   id: newItemId       } },
                                    storage: { data: { type: 'objects', id: storageObjectId } }
                                }
                            }
                        };
                        const addVersionResp = await axios.post(
                            `https://developer.api.autodesk.com/data/v1/projects/${projectId}/versions`,
                            addVersionPayload,
                            { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/vnd.api+json' } }
                        );
                        newVersionId  = addVersionResp.data?.data?.id;
                        newVersionNum = addVersionResp.data?.data?.attributes?.versionNumber;
                        console.log(`DA finalize (fallback): ✓ Added version ${newVersionNum} to item ${newItemId}`);
                    }
                }
                return res.json({
                    success:       true,
                    fallback:      true,
                    newItem:       true,
                    itemId:        newItemId,
                    versionId:     newVersionId,
                    versionNumber: newVersionNum,
                    name:          newName,
                    note:          'Created as a new file (C4RModel whitelisting required for version update of original item)'
                });
            }
            throw vErr; // rethrow for the outer catch
        }

        const newVersionId  = versionResp.data.data.id;
        const newVersionNum = versionResp.data.data.attributes?.versionNumber;
        console.log(`DA finalize: ✓ Created version ${newVersionNum} — ${newVersionId}`);
        res.json({ success: true, versionId: newVersionId, versionNumber: newVersionNum });

    } catch (err) {
        const errBody = err.response?.data;
        console.error('DA finalize error:', err.response?.status, JSON.stringify(errBody) || err.message);
        const msg = errBody?.errors?.[0]?.detail || errBody?.errors?.[0]?.title || errBody?.message || err.message;
        res.status(err.response?.status || 500).json({ error: msg });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 AEC Data Model Viewer Server running on http://localhost:${PORT}`);
    console.log(`\n📝 Configuration:`);
    console.log(`   - Client ID: ${settings.clientId ? '***configured***' : 'NOT SET'}`);
    console.log(`   - Client Secret: ${settings.clientSecret ? '***configured***' : 'NOT SET'}`);
    console.log(`   - Callback URL: ${settings.callbackUrl}`);
    console.log(`   - Region: ${settings.region}`);
    console.log(`\n💡 Open http://localhost:${PORT} in your browser to get started`);
    
    if (!settings.clientId || !settings.clientSecret) {
        console.log(`\n⚠️  Please configure your Client ID and Client Secret in the Settings modal`);
    }
});
