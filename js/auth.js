// Authentication and Settings Management

function updateAuthUi(isAuthenticated) {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    if (!loginBtn || !logoutBtn) return;

    if (isAuthenticated) {
        loginBtn.textContent = 'Logged In ✓';
        loginBtn.classList.remove('btn-secondary');
        loginBtn.classList.add('btn-primary');
        loginBtn.onclick = logout;
        logoutBtn.style.display = '';
        return;
    }

    loginBtn.textContent = 'Login With Autodesk';
    loginBtn.classList.remove('btn-secondary');
    loginBtn.classList.add('btn-primary');
    loginBtn.onclick = loginWithAutodesk;
    logoutBtn.style.display = 'none';
}

function scheduleHubLoad() {
    if (typeof loadHubs === 'function') {
        setTimeout(loadHubs, 100);
    }
}

async function loadSettings() {
    try {
        const response = await fetch(`${API_BASE}/api/settings`);
        const serverSettings = await response.json();
        
        settings = {
            clientId: serverSettings.clientId || '',
            clientSecret: '',
            callbackUrl: serverSettings.callbackUrl || 'http://localhost:3000/api/callback'
        };
        
        document.getElementById('clientId').value = settings.clientId;
        document.getElementById('callbackUrl').value = settings.callbackUrl;
        
        // Check for OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const session = urlParams.get('session');
        const error = urlParams.get('error');
        
        if (error) {
            alert(`Authentication error: ${error}`);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (session) {
            sessionId = session;
            localStorage.setItem('apsSessionId', sessionId);
            updateAuthUi(true);
            window.history.replaceState({}, document.title, window.location.pathname);
            scheduleHubLoad();
        } else {
            const savedSession = localStorage.getItem('apsSessionId');
            if (savedSession) {
                try {
                    const tokenResponse = await fetch(`${API_BASE}/api/token/${savedSession}`);
                    if (tokenResponse.ok) {
                        sessionId = savedSession;
                        updateAuthUi(true);
                        scheduleHubLoad();
                    } else {
                        localStorage.removeItem('apsSessionId');
                        updateAuthUi(false);
                    }
                } catch (error) {
                    localStorage.removeItem('apsSessionId');
                    updateAuthUi(false);
                }
            } else {
                updateAuthUi(false);
            }
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function openSettingsModal() {
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

async function saveSettings() {
    const newSettings = {
        clientId: document.getElementById('clientId').value,
        clientSecret: document.getElementById('clientSecret').value,
        callbackUrl: document.getElementById('callbackUrl').value
    };

    try {
        const response = await fetch(`${API_BASE}/api/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings)
        });

        const result = await response.json();
        if (result.success) {
            settings = {
                clientId: newSettings.clientId,
                clientSecret: '',
                callbackUrl: newSettings.callbackUrl
            };
            closeSettingsModal();
            alert('Settings saved successfully!');
        } else {
            alert('Failed to save settings: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings. Please try again.');
    }
}

async function loginWithAutodesk() {
    if (!settings.clientId) {
        alert('Please configure your Client ID in Settings first.');
        openSettingsModal();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/login`);
        const data = await response.json();
        
        if (data.authUrl) {
            window.location.href = data.authUrl;
        } else {
            alert('Failed to initiate login. Please check your settings.');
        }
    } catch (error) {
        console.error('Error initiating login:', error);
        alert('Failed to initiate login. Please try again.');
    }
}

async function logout() {
    if (sessionId) {
        try {
            await fetch(`${API_BASE}/api/logout/${sessionId}`, { method: 'POST' });
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
    
    sessionId = null;
    localStorage.removeItem('apsSessionId');
    updateAuthUi(false);
    
    document.getElementById('mainContainer').innerHTML = `
        <div class="login-prompt">
            <h2>Welcome to AEC Data Model Viewer</h2>
            <p>Please configure your settings and login to get started.</p>
        </div>
    `;
}
