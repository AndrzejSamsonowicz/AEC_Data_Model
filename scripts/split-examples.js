/**
 * split-examples.js
 * Splits js/examples.js into three functional files:
 *   js/ExecuteQuery.js       – Phase 1: hub search, treemap, compliance, shared utilities
 *   js/ExploreParameters.js  – Phase 2: zoom into file, Parameter Explorer modal
 *   js/UpdateRevit.js        – Phase 3: open in viewer, update Revit parameters
 *
 * Line ranges (1-based, inclusive):
 *
 * ExecuteQuery.js:
 *   1   – 1282  (shared state/utilities + Phase 1 query + treemap)
 *   1895 – 2397  (Phase 1 selection helpers + Compliance Check)
 *   5135 – 5183  (shared finders: _peFindPropByName, _peSentinelValueMatch, _peFindRevitIdValue)
 *
 *   REMOVED (lines 2398-3219): Example 2 Material Usage Analysis + Example 5 Smart Folder Search
 *
 * ExploreParameters.js:
 *   1283 – 1894  (zoom drill-down: zoomIntoFile … showZoomSelectionInViewer)
 *   3220 – 5059  (openParameterExplorer … end of _peRenderOverview)
 *   5060 – 5134  (_peUpdateZoomSelBar, _peClearZoomSelection)
 *   5895 – 6488  (_peBgCountSentinel … end of _peRenderZoom)
 *
 * UpdateRevit.js:
 *   5184 – 5894  (_peOpenSelectedInViewer … end of _peOpenValueInViewer)
 */

const fs = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, '..', 'js', 'examples.js');
const DEST = path.join(__dirname, '..', 'js');

const raw   = fs.readFileSync(SRC, 'utf8');
const lines = raw.split('\n');  // 0-based array; line N = lines[N-1]

// Helper: extract lines[start-1 .. end-1] inclusive (1-based line numbers) → string
function extract(start, end) {
    return lines.slice(start - 1, end).join('\n');
}

const totalLines = lines.length;
console.log(`Source file: ${totalLines} lines`);

// ── ExecuteQuery.js ──────────────────────────────────────────────────────────
const eq = [
    '// ExecuteQuery.js – Phase 1: hub search, Revit file treemap, extraction status, compliance check\n',
    '// Shared state, utilities, and GraphQL query helpers used by ExploreParameters.js and UpdateRevit.js\n',
    extract(1, 1282),
    '\n',
    extract(1895, 2397),
    '\n',
    '// ─── Shared element-property finders (used by ExploreParameters and UpdateRevit) ─\n',
    extract(5135, 5183),
    '\n',
].join('\n');

// ── ExploreParameters.js ─────────────────────────────────────────────────────
const ep = [
    '// ExploreParameters.js – Phase 2: zoom into Revit file, Parameter Explorer modal\n',
    extract(1283, 1894),
    '\n',
    extract(3220, 5059),
    '\n',
    extract(5060, 5134),
    '\n',
    extract(5895, totalLines),
    '\n',
].join('\n');

// ── UpdateRevit.js ───────────────────────────────────────────────────────────
const ur = [
    '// UpdateRevit.js – Phase 3: open selected elements in Viewer, update Revit parameters\n',
    extract(5184, 5894),
    '\n',
].join('\n');

fs.writeFileSync(path.join(DEST, 'ExecuteQuery.js'),      eq, 'utf8');
fs.writeFileSync(path.join(DEST, 'ExploreParameters.js'), ep, 'utf8');
fs.writeFileSync(path.join(DEST, 'UpdateRevit.js'),       ur, 'utf8');

const eqLines = eq.split('\n').length;
const epLines = ep.split('\n').length;
const urLines = ur.split('\n').length;

console.log(`ExecuteQuery.js:      ${eqLines} lines`);
console.log(`ExploreParameters.js: ${epLines} lines`);
console.log(`UpdateRevit.js:       ${urLines} lines`);
console.log('Done.');
