// Reorder mode: assign incrementing values to Parameter Edit rows from viewer clicks.
(function () {
    var state = {
        enabled: false,
        seed: 'test-1',
        prefix: 'test-',
        suffix: '',
        currentNumber: 1,
        step: 1,
        alphaEnabled: false,
        alphaStep: 1,
        alphaHead: '',
        alphaTail: '',
        alphaCurrent: null,
        padding: 1,
        autoAdvance: true,
        activeRowIndex: -1,
        assignmentCounter: 0,
        selectedColor: '#00c853',
        pickedEntries: new Map(),
        revitIdToDbEntries: new Map(),
        revitMapPromise: null,
        dbIdToRevitId: new Map(),
        lastPickKey: '',
        lastPickAt: 0,
        colorEpoch: 0
    };

    function hexToVector4(hex) {
        var h = String(hex || '').trim();
        if (!/^#[0-9a-fA-F]{6}$/.test(h)) h = '#00c853';
        var r = parseInt(h.slice(1, 3), 16) / 255;
        var g = parseInt(h.slice(3, 5), 16) / 255;
        var b = parseInt(h.slice(5, 7), 16) / 255;
        return new THREE.Vector4(r, g, b, 1);
    }

    function hexToColor(hex) {
        var h = String(hex || '').trim();
        if (!/^#[0-9a-fA-F]{6}$/.test(h)) h = '#00c853';
        if (typeof THREE !== 'undefined' && typeof THREE.Color === 'function') {
            return new THREE.Color(h);
        }
        return h;
    }

    function applyViewerSelectionColor() {
        if (!window.viewer || typeof viewer.setSelectionColor !== 'function') return;
        try {
            viewer.setSelectionColor(hexToColor(state.selectedColor));
        } catch (e) {
            try {
                viewer.setSelectionColor(hexToColor(state.selectedColor), Autodesk.Viewing.SelectionType.MIXED);
            } catch (e2) {}
        }
    }

    function colorCurrentSelectionNow() {
        if (!window.viewer) return;
        var selected = (typeof viewer.getSelection === 'function') ? viewer.getSelection() : [];
        var model = viewer.model || null;
        (selected || []).forEach(function (dbId) {
            colorPickedElement(model, dbId);
        });

        var agg = (typeof viewer.getAggregateSelection === 'function') ? viewer.getAggregateSelection() : [];
        (agg || []).forEach(function (sel) {
            var ids = sel.selection || sel.dbIdArray || sel.ids || [];
            ids.forEach(function (dbId) {
                colorPickedElement(sel.model || model, dbId);
            });
        });
    }

    function getViewerModels() {
        if (!window.viewer) return [];
        return (viewer.getAllModels ? viewer.getAllModels() : (viewer.model ? [viewer.model] : [])) || [];
    }

    function clearViewerHighlights() {
        var models = getViewerModels();
        var visibleModels = (viewer && viewer.getVisibleModels) ? (viewer.getVisibleModels() || []) : [];
        var queuedModels = (viewer && viewer.impl && viewer.impl.modelQueue) ? (viewer.impl.modelQueue().getModels() || []) : [];
        var all = [].concat(models, visibleModels, queuedModels);
        var seen = new Set();
        all.forEach(function (m) {
            if (!m) return;
            var k = (m.id !== undefined) ? String(m.id) : String(m);
            if (seen.has(k)) return;
            seen.add(k);
            try { viewer.clearThemingColors(m); } catch (e) {}
        });
        try { viewer.clearThemingColors(); } catch (e) {}
        state.pickedEntries.clear();
    }

    function colorPickedElement(model, dbId) {
        if (!window.viewer || dbId === undefined || dbId === null) return;
        var epoch = state.colorEpoch;
        var color = hexToVector4(state.selectedColor);
        var targetModels = [];

        if (model) {
            targetModels = [model];
        } else {
            // In aggregate mode event.model may be missing; try all loaded models.
            targetModels = getViewerModels();
        }

        if (!targetModels.length) {
            // Final fallback for single-model scenarios.
            if (viewer.model) targetModels = [viewer.model];
        }

        targetModels.forEach(function (m) {
            try {
                // recursive=true helps when the selected node is a parent/container.
                viewer.setThemingColor(dbId, color, m, true);
                var modelId = (m && m.id !== undefined) ? String(m.id) : 'default';
                var key = modelId + '::' + String(dbId);
                state.pickedEntries.set(key, { model: m, dbId: dbId });
            } catch (e) {
                // Ignore per-model failures and continue.
            }
        });

        // Forge selection overlay is applied after selection events; re-apply color
        // on next tick and clear selection then, so the custom color stays visible.
        setTimeout(function () {
            if (epoch !== state.colorEpoch) return;
            targetModels.forEach(function (m) {
                try {
                    viewer.setThemingColor(dbId, color, m, true);
                } catch (e) {}
            });
            if (viewer.impl && typeof viewer.impl.invalidate === 'function') {
                viewer.impl.invalidate(true, true, true);
            }
        }, 30);
    }

    function refreshPickedColors() {
        if (!window.viewer) return;
        state.pickedEntries.forEach(function (entry) {
            try {
                viewer.setThemingColor(entry.dbId, hexToVector4(state.selectedColor), entry.model, true);
            } catch (e) {}
        });
        if (viewer.impl && typeof viewer.impl.invalidate === 'function') {
            viewer.impl.invalidate(true, true, true);
        }
    }

    function resetRevitColorCache() {
        state.revitIdToDbEntries = new Map();
        state.revitMapPromise = null;
    }

    function ensureRevitIdDbMap() {
        if (state.revitMapPromise) return state.revitMapPromise;
        if (state.revitIdToDbEntries && state.revitIdToDbEntries.size > 0) {
            return Promise.resolve(state.revitIdToDbEntries);
        }

        state.revitMapPromise = new Promise(function (resolve) {
            var models = getViewerModels();
            if (!models.length) {
                state.revitMapPromise = null;
                resolve(state.revitIdToDbEntries);
                return;
            }

            var pending = models.length;
            models.forEach(function (model) {
                try {
                    var tree = model.getInstanceTree ? model.getInstanceTree() : null;
                    if (!tree) {
                        pending -= 1;
                        if (pending === 0) {
                            state.revitMapPromise = null;
                            resolve(state.revitIdToDbEntries);
                        }
                        return;
                    }

                    var dbIds = [];
                    tree.enumNodeChildren(tree.getRootId(), function (dbId) { dbIds.push(dbId); }, true);
                    model.getBulkProperties(dbIds, { propFilter: ['ElementId', 'Element ID', 'Element_ID', 'Revit Element ID'] }, function (results) {
                        (results || []).forEach(function (item) {
                            var revitId = null;
                            (item.properties || []).forEach(function (p) {
                                var n = String(p.displayName || '').toLowerCase();
                                if (!revitId && n.indexOf('element') >= 0 && n.indexOf('id') >= 0) {
                                    revitId = String(p.displayValue || '');
                                }
                            });
                            if (!revitId) return;
                            if (!state.revitIdToDbEntries.has(revitId)) state.revitIdToDbEntries.set(revitId, []);
                            state.revitIdToDbEntries.get(revitId).push({ model: model, dbId: item.dbId });
                        });
                        pending -= 1;
                        if (pending === 0) {
                            state.revitMapPromise = null;
                            resolve(state.revitIdToDbEntries);
                        }
                    }, function () {
                        pending -= 1;
                        if (pending === 0) {
                            state.revitMapPromise = null;
                            resolve(state.revitIdToDbEntries);
                        }
                    });
                } catch (e) {
                    pending -= 1;
                    if (pending === 0) {
                        state.revitMapPromise = null;
                        resolve(state.revitIdToDbEntries);
                    }
                }
            });
        });

        return state.revitMapPromise;
    }

    function colorByRevitIds(revitIds) {
        var ids = (revitIds || []).map(function (r) { return String(r); });
        if (!ids.length) return Promise.resolve(false);

        // Reuse the same viewer pipeline that colors selected rows blue from the list.
        if (typeof window._peIsolateWithFocus === 'function') {
            var rows = window._pendingParamEditRows || [];
            var allPairs = [];
            var focusPairs = [];

            rows.forEach(function (r) {
                if (!r || !r.revitIds) return;
                var egId = (r.fileContext && r.fileContext.egId) ? r.fileContext.egId : '';
                r.revitIds.forEach(function (rid) {
                    allPairs.push({ revitId: String(rid), egId: egId });
                });
                // Keep all already-assigned rows focused so they remain visibly colored.
                if (typeof r.__reorderOrdinal === 'number') {
                    r.revitIds.forEach(function (rid) {
                        focusPairs.push({ revitId: String(rid), egId: egId });
                    });
                }
            });

            // Ensure current ids are always in focus set.
            ids.forEach(function (rid) {
                focusPairs.push({ revitId: rid, egId: '' });
            });

            return window._peIsolateWithFocus(
                allPairs,
                focusPairs,
                hexToVector4(state.selectedColor),
                { keepScene: true, append: true }
            )
                .then(function () { return true; })
                .catch(function () { return false; });
        }

        return ensureRevitIdDbMap().then(function (map) {
            var hitCount = 0;
            ids.forEach(function (rid) {
                var entries = map.get(rid) || [];
                entries.forEach(function (entry) {
                    hitCount += 1;
                    colorPickedElement(entry.model, entry.dbId);
                });
            });
            return hitCount > 0;
        });
    }

    function lettersToNumber(letters) {
        var s = String(letters || '').toUpperCase();
        var n = 0;
        for (var i = 0; i < s.length; i++) {
            var code = s.charCodeAt(i);
            if (code < 65 || code > 90) return null;
            n = n * 26 + (code - 64);
        }
        return n;
    }

    function numberToLetters(number) {
        var n = Math.max(1, parseInt(number, 10) || 1);
        var out = '';
        while (n > 0) {
            var rem = (n - 1) % 26;
            out = String.fromCharCode(65 + rem) + out;
            n = Math.floor((n - 1) / 26);
        }
        return out;
    }

    function deriveAlphaPartsFromPrefix() {
        // Split prefix into: head + trailing letters + tail.
        // Example: "A-" => head:"", letters:"A", tail:"-"
        var m = String(state.prefix || '').match(/^(.*?)([A-Za-z]+)([^A-Za-z]*)$/);
        if (!m) {
            state.alphaHead = '';
            state.alphaTail = '';
            state.alphaCurrent = null;
            return;
        }
        state.alphaHead = m[1] || '';
        state.alphaTail = m[3] || '';
        state.alphaCurrent = lettersToNumber(m[2]);
    }

    function parseSeed(seedValue) {
        var seed = String(seedValue || '').trim();
        if (!seed) seed = 'test-1';

        // Parse trailing number so values increment like Excel (example: test-1, test-2, ...)
        var match = seed.match(/^(.*?)(\d+)([^\d]*)$/);
        if (match) {
            state.prefix = match[1] || '';
            state.currentNumber = parseInt(match[2], 10);
            state.padding = match[2].length;
            state.suffix = match[3] || '';
        } else {
            state.prefix = seed + '-';
            state.currentNumber = 1;
            state.padding = 1;
            state.suffix = '';
        }
        state.seed = seed;
        deriveAlphaPartsFromPrefix();
    }

    function buildValue(number) {
        var n = Math.max(0, Number(number || 0));
        var p = Math.max(0, Number(state.padding || 0));
        var num = String(n).padStart(p, '0');
        var prefix = state.prefix;
        if (state.alphaEnabled && state.alphaCurrent !== null) {
            prefix = state.alphaHead + numberToLetters(state.alphaCurrent) + state.alphaTail;
        }
        return prefix + num + state.suffix;
    }

    function peekValue(offset) {
        var step = Math.max(1, parseInt(state.step, 10) || 1);
        return buildValue(state.currentNumber + (offset * step));
    }

    function nextValue() {
        var out = peekValue(0);
        var step = Math.max(1, parseInt(state.step, 10) || 1);
        state.currentNumber += step;
        if (state.alphaEnabled && state.alphaCurrent !== null) {
            var aStep = Math.max(1, parseInt(state.alphaStep, 10) || 1);
            state.alphaCurrent += aStep;
        }
        updatePreview();
        return out;
    }

    function ensureModal() {
        var existing = document.getElementById('reorderModal');
        if (existing) return existing;

        var modal = document.createElement('div');
        modal.id = 'reorderModal';
        modal.className = 'reorder-modal';
        modal.style.display = 'none';
        modal.innerHTML = '' +
            '<div class="reorder-modal-header" id="reorderModalHeader">' +
                '<span>Reorder Numbering</span>' +
                '<button id="reorderCloseBtn" type="button" style="background:none;border:none;color:#fff;cursor:pointer;font-size:16px;line-height:1;">x</button>' +
            '</div>' +
            '<div class="reorder-modal-body">' +
                '<div class="reorder-field">' +
                    '<label for="reorderSeed">Seed value</label>' +
                    '<input id="reorderSeed" type="text" value="test-1" placeholder="Example: test-1">' +
                '</div>' +
                '<div class="reorder-field">' +
                    '<label for="reorderStep">Increment step</label>' +
                    '<input id="reorderStep" type="number" min="1" step="1" value="1">' +
                '</div>' +
                '<label class="reorder-checkbox-row" for="reorderAlphaEnabled">' +
                    '<input id="reorderAlphaEnabled" type="checkbox">' +
                    '<span>Increment letters (A, B, C...)</span>' +
                '</label>' +
                '<div class="reorder-field">' +
                    '<label for="reorderAlphaStep">Letter step</label>' +
                    '<input id="reorderAlphaStep" type="number" min="1" step="1" value="1">' +
                '</div>' +
                '<div class="reorder-field">' +
                    '<label for="reorderColor">Picked element color</label>' +
                    '<input id="reorderColor" type="color" value="#00c853">' +
                '</div>' +
                '<label class="reorder-checkbox-row" for="reorderAutoAdvance">' +
                    '<input id="reorderAutoAdvance" type="checkbox" checked>' +
                    '<span>Auto-advance to next row</span>' +
                '</label>' +
                '<div class="reorder-preview" id="reorderPreview"></div>' +
                '<div class="reorder-actions">' +
                    '<button id="reorderClearBtn" type="button">Clear</button>' +
                    '<button id="reorderListBtn" type="button">Reorder in List</button>' +
                    '<button id="reorderResetBtn" type="button">Reset Counter</button>' +
                    '<button id="reorderDisableBtn" type="button" class="primary">Exit Reorder</button>' +
                '</div>' +
                '<div class="reorder-status" id="reorderStatus"></div>' +
            '</div>';

        document.body.appendChild(modal);

        document.getElementById('reorderSeed').addEventListener('input', function (e) {
            parseSeed(e.target.value);
            state.activeRowIndex = -1;
            updatePreview();
        });

        document.getElementById('reorderStep').addEventListener('input', function (e) {
            var parsed = parseInt(e.target.value, 10);
            state.step = (isNaN(parsed) || parsed < 1) ? 1 : parsed;
            updatePreview();
        });

        document.getElementById('reorderAlphaEnabled').addEventListener('change', function (e) {
            state.alphaEnabled = !!e.target.checked;
            deriveAlphaPartsFromPrefix();
            updatePreview();
        });

        document.getElementById('reorderAlphaStep').addEventListener('input', function (e) {
            var parsed = parseInt(e.target.value, 10);
            state.alphaStep = (isNaN(parsed) || parsed < 1) ? 1 : parsed;
            updatePreview();
        });

        document.getElementById('reorderAutoAdvance').addEventListener('change', function (e) {
            state.autoAdvance = !!e.target.checked;
        });

        document.getElementById('reorderColor').addEventListener('input', function (e) {
            state.selectedColor = e.target.value || '#00c853';
            applyViewerSelectionColor();
            refreshPickedColors();
            colorCurrentSelectionNow();
        });

        document.getElementById('reorderResetBtn').addEventListener('click', function () {
            parseSeed(document.getElementById('reorderSeed').value);
            var alphaStepParsed = parseInt(document.getElementById('reorderAlphaStep').value, 10);
            state.alphaStep = (isNaN(alphaStepParsed) || alphaStepParsed < 1) ? 1 : alphaStepParsed;
            state.alphaEnabled = !!document.getElementById('reorderAlphaEnabled').checked;
            updatePreview();
            setStatus('Counter reset to ' + peekValue(0));
        });

        document.getElementById('reorderClearBtn').addEventListener('click', function () {
            clearAllPlacedValues();
        });

        document.getElementById('reorderListBtn').addEventListener('click', function () {
            reorderRowsByAssignedOrder();
        });

        document.getElementById('reorderDisableBtn').addEventListener('click', function () {
            disable();
        });

        document.getElementById('reorderCloseBtn').addEventListener('click', function () {
            disable();
        });

        makeModalDraggable(modal, document.getElementById('reorderModalHeader'));
        updatePreview();
        return modal;
    }

    function makeModalDraggable(modal, header) {
        var startX = 0;
        var startY = 0;
        var left = 0;
        var top = 0;
        var dragging = false;

        header.addEventListener('mousedown', function (e) {
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            left = modal.offsetLeft;
            top = modal.offsetTop;
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (!dragging) return;
            var nextLeft = left + (e.clientX - startX);
            var nextTop = top + (e.clientY - startY);
            var maxLeft = Math.max(8, window.innerWidth - modal.offsetWidth - 8);
            var maxTop = Math.max(8, window.innerHeight - modal.offsetHeight - 8);
            modal.style.left = Math.min(Math.max(8, nextLeft), maxLeft) + 'px';
            modal.style.top = Math.min(Math.max(8, nextTop), maxTop) + 'px';
        });

        document.addEventListener('mouseup', function () {
            if (!dragging) return;
            dragging = false;
            document.body.style.userSelect = '';
        });
    }

    function updatePreview() {
        var preview = document.getElementById('reorderPreview');
        if (!preview) return;
        preview.textContent = 'Current: ' + peekValue(0) + ' | Next: ' + peekValue(1);
        if (state.alphaEnabled && state.alphaCurrent === null) {
            preview.textContent += ' (No letter token in prefix)';
        }
    }

    function setStatus(msg) {
        var status = document.getElementById('reorderStatus');
        if (status) status.textContent = msg || '';
    }

    function setButtonState(active) {
        var btn = document.getElementById('viewerReorderBtn');
        if (!btn) return;
        btn.classList.toggle('reorder-active', !!active);
        btn.textContent = active ? 'Reorder On' : 'Reorder';
    }

    function clearAllPlacedValues() {
        state.colorEpoch += 1; // cancel pending delayed recolor callbacks
        var rows = window._pendingParamEditRows || [];
        rows.forEach(function (r) {
            if (!r) return;
            r.newValue = '';
            delete r.__reorderOrdinal;
        });
        document.querySelectorAll('#peParamTbody .pe-new-input').forEach(function (input) {
            input.value = '';
        });
        state.assignmentCounter = 0;
        clearViewerHighlights();
        if (window.viewer && typeof viewer.clearSelection === 'function') {
            viewer.clearSelection();
        }
        if (window.viewer && viewer.impl && typeof viewer.impl.invalidate === 'function') {
            viewer.impl.invalidate(true, true, true);
        }
        resetRevitColorCache();
        setStatus('Cleared all assigned values and viewer highlights.');
    }

    function reorderRowsByAssignedOrder() {
        var rows = window._pendingParamEditRows || [];
        if (!rows.length) {
            setStatus('No rows to reorder.');
            return;
        }

        rows.sort(function (a, b) {
            var ao = (a && typeof a.__reorderOrdinal === 'number') ? a.__reorderOrdinal : Number.MAX_SAFE_INTEGER;
            var bo = (b && typeof b.__reorderOrdinal === 'number') ? b.__reorderOrdinal : Number.MAX_SAFE_INTEGER;
            if (ao !== bo) return ao - bo;
            var an = (a && a.paramName) ? String(a.paramName) : '';
            var bn = (b && b.paramName) ? String(b.paramName) : '';
            return an.localeCompare(bn);
        });

        var panel = document.getElementById('paramEditPanel');
        if (panel && typeof _peRenderParamTable === 'function') {
            _peRenderParamTable(panel, rows);
            setStatus('Reordered list by assignment sequence.');
        } else {
            setStatus('Rows reordered in data, but table render function was not found.');
        }
    }

    function getSelectedRows(rows) {
        var st = window._peTableState;
        if (!st || !st.selected || st.selected.size === 0) return [];
        return Array.from(st.selected)
            .filter(function (i) { return rows[i]; })
            .sort(function (a, b) { return a - b; });
    }

    function rowMatchesRevitId(row, revitId) {
        if (!row || !row.revitIds || !revitId) return false;
        return row.revitIds.some(function (rid) { return String(rid) === String(revitId); });
    }

    function pickTargetRowIndex(rows, revitId) {
        var selected = getSelectedRows(rows);

        if (selected.length > 0) {
            var matchInSelected = selected.find(function (idx) {
                return rowMatchesRevitId(rows[idx], revitId);
            });
            if (matchInSelected !== undefined) return matchInSelected;

            if (selected.indexOf(state.activeRowIndex) >= 0) return state.activeRowIndex;
            return selected[0];
        }

        if (revitId) {
            for (var i = 0; i < rows.length; i++) {
                if (rowMatchesRevitId(rows[i], revitId)) return i;
            }
        }

        if (state.activeRowIndex >= 0 && rows[state.activeRowIndex]) return state.activeRowIndex;
        return rows.length ? 0 : -1;
    }

    function advanceTarget(rows) {
        if (!state.autoAdvance || !rows.length) return;

        var selected = getSelectedRows(rows);
        if (selected.length > 1) {
            var currentPos = selected.indexOf(state.activeRowIndex);
            if (currentPos >= 0 && currentPos < selected.length - 1) {
                state.activeRowIndex = selected[currentPos + 1];
            }
            return;
        }

        if (state.activeRowIndex < rows.length - 1) state.activeRowIndex += 1;
    }

    function syncInputAt(idx, value) {
        var input = document.querySelector('#peParamTbody .pe-new-input[data-idx="' + idx + '"]');
        if (input) input.value = value;

        if (typeof window._peRefreshRowStyles === 'function') {
            window._peRefreshRowStyles();
        }

        var rowEl = document.querySelector('#peParamTbody tr.pe-param-row[data-idx="' + idx + '"]');
        if (rowEl) rowEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function getCacheKey(model, dbId) {
        var modelId = (model && model.id !== undefined) ? model.id : 'default';
        return modelId + '::' + String(dbId);
    }

    function resolveRevitId(model, dbId) {
        return new Promise(function (resolve) {
            if (!model || dbId === undefined || dbId === null) {
                resolve(null);
                return;
            }

            var key = getCacheKey(model, dbId);
            if (state.dbIdToRevitId.has(key)) {
                resolve(state.dbIdToRevitId.get(key));
                return;
            }

            model.getBulkProperties([dbId], { propFilter: ['ElementId', 'Element ID', 'Element_ID', 'Revit Element ID'] }, function (results) {
                var revitId = null;
                if (results && results[0] && Array.isArray(results[0].properties)) {
                    for (var i = 0; i < results[0].properties.length; i++) {
                        var p = results[0].properties[i];
                        var n = String(p.displayName || '').toLowerCase();
                        if (n.indexOf('element') >= 0 && n.indexOf('id') >= 0) {
                            revitId = String(p.displayValue || '');
                            break;
                        }
                    }
                }
                state.dbIdToRevitId.set(key, revitId);
                resolve(revitId);
            }, function () {
                resolve(null);
            });
        });
    }

    function extractPick(event, isAggregate) {
        var entries = getPickEntries(event, isAggregate);
        if (!entries.length) return null;
        return entries[0];
    }

    function getPickEntries(event, isAggregate) {
        var out = [];

        // Most reliable source for multi-model picking.
        var agg = (window.viewer && viewer.getAggregateSelection) ? viewer.getAggregateSelection() : null;
        if (agg && agg.length > 0) {
            agg.forEach(function (sel) {
                var ids = sel.selection || sel.dbIdArray || sel.ids || [];
                ids.forEach(function (id) {
                    out.push({ dbId: id, model: sel.model || (window.viewer && window.viewer.model) });
                });
            });
            if (out.length > 0) return out;
        }

        if (!isAggregate) {
            if (!event || !event.dbIdArray || event.dbIdArray.length === 0) return out;
            out.push({ dbId: event.dbIdArray[0], model: event.model || (window.viewer && window.viewer.model) });
            return out;
        }

        if (!event || !event.selections || event.selections.length === 0) return out;
        var first = event.selections[0];
        var list = first.dbIdArray || first.selection || first.ids || [];
        if (!list.length) return out;
        out.push({ dbId: list[0], model: first.model || (window.viewer && window.viewer.model) });
        return out;
    }

    function isDuplicatePick(pick) {
        var modelId = (pick.model && pick.model.id !== undefined) ? String(pick.model.id) : 'default';
        var key = modelId + '::' + String(pick.dbId);
        var now = Date.now();
        var duplicate = (key === state.lastPickKey) && ((now - state.lastPickAt) < 180);
        state.lastPickKey = key;
        state.lastPickAt = now;
        return duplicate;
    }

    function assignFromViewerPick(pick, picksToColor) {
        var rows = window._pendingParamEditRows || [];
        if (!rows.length) {
            setStatus('No rows available. Populate Parameter Edit table first.');
            return;
        }

        resolveRevitId(pick.model, pick.dbId).then(function (revitId) {
            var targetIdx = pickTargetRowIndex(rows, revitId);
            if (targetIdx < 0 || !rows[targetIdx]) {
                setStatus('Select a row in the left panel first.');
                return;
            }

            var value = nextValue();
            rows[targetIdx].newValue = value;
            rows[targetIdx].__reorderOrdinal = state.assignmentCounter++;
            state.activeRowIndex = targetIdx;
            syncInputAt(targetIdx, value);
            advanceTarget(rows);

            var rowName = rows[targetIdx].paramName || ('Row ' + (targetIdx + 1));
            var ridText = revitId ? (' (ElementId ' + revitId + ')') : '';
            setStatus('Assigned ' + value + ' to ' + rowName + ridText + '. Coloring selected element(s)...');

            colorByRevitIds(rows[targetIdx].revitIds).then(function (colored) {
                if (colored) {
                    setStatus('Assigned ' + value + ' to ' + rowName + ridText + '.');
                    return;
                }
                // Fallback: color the picked dbId(s) when row Revit IDs are not mappable.
                (picksToColor || [pick]).forEach(function (p) {
                    colorPickedElement(p.model, p.dbId);
                });
                setStatus('Assigned ' + value + ' to ' + rowName + ridText + '. (fallback color by picked object)');
            });
        });
    }

    function enable() {
        if (!document.getElementById('peParamTbody')) {
            alert('Open and populate the Parameter Edit list first, then enable Reorder.');
            return;
        }

        ensureModal();
        parseSeed(document.getElementById('reorderSeed').value);
        var stepValue = parseInt(document.getElementById('reorderStep').value, 10);
        state.step = (isNaN(stepValue) || stepValue < 1) ? 1 : stepValue;
        var alphaStepValue = parseInt(document.getElementById('reorderAlphaStep').value, 10);
        state.alphaStep = (isNaN(alphaStepValue) || alphaStepValue < 1) ? 1 : alphaStepValue;
        state.alphaEnabled = !!document.getElementById('reorderAlphaEnabled').checked;
        state.selectedColor = document.getElementById('reorderColor').value || '#00c853';
        applyViewerSelectionColor();
        deriveAlphaPartsFromPrefix();
        state.autoAdvance = !!document.getElementById('reorderAutoAdvance').checked;
        state.enabled = true;
        state.activeRowIndex = -1;

        var modal = document.getElementById('reorderModal');
        modal.style.display = '';
        setButtonState(true);
        updatePreview();

        if (window.viewer && typeof window.viewer.showAll === 'function') {
            window.viewer.showAll();
            clearViewerHighlights();
            resetRevitColorCache();
        }

        setStatus('Reorder mode enabled. Click elements in the viewer to fill New Value cells.');
    }

    function disable() {
        state.enabled = false;
        state.activeRowIndex = -1;
        state.colorEpoch += 1; // cancel any pending delayed recolor callbacks
        if (window.viewer) {
            clearViewerHighlights();
            if (typeof viewer.clearSelection === 'function') {
                viewer.clearSelection();
            }
            if (viewer.impl && typeof viewer.impl.invalidate === 'function') {
                viewer.impl.invalidate(true, true, true);
            }
        }
        var modal = document.getElementById('reorderModal');
        if (modal) modal.style.display = 'none';
        setButtonState(false);
    }

    function onViewerSelection(event, isAggregate) {
        if (!state.enabled) return;
        applyViewerSelectionColor();
        colorCurrentSelectionNow();
        var picks = getPickEntries(event, !!isAggregate);
        var pick = extractPick(event, !!isAggregate);
        if (!pick) return;
        if (isDuplicatePick(pick)) return;
        assignFromViewerPick(pick, picks);
    }

    // Global entry point used by the Reorder button.
    window.viewerReorder = function () {
        if (state.enabled) disable();
        else enable();
    };

    window.ReorderController = {
        isEnabled: function () { return !!state.enabled; },
        onViewerSelection: onViewerSelection,
        disable: disable
    };
})();
