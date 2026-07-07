// ExploreParameters.js – Phase 2: zoom into Revit file, Parameter Explorer modal

// â”€â”€ Parameter Explorer shared state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let paramExplorerTooltip = null;
let paramExplorerZoomState = null;   // null = overview  |  string = zoomed paramName
let _peRafId = null;   // cancellable rAF handle for progressive render

const _PE_PALETTE = [
    '#aed6f1','#a9dfbf','#f9e79f','#f5cba7','#d2b4de',
    '#a3d8d8','#f1948a','#abebc6','#fad7a0','#c9cfe8',
    '#d7dbdd','#f7dc6f','#82e0aa','#85c1e9','#c39bd3',
    '#f0b27a','#76d7c4','#ec7063','#d4e6f1','#d5f5e3'
];

// Schedule a treemap re-render (debounced via rAF, cancellable)
function _peScheduleRender() {
    if (_peRafId) return;   // already queued
    _peRafId = requestAnimationFrame(() => {
        _peRafId = null;
        const agg = window._paramExplorerAgg;
        const modal = document.getElementById('paramExplorerModal');
        if (!agg || !modal || modal.style.display === 'none') return;
        const treemapDiv = document.getElementById('paramExplorerTreemap');
        if (paramExplorerZoomState) {
            const byValue = (_peFilteredAgg() || agg).get(paramExplorerZoomState);
            if (!byValue) {
                // Scan still running -- update the inline progress text
                const totalToScan = Object.keys(window._peElementScanCache || {}).length;
                const doneSoFar   = window._peScanCompleted?.size ?? 0;
                const txt = document.getElementById('peScanProgressText');
                if (txt) txt.textContent =
                    `${doneSoFar} / ${totalToScan || '?'} file${totalToScan !== 1 ? 's' : ''} scanned \u2014 please wait\u2026`;
                return;
            }
            // Data ready \u2013 render the name-based zoom view
            if (treemapDiv) _peRenderZoom(byValue, paramExplorerZoomState, treemapDiv);
            return;
        }
        if (treemapDiv) _peRenderOverview(_peFilteredAgg() || agg, treemapDiv, /*loading=*/true);
    });
}

async function zoomIntoFile(egId, egName, projectName) {
    document.getElementById('example1Loading').style.display = 'flex';

    const isV1 = example1State.version === 'v1';
    const filter = { query: `property.name.category=='${example1State.category}'` };

    if (!isV1) {
        // â”€â”€ FAST PATH (latest) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        // Fire parallel distinctPropertyValues queries for all preferred props.
        document.getElementById('example1Loading').lastElementChild.textContent = 'Loading overview\u2026';

        const distinctQuery = `
            query GetDistinct($elementGroupId: ID!, $name: String!, $filter: ElementFilterInput) {
                distinctPropertyValuesInElementGroupByName(elementGroupId: $elementGroupId, name: $name, filter: $filter) {
                    results {
                        values(limit: 500) { value count }
                    }
                }
            }`;

        const settled = await Promise.allSettled(
            PREFERRED_PROPS.map(propName =>
                executeGraphQLQuery(distinctQuery, { elementGroupId: egId, name: propName, filter }, example1State.region)
                    .then(r => ({ propName, values: r.data?.distinctPropertyValuesInElementGroupByName?.results?.[0]?.values || [] }))
            )
        );

        const distinctValues = new Map();
        let totalCount = 0;
        for (const r of settled) {
            if (r.status === 'fulfilled' && r.value.values.length > 0) {
                distinctValues.set(r.value.propName, r.value.values);
                if (totalCount === 0) {
                    totalCount = r.value.values.reduce((s, v) => s + (v.count || 0), 0);
                }
            }
        }

        if (distinctValues.size > 0) {
            const fastProps = PREFERRED_PROPS.filter(p => distinctValues.has(p));
            zoomState = { active: true, elements: [], egId, egName, projectName, props: fastProps, distinctValues, totalCount, allLoaded: false };
            document.getElementById('example1Loading').style.display = 'none';
            renderZoomView(fastProps[0]);
            // Background: fetch full element list for individual tiles + viewer selection
            loadZoomElementsInBackground(egId, filter);
            return;
        }
        // If all distinct queries failed/returned empty, fall through to slow path
    }

    // â”€â”€ SLOW PATH (V1 or fallback) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Serial cursor pagination, limit:100 per page.
    const queryWithProps = isV1
        ? `query GetElsWithProps($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results {
                    id
                    name
                    properties(pagination: { limit: 200 }) {
                        results { name value }
                    }
                }
            }
        }`
        : `query GetElsWithProps($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results {
                    id
                    name
                    properties(pagination: { limit: 200 }) {
                        results { name value }
                    }
                }
            }
        }`;
    const zoomDataKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';

    const elementsWithProps = [];
    let cursor = null;
    let page = 0;

    do {
        page++;
        document.getElementById('example1Loading').lastElementChild.textContent =
            `Loading elements\u2026 page ${page}`;
        try {
            const result = await executeGraphQLQuery(queryWithProps, {
                elementGroupId: egId, filter,
                pagination: cursor ? { cursor, limit: 100 } : { limit: 100 }
            }, example1State.region);
            const data = result.data?.[zoomDataKey];
            elementsWithProps.push(...(data?.results || []));
            cursor = data?.pagination?.cursor || null;
        } catch (err) {
            logDebug('Zoom fetch error: ' + err.message);
            cursor = null;
        }
    } while (cursor);

    if (elementsWithProps.length === 0) {
        document.getElementById('example1Loading').style.display = 'none';
        alert('No elements found for this file.');
        return;
    }

    const propSet = new Set();
    elementsWithProps.forEach(el => {
        (el.properties?.results || []).forEach(p => {
            if (p.value !== null && p.value !== undefined && p.value !== '') propSet.add(p.name);
        });
    });

    const sortedProps = [
        ...PREFERRED_PROPS.filter(p => propSet.has(p)),
        ...[...propSet].filter(p => !PREFERRED_PROPS.includes(p)).sort()
    ];

    zoomState = { active: true, elements: elementsWithProps, egId, egName, projectName, props: sortedProps, distinctValues: new Map(), totalCount: elementsWithProps.length, allLoaded: true };
    document.getElementById('example1Loading').style.display = 'none';
    renderZoomView(sortedProps[0] || '');
}

