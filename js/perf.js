// Performance measurement: per-call GraphQL timings and per-step summaries.
// Calls are only aggregated in memory (no per-call logging, so measuring doesn't add load).
// Each wrapped step prints one "[PERF]" summary to the console (and therefore to debug.log)
// once all the calls it started have finished. perfReport() re-prints the last summaries.
(function () {
    var MAX_EVENTS = 50000;
    var SETTLE_TIMEOUT_MS = 180000;

    var calls = [];      // { op, start, end, clientMs, waitMs, callMs, apsMs, serverMs, bytes, status, ok }
    var logs = [];       // { t, bytes }
    var longTasks = [];  // { start, end }
    var inFlight = 0;
    var open = new Set();     // handles of calls still running
    var inFlightSamples = []; // { t, n } on every change, for max concurrency per window
    var reports = [];

    try {
        new PerformanceObserver(function (list) {
            list.getEntries().forEach(function (e) {
                longTasks.push({ start: e.startTime, end: e.startTime + e.duration });
            });
        }).observe({ type: 'longtask', buffered: true });
    } catch (e) { /* long tasks not supported in this browser */ }

    function now() { return performance.now(); }

    function trim(arr) { if (arr.length > MAX_EVENTS) arr.splice(0, arr.length - MAX_EVENTS); }

    function opName(query) {
        var m = /\b(?:query|mutation)\s+(\w+)/.exec(query || '');
        if (m) return m[1];
        m = /{\s*(\w+)/.exec(query || '');
        return m ? m[1] : '(anonymous)';
    }

    function callStart(query) {
        inFlight += 1;
        inFlightSamples.push({ t: now(), n: inFlight });
        trim(inFlightSamples);
        var handle = { op: opName(query), start: now() };
        open.add(handle);
        return handle;
    }

    // Called when the request pool hands the call a slot (graphql.js) — splits wait vs. call time.
    function callAcquired(handle) {
        handle.acquired = now();
    }

    function callEnd(handle, info) {
        inFlight = Math.max(0, inFlight - 1);
        open.delete(handle);
        var end = now();
        inFlightSamples.push({ t: end, n: inFlight });
        calls.push({
            op: handle.op,
            start: handle.start,
            end: end,
            clientMs: end - handle.start,
            waitMs: (handle.acquired || handle.start) - handle.start,
            callMs: end - (handle.acquired || handle.start),
            apsMs: info && typeof info.apsMs === 'number' ? info.apsMs : null,
            serverMs: info && typeof info.serverMs === 'number' ? info.serverMs : null,
            bytes: (info && info.bytes) || 0,
            status: (info && info.status) || 0,
            ok: !!(info && info.ok)
        });
        trim(calls);
    }

    function recordLog(bytes) {
        logs.push({ t: now(), bytes: bytes || 0 });
        trim(logs);
    }

    // ── Statistics helpers ──────────────────────────────────────────────────
    function pct(sorted, p) {
        if (!sorted.length) return null;
        var i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p / 100 * sorted.length) - 1));
        return sorted[i];
    }

    function sortedNums(arr) {
        return arr.filter(function (v) { return typeof v === 'number'; }).sort(function (a, b) { return a - b; });
    }

    function sum(arr) { return arr.reduce(function (a, b) { return a + (b || 0); }, 0); }

    function fmtMs(ms) {
        if (ms === null || ms === undefined) return 'n/a';
        return ms >= 1000 ? (ms / 1000).toFixed(1) + ' s' : Math.round(ms) + ' ms';
    }

    function fmtMB(bytes) { return (bytes / 1e6).toFixed(1) + ' MB'; }

    function pad(s, n, right) {
        s = String(s);
        if (s.length >= n) return s.slice(0, n);
        var sp = new Array(n - s.length + 1).join(' ');
        return right ? sp + s : s + sp;
    }

    // Union length of long-task intervals clipped to [a, b].
    function blockedMs(a, b) {
        var total = 0;
        longTasks.forEach(function (t) {
            var s = Math.max(a, t.start), e = Math.min(b, t.end);
            if (e > s) total += e - s;
        });
        return total;
    }

    function maxInFlight(a, b) {
        var max = 0;
        inFlightSamples.forEach(function (s) { if (s.t >= a && s.t <= b && s.n > max) max = s.n; });
        return max;
    }

    function summarize(name, t0, tReturn, tSettled, startedInside) {
        var cs = calls.filter(function (c) { return startedInside(c); });
        var client = sortedNums(cs.map(function (c) { return c.clientMs; }));
        var wait = sortedNums(cs.map(function (c) { return c.waitMs; }));
        var call = sortedNums(cs.map(function (c) { return c.callMs; }));
        var aps = sortedNums(cs.map(function (c) { return c.apsMs; }));
        var withAps = cs.filter(function (c) { return typeof c.apsMs === 'number'; });
        var apsShare = withAps.length ? sum(withAps.map(function (c) { return c.apsMs; })) / sum(withAps.map(function (c) { return c.callMs; })) : null;
        var errors = cs.filter(function (c) { return !c.ok; }).length;
        var rate = cs.filter(function (c) { return c.status === 429; }).length;
        var ls = logs.filter(function (l) { return l.t >= t0 && l.t <= tSettled; });

        var byOp = {};
        cs.forEach(function (c) { (byOp[c.op] = byOp[c.op] || []).push(c); });
        var ops = Object.keys(byOp).sort(function (a, b) {
            return sum(byOp[b].map(function (c) { return c.clientMs; })) - sum(byOp[a].map(function (c) { return c.clientMs; }));
        });

        var lines = [];
        lines.push('[PERF] ' + name + ' — ' + fmtMs(tReturn - t0) +
            (tSettled > tReturn + 1 ? ' (network settled after ' + fmtMs(tSettled - t0) + ')' : ''));
        lines.push('  calls ' + cs.length + ' · errors ' + errors + ' · rate-limited (429) ' + rate +
            ' · max requested at once ' + maxInFlight(t0, tSettled));
        lines.push('  per call: median ' + fmtMs(pct(client, 50)) + ', p90 ' + fmtMs(pct(client, 90)) +
            ', max ' + fmtMs(pct(client, 100)) +
            ' = queued median ' + fmtMs(pct(wait, 50)) + ' + request median ' + fmtMs(pct(call, 50)));
        lines.push('  time at Autodesk: median ' + fmtMs(pct(aps, 50)) +
            (apsShare !== null ? ' (' + Math.round(apsShare * 100) + '% of request time)' : ' (restart server.js to measure)'));
        lines.push('  downloaded ' + fmtMB(sum(cs.map(function (c) { return c.bytes; }))) +
            ' · logging ' + ls.length + ' posts, ' + fmtMB(sum(ls.map(function (l) { return l.bytes; }))) +
            ' · main thread blocked ' + fmtMs(blockedMs(t0, tSettled)));
        if (ops.length) {
            lines.push('  ' + pad('query', 34) + pad('calls', 7, true) + pad('median', 9, true) + pad('p90', 9, true) +
                pad('queued', 9, true) + pad('Autodesk', 10, true) + pad('MB', 8, true));
            ops.forEach(function (op) {
                var list = byOp[op];
                var cm = sortedNums(list.map(function (c) { return c.clientMs; }));
                var am = sortedNums(list.map(function (c) { return c.apsMs; }));
                var wm = sortedNums(list.map(function (c) { return c.waitMs; }));
                lines.push('  ' + pad(op, 34) + pad(list.length, 7, true) + pad(fmtMs(pct(cm, 50)), 9, true) +
                    pad(fmtMs(pct(cm, 90)), 9, true) + pad(fmtMs(pct(wm, 50)), 9, true) + pad(fmtMs(pct(am, 50)), 10, true) +
                    pad((sum(list.map(function (c) { return c.bytes; })) / 1e6).toFixed(1), 8, true));
            });
        }
        return lines.join('\n');
    }

    // ── Step wrapper ────────────────────────────────────────────────────────
    var activeSteps = {};

    function wrap(name, fn) {
        if (typeof fn !== 'function' || fn.__perfWrapped) return fn;
        var wrapped = function () {
            // Re-entrant calls (e.g. a step re-rendering itself) are counted in the outer run.
            if (activeSteps[name]) return fn.apply(this, arguments);
            activeSteps[name] = true;
            var t0 = now();
            var startedInside = function (c) { return c.start >= t0 && c.start <= tReturn; };
            var tReturn = Infinity;

            function finish() {
                tReturn = now();
                activeSteps[name] = false;
                var deadline = tReturn + SETTLE_TIMEOUT_MS;
                (function waitSettled() {
                    // "Settled" = no call started during the step is still running.
                    var pending = false;
                    open.forEach(function (h) { if (startedInside(h)) pending = true; });
                    if (pending && now() < deadline) { setTimeout(waitSettled, 250); return; }
                    var report = summarize(name, t0, tReturn, now(), startedInside);
                    reports.push(report);
                    if (reports.length > 20) reports.shift();
                    console.log(report);
                })();
            }

            var result;
            try {
                result = fn.apply(this, arguments);
            } catch (e) {
                finish();
                throw e;
            }
            if (result && typeof result.then === 'function') {
                result.then(finish, finish);
            } else {
                finish();
            }
            return result;
        };
        wrapped.__perfWrapped = true;
        return wrapped;
    }

    // Wrap the user-facing steps once every script has loaded. Reassigning the global also
    // redirects onclick="..." handlers and internal calls, since these are global functions.
    window.addEventListener('DOMContentLoaded', function () {
        [['executeExample1', 'Execute Query'],
         ['executeExample1Compliance', 'Compliance Query'],
         ['openParameterExplorer', 'Explore Parameters'],
         ['_peLoadCheckedValues', 'Load Values']].forEach(function (pair) {
            if (typeof window[pair[0]] === 'function') window[pair[0]] = wrap(pair[1], window[pair[0]]);
        });
    });

    window.Perf = { callStart: callStart, callAcquired: callAcquired, callEnd: callEnd, recordLog: recordLog, wrap: wrap };

    window.perfReport = function () {
        if (!reports.length) { console.log('[PERF] No steps measured yet.'); return; }
        console.log(reports.join('\n\n'));
    };
})();
