// Bulk Assign mode: pick a series of elements (one-by-one or via native viewer multi-select)
// and apply the SAME value to all of their Parameter Edit rows at once.
(function () {
    var state = {
        enabled: false,
        selectedColor: '#ff9800',
        pickedRows: new Set(),       // Set<rowIndex> currently batched
        pickedEntries: new Map(),    // modelId::dbId -> {model, dbId}, for direct-feedback theming
        dbIdToRevitId: new Map(),
        lastPickKey: '',
        lastPickAt: 0,
        colorEpoch: 0,
        justDeselectedRevitId: null,
        justDeselectedAt: 0
    };

    // `viewer` is declared with `let viewer = null;` at the top level (config.js) — let/const
    // globals do NOT become window properties, so `window.viewer` is ALWAYS undefined.
    function hasViewer() {
        return typeof viewer !== 'undefined' && !!viewer;
    }

    function hexToVector4(hex) {
        var h = String(hex || '').trim();
        if (!/^#[0-9a-fA-F]{6}$/.test(h)) h = '#ff9800';
        var r = parseInt(h.slice(1, 3), 16) / 255;
        var g = parseInt(h.slice(3, 5), 16) / 255;
        var b = parseInt(h.slice(5, 7), 16) / 255;
        return new THREE.Vector4(r, g, b, 1);
    }

    function getViewerModels() {
        if (!hasViewer()) return [];
        return (viewer.getAllModels ? viewer.getAllModels() : (viewer.model ? [viewer.model] : [])) || [];
    }


    function colorPickedElement(model, dbId) {
        if (!hasViewer() || dbId === undefined || dbId === null) return;
        var epoch = state.colorEpoch;
        var color = hexToVector4(state.selectedColor);
        var targetModels = model ? [model] : getViewerModels();
        if (!targetModels.length && viewer.model) targetModels = [viewer.model];

        targetModels.forEach(function (m) {
            var modelId = (m && m.id !== undefined) ? String(m.id) : 'default';
            var key = modelId + '::' + String(dbId);
            state.pickedEntries.set(key, { model: m, dbId: dbId });
            try { viewer.setThemingColor(dbId, color, m, true); } catch (e) {}
        });

        // Forge selection overlay is applied after selection events; re-apply color
        // on next tick so the custom color stays visible.
        setTimeout(function () {
            if (epoch !== state.colorEpoch) return;
            targetModels.forEach(function (m) {
                try { viewer.setThemingColor(dbId, color, m, true); } catch (e) {}
            });
            if (viewer.impl && typeof viewer.impl.invalidate === 'function') {
                viewer.impl.invalidate(true, true, true);
            }
        }, 30);
    }

    // Removes the custom tint from a single element without touching other elements' theming
    // (w=0 means "no tint" for that dbId, unlike clearThemingColors() which clears everything).
    function clearThemingForDbId(model, dbId) {
        if (!hasViewer() || dbId === undefined || dbId === null) return;
        var targetModels = model ? [model] : getViewerModels();
        if (!targetModels.length && viewer.model) targetModels = [viewer.model];
        var noTint = new THREE.Vector4(0, 0, 0, 0);
        targetModels.forEach(function (m) {
            try { viewer.setThemingColor(dbId, noTint, m, true); } catch (e) {}
            var modelId = (m && m.id !== undefined) ? String(m.id) : 'default';
            state.pickedEntries.delete(modelId + '::' + String(dbId));
        });
    }

    // Full recompute: clear all theming, then reapply the batch color only for rows still in
    // state.pickedRows. Prefers the shared _peIsolateWithFocus pipeline (viewer.js) since it
    // builds/rebuilds window._peRevitDbIdCache automatically; falls back to using the cache
    // directly if that function isn't available for some reason.
    function recolorAllPickedRows() {
        if (!hasViewer()) return;
        var rows = window._pendingParamEditRows || [];
        var color = hexToVector4(state.selectedColor);

        if (typeof window._peIsolateWithFocus === 'function') {
            var allPairs = [];
            var focusPairs = [];
            rows.forEach(function (r) {
                if (!r || !r.revitIds) return;
                var egId = (r.fileContext && r.fileContext.egId) ? r.fileContext.egId : '';
                r.revitIds.forEach(function (rid) { allPairs.push({ revitId: String(rid), egId: egId }); });
            });
            state.pickedRows.forEach(function (idx) {
                var row = rows[idx];
                if (!row || !row.revitIds) return;
                var egId = (row.fileContext && row.fileContext.egId) ? row.fileContext.egId : '';
                row.revitIds.forEach(function (rid) { focusPairs.push({ revitId: String(rid), egId: egId }); });
            });
            if (allPairs.length) {
                window._peIsolateWithFocus(allPairs, focusPairs, color, { keepScene: true, append: false }).catch(function () {});
                return;
            }
        }

        // Fallback: direct cache-based clear+reapply.
        var models = getViewerModels();
        if (viewer.model && models.indexOf(viewer.model) === -1) models.push(viewer.model);
        models.forEach(function (m) { try { viewer.clearThemingColors(m); } catch (e) {} });
        try { viewer.clearThemingColors(); } catch (e) {}
        if (viewer.impl && typeof viewer.impl.invalidate === 'function') {
            viewer.impl.invalidate(true, true, true);
        }

        var cache = window._peRevitDbIdCache;
        var idsToReapply = [];
        state.pickedRows.forEach(function (idx) {
            var row = rows[idx];
            if (row && row.revitIds) idsToReapply = idsToReapply.concat(row.revitIds.map(String));
        });
        var epoch = state.colorEpoch;

        // Forge Viewer needs the clear to land on its own render pass before we reapply.
        setTimeout(function () {
            if (epoch !== state.colorEpoch || !hasViewer()) return;
            idsToReapply.forEach(function (rid) {
                var entry = cache && cache.get(String(rid));
                if (!entry) return;
                var dbId = (typeof entry === 'object' && entry.dbId !== undefined) ? entry.dbId : entry;
                var model = (typeof entry === 'object' && entry.model) ? entry.model : viewer.model;
                try { viewer.setThemingColor(dbId, color, model, true); } catch (e) {}
            });
            if (viewer.impl && typeof viewer.impl.invalidate === 'function') {
                viewer.impl.invalidate(true, true, true);
            }
        }, 50);
    }

    // Like recolorAllPickedRows, but the focus set is every row that actually HAS a value
    // applied (row.newValue), not just whatever's currently in the picking batch. Used when
    // exiting Bulk Assign so applied elements keep their color while unapplied picks don't.
    function recolorPersistedRows() {
        if (!hasViewer()) return;
        var rows = window._pendingParamEditRows || [];
        var color = hexToVector4(state.selectedColor);
        state.pickedEntries.clear();

        if (typeof window._peIsolateWithFocus === 'function') {
            var allPairs = [];
            var focusPairs = [];
            rows.forEach(function (r) {
                if (!r || !r.revitIds) return;
                var egId = (r.fileContext && r.fileContext.egId) ? r.fileContext.egId : '';
                r.revitIds.forEach(function (rid) { allPairs.push({ revitId: String(rid), egId: egId }); });
                if (r.newValue) {
                    r.revitIds.forEach(function (rid) { focusPairs.push({ revitId: String(rid), egId: egId }); });
                }
            });
            if (allPairs.length) {
                window._peIsolateWithFocus(allPairs, focusPairs, color, { keepScene: true, append: false }).catch(function () {});
                return;
            }
        }

        // Fallback: direct cache-based clear+reapply.
        var models = getViewerModels();
        if (viewer.model && models.indexOf(viewer.model) === -1) models.push(viewer.model);
        models.forEach(function (m) { try { viewer.clearThemingColors(m); } catch (e) {} });
        try { viewer.clearThemingColors(); } catch (e) {}
        if (viewer.impl && typeof viewer.impl.invalidate === 'function') {
            viewer.impl.invalidate(true, true, true);
        }

        var cache = window._peRevitDbIdCache;
        var idsToReapply = [];
        rows.forEach(function (r) {
            if (r && r.newValue && r.revitIds) idsToReapply = idsToReapply.concat(r.revitIds.map(String));
        });
        var epoch = state.colorEpoch;
        setTimeout(function () {
            if (epoch !== state.colorEpoch || !hasViewer()) return;
            idsToReapply.forEach(function (rid) {
                var entry = cache && cache.get(String(rid));
                if (!entry) return;
                var dbId = (typeof entry === 'object' && entry.dbId !== undefined) ? entry.dbId : entry;
                var model = (typeof entry === 'object' && entry.model) ? entry.model : viewer.model;
                try { viewer.setThemingColor(dbId, color, model, true); } catch (e) {}
            });
            if (viewer.impl && typeof viewer.impl.invalidate === 'function') {
                viewer.impl.invalidate(true, true, true);
            }
        }, 50);
    }

    function getCacheKey(model, dbId) {
        var modelId = (model && model.id !== undefined) ? model.id : 'default';
        return modelId + '::' + String(dbId);
    }

    // No propFilter: propFilter for ElementId/'Revit Element ID' is unreliable and can return 0
    // results depending on the model — fetch everything and loosely match the property name.
    function resolveRevitId(model, dbId) {
        return new Promise(function (resolve) {
            if (!model || dbId === undefined || dbId === null) { resolve(null); return; }
            var key = getCacheKey(model, dbId);
            if (state.dbIdToRevitId.has(key)) { resolve(state.dbIdToRevitId.get(key)); return; }

            model.getBulkProperties([dbId], {}, function (results) {
                var revitId = null;
                if (results && results[0] && Array.isArray(results[0].properties)) {
                    for (var i = 0; i < results[0].properties.length; i++) {
                        var p = results[0].properties[i];
                        var n = String(p.displayName || '').toLowerCase();
                        if (n.indexOf('elementid') >= 0 || n.indexOf('element id') >= 0 || n.indexOf('element_id') >= 0) {
                            revitId = String(p.displayValue || '');
                            break;
                        }
                    }
                }
                state.dbIdToRevitId.set(key, revitId);
                resolve(revitId);
            }, function () { resolve(null); });
        });
    }

    function rowMatchesRevitId(row, revitId) {
        if (!row || !row.revitIds || !revitId) return false;
        // Insulated/lined MEP elements (ducts, pipes) can report a compound "hostId/liningId"
        // ElementId — check every segment so those elements still resolve to their row.
        var candidates = String(revitId).split('/');
        return row.revitIds.some(function (rid) {
            var ridStr = String(rid);
            return candidates.some(function (c) { return c === ridStr; });
        });
    }

    function getSelectedRows(rows) {
        var st = window._peTableState;
        if (!st || !st.selected || st.selected.size === 0) return [];
        return Array.from(st.selected)
            .filter(function (i) { return rows[i]; })
            .sort(function (a, b) { return a - b; });
    }

    function pickTargetRowIndex(rows, revitId) {
        var selected = getSelectedRows(rows);
        if (selected.length > 0) {
            var matchInSelected = selected.find(function (idx) { return rowMatchesRevitId(rows[idx], revitId); });
            if (matchInSelected !== undefined) return matchInSelected;
        }
        if (revitId) {
            for (var i = 0; i < rows.length; i++) {
                if (rowMatchesRevitId(rows[i], revitId)) return i;
            }
        }
        return -1;
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

    function getPickEntries(event, isAggregate) {
        var out = [];
        var agg = (hasViewer() && viewer.getAggregateSelection) ? viewer.getAggregateSelection() : null;
        if (agg && agg.length > 0) {
            agg.forEach(function (sel) {
                var ids = sel.selection || sel.dbIdArray || sel.ids || [];
                ids.forEach(function (id) {
                    out.push({ dbId: id, model: sel.model || (hasViewer() && viewer.model) });
                });
            });
            if (out.length > 0) return out;
        }

        if (!isAggregate) {
            if (!event || !event.dbIdArray || event.dbIdArray.length === 0) return out;
            out.push({ dbId: event.dbIdArray[0], model: event.model || (hasViewer() && viewer.model) });
            return out;
        }

        if (!event || !event.selections || event.selections.length === 0) return out;
        var first = event.selections[0];
        var list = first.dbIdArray || first.selection || first.ids || [];
        if (!list.length) return out;
        out.push({ dbId: list[0], model: first.model || (hasViewer() && viewer.model) });
        return out;
    }

    function extractPick(event, isAggregate) {
        var entries = getPickEntries(event, isAggregate);
        if (!entries.length) return null;
        return entries[0];
    }

    function syncInputAt(idx, value) {
        var input = document.querySelector('#peParamTbody .pe-new-input[data-idx="' + idx + '"]');
        if (input) input.value = value;
        if (typeof window._peRefreshRowStyles === 'function') window._peRefreshRowStyles();
    }

    function rowLabel(row, idx) {
        var ridText = (row.revitIds && row.revitIds.length) ? (' (ElementId ' + row.revitIds[0] + ')') : '';
        return (row.paramName || ('Row ' + (idx + 1))) + ridText;
    }

    function renderBatchList() {
        var list = document.getElementById('bulkAssignList');
        if (!list) return;
        var rows = window._pendingParamEditRows || [];
        var indices = Array.from(state.pickedRows).sort(function (a, b) { return a - b; });
        if (indices.length === 0) {
            list.innerHTML = '<div style="color:#888;font-size:11px;padding:4px 0;">No elements picked yet.</div>';
        } else {
            list.innerHTML = indices.map(function (idx) {
                var row = rows[idx];
                if (!row) return '';
                return '<div class="bulk-assign-item" data-idx="' + idx + '">' +
                    '<span>' + _peEscapeHtmlSafe(rowLabel(row, idx)) + '</span>' +
                    '<button type="button" class="bulk-assign-remove" data-idx="' + idx + '">&times;</button>' +
                    '</div>';
            }).join('');
        }
        var countEl = document.getElementById('bulkAssignCount');
        if (countEl) countEl.textContent = indices.length + ' picked';
    }

    function _peEscapeHtmlSafe(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function setStatus(msg) {
        var status = document.getElementById('bulkAssignStatus');
        if (status) status.textContent = msg || '';
    }

    function setButtonState(active) {
        var btn = document.getElementById('viewerBulkAssignBtn');
        if (!btn) return;
        btn.classList.toggle('bulk-assign-active', !!active);
        btn.textContent = active ? 'Bulk Assign On' : 'Bulk Assign';
    }

    function addRowToBatch(rowIndex) {
        if (state.pickedRows.has(rowIndex)) return false;
        state.pickedRows.add(rowIndex);
        return true;
    }

    function removeRowFromBatch(rowIndex) {
        if (!state.pickedRows.has(rowIndex)) return false;
        state.pickedRows.delete(rowIndex);
        return true;
    }

    // Undoes a re-click on an already-picked element.
    function handleDeselectPick(pick, rowIndex, revitId) {
        clearThemingForDbId(pick.model, pick.dbId);
        var rows = window._pendingParamEditRows || [];
        var row = rows[rowIndex];
        removeRowFromBatch(rowIndex);
        state.justDeselectedRevitId = revitId;
        state.justDeselectedAt = Date.now();
        recolorAllPickedRows();
        renderBatchList();
        setStatus('Removed ' + (row ? rowLabel(row, rowIndex) : ('row ' + rowIndex)) + ' from batch.');
    }

    function handleSelectPick(pick, rowIndex, revitId) {
        var rows = window._pendingParamEditRows || [];
        var row = rows[rowIndex];
        addRowToBatch(rowIndex);
        colorPickedElement(pick.model, pick.dbId);
        renderBatchList();
        setStatus('Added ' + (row ? rowLabel(row, rowIndex) : ('row ' + rowIndex)) + ' to batch. (' + state.pickedRows.size + ' total)');
    }

    function onViewerSelection(event, isAggregate) {
        if (!state.enabled) return;
        var picks = getPickEntries(event, !!isAggregate);
        if (picks.length === 0) return;

        var pick = extractPick(event, !!isAggregate);
        if (!pick) return;
        if (isDuplicatePick(pick)) return;

        resolveRevitId(pick.model, pick.dbId).then(function (revitId) {
            var rows = window._pendingParamEditRows || [];
            var targetIdx = pickTargetRowIndex(rows, revitId);
            if (targetIdx < 0) {
                setStatus('No matching Parameter Edit row for this element.');
                return;
            }

            if (state.pickedRows.has(targetIdx)) {
                handleDeselectPick(pick, targetIdx, revitId);
                return;
            }

            // Swallow the viewer's own immediate re-select echo after a deselect.
            if (revitId && revitId === state.justDeselectedRevitId && (Date.now() - state.justDeselectedAt) < 800) {
                state.justDeselectedRevitId = null;
                return;
            }

            handleSelectPick(pick, targetIdx, revitId);
        });
    }

    // "Select all": bulk-add every row backing the CURRENT native viewer selection (built via
    // box-select / ctrl-click) in one shot, instead of clicking each element individually.
    function addCurrentViewerSelectionToBatch() {
        if (!hasViewer()) { setStatus('Viewer not available.'); return; }
        var entries = [];
        var agg = viewer.getAggregateSelection ? viewer.getAggregateSelection() : null;
        if (agg && agg.length > 0) {
            agg.forEach(function (sel) {
                var ids = sel.selection || sel.dbIdArray || sel.ids || [];
                ids.forEach(function (id) { entries.push({ dbId: id, model: sel.model || viewer.model }); });
            });
        } else if (typeof viewer.getSelection === 'function') {
            (viewer.getSelection() || []).forEach(function (id) { entries.push({ dbId: id, model: viewer.model }); });
        }

        if (entries.length === 0) {
            setStatus('Nothing is currently selected in the viewer. Ctrl+click or box-select elements first.');
            return;
        }

        var rows = window._pendingParamEditRows || [];
        Promise.all(entries.map(function (e) {
            return resolveRevitId(e.model, e.dbId).then(function (revitId) { return { entry: e, revitId: revitId }; });
        })).then(function (resolved) {
            var added = 0, skipped = 0;
            resolved.forEach(function (r) {
                var targetIdx = pickTargetRowIndex(rows, r.revitId);
                if (targetIdx < 0) { skipped += 1; return; }
                if (addRowToBatch(targetIdx)) {
                    added += 1;
                    colorPickedElement(r.entry.model, r.entry.dbId);
                }
            });
            renderBatchList();
            setStatus('Added ' + added + ' element(s) from current selection' + (skipped ? (' (' + skipped + ' had no matching row)') : '') + '. Batch total: ' + state.pickedRows.size + '.');
        });
    }

    function applyValueToBatch() {
        var input = document.getElementById('bulkAssignValue');
        var value = input ? input.value : '';
        if (!value) { setStatus('Enter a value first.'); return; }
        if (state.pickedRows.size === 0) { setStatus('No elements picked yet.'); return; }

        var rows = window._pendingParamEditRows || [];
        var count = 0;
        state.pickedRows.forEach(function (idx) {
            var row = rows[idx];
            if (!row) return;
            row.newValue = value;
            syncInputAt(idx, value);
            count += 1;
        });
        setStatus('Applied "' + value + '" to ' + count + ' row(s).');
    }

    function clearBatch() {
        state.colorEpoch += 1;
        state.pickedRows.clear();
        recolorPersistedRows(); // drop highlighting for unapplied picks, keep already-applied rows colored
        if (hasViewer() && viewer.impl && typeof viewer.impl.invalidate === 'function') {
            viewer.impl.invalidate(true, true, true);
        }
        renderBatchList();
        setStatus('Batch cleared.');
    }

    function ensureModal() {
        var existing = document.getElementById('bulkAssignModal');
        if (existing) return existing;

        var modal = document.createElement('div');
        modal.id = 'bulkAssignModal';
        modal.className = 'reorder-modal';
        modal.style.display = 'none';
        modal.style.left = '340px';
        modal.innerHTML = '' +
            '<div class="reorder-modal-header" id="bulkAssignModalHeader">' +
                '<span>Bulk Assign Value</span>' +
                '<button id="bulkAssignCloseBtn" type="button" style="background:none;border:none;color:#fff;cursor:pointer;font-size:16px;line-height:1;">x</button>' +
            '</div>' +
            '<div class="reorder-modal-body">' +
                '<div class="reorder-field">' +
                    '<label for="bulkAssignValue">Value to apply</label>' +
                    '<input id="bulkAssignValue" type="text" placeholder="Example: Approved">' +
                '</div>' +
                '<div class="reorder-field">' +
                    '<label for="bulkAssignColor">Picked element color</label>' +
                    '<input id="bulkAssignColor" type="color" value="#ff9800">' +
                '</div>' +
                '<div class="reorder-actions">' +
                    '<button id="bulkAssignAddSelectionBtn" type="button">Add Viewer Selection</button>' +
                    '<button id="bulkAssignApplyBtn" type="button" class="primary">Apply to All Picked</button>' +
                    '<button id="bulkAssignClearBtn" type="button">Clear Batch</button>' +
                    '<button id="bulkAssignDisableBtn" type="button">Exit Bulk Assign</button>' +
                '</div>' +
                '<div class="reorder-field" style="margin-top:10px;">' +
                    '<label>Picked elements (<span id="bulkAssignCount">0 picked</span>)</label>' +
                    '<div id="bulkAssignList" class="bulk-assign-list"></div>' +
                '</div>' +
                '<div class="reorder-status" id="bulkAssignStatus"></div>' +
            '</div>';

        document.body.appendChild(modal);

        document.getElementById('bulkAssignColor').addEventListener('input', function (e) {
            state.selectedColor = e.target.value || '#ff9800';
            recolorAllPickedRows();
        });

        document.getElementById('bulkAssignAddSelectionBtn').addEventListener('click', addCurrentViewerSelectionToBatch);
        document.getElementById('bulkAssignApplyBtn').addEventListener('click', applyValueToBatch);
        document.getElementById('bulkAssignClearBtn').addEventListener('click', clearBatch);
        document.getElementById('bulkAssignDisableBtn').addEventListener('click', disable);
        document.getElementById('bulkAssignCloseBtn').addEventListener('click', disable);

        document.getElementById('bulkAssignList').addEventListener('click', function (e) {
            var btn = e.target.closest('.bulk-assign-remove');
            if (!btn) return;
            var idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (isNaN(idx)) return;
            removeRowFromBatch(idx);
            recolorAllPickedRows();
            renderBatchList();
        });

        makeModalDraggable(modal, document.getElementById('bulkAssignModalHeader'));
        return modal;
    }

    function makeModalDraggable(modal, header) {
        var startX = 0, startY = 0, left = 0, top = 0, dragging = false;
        header.addEventListener('mousedown', function (e) {
            dragging = true;
            startX = e.clientX; startY = e.clientY;
            left = modal.offsetLeft; top = modal.offsetTop;
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

    function enable() {
        if (!document.getElementById('peParamTbody')) {
            alert('Open and populate the Parameter Edit list first, then enable Bulk Assign.');
            return;
        }

        if (window.ReorderController && window.ReorderController.isEnabled && window.ReorderController.isEnabled()) {
            window.ReorderController.disable();
        }

        ensureModal();
        state.selectedColor = document.getElementById('bulkAssignColor').value || '#ff9800';
        state.enabled = true;

        var modal = document.getElementById('bulkAssignModal');
        modal.style.display = '';
        setButtonState(true);
        renderBatchList();
        recolorAllPickedRows(); // restore coloring for whatever's still in the batch from last time

        setStatus('Bulk Assign enabled. Click elements one-by-one, or multi-select in the viewer and click "Add Viewer Selection".');
    }

    function disable() {
        state.enabled = false;
        state.colorEpoch += 1;
        state.lastPickKey = '';
        state.lastPickAt = 0;
        recolorPersistedRows(); // keep color only for rows that actually received a value
        if (hasViewer()) {
            if (typeof viewer.clearSelection === 'function') viewer.clearSelection();
            if (viewer.impl && typeof viewer.impl.invalidate === 'function') viewer.impl.invalidate(true, true, true);
        }
        var modal = document.getElementById('bulkAssignModal');
        if (modal) modal.style.display = 'none';
        setButtonState(false);
    }

    // Global entry point used by the Bulk Assign button.
    window.viewerBulkAssign = function () {
        if (state.enabled) disable();
        else enable();
    };

    window.BulkAssignController = {
        isEnabled: function () { return !!state.enabled; },
        onViewerSelection: onViewerSelection,
        disable: disable
    };
})();