// Fetch all elements+properties in the background after initial fast render.
// Updates zoomState when done and re-renders with individual element tiles.
async function loadZoomElementsInBackground(egId, filter) {
    const bgQuery = `
        query GetElsWithProps($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results {
                    id
                    name
                    properties(pagination: { limit: 200 }) {
                        results { name value }
                    }
                }
            }
        }`;

    const elementsWithProps = [];
    let cursor = null;
    let page = 0;

    do {
        page++;
        const badge = document.getElementById('zoomLoadingBadge');
        if (badge) badge.textContent = `Loading details\u2026 ${elementsWithProps.length}${zoomState.totalCount ? ' / ' + zoomState.totalCount : ''}`;

        try {
            const result = await executeGraphQLQuery(bgQuery, {
                elementGroupId: egId, filter,
                pagination: cursor ? { cursor, limit: 100 } : { limit: 100 }
            }, example1State.region);
            const data = result.data?.elementsByElementGroup;
            elementsWithProps.push(...(data?.results || []));
            cursor = data?.pagination?.cursor || null;
        } catch (err) {
            logDebug('Background zoom fetch error: ' + err.message);
            cursor = null;
        }

        // Abort if the user navigated away from this file
        if (!zoomState.active || zoomState.egId !== egId) return;
    } while (cursor);

    if (!zoomState.active || zoomState.egId !== egId) return;

    // Build full prop list from all elements
    const propSet = new Set();
    elementsWithProps.forEach(el => {
        (el.properties?.results || []).forEach(p => {
            if (p.value !== null && p.value !== undefined && p.value !== '') propSet.add(p.name);
        });
    });
    const sortedProps = [
        ...PREFERRED_PROPS.filter(p => propSet.has(p)),
        ...[...propSet].filter(p => !PREFERRED_PROPS.includes(p)).sort()
    ];

    // Preserve the currently selected param if still valid
    const currentParam = document.querySelector('.zoom-param-select')?.value || '';

    zoomState.elements = elementsWithProps;
    zoomState.props = sortedProps;
    zoomState.totalCount = elementsWithProps.length;
    zoomState.allLoaded = true;

    renderZoomView(sortedProps.includes(currentParam) ? currentParam : (sortedProps[0] || ''));
}

function renderZoomView(selectedParam) {
    const container = document.getElementById('example1Treemap');
    container.innerHTML = '';

    const displayCount = zoomState.allLoaded ? zoomState.elements.length : zoomState.totalCount;
    const loadingBadge = !zoomState.allLoaded
        ? `<span id="zoomLoadingBadge" class="zoom-loading-badge">Loading details\u2026</span>`
        : '';

    // â”€â”€ Top bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const bar = document.createElement('div');
    bar.className = 'zoom-bar';
    bar.innerHTML = `
        <button class="btn-zoom-back" onclick="exitZoom()">â† Overview</button>
        <span class="zoom-breadcrumb">${zoomState.projectName} &rsaquo; <strong>${(zoomState.egName || '(unnamed)').replace(/\.rvt$/i, '')}</strong></span>
        <label class="zoom-label">Group by parameter:</label>
        <select class="zoom-param-select" onchange="renderZoomView(this.value)">
            ${zoomState.props.map(p =>
                `<option value="${p}"${p === selectedParam ? ' selected' : ''}>${p}</option>`
            ).join('')}
        </select>
        <span class="zoom-count">${displayCount} elements</span>
        ${loadingBadge}
    `;
    container.appendChild(bar);

    // â”€â”€ Search bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const zoomSearchBar = document.createElement('div');
    zoomSearchBar.style.cssText = 'margin-bottom:8px;';
    zoomSearchBar.innerHTML = `<input id="zoomSearchInput" type="text" placeholder="ðŸ” Filter by value\u2026"
        oninput="filterZoomTreemap(this.value)"
        style="width:100%;box-sizing:border-box;padding:7px 12px;border:1px solid #d0d0d0;border-radius:6px;font-size:13px;outline:none;" />`;
    container.appendChild(zoomSearchBar);

    // â”€â”€ Treemap + legend side by side â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;gap:12px;align-items:flex-start;';
    const area = document.createElement('div');
    area.className = 'zoom-treemap-area';
    area.style.cssText = 'flex:1;min-width:0;';
    const legendPanel = document.createElement('div');
    legendPanel.id = 'zoomLegendPanel';
    legendPanel.style.cssText = 'width:190px;flex-shrink:0;max-height:600px;overflow-y:auto;background:#f8f9fa;border-radius:6px;padding:8px 10px;';
    wrapper.appendChild(area);
    wrapper.appendChild(legendPanel);
    container.appendChild(wrapper);

    renderZoomTreemap(area, selectedParam);
}

