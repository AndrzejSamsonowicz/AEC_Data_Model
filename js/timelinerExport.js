// TimeLiner export: downloads a CSV with one task per unique value from the Parameter Edit
// "New Value" column, for Navisworks TimeLiner (Data Sources → Add → CSV Import). Dates, task
// types etc. are set in TimeLiner, which then exports the schedule XML for Autodesk Build.
(function () {
    var HEADER = 'Task Name';

    // Unique values in assignment order: Reorder assignments first (by ordinal), then values that
    // were typed or bulk-assigned (no ordinal), in table order. A repeated value (e.g. the same
    // Bulk Assign value on many elements) becomes one task, positioned where it first appears.
    function collectTaskNames() {
        var rows = window._pendingParamEditRows || [];
        var withValue = rows.filter(function (r) { return r && String(r.newValue || '').trim() !== ''; });
        var ordered = withValue.filter(function (r) { return typeof r.__reorderOrdinal === 'number'; })
            .sort(function (a, b) { return a.__reorderOrdinal - b.__reorderOrdinal; });
        var unordered = withValue.filter(function (r) { return typeof r.__reorderOrdinal !== 'number'; });
        var seen = new Set();
        var names = [];
        ordered.concat(unordered).forEach(function (r) {
            var v = String(r.newValue).trim();
            if (!seen.has(v)) { seen.add(v); names.push(v); }
        });
        return { names: names, rowCount: withValue.length };
    }

    // RFC 4180 quoting: wrap in quotes when the value contains a comma, quote or line break.
    function csvField(value) {
        var s = String(value);
        return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }

    function buildCsv(taskNames) {
        return [HEADER].concat(taskNames).map(csvField).join('\r\n') + '\r\n';
    }

    function download(text, fileName) {
        // BOM so Navisworks/Excel read the file as UTF-8 (keeps non-ASCII characters intact).
        var blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    function exportTasksCsv() {
        var collected = collectTaskNames();
        if (!collected.names.length) {
            alert('No values to export. Assign values in the Parameter Edit table (e.g. with Reorder or Bulk Assign) first.');
            return;
        }
        var fileName = 'TimeLiner tasks ' + new Date().toISOString().slice(0, 10) + '.csv';
        download(buildCsv(collected.names), fileName);
        var dup = collected.rowCount - collected.names.length;
        alert('Exported ' + collected.names.length + ' task(s) to "' + fileName + '".' +
            (dup > 0 ? '\n\n' + collected.rowCount + ' rows had values; ' + dup + ' repeated value(s) were merged into one task each.' : ''));
    }

    window.viewerExportTasksCsv = exportTasksCsv;
    window.TimelinerExport = { buildCsv: buildCsv, collectTaskNames: collectTaskNames };
})();
