// Element Tags: small HTML labels anchored to viewer elements, showing each Parameter Edit
// row's New Value. The rows (window._pendingParamEditRows) are the single source of truth, so
// tags follow Reorder, Bulk Assign, manual edits, paste, Fill Down and Clear without extra wiring.
(function () {
    var STORAGE_KEY = 'aecdm.tagsVisible';
    var POLL_MS = 300;
    var DEFAULT_COLOR = '#0696d7';

    var state = {
        visible: loadVisiblePref(),
        layer: null,
        boundViewer: null,
        tags: [],            // [{ el, anchor: THREE.Vector3, model, dbId }]
        signature: '',
        rafPending: false
    };

    // `viewer` is declared with `let` in config.js, so it is not on window — check the bare identifier.
    function hasViewer() {
        return typeof viewer !== 'undefined' && !!viewer && !!viewer.impl;
    }

    function loadVisiblePref() {
        try { return localStorage.getItem(STORAGE_KEY) !== '0'; } catch (e) { return true; }
    }

    function saveVisiblePref(v) {
        try { localStorage.setItem(STORAGE_KEY, v ? '1' : '0'); } catch (e) {}
    }

    function ensureLayer() {
        if (!hasViewer()) return null;
        if (state.layer && state.layer.parentNode === viewer.container && state.boundViewer === viewer) return state.layer;

        if (state.layer && state.layer.parentNode) state.layer.parentNode.removeChild(state.layer);
        state.layer = document.createElement('div');
        state.layer.className = 'element-tag-layer';
        state.layer.style.display = state.visible ? '' : 'none';
        viewer.container.appendChild(state.layer);

        if (state.boundViewer !== viewer) {
            var E = Autodesk.Viewing;
            [E.CAMERA_CHANGE_EVENT, E.VIEWER_RESIZE_EVENT, E.ISOLATE_EVENT, E.HIDE_EVENT, E.SHOW_EVENT]
                .forEach(function (evt) { if (evt) viewer.addEventListener(evt, schedulePosition); });
            state.boundViewer = viewer;
        }
        return state.layer;
    }

    function rowColor(row) {
        return (row && row.__tagColor) || DEFAULT_COLOR;
    }

    function rowsWithValues() {
        return (window._pendingParamEditRows || []).filter(function (r) {
            return r && r.revitIds && r.revitIds.length && String(r.newValue || '').trim() !== '';
        });
    }

    function computeSignature(rows) {
        var cache = window._peRevitDbIdCache;
        var parts = [cache ? String(cache.size) : '0'];
        rows.forEach(function (r) {
            var egId = (r.fileContext && r.fileContext.egId) || '';
            parts.push(egId + '|' + r.revitIds.join(',') + '=' + r.newValue + '|' + rowColor(r));
        });
        return parts.join('\n');
    }

    // Same lookup as _peIsolateWithFocus in viewer.js: prefer the egId-qualified key (multi-model).
    function lookupEntry(cache, egId, revitId) {
        var entry = egId ? cache.get(egId + '::' + revitId) : null;
        if (!entry) entry = cache.get(String(revitId));
        if (!entry) return null;
        if (typeof entry === 'object' && entry.dbId !== undefined) return entry;
        return { dbId: entry, model: viewer.model };
    }

    // Top-centre of the element's world bounding box (Revit models are Z-up).
    function anchorFor(model, dbId) {
        var tree = model.getInstanceTree && model.getInstanceTree();
        var frags = model.getFragmentList && model.getFragmentList();
        if (!tree || !frags) return null;
        var box = new THREE.Box3();
        var tmp = new THREE.Box3();
        var any = false;
        tree.enumNodeFragments(dbId, function (fragId) {
            frags.getWorldBounds(fragId, tmp);
            box.union(tmp);
            any = true;
        }, true);
        // Viewer v7 bundles three.js r71 (no Box3.isEmpty), so check the bounds directly.
        if (!any || box.min.x > box.max.x) return null;
        return new THREE.Vector3((box.min.x + box.max.x) / 2, (box.min.y + box.max.y) / 2, box.max.z);
    }

    function clearTags() {
        state.tags.forEach(function (t) { if (t.el.parentNode) t.el.parentNode.removeChild(t.el); });
        state.tags = [];
    }

    function rebuild(rows) {
        clearTags();
        var layer = ensureLayer();
        var cache = window._peRevitDbIdCache;
        if (!layer || !cache) return;

        rows.forEach(function (row) {
            var egId = (row.fileContext && row.fileContext.egId) || '';
            var text = String(row.newValue).trim();
            var color = rowColor(row);
            row.revitIds.forEach(function (rid) {
                var entry = lookupEntry(cache, egId, rid);
                if (!entry) return;
                var anchor = anchorFor(entry.model, entry.dbId);
                if (!anchor) return;
                var el = document.createElement('div');
                el.className = 'element-tag';
                el.textContent = text;
                el.title = (row.paramName || '') + ' · ElementId ' + rid;
                el.style.borderColor = color;
                layer.appendChild(el);
                state.tags.push({ el: el, anchor: anchor, model: entry.model, dbId: entry.dbId });
            });
        });
        positionAll();
    }

    function isElementVisible(model, dbId) {
        try {
            if (typeof viewer.isNodeVisible === 'function') return viewer.isNodeVisible(dbId, model);
        } catch (e) {}
        return true;
    }

    function positionAll() {
        state.rafPending = false;
        if (!state.visible || !state.tags.length || !hasViewer()) return;
        var camera = viewer.impl.camera;
        var w = viewer.container.clientWidth;
        var h = viewer.container.clientHeight;
        var p = new THREE.Vector3();
        state.tags.forEach(function (t) {
            p.copy(t.anchor).project(camera);
            // z > 1 → behind the camera; also hide tags of hidden elements and those far off-screen.
            var onScreen = p.z <= 1 && p.x >= -1.2 && p.x <= 1.2 && p.y >= -1.2 && p.y <= 1.2;
            if (!onScreen || !isElementVisible(t.model, t.dbId)) {
                t.el.style.display = 'none';
                return;
            }
            var x = (p.x + 1) / 2 * w;
            var y = (1 - p.y) / 2 * h;
            t.el.style.display = '';
            t.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-100%)';
        });
    }

    function schedulePosition() {
        if (state.rafPending) return;
        state.rafPending = true;
        requestAnimationFrame(positionAll);
    }

    // Rebuild tags only when the set of (element, value, colour) changes.
    function sync(force) {
        if (!hasViewer()) return;
        var rows = rowsWithValues();
        var sig = computeSignature(rows);
        if (!force && sig === state.signature) return;
        state.signature = sig;
        rebuild(rows);
    }

    function updateButton() {
        var btn = document.getElementById('viewerTagsBtn');
        if (!btn) return;
        btn.classList.toggle('tags-active', state.visible);
        btn.textContent = state.visible ? '🏷 Tags On' : '🏷 Tags Off';
    }

    function setVisible(v) {
        state.visible = !!v;
        saveVisiblePref(state.visible);
        if (state.layer) state.layer.style.display = state.visible ? '' : 'none';
        updateButton();
        if (state.visible) sync(true);
    }

    function reset() {
        clearTags();
        state.signature = '';
    }

    setInterval(function () {
        if (state.visible) sync(false);
    }, POLL_MS);

    document.addEventListener('DOMContentLoaded', updateButton);

    window.viewerToggleTags = function () { setVisible(!state.visible); };

    window.ElementTags = {
        refresh: function () { sync(true); },
        reset: reset,
        setVisible: setVisible,
        isVisible: function () { return state.visible; }
    };
})();