// Fast treemap: renders group tiles from distinctValues (no individual element sub-tiles).
// Used while the background element fetch is still in progress.
function renderFastZoomTreemap(container, paramName) {
    const values = (zoomState.distinctValues.get(paramName) || [])
        .filter(v => v.count > 0)
        .sort((a, b) => b.count - a.count);

    const groupNames = values.map(v => String(v.value ?? '(not set)'));
    const ZOOM_PALETTE = ['#aed6f1','#a9dfbf','#f9e79f','#f5cba7','#d2b4de','#a3d8d8','#f1948a','#abebc6','#fad7a0','#c9cfe8'];
    const color = d3.scaleOrdinal().domain(groupNames).range(ZOOM_PALETTE);

    const data = {
        name: 'root',
        children: values.map(v => ({
            name: String(v.value ?? '(not set)'),
            value: v.count,
            groupVal: String(v.value ?? '(not set)')
        }))
    };

    const style = window.getComputedStyle(container);
    const hPad = parseFloat(style.paddingLeft || 0) + parseFloat(style.paddingRight || 0);
    const width = Math.max(200, (container.clientWidth || 900) - hPad);
    const total = values.reduce((s, v) => s + v.count, 0);
    const height = Math.max(400, Math.min(900, total * 8));

    const treemap = d3.treemap()
        .size([width, height])
        .paddingInner(3)
        .paddingOuter(4)
        .round(true);

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    treemap(root);

    const svg = d3.create('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', '100%')
        .attr('height', height)
        .style('display', 'block')
        .style('font-family', 'Segoe UI, sans-serif');

    const node = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.append('rect')
        .attr('width', d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill', d => color(d.data.groupVal))
        .attr('stroke', 'rgba(255,255,255,0.5)')
        .attr('stroke-width', 1)
        .attr('rx', 3)
        .attr('opacity', 0.85);

    node.each(function(d) {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 20 || h < 14) return;
        const label = `${d.data.name}  (${d.data.value})`;
        const maxChars = Math.max(4, Math.floor(w / 7));
        d3.select(this).append('text')
            .attr('x', 6).attr('y', Math.min(18, h - 4))
            .text(label.length > maxChars ? label.slice(0, maxChars - 1) + '\u2026' : label)
            .attr('font-size', '12px')
            .attr('font-weight', '600')
            .attr('fill', '#111')
            .style('pointer-events', 'none');
    });

    // Stamp data-groupval for cross-highlight with legend
    node.attr('data-groupval', d => d.data.groupVal);

    // Tooltip + cross-highlight on hover
    node.on('mousemove', (event, d) => {
        showZoomTooltip(event,
            `<strong style="font-size:14px">${formatLegendVal(d.data.name)}</strong>` +
            `<br><span style="opacity:0.8">${d.data.value} element${d.data.value !== 1 ? 's' : ''}</span>`
        );
        applyZoomGroupHighlight(container, d.data.groupVal);
    }).on('mouseout', () => {
        hideTooltip();
        clearZoomGroupHighlight(container);
    });

    container.appendChild(svg.node());

    // Legend \u2013 sorted by count desc, placed in the right panel
    const fastLegendPanel = document.getElementById('zoomLegendPanel');
    if (fastLegendPanel) {
        fastLegendPanel.innerHTML = '<div style="font-weight:700;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #e0e0e0;">Values</div>';
        [...values].sort((a, b) => b.count - a.count).forEach(v => {
            const val = String(v.value ?? '(not set)');
            const chip = document.createElement('div');
            chip.style.cssText = 'display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:5px;margin-bottom:3px;font-size:12px;cursor:default;transition:opacity 0.15s,box-shadow 0.15s;';
            chip.setAttribute('data-legend-groupval', val);
            chip.innerHTML = `<span style="width:10px;height:10px;flex-shrink:0;background:${color(val)};border-radius:3px;display:inline-block;"></span>`
                + `<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${val}">${formatLegendVal(val)}</span>`
                + `<strong style="flex-shrink:0;color:#555;">${v.count}</strong>`;
            chip.addEventListener('mouseover', () => applyZoomGroupHighlight(container, val));
            chip.addEventListener('mouseout',  () => clearZoomGroupHighlight(container));
            fastLegendPanel.appendChild(chip);
        });
    }
}

