// ─── Parameter Treemap Visualization (D3 v7) ─────────────────────────────────
// Hierarchy: Files → Categories → Parameters → Values
// Size metric: element count (string/bool params) or sum (numeric params)

let _tmData        = null;   // [{modelName, model, category, dbId, elementName, properties}]
let _tmParams      = null;   // Map<paramName, isNumeric>
let _tmLeafMap     = new Map(); // "paramName::value" → [{dbId, model}]
let _tmZoomStack   = [];
let _tmResizeT     = null;
let _tmSelListener = null;   // viewer selection listener

// ─── Entry point ──────────────────────────────────────────────────────────────

function showTreemapModal() {
    const checked = document.querySelectorAll('#categoryResults input[type="checkbox"]:checked');
    if (checked.length === 0) {
        alert('Please select at least one category first.');
        return;
    }

    const modal = document.getElementById('treemapModal');
    modal.style.display = 'flex';
    _tmZoomStack = [];
    _tmLeafMap.clear();

    if (!modal._tmInit) {
        _initDragAndResize(modal);
        modal._tmInit = true;
    }

    _registerViewerListener();

    const body = document.getElementById('treemapBody');
    body.innerHTML = '<div style="padding:30px;text-align:center;color:#666;">⏳ Scanning element properties…</div>';

    const selectedCategories = Array.from(checked).map(cb => cb.value);
    _collectProps(selectedCategories)
        .then(data => { _tmData = data; _showPicker(data); })
        .catch(err  => {
            document.getElementById('treemapBody').innerHTML =
                `<div style="padding:20px;color:#c62828;">Error: ${err.message}</div>`;
        });
}

function closeTreemapModal() {
    document.getElementById('treemapModal').style.display = 'none';
    _unregisterViewerListener();
    if (viewer) viewer.clearThemingColors();
}

function treemapBackToPicker() {
    _tmZoomStack = [];
    document.getElementById('treemapBackBtn').style.display = 'none';
    _showPicker(_tmData);
}

// ─── Drag + Resize ────────────────────────────────────────────────────────────

function _initDragAndResize(modal) {
    const header = document.getElementById('treemapHeader');
    let drag = false, ox, oy, ml, mt;

    header.addEventListener('mousedown', e => {
        drag = true;
        const r = modal.getBoundingClientRect();
        ml = r.left; mt = r.top;
        ox = e.clientX; oy = e.clientY;
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!drag) return;
        modal.style.left      = (ml + e.clientX - ox) + 'px';
        modal.style.top       = (mt + e.clientY - oy) + 'px';
        modal.style.transform = 'none';
    });
    document.addEventListener('mouseup', () => { drag = false; });

    // Redraw treemap on resize (debounced 150ms)
    new ResizeObserver(() => {
        if (_tmZoomStack.length === 0) return;
        clearTimeout(_tmResizeT);
        _tmResizeT = setTimeout(() => {
            if (document.getElementById('tmSvgContainer')) {
                _drawTreemap(_tmZoomStack[_tmZoomStack.length - 1]);
            }
        }, 150);
    }).observe(modal);
}

// ─── Data collection ──────────────────────────────────────────────────────────

async function _collectProps(selectedCategories) {
    const allElements = [];
    const allModels = viewer.getAllModels ? viewer.getAllModels() : [viewer.model];

    for (const cat of selectedCategories) {
        const entries = (cachedCategoryDbIds && cachedCategoryDbIds.get(cat)) || [];
        for (const { model, dbIds } of entries) {
            const idx   = allModels.indexOf(model);
            const mName = (currentLoadedFiles[idx] || {}).name || `Model ${idx + 1}`;
            const results = await new Promise((res, rej) => model.getBulkProperties(dbIds, {}, res, rej));
            for (const el of results) {
                allElements.push({
                    modelName:   mName,
                    model:       model,
                    category:    cat,
                    dbId:        el.dbId,
                    elementName: el.name || 'Unnamed',
                    properties:  el.properties || []
                });
            }
        }
    }
    return allElements;
}

// ─── Parameter picker ─────────────────────────────────────────────────────────

const _SKIP_PARAMS = new Set([
    '__viewable_in__', '__parent__', '__Node_Flags__',
    'viewable_in', 'parent', 'instanceof_objid', 'child'
]);

