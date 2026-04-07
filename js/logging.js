// Auto-logging functionality
(function setupAutoLogging() {
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug
    };

    // Patterns from the Viewer internals that are noise, not real app errors
    const SUPPRESS_PATTERNS = [
        /Failed to fetch resource:.*\/materials\/textures\//i,
        /Failed to fetch resource:.*program files.*autodesk/i,
        /Failed to fetch resource:.*\/mats\//i,
        /TextureLoader/i,
        /loadTextureWith/i,
    ];

    function shouldSuppress(args) {
        const str = args.map(a => String(a)).join(' ');
        return SUPPRESS_PATTERNS.some(p => p.test(str));
    }

    function sendLogToServer(level, args) {
        if (shouldSuppress(args)) return;
        const message = args.map(arg => {
            if (arg instanceof Error) {
                return `${arg.name}: ${arg.message}${arg.stack ? '\n' + arg.stack : ''}`;
            }
            if (typeof arg === 'object' && arg !== null) {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch (e) {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');

        // Send to server asynchronously (don't wait for response)
        fetch(`${API_BASE}/api/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                level, 
                message,
                timestamp: new Date().toISOString()
            })
        }).catch(() => {}); // Silently fail if logging fails
    }

    // Override console methods
    console.log = function(...args) {
        originalConsole.log.apply(console, args);
        sendLogToServer('log', args);
    };

    console.error = function(...args) {
        originalConsole.error.apply(console, args);
        sendLogToServer('error', args);
    };

    console.warn = function(...args) {
        originalConsole.warn.apply(console, args);
        sendLogToServer('warn', args);
    };

    console.info = function(...args) {
        originalConsole.info.apply(console, args);
        sendLogToServer('info', args);
    };

    console.debug = function(...args) {
        originalConsole.debug.apply(console, args);
        sendLogToServer('debug', args);
    };

    // Capture uncaught errors
    window.addEventListener('error', (event) => {
        sendLogToServer('error', [`Uncaught Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`]);
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        sendLogToServer('error', [`Unhandled Promise Rejection: ${event.reason}`]);
    });

    console.log('Auto-logging to debug.log enabled');
})();

// Clear debug log on page load
(async function clearDebugLog() {
    try {
        await fetch(`${API_BASE}/api/log/clear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Debug log cleared on page load');
    } catch (error) {
        // Silently fail if clear fails
    }
})();