function renderZoomTreemap(container, paramName) {
    // While background fetch is in progress, use fast (distinct-values) rendering
    if (!zoomState.allLoaded && zoomState.distinctValues?.has(paramName)) {
        renderFastZoomTreemap(container, paramName);
        return;
    }

    // â”€â”€ Full mode: individual element tiles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Group elements by selected property value
    const groups = {};
    zoomState.elements.forEach(el => {
        const prop = (el.properties?.results || []).find(p => p.name === paramName);
        const val = (prop?.value !== null && prop?.value !== undefined && prop?.value !== '')
            ? String(prop.value)
            : '(not set)';
        if (!groups[val]) groups[val] = [];
        groups[val].push(el);
    });

    const groupNames = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);

    const data = {
        name: 'root',
        children: groupNames.map(val => ({
            name: val,
            groupVal: val,
            children: groups[val].map(el => ({
                name: el.name || el.id,
                value: 1,
                elementId: el.id,
                groupVal: val
            }))
        }))
    };

    const style = window.getComputedStyle(container);
    const hPad = parseFloat(style.paddingLeft || 0) + parseFloat(style.paddingRight || 0);
    const width = Math.max(200, (container.clientWidth || 900) - hPad);
    const totalElements = zoomState.elements.length;
    const height = Math.max(400, Math.min(900, totalElements * 12));

    const ZOOM_PALETTE = ['#aed6f1','#a9dfbf','#f9e79f','#f5cba7','#d2b4de','#a3d8d8','#f1948a','#abebc6','#fad7a0','#c9cfe8'];
    const color = d3.scaleOrdinal().domain(groupNames).range(ZOOM_PALETTE);

    const treemap = d3.treemap()
        .size([width, height])
        .paddingTop(d => d.depth === 1 ? 22 : 0)
        .paddingInner(2)
        .paddingOuter(3)
        .round(true);

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    treemap(root);

    const svg = d3.create('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', '100%')
        .attr('height', height)
        .style('display', 'block')
        .style('font-family', 'Segoe UI, sans-serif');

    const node = svg.selectAll('g')
        .data(root.descendants().filter(d => d.depth > 0))
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.append('rect')
        .attr('width', d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill', d => d.depth === 1
            ? color(d.data.groupVal) + '44'
            : color(d.data.groupVal))
        .attr('stroke', d => d.depth === 1 ? color(d.data.groupVal) : 'rgba(255,255,255,0.5)')
        .attr('stroke-width', d => d.depth === 1 ? 2 : 1)
        .attr('rx', 2)
        .attr('opacity', d => d.depth === 2 ? 0.95 : 1);

    // Group label (depth 1)
    node.filter(d => d.depth === 1)
        .append('text')
        .attr('x', 5).attr('y', 15)
        .text(d => {
            const w = d.x1 - d.x0;
            const label = `${d.data.name}  (${groups[d.data.name]?.length})`;
            const maxChars = Math.max(4, Math.floor(w / 7));
            return label.length > maxChars ? label.slice(0, maxChars - 1) + '\u2026' : label;
        })
        .attr('font-size', '11px')
        .attr('font-weight', '700')
        .attr('fill', '#1a1a1a')
        .style('pointer-events', 'none');

    // Element leaf label (depth 2)
    node.filter(d => d.depth === 2)
        .each(function(d) {
            const w = d.x1 - d.x0;
            const h = d.y1 - d.y0;
            if (w < 14 || h < 10) return;
            const maxChars = Math.max(2, Math.floor(w / 6));
            const label = (d.data.name || '').length > maxChars ? d.data.name.slice(0, maxChars - 1) + '\u2026' : (d.data.name || '');
            d3.select(this).append('text')
                .attr('x', 3).attr('y', Math.min(12, h - 2))
                .text(label)
                .attr('font-size', '9px')
                .attr('fill', '#111')
                .style('pointer-events', 'none');
        });

    // Stamp data-elementid on leaf g nodes for event delegation
    node.filter(d => d.depth === 2 && d.data.elementId)
        .attr('data-elementid', d => d.data.elementId)
        .attr('data-elementname', d => d.data.name || '')
        .style('cursor', 'pointer');

    // Stamp data-groupval on all nodes for cross-highlight with legend
    node.attr('data-groupval', d => d.data.groupVal);

    // Tooltip + cross-highlight on hover
    node.on('mousemove', (event, d) => {
        const html = d.depth === 1
            ? `<strong style="font-size:14px">${formatLegendVal(d.data.name)}</strong>` +
              `<br><span style="opacity:0.8">${groups[d.data.name]?.length ?? 0} element${(groups[d.data.name]?.length ?? 0) !== 1 ? 's' : ''}</span>`
            : `<strong style="font-size:14px">${d.data.name || ''}</strong>` +
              `<br><span style="opacity:0.8;font-size:12px">Group: ${formatLegendVal(d.data.groupVal)}</span>`;
        showZoomTooltip(event, html);
        applyZoomGroupHighlight(container, d.data.groupVal);
    }).on('mouseout', () => {
        hideTooltip();
        clearZoomGroupHighlight(container);
    });

    container.appendChild(svg.node());

    // Restore selection state visually (when re-rendering on param change)
    if (selectedZoomElementIds.size > 0) {
        svg.node().querySelectorAll('g[data-elementid]').forEach(g => {
            const id = g.getAttribute('data-elementid');
            if (selectedZoomElementIds.has(id)) {
                const rect = g.querySelector('rect');
                if (rect) { rect.setAttribute('stroke', '#FFD600'); rect.setAttribute('stroke-width', '3'); rect.style.filter = 'drop-shadow(0 0 5px rgba(255,214,0,0.9))'; }
            }
        });
    }

    // Native event delegation for element tile selection
    svg.node().addEventListener('click', function(e) {
        let el = e.target;
        while (el && el !== this) {
            const elemId = el.getAttribute && el.getAttribute('data-elementid');
            if (elemId) {
                const rect = el.querySelector('rect');
                if (selectedZoomElementIds.has(elemId)) {
                    selectedZoomElementIds.delete(elemId);
                    if (rect) { rect.setAttribute('stroke', 'rgba(255,255,255,0.4)'); rect.setAttribute('stroke-width', '1'); rect.style.filter = ''; }
                } else {
                    selectedZoomElementIds.add(elemId);
                    if (rect) { rect.setAttribute('stroke', '#FFD600'); rect.setAttribute('stroke-width', '3'); rect.style.filter = 'drop-shadow(0 0 5px rgba(255,214,0,0.9))'; }
                }
                updateZoomSelectionBar();
                return;
            }
            el = el.parentElement;
        }
    });

    // Legend \u2013 sorted by count desc, placed in the right panel
    const zoomLegendPanel = document.getElementById('zoomLegendPanel');
    if (zoomLegendPanel) {
        zoomLegendPanel.innerHTML = '<div style="font-weight:700;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #e0e0e0;">Values</div>';
        [...groupNames].sort((a, b) => (groups[b]?.length || 0) - (groups[a]?.length || 0)).forEach(val => {
            const chip = document.createElement('div');
            chip.style.cssText = 'display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:5px;margin-bottom:3px;font-size:12px;cursor:default;transition:opacity 0.15s,box-shadow 0.15s;';
            chip.setAttribute('data-legend-groupval', val);
            chip.innerHTML = `<span style="width:10px;height:10px;flex-shrink:0;background:${color(val)};border-radius:3px;display:inline-block;"></span>`
                + `<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${val}">${formatLegendVal(val)}</span>`
                + `<strong style="flex-shrink:0;color:#555;">${groups[val].length}</strong>`;
            chip.addEventListener('mouseover', () => applyZoomGroupHighlight(container, val));
            chip.addEventListener('mouseout',  () => clearZoomGroupHighlight(container));
            zoomLegendPanel.appendChild(chip);
        });
    }
}

function exitZoom() {
    zoomState = { active: false };
    selectedZoomElementIds.clear();
    updateZoomSelectionBar();
    createTreemapVisualization(example1State.fileSummary || [], example1State.category);
}

