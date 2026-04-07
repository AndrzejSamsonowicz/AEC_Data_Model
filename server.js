const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
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
    authUrl.searchParams.append('scope', 'data:create data:read data:write viewables:read');
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
    const { level, message, timestamp } = req.body;
    
    // Use provided timestamp or current time if not provided
    const logTime = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    const logEntry = `[${logTime}] [${level.toUpperCase()}] ${message}\n`;
    
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