function _showPicker(data) {
    // Collect unique param names + detect type from Viewer's p.type field
    // type 2 = int, type 3 = float → numeric; everything else → string/bool
    const paramMap = new Map(); // name → { isNumeric, count }

    for (const el of data) {
        for (const p of el.properties) {
            const name = p.displayName || p.attributeName;
            if (!name || _SKIP_PARAMS.has(name) || name.startsWith('__')) continue;
            if (!paramMap.has(name)) {
                paramMap.set(name, { isNumeric: p.type === 2 || p.type === 3, count: 0 });
            }
            if (p.displayValue !== null && p.displayValue !== undefined && p.displayValue !== '') {
                paramMap.get(name).count++;
            }
        }
    }

    const params = [...paramMap.entries()]
        .filter(([, v]) => v.count > 0)
        .sort((a, b) => a[0].localeCompare(b[0]));

    let html = `
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
            <b style="font-size:13px;color:#333;">${data.length} elements</b>
            <span style="font-size:12px;">
                <a href="#" onclick="treemapSelAll(true);return false" style="color:#7b1fa2;margin-right:8px;">All</a>
                <a href="#" onclick="treemapSelAll(false);return false" style="color:#7b1fa2;">None</a>
            </span>
        </div>
        <input type="search" placeholder="Filter parameters…"
               oninput="treemapFilterParams(this.value)"
               style="width:100%;box-sizing:border-box;padding:6px 8px;margin-bottom:6px;
                      border:1px solid #ccc;border-radius:4px;font-size:12px;">
        <div id="tmParamList" style="max-height:300px;overflow-y:auto;border:1px solid #ddd;border-radius:4px;margin-bottom:12px;">`;

    for (const [name, info] of params) {
        const badge = info.isNumeric
            ? `<span style="font-size:10px;background:#f3e5f5;color:#7b1fa2;padding:1px 5px;border-radius:3px;white-space:nowrap;">∑ numeric</span>`
            : `<span style="font-size:10px;background:#f5f5f5;color:#666;padding:1px 5px;border-radius:3px;white-space:nowrap;"># string</span>`;
        const safeName = name.replace(/"/g, '&quot;');
        html += `
            <label class="tm-param-row" data-name="${safeName.toLowerCase()}"
                   style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-bottom:1px solid #f0f0f0;cursor:pointer;">
                <input type="checkbox" class="tm-cb" value="${safeName}" data-numeric="${info.isNumeric}">
                <span style="flex:1;font-size:12px;">${name} <span style="color:#aaa;font-size:11px;">(${info.count})</span></span>
                ${badge}
            </label>`;
    }

    html += `</div>
        <button onclick="treemapBuild()"
            style="width:100%;padding:9px;background:#7b1fa2;color:white;border:none;border-radius:4px;
                   cursor:pointer;font-size:14px;font-weight:bold;">
            📊 Build Treemap
        </button>`;

    document.getElementById('treemapBody').innerHTML = html;
    document.getElementById('treemapBackBtn').style.display = 'none';
}

function treemapFilterParams(query) {
    const q = (query || '').toLowerCase();
    document.querySelectorAll('.tm-param-row').forEach(row => {
        row.style.display = row.dataset.name.includes(q) ? '' : 'none';
    });
}

function treemapSelAll(on) {
    document.querySelectorAll('.tm-cb:not([style*="display: none"])').forEach(cb => cb.checked = on);
}

function treemapBuild() {
    const cbs = [...document.querySelectorAll('.tm-cb:checked')];
    if (!cbs.length) { alert('Select at least one parameter.'); return; }

    _tmParams = new Map(cbs.map(cb => [cb.value, cb.dataset.numeric === 'true']));

    // Build leaf map for bidirectional viewer↔treemap sync
    _tmLeafMap.clear();
    for (const el of _tmData) {
        for (const [pName] of _tmParams) {
            const prop = el.properties.find(p => (p.displayName || p.attributeName) === pName);
            const raw  = prop ? prop.displayValue : null;
            const val  = (raw === null || raw === undefined || raw === '') ? '(empty)' : String(raw).trim();
            const key  = `${pName}::${val}`;
            if (!_tmLeafMap.has(key)) _tmLeafMap.set(key, []);
            _tmLeafMap.get(key).push({ dbId: el.dbId, model: el.model });
        }
    }

    _tmZoomStack = [];
    const root = _buildHierarchy(_tmData, _tmParams);
    _tmZoomStack.push(root);

    // Swap body to treemap view
    document.getElementById('treemapBody').innerHTML = `
        <div id="tmBreadcrumb" style="font-size:12px;color:#666;padding:2px 0 6px;min-height:26px;line-height:24px;"></div>
        <div id="tmSvgContainer"></div>`;
    document.getElementById('treemapBackBtn').style.display = '';

    _drawTreemap(root);
}

// ─── Hierarchy builder ────────────────────────────────────────────────────────

function _buildHierarchy(data, params) {
    // Two-pass: group → convert
    const tree = {}; // modelName → category → paramName → value → {count, sum}

    for (const el of data) {
        const { modelName: m, category: c } = el;
        if (!tree[m])    tree[m]    = {};
        if (!tree[m][c]) tree[m][c] = {};

        for (const [pName, isNum] of params) {
            const prop = el.properties.find(
                p => (p.displayName || p.attributeName) === pName
            );
            const raw  = prop ? prop.displayValue : null;
            const key  = (raw === null || raw === undefined || raw === '')
                ? '(empty)' : String(raw).trim();
            const num  = (isNum && raw !== null && raw !== '' && !isNaN(+raw))
                ? Math.abs(+raw) : 0;

            if (!tree[m][c][pName]) tree[m][c][pName] = { isNum, vals: {} };
            const v = (tree[m][c][pName].vals[key] = tree[m][c][pName].vals[key] || { count: 0, sum: 0 });
            v.count++; v.sum += num;
        }
    }

    // Convert to D3-compatible tree
    const root = { name: 'All Models', children: [] };

    for (const [m, cats] of Object.entries(tree)) {
        const fn = { name: m, children: [] };
        for (const [c, ps] of Object.entries(cats)) {
            const cn = { name: c, children: [] };
            for (const [p, pd] of Object.entries(ps)) {
                const pn = { name: p, isNum: pd.isNum, children: [] };
                for (const [val, st] of Object.entries(pd.vals)) {
                    // Size: sum for numeric (fallback to count if all-zero), count for strings
                    const sz = pd.isNum ? (st.sum > 0 ? st.sum : st.count) : st.count;
                    pn.children.push({ name: val, value: sz, count: st.count, isLeaf: true });
                }
                pn.children.sort((a, b) => b.value - a.value);
                if (pn.children.length) cn.children.push(pn);
            }
            if (cn.children.length) fn.children.push(cn);
        }
        if (fn.children.length) root.children.push(fn);
    }

    return root;
}

// ─── Treemap renderer ─────────────────────────────────────────────────────────

const _TM_PALETTE = d3.schemeTableau10;

function _drawTreemap(nodeData) {
    const body    = document.getElementById('treemapBody');
    const svgCont = document.getElementById('tmSvgContainer');
    if (!svgCont || !body) return;

    // Available size
    const svgW = Math.max(200, body.clientWidth  - 4);
    const svgH = Math.max(150, body.clientHeight - 36); // subtract breadcrumb row

    // Update breadcrumb
    const bc = document.getElementById('tmBreadcrumb');
    if (bc) {
        bc.innerHTML = _tmZoomStack
            .map((nd, i) => `<a href="#" onclick="treemapZoomTo(${i});return false;"
                style="color:#7b1fa2;text-decoration:none;">${nd.name}</a>`)
            .join(' <span style="color:#ccc;margin:0 2px;">›</span> ');
    }

    // Build D3 hierarchy from raw data node
    const hier = d3.hierarchy(nodeData)
        .sum(d => d.value || 0)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([svgW, svgH])
        .paddingTop(d => d.depth === 0 ? 0 : 18)
        .paddingInner(2)
        .paddingRight(1).paddingBottom(1).paddingLeft(1)
        .round(true)
      (hier);

    // Color — index of depth-1 ancestor
    const depth1 = hier.children || [];
    const anc1   = d => { let n = d; while (n.depth > 1) n = n.parent; return n; };
    const tileColor = d => {
        const idx  = depth1.indexOf(anc1(d));
        const base = d3.color(_TM_PALETTE[idx % _TM_PALETTE.length]);
        base.opacity = d.children ? Math.max(0.18, 0.55 - d.depth * 0.12) : 0.8;
        return base.toString();
    };

    // Draw
    svgCont.innerHTML = '';
    const svg = d3.select(svgCont).append('svg')
        .attr('width', svgW).attr('height', svgH)
        .style('font-family', 'sans-serif').style('display', 'block');

    const nodes = hier.descendants().filter(d => d.depth > 0);
    const cell  = svg.selectAll('g').data(nodes).join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Background rect — data-tmkey on leaf rects for bidirectional sync
    const rect = cell.append('rect')
        .attr('width',  d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill',   tileColor)
        .attr('stroke', '#fff').attr('stroke-width', 0.5)
        .style('cursor', d => d.children ? 'zoom-in' : 'pointer');

    rect.filter(d => d.data.isLeaf)
        .attr('data-tmkey', d => `${d.parent.data.name}::${d.data.name}`);

    // Primary label (name + count)
    cell.filter(d => (d.x1 - d.x0) > 28 && (d.y1 - d.y0) > 14)
        .append('text')
        .attr('x', 4).attr('y', 13)
        .attr('fill', '#111')
        .style('font-size',   d => d.depth <= 1 ? '11px' : '10px')
        .style('font-weight', d => d.depth <= 1 ? '600'  : 'normal')
        .style('pointer-events', 'none')
        .text(d => {
            const w     = d.x1 - d.x0;
            const label = d.data.isLeaf
                ? `${d.data.name}  (${d.data.count})`
                : d.data.name;
            const max = Math.floor(w / 6.5);
            return label.length > max ? label.slice(0, max - 1) + '…' : label;
        });

    // Secondary label: sum for numeric leaf tiles
    cell.filter(d => d.data.isLeaf && (d.x1 - d.x0) > 55 && (d.y1 - d.y0) > 28)
        .append('text')
        .attr('x', 4).attr('y', 25)
        .attr('fill', '#333')
        .style('font-size', '9px').style('pointer-events', 'none')
        .text(d => {
            const isNum = _tmParams && _tmParams.get(d.parent && d.parent.data.name);
            if (!isNum) return '';
            const v = d.data.value;
            return `Σ ${v % 1 === 0 ? v : v.toFixed(2)}`;
        });

    // Native SVG tooltip
    cell.append('title').text(d => {
        if (d.data.isLeaf) {
            const isNum = _tmParams && _tmParams.get(d.parent && d.parent.data.name);
            return `${d.data.name}\nCount: ${d.data.count}` +
                   (isNum ? `\nSum: ${d.data.value.toFixed(2)}` : '');
        }
        return `${d.data.name}\nTotal: ${d.value}`;
    });

    // Click: zoom into internal nodes; highlight viewer from leaf clicks
    cell.filter(d => !!d.children).on('click', (event, d) => {
        event.stopPropagation();
        _tmZoomStack.push(d.data);
        _drawTreemap(d.data);
    });

    cell.filter(d => d.data.isLeaf).on('click', (event, d) => {
        event.stopPropagation();
        _highlightLeafInViewer(d.parent.data.name, d.data.name);
    });
}

function treemapZoomTo(idx) {
    _tmZoomStack = _tmZoomStack.slice(0, idx + 1);
    _drawTreemap(_tmZoomStack[_tmZoomStack.length - 1]);
}

// ─── Treemap → Viewer ─────────────────────────────────────────────────────────

function _highlightLeafInViewer(paramName, valueName) {
    if (!viewer) return;
    const key     = `${paramName}::${valueName}`;
    const entries = _tmLeafMap.get(key) || [];
    viewer.clearThemingColors();
    const ORANGE = new THREE.Vector4(1, 0.55, 0, 1);
    for (const { dbId, model } of entries) {
        viewer.setThemingColor(dbId, ORANGE, model);
    }
    console.log(`🌳 Treemap→Viewer: ${entries.length} elements highlighted for "${paramName}" = "${valueName}"`);
}

// ─── Viewer → Treemap ─────────────────────────────────────────────────────────

function _highlightInTreemap(dbId) {
    const el = _tmData && _tmData.find(e => e.dbId === dbId);
    // Reset all borders
    d3.select('#tmSvgContainer').selectAll('rect[data-tmkey]')
        .attr('stroke', '#fff').attr('stroke-width', 0.5);

    if (!el || !_tmParams) return;

    for (const [pName] of _tmParams) {
        const prop = el.properties.find(p => (p.displayName || p.attributeName) === pName);
        const raw  = prop ? prop.displayValue : null;
        const val  = (raw === null || raw === undefined || raw === '') ? '(empty)' : String(raw).trim();
        const key  = `${pName}::${val}`;
        d3.select('#tmSvgContainer').selectAll('rect[data-tmkey]')
            .filter(function() { return this.getAttribute('data-tmkey') === key; })
            .attr('stroke', '#ff6f00').attr('stroke-width', 3)
            .each(function() { d3.select(this.parentNode).raise(); });
    }
}

function _registerViewerListener() {
    if (!viewer) return;
    _unregisterViewerListener();
    _tmSelListener = (event) => {
        const modal = document.getElementById('treemapModal');
        if (!modal || modal.style.display === 'none') return;
        if (!document.getElementById('tmSvgContainer')) return; // picker open

        // Reset borders first
        d3.select('#tmSvgContainer').selectAll('rect[data-tmkey]')
            .attr('stroke', '#fff').attr('stroke-width', 0.5);

        const dbIds = event.dbIdArray;
        if (dbIds && dbIds.length > 0) {
            _highlightInTreemap(dbIds[0]);
        }
    };
    viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, _tmSelListener);
}

function _unregisterViewerListener() {
    if (_tmSelListener && viewer) {
        try { viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, _tmSelListener); }
        catch (e) {}
        _tmSelListener = null;
    }
}