// â”€â”€â”€ Zoom-view element selection → Viewer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function updateZoomSelectionBar() {
    const bar = document.getElementById('zoomSelectionBar');
    const countEl = document.getElementById('zoomSelectionCount');
    if (!bar) return;
    const n = selectedZoomElementIds.size;
    if (n === 0) {
        bar.style.display = 'none';
    } else {
        bar.style.display = 'flex';
        countEl.textContent = `${n} element${n !== 1 ? 's' : ''} selected`;
        bar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function clearZoomSelection() {
    selectedZoomElementIds.clear();
    updateZoomSelectionBar();
    // Re-render to restore normal tile colours
    const area = document.querySelector('.zoom-treemap-area');
    if (area) {
        area.querySelectorAll('g[data-elementid] rect').forEach(rect => {
            rect.setAttribute('stroke', 'rgba(255,255,255,0.4)');
            rect.setAttribute('stroke-width', '1');
            rect.style.filter = '';
        });
    }
}

function showZoomSelectionInViewer() {
    if (selectedZoomElementIds.size === 0) return;

    if (!zoomState.allLoaded) {
        alert('Element details are still loading. Please wait a moment and try again.');
        return;
    }

    // Find the fileVersionUrn for the currently zoomed file
    const fileEntry = (example1State.fileSummary || []).find(f => f.egId === zoomState.egId);
    if (!fileEntry?.fileVersionUrn) {
        alert('No viewable file version URN for this file. Try using the file browser instead.');
        return;
    }

    // Collect the "Revit Element ID" property value for each selected AEC DM element
    const revitIds = [];
    for (const aecId of selectedZoomElementIds) {
        const el = zoomState.elements.find(e => e.id === aecId);
        if (el) {
            const prop = (el.properties?.results || []).find(p => p.name === 'Revit Element ID');
            if (prop?.value != null && prop.value !== '') revitIds.push(String(prop.value));
        }
    }

    if (revitIds.length === 0) {
        alert('Selected elements have no "Revit Element ID" property \u2013 cannot map to viewer objects.');
        return;
    }

    pendingRevitElementIds = revitIds;
    pendingRevitCategory = example1State.category;
    pendingCategoryHighlight = null; // don't also isolate by category
    currentRegion = example1State.region; // ensure viewer knows the region
    openViewerModal([{ id: fileEntry.egId, name: fileEntry.egName, alternativeIdentifiers: { fileVersionUrn: fileEntry.fileVersionUrn } }]);
}

// â”€â”€â”€ Treemap multi-select → Viewer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€



async function openParameterExplorer() {
    if (selectedEgIds.size === 0) return;

    const modal      = document.getElementById('paramExplorerModal');
    const loading    = document.getElementById('paramExplorerLoading');
    const progress   = document.getElementById('paramExplorerProgress');
    const subtitle   = document.getElementById('paramExplorerSubtitle');
    const treemapDiv = document.getElementById('paramExplorerTreemap');
    const searchInput = document.getElementById('paramExplorerSearch');
    const backBtn     = document.getElementById('paramExplorerBackBtn');

    modal.style.display = 'flex';
    loading.style.display = 'flex';
    treemapDiv.innerHTML  = '';
    paramExplorerZoomState = null;
    window._paramExplorerAgg = null;
    window._pePickerTypeGroups = null;
    window._pePickerSelected   = new Set();
    window._peHiddenFiles = new Set();
    window._peAllowedValues = [];
    window._peParamAllowedValues = {};
    if (searchInput) { searchInput.style.display = 'none'; searchInput.value = ''; }
    if (backBtn)     backBtn.style.display = 'none';
    const refreshBtn0 = document.getElementById('paramExplorerRefreshBtn');
    if (refreshBtn0)  refreshBtn0.style.display = 'none';

    // Cancel any in-progress extraction-status background fetch so it stops
    // competing with param-name API calls (avoids rate-limiting / 60s timeouts).
    window._extStatusGen = (window._extStatusGen || 0) + 1;

    const selectedFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId));
    const n = selectedFiles.length;
    console.log(`[PE-OPEN] selectedEgIds=[${[...selectedEgIds].map(id=>id.slice(-12)).join(',')}] → ${n} file(s): [${selectedFiles.map(f=>`${f.egName}=\u2026${f.egId.slice(-12)}`).join(', ')}]`);
    subtitle.textContent = `${n} file${n !== 1 ? 's' : ''} \u2013 collecting parameter names\u2026`;

    const region = example1State.region;

    // â”€â”€ Correct stale egIds before any Phase A/B queries â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // elementGroupExtractionStatusAtTip returns the ElementGroup that corresponds
    // to the LATEST (tip) file version.  This replaces any stale egId that the
    // dedup heuristic in executeLatestQuery/executeV1Query may have selected.
    // Runs in parallel for all selected files; failures are silently ignored so
    // the explorer still opens even if a file has no AEC DM extraction yet.
    await Promise.all(selectedFiles.map(async f => {
        if (!f.fileUrn || !f.projectId) { console.log(`[PE-TIP] ${f.egName}: SKIP \u2013 fileUrn=${f.fileUrn || 'null'} projectId=${f.projectId || 'null'}`); return; }
        console.log(`[PE-TIP] ${f.egName}: calling AtTip | fileUrn=\u2026${f.fileUrn.slice(-30)} | egId=\u2026${f.egId.slice(-12)}`);
        const gql = `query GetEGAtTip($fileUrn: ID!, $accProjectId: ID!) {
            elementGroupExtractionStatusAtTip(fileUrn: $fileUrn, accProjectId: $accProjectId) {
                elementGroup { id }
            }
        }`;
        try {
            const r = await executeGraphQLQuery(gql, { fileUrn: f.fileUrn, accProjectId: f.projectId }, region);
            const tipEgId = r.data?.elementGroupExtractionStatusAtTip?.elementGroup?.id;
            if (tipEgId && tipEgId !== f.egId) {
                console.log(`[PE tip-fix] ${f.egName}: replacing stale egId \u2026${f.egId.slice(-10)} → \u2026${tipEgId.slice(-10)}`);
                selectedEgIds.delete(f.egId);  // keep selectedEgIds in sync so _peLoadCheckedValues can still find this file
                f.egId = tipEgId;
                selectedEgIds.add(tipEgId);
            } else if (tipEgId) {
                console.log(`[PE tip-fix] ${f.egName}: egId confirmed correct (\u2026${tipEgId.slice(-10)}, ${f.fileVersionUrn || 'ver?'})`);
            } else {
                console.log(`[PE tip-fix] ${f.egName}: AtTip returned no elementGroup \u2013 keeping dedup egId`);
            }
        } catch (e) { console.warn(`[PE tip-fix] ${f.egName}: AtTip failed (${e.message}) \u2013 keeping dedup egId`); }
    }));

    // â”€â”€ Phase 1: collect param names (dynamic fillup) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Build a live paramFileMap from whatever is cached already, then fetch the
    // rest file-by-file, refreshing the picker treemap after each one completes.

    function _buildParamFileMap() {
        const map = new Map();
        for (const f of selectedFiles) {
            const names = window._paramNamesCache[f.egId] || new Set();
            for (const name of names) {
                if (!map.has(name)) map.set(name, new Set());
                map.get(name).add(f.egId);
            }
        }
        return map;
    }

    const notReady = selectedFiles.filter(f => !window._paramNamesCache[f.egId]);
    let doneCount = 0;

    // Version label: for single-file mode, show "v5 (AEC DM)" so stale data is immediately visible.
    const _verNum = u => { const m = (u||'').match(/\?version=(\d+)$/); return m ? +m[1] : null; };
    const _versionSuffix = () => {
        if (n !== 1) return '';
        const v = _verNum(selectedFiles[0].fileVersionUrn);
        return v ? ` \u00b7 v${v} (AEC DM index)` : '';
    };

    // Show picker immediately with whatever is already cached, then hide loading
    loading.style.display = 'none';
    if (searchInput) searchInput.style.display = '';
    const initialMap = _buildParamFileMap();
    const totalParams0 = initialMap.size;
    if (notReady.length > 0) {
        subtitle.textContent = `${n} file${n !== 1 ? 's' : ''}${_versionSuffix()} \u00b7 ${totalParams0} params (loading ${notReady.length} more\u2026)`;
    } else {
        subtitle.textContent = `${n} file${n !== 1 ? 's' : ''}${_versionSuffix()} \u00b7 ${totalParams0} parameters \u2013 select which to explore`;
    }
    _peRenderChecklist(initialMap, selectedFiles, treemapDiv);

    if (notReady.length > 0) {
        const CONCURRENCY = 8;
        for (let i = 0; i < notReady.length; i += CONCURRENCY) {
            if (modal.style.display === 'none') return;
            await Promise.all(notReady.slice(i, i + CONCURRENCY).map(async f => {
                await _prefetchParamNames(f.egId, region);
                doneCount++;
                if (modal.style.display === 'none') return;
                const map = _buildParamFileMap();
                const remaining = notReady.length - doneCount;
                subtitle.textContent = remaining > 0
                    ? `${n} file${n !== 1 ? 's' : ''}${_versionSuffix()} \u00b7 ${map.size} params (loading ${remaining} more\u2026)`
                    : `${n} file${n !== 1 ? 's' : ''}${_versionSuffix()} \u00b7 ${map.size} parameters \u2013 select which to explore`;
                _pePicker_RefreshData(map, selectedFiles);
            }));
        }
    }

    if (modal.style.display === 'none') return;
}

