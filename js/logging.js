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

    // Log entries are batched: one POST per second (or per 200 entries / ~500 KB) instead of
    // one POST per console call, so logging doesn't compete with GraphQL calls for the
    // browser's few connections to localhost:3000. Long messages are truncated in debug.log
    // only — the DevTools console still receives the full arguments.
    const MAX_MESSAGE_CHARS = 20000;
    const FLUSH_INTERVAL_MS = 1000;
    const MAX_BATCH_ENTRIES = 200;
    const MAX_BATCH_CHARS = 500000;
    let pendingEntries = [];
    let pendingChars = 0;
    let flushTimer = null;

    function flushLogs(onPageExit) {
        if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
        if (!pendingEntries.length) return;
        const body = JSON.stringify({ entries: pendingEntries });
        pendingEntries = [];
        pendingChars = 0;
        if (window.Perf) window.Perf.recordLog(body.length);

        if (onPageExit && navigator.sendBeacon) {
            navigator.sendBeacon(`${API_BASE}/api/log`, new Blob([body], { type: 'application/json' }));
            return;
        }
        fetch(`${API_BASE}/api/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        }).catch(() => {}); // Silently fail if logging fails
    }

    window.addEventListener('pagehide', () => flushLogs(true));

    function sendLogToServer(level, args, context = null) {
        if (shouldSuppress(args)) return;
        let message = args.map(arg => {
            if (arg instanceof Error) {
                return `${arg.name}: ${arg.message}${arg.stack ? '\n' + arg.stack : ''}`;
            }
            if (typeof arg === 'object' && arg !== null) {
                try {
                    return JSON.stringify(arg);
                } catch (e) {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');
        if (message.length > MAX_MESSAGE_CHARS) {
            message = message.slice(0, MAX_MESSAGE_CHARS) + ` …[truncated ${message.length - MAX_MESSAGE_CHARS} chars]`;
        }

        pendingEntries.push({ level, message, context, timestamp: new Date().toISOString() });
        pendingChars += message.length;
        if (pendingEntries.length >= MAX_BATCH_ENTRIES || pendingChars >= MAX_BATCH_CHARS) {
            flushLogs(false);
        } else if (!flushTimer) {
            flushTimer = setTimeout(() => flushLogs(false), FLUSH_INTERVAL_MS);
        }
    }

    // Override console methods using one shared wrapper pattern
    ['log', 'error', 'warn', 'info', 'debug'].forEach((level) => {
        console[level] = function(...args) {
            originalConsole[level].apply(console, args);
            sendLogToServer(level, args);
        };
    });

    // Capture uncaught errors
    window.addEventListener('error', (event) => {
        sendLogToServer('error', [`Uncaught Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`]);
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        sendLogToServer('error', [`Unhandled Promise Rejection: ${event.reason}`]);
    });

    window.logTrace = window.logTrace || function(scope, ...args) {
        console.debug(`[TRACE:${scope}]`, ...args);
    };

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
    } catch (_error) {
        // Silently fail if clear fails
    }
})();

// Logging helper functions
function logDebug(...args) {
    console.log('[DEBUG]', ...args);
}

function logTrace(scope, ...args) {
    console.debug(`[TRACE:${scope}]`, ...args);
}

function logError(...args) {
    console.error('[ERROR]', ...args);
}

function logInfo(...args) {
    console.info('[INFO]', ...args);
}

function logWarn(...args) {
    console.warn('[WARN]', ...args);
}