function _peRenderChecklist(paramFileMap, selectedFiles, container) {
    window._peLastChecklistState = { paramFileMap, selectedFiles };
    window._pePickerSelected = new Set();
    window._pePickerZoom     = null;
    window._pePickerNFiles   = selectedFiles.length;

    // Build type groups: typeName → [{name, fileCount}]
    const typeGroups = new Map();
    for (const [name, egIds] of paramFileMap.entries()) {
        const tl = _peParamTypeLabel(name) || 'Other';
        if (!typeGroups.has(tl)) typeGroups.set(tl, []);
        typeGroups.get(tl).push({ name, fileCount: egIds.size });
    }
    for (const [, params] of typeGroups) {
        params.sort((a, b) => b.fileCount - a.fileCount || a.name.localeCompare(b.name));
    }
    window._pePickerTypeGroups   = typeGroups;
    window._pePickerParamFileMap = paramFileMap;

    container.innerHTML = `
        <div id="pePickerWrap">
            <div id="pePickerLeft">
                <div id="pePickerBreadcrumb">
                    <span class="pe-crumb" onclick="_pePicker_BackToTypes()">All Types<span style="opacity:0.6;font-weight:400;margin-left:4px;">(${typeGroups.size})</span></span>
                    <span id="pePickerCrumbSep" style="display:none;color:#aaa;padding:0 6px;">â€º</span>
                    <span id="pePickerCrumbType" style="display:none;font-weight:700;color:#3c3c3c;"></span>
                    <span id="pePickerCrumbSelAll" style="display:none;margin-left:auto;font-size:11px;color:#0696d7;cursor:pointer;padding:2px 6px;border-radius:3px;background:#e8f4fc;" onclick="_pePicker_SelectAllInType()">Select all in type</span>
                </div>
                <div id="pePickerTreemapArea"></div>
            </div>
            <div id="pePickerRight">
                <div id="pePickerRightHeader">
                    <span id="pePickerSelCount" style="font-weight:600;color:#0696d7;">0 selected</span>
                    <button onclick="_pePicker_ClearAll()">âœ• Clear</button>
                </div>
                <div id="pePickerSelectedList">
                    <div id="pePickerEmptyHint">Click parameter tiles<br>to add them here</div>
                </div>
                <div id="pePickerRightFooter">
                    <button id="pePickerLoadBtn" class="btn btn-execute" disabled
                        onclick="_peLoadCheckedValues()">
                        Load Values &#8594;
                    </button>
                </div>
            </div>
        </div>`;

    _pePicker_DrawTypeOverview();

    // Resize observer \u2013 redraw SVG when container changes size
    const area = document.getElementById('pePickerTreemapArea');
    if (area) {
        if (area._ro) area._ro.disconnect();
        const ro = new ResizeObserver(() => {
            if (window._pePickerZoom) _pePicker_DrawTypeZoom(window._pePickerZoom);
            else _pePicker_DrawTypeOverview();
        });
        ro.observe(area);
        area._ro = ro;
    }
}

// â”€â”€ Type overview treemap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _pePicker_DrawTypeOverview() {
    window._pePickerZoom = null;
    const crumbSep  = document.getElementById('pePickerCrumbSep');
    const crumbType = document.getElementById('pePickerCrumbType');
    const crumbSelAll = document.getElementById('pePickerCrumbSelAll');
    if (crumbSep)    crumbSep.style.display    = 'none';
    if (crumbType)   crumbType.style.display   = 'none';
    if (crumbSelAll) crumbSelAll.style.display = 'none';

    const area = document.getElementById('pePickerTreemapArea');
    if (!area) return;
    const { width: W, height: H } = area.getBoundingClientRect();
    if (W < 10 || H < 10) return;

    const typeGroups = window._pePickerTypeGroups || new Map();
    const tgArr = Array.from(typeGroups.entries()).sort((a, b) => b[1].length - a[1].length);

    const hier = d3.hierarchy({ name: 'root', children: tgArr.map(([tn, ps]) => ({ name: tn, value: ps.length })) })
        .sum(d => d.value || 0);
    d3.treemap().size([W, H]).padding(4).round(true)(hier);

    area.innerHTML = '';
    const svg = d3.select(area).append('svg').attr('width', W).attr('height', H);
    const tw = d => d.x1 - d.x0;
    const th = d => d.y1 - d.y0;

    const cells = svg.selectAll('g')
        .data(hier.leaves()).join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .style('cursor', 'pointer')
        .on('click', (e, d) => _pePicker_ZoomToType(d.data.name));

    cells.append('rect')
        .attr('width', tw).attr('height', th)
        .attr('rx', 5).attr('ry', 5)
        .attr('fill', d => _peTypeBadgeColor(d.data.name))
        .attr('opacity', 0.88);

    cells.filter(d => tw(d) > 40 && th(d) > 24)
        .append('text').attr('x', 10).attr('y', 22)
        .attr('fill', 'white')
        .attr('font-size', d => Math.min(15, Math.max(9, tw(d) / 8)) + 'px')
        .attr('font-weight', '700')
        .attr('font-family', "'ArtifaktElement','Helvetica Neue',Arial,sans-serif")
        .style('pointer-events', 'none')
        .text(d => d.data.name);

    cells.filter(d => tw(d) > 40 && th(d) > 44)
        .append('text').attr('x', 10).attr('y', 38)
        .attr('fill', 'rgba(255,255,255,0.72)').attr('font-size', '11px')
        .attr('font-family', "'ArtifaktElement','Helvetica Neue',Arial,sans-serif")
        .style('pointer-events', 'none')
        .text(d => `${d.data.value} param${d.data.value !== 1 ? 's' : ''}`);

    cells.filter(d => tw(d) > 100 && th(d) > 60)
        .append('text').attr('x', 10).attr('y', d => th(d) - 10)
        .attr('fill', 'rgba(255,255,255,0.45)').attr('font-size', '9px')
        .attr('font-family', "'ArtifaktElement','Helvetica Neue',Arial,sans-serif")
        .style('pointer-events', 'none').text('click to explore →');

    cells
        .on('mouseenter', function() { d3.select(this).select('rect').attr('opacity', 1); })
        .on('mouseleave', function() { d3.select(this).select('rect').attr('opacity', 0.88); });
}

// â”€â”€ Zoom into one type (individual param tiles) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _pePicker_ZoomToType(typeName) {
    window._pePickerZoom = typeName;
    const crumbSep    = document.getElementById('pePickerCrumbSep');
    const crumbType   = document.getElementById('pePickerCrumbType');
    const crumbSelAll = document.getElementById('pePickerCrumbSelAll');
    if (crumbSep)    crumbSep.style.display    = '';
    if (crumbType)   { crumbType.style.display = ''; crumbType.textContent = typeName; }
    if (crumbSelAll) crumbSelAll.style.display = '';
    _pePicker_DrawTypeZoom(typeName);
}

function _pePicker_DrawTypeZoom(typeName) {
    const area = document.getElementById('pePickerTreemapArea');
    if (!area) return;

    const params    = (window._pePickerTypeGroups || new Map()).get(typeName) || [];
    const selected  = window._pePickerSelected || new Set();
    const n         = window._pePickerNFiles || 1;
    const typeColor = _peTypeBadgeColor(typeName);

    // Alphabetical order
    const sortedParams = [...params].sort((a, b) => a.name.localeCompare(b.name));

    area.innerHTML = '';
    const list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-direction:column;gap:1px;overflow-y:auto;height:100%;padding:2px 0;';

    sortedParams.forEach(p => {
        const isSel = selected.has(p.name);
        const row = document.createElement('div');
        row.setAttribute('data-pname', p.name);
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:4px;cursor:pointer;'
            + 'border-left:3px solid ' + (isSel ? typeColor : 'transparent') + ';'
            + 'background:' + (isSel ? '#dceefb' : 'transparent') + ';'
            + "font-size:13px;font-family:'ArtifaktElement','Helvetica Neue',Arial,sans-serif;";

        const label = document.createElement('span');
        label.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'
            + 'color:' + (isSel ? typeColor : '#3c3c3c') + ';'
            + 'font-weight:' + (isSel ? '700' : '400') + ';';
        label.textContent = p.name;
        label.title = p.name;
        row.appendChild(label);

        if (n > 1) {
            const fc = document.createElement('span');
            fc.style.cssText = 'flex-shrink:0;font-size:11px;color:#aaa;';
            fc.textContent = p.fileCount === n ? 'all' : p.fileCount + '/' + n;
            row.appendChild(fc);
        }

        const check = document.createElement('span');
        check.style.cssText = 'flex-shrink:0;width:16px;text-align:center;color:' + typeColor + ';font-weight:700;font-size:12px;';
        check.textContent = isSel ? '\u2713' : '';
        row.appendChild(check);

        row.addEventListener('click', () => _pePicker_ToggleParam(p.name));
        row.addEventListener('mouseenter', () => {
            if (!window._pePickerSelected.has(p.name)) row.style.background = '#f0f4f8';
        });
        row.addEventListener('mouseleave', () => {
            row.style.background = window._pePickerSelected.has(p.name) ? '#dceefb' : 'transparent';
        });

        list.appendChild(row);
    });

    area.appendChild(list);
}

// â”€â”€ Picker selection helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _pePicker_ToggleParam(paramName) {
    const sel = window._pePickerSelected || (window._pePickerSelected = new Set());
    if (sel.has(paramName)) sel.delete(paramName); else sel.add(paramName);
    if (window._pePickerZoom) _pePicker_DrawTypeZoom(window._pePickerZoom);
    _pePicker_UpdatePanel();
}

function _pePicker_SelectAllInType() {
    const typeName = window._pePickerZoom;
    if (!typeName) return;
    const params = (window._pePickerTypeGroups || new Map()).get(typeName) || [];
    const sel = window._pePickerSelected || (window._pePickerSelected = new Set());
    params.forEach(p => sel.add(p.name));
    _pePicker_DrawTypeZoom(typeName);
    _pePicker_UpdatePanel();
}

function _pePicker_UpdatePanel() {
    const sel = window._pePickerSelected || new Set();
    const n   = sel.size;
    const countEl = document.getElementById('pePickerSelCount');
    if (countEl) countEl.textContent = `${n} selected`;
    const loadBtn = document.getElementById('pePickerLoadBtn');
    if (loadBtn) loadBtn.disabled = (n === 0);
    const listEl = document.getElementById('pePickerSelectedList');
    if (!listEl) return;
    if (n === 0) {
        listEl.innerHTML = '<div id="pePickerEmptyHint">Click parameter tiles<br>to add them here</div>';
        return;
    }
    listEl.innerHTML = Array.from(sel).map(name =>
        `<div class="pe-picker-chip">
            <span title="${_peEsc(name)}">${_peEsc(name)}</span>
            <button onclick="_pePicker_RemoveParam(${JSON.stringify(name)})" title="Remove">âœ•</button>
        </div>`
    ).join('');
}

function _pePicker_RemoveParam(paramName) {
    (window._pePickerSelected || new Set()).delete(paramName);
    if (window._pePickerZoom) _pePicker_DrawTypeZoom(window._pePickerZoom);
    _pePicker_UpdatePanel();
}

function _pePicker_BackToTypes() { _pePicker_DrawTypeOverview(); }

function _pePicker_ClearAll() {
    window._pePickerSelected = new Set();
    if (window._pePickerZoom) _pePicker_DrawTypeZoom(window._pePickerZoom);
    _pePicker_UpdatePanel();
}

// Refresh type groups and redraw current view after a new file's data arrives.
// Preserves selection and zoom state.
function _pePicker_RefreshData(paramFileMap, selectedFiles) {
    // Rebuild type groups
    const typeGroups = new Map();
    for (const [name, egIds] of paramFileMap.entries()) {
        const tl = _peParamTypeLabel(name) || 'Other';
        if (!typeGroups.has(tl)) typeGroups.set(tl, []);
        typeGroups.get(tl).push({ name, fileCount: egIds.size });
    }
    for (const [, params] of typeGroups) {
        params.sort((a, b) => b.fileCount - a.fileCount || a.name.localeCompare(b.name));
    }
    window._pePickerTypeGroups   = typeGroups;
    window._pePickerParamFileMap = paramFileMap;
    window._peLastChecklistState = { paramFileMap, selectedFiles };
    window._pePickerNFiles       = selectedFiles.length;

    // Redraw whichever view is active
    if (window._pePickerZoom) {
        _pePicker_DrawTypeZoom(window._pePickerZoom);
    } else {
        _pePicker_DrawTypeOverview();
    }
    // Update breadcrumb "All Types" count
    const crumbEl = document.querySelector('#pePickerBreadcrumb .pe-crumb');
    if (crumbEl) crumbEl.innerHTML = `All Types<span style="opacity:0.6;font-weight:400;margin-left:4px;">(${typeGroups.size})</span>`;
}

function _peEsc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _peFormatValue(v) {
    // Display numbers rounded to 2 decimal places; leave non-numeric strings as-is
    const s = String(v);
    if (s.trim() === '' || s === 'Skipped, Data Too Large') return s;
    const n = Number(s.trim());
    if (!isNaN(n) && isFinite(n)) return String(+n.toFixed(2));
    return s;
}

function _peToggleAll(checked) {
    document.querySelectorAll('.pe-param-cb').forEach(cb => { cb.checked = checked; });
    _peCountSelected();
}

function _peCountSelected() {
    const checked = [...document.querySelectorAll('.pe-param-cb:checked')];
    const n = checked.length;
    const el = document.getElementById('peSelectedCount');
    if (el) el.textContent = `${n} selected`;
    const all = document.getElementById('peSelectAll');
    if (all) {
        const total = document.querySelectorAll('.pe-param-cb').length;
        all.indeterminate = n > 0 && n < total;
        all.checked = n === total;
    }
    // Auto-populate compliance input when exactly 1 checkbox is checked
    const compInput = document.getElementById('peCompAllowedInput');
    if (!compInput) {
        // checklist phase \u2013 no compliance bar yet, nothing to do
    }
}

// filter search on checklist / picker / treemap
function filterParamExplorerTreemap(query) {
    const term = query.trim().toLowerCase();

    // Picker mode (phase 1 \u2013 type-overview or type-zoom treemap)
    if (window._pePickerTypeGroups) {
        const area = document.getElementById('pePickerTreemapArea');
        if (area) {
            if (window._pePickerZoom) {
                // In type-zoom list: dim rows that don't match
                area.querySelectorAll('[data-pname]').forEach(row => {
                    const name = (row.getAttribute('data-pname') || '').toLowerCase();
                    row.style.opacity = (!term || name.includes(term)) ? '' : '0.15';
                });
            } else {
                // In type-overview: dim type tiles that don't match
                area.querySelectorAll('g').forEach(g => {
                    const textEl = g.querySelector('text');
                    if (!textEl) return;
                    const name = (textEl.textContent || '').toLowerCase();
                    g.style.opacity = (!term || name.includes(term)) ? '' : '0.1';
                });
            }
        }
        return;
    }

    // Treemap mode (phase 2 \u2013 after Load Values)
    const svg = document.querySelector('#paramExplorerTreemap svg');
    if (!svg) return;
    if (paramExplorerZoomState) {
        // Zoom views: highlight matches with red border, dim non-matches
        svg.querySelectorAll('g[data-peval]').forEach(g => {
            const val = (g.getAttribute('data-peval') || '').toLowerCase();
            const match = !term || val.includes(term);
            g.style.opacity = match ? '' : '0.07';
            const rect = g.querySelector('rect');
            if (rect) {
                if (term && match) {
                    rect.style.stroke = '#e53935';
                    rect.style.strokeWidth = '2.5px';
                } else {
                    rect.style.stroke = '';
                    rect.style.strokeWidth = '';
                }
            }
        });
    } else {
        svg.querySelectorAll('g[data-paramname]').forEach(g => {
            const name = (g.getAttribute('data-paramname') || '').toLowerCase();
            g.style.opacity = (!term || name.includes(term)) ? '' : '0.07';
        });
    }
}

// â”€â”€ (legacy kept for potential external callers) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// (ExploreParameters.js ends here — value loading is in LoadParameterValues.js)
