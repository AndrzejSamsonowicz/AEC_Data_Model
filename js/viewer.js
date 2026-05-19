// Forge Viewer Initialization and Controls

async function getViewerToken(callback) {
    try {
        console.log('Requesting viewer token with sessionId:', sessionId);
        const response = await fetch(`${API_BASE}/api/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
        });
        
        console.log('Token response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Token request failed:', errorText);
            throw new Error(`Failed to get viewer token: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Token received, expires in:', data.expires_in, 'seconds');
        callback(data.access_token, data.expires_in);
    } catch (error) {
        console.error('Error getting viewer token:', error);
        alert('Failed to get viewer token. Please try logging in again.');
    }
}

function initializeViewer() {
    return new Promise((resolve, reject) => {
        if (viewer) {
            resolve(viewer);
            return;
        }

        const options = {
            env: 'AutodeskProduction',
            api: 'derivativeV2',
            getAccessToken: getViewerToken
        };

        Autodesk.Viewing.Initializer(options, () => {
            const viewerDiv = document.getElementById('viewerDiv');
            viewer = new Autodesk.Viewing.GuiViewer3D(viewerDiv);
            const startedCode = viewer.start();
            if (startedCode > 0) {
                console.error('Failed to initialize viewer');
                reject(new Error('Failed to initialize viewer'));
                return;
            }
            console.log('Viewer initialized successfully');
            resolve(viewer);
        });
    });
}

function openViewerModal(elementGroups) {
    const files = Array.isArray(elementGroups) ? elementGroups : [elementGroups];
    const primary = files[0];

    console.log(`🎬 Opening viewer modal for ${files.length} model(s)`);
    files.forEach(f => console.log('   -', f.name));
    console.log('   Current Region:', currentRegion);
    console.log('   Current Project:', currentProject);

    if (!currentRegion) {
        console.error('❌ No region set!');
        alert('Error: No region set. Please select a project first.');
        return;
    }

    // Build DA file context from the primary file, enriching with projectId from fileSummary if available
    if (!window._pendingDAFileContext || !window._pendingDAFileContext.fileVersionUrn) {
        const fvu = primary.alternativeIdentifiers?.fileVersionUrn || null;
        const summaryEntry = (window.example1State?.fileSummary || []).find(
            s => s.fileVersionUrn === fvu || s.egId === primary.id
        );
        window._pendingDAFileContext = {
            fileVersionUrn: fvu,
            projectId:      summaryEntry?.projectId || null,
            hubId:          summaryEntry?.hubId || window.example1State?.hubId || null,
            region:         window.example1State?.region || null,
            fileName:       primary.name || 'model.rvt'
        };
    } else {
        if (!window._pendingDAFileContext.hubId)
            window._pendingDAFileContext.hubId = window.example1State?.hubId || null;
        if (!window._pendingDAFileContext.region)
            window._pendingDAFileContext.region = window.example1State?.region || null;
    }

    currentElementGroup = primary;
    currentLoadedFiles = files;
    const modal = document.getElementById('viewerModal');
    const title = document.getElementById('viewerModalTitle');
    const loading = document.getElementById('viewerLoading');

    title.textContent = files.length > 1 ? `${files.length} models` : primary.name;
    loading.style.display = 'block';
    modal.classList.add('active');

    // Populate parameter edit panel with any pending selection
    populateParamEditPanel();

    // Initialize and load model(s)
    initializeViewer()
        .then((viewerInstance) => {
            loading.textContent = `Loading model${files.length > 1 ? 's' : ''}...`;
            loadModelsInViewer(viewerInstance, files);
        })
        .catch((error) => {
            loading.textContent = 'Failed to initialize viewer';
            console.error('Viewer initialization error:', error);
            alert('Failed to initialize viewer. Please try again.');
        });
}

function closeViewerModal() {
    const modal = document.getElementById('viewerModal');
    modal.classList.remove('active');
    
    // Remove viewer selection event listener
    if (viewer) {
        viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, handleViewerSelection);
    }
    
    // Unload all loaded models but keep viewer instance
    if (viewer) {
        try {
            const models = viewer.getAllModels ? viewer.getAllModels() : (viewer.model ? [viewer.model] : []);
            models.forEach(m => { try { viewer.unloadModel(m); } catch(e) {} });
        } catch (e) {
            console.log('Model unload:', e.message);
        }
        currentElementGroup = null;
        currentLoadedFiles = [];
    }

    // Hide the Show All button
    const showAllBtn = document.getElementById('viewerShowAllBtn');
    if (showAllBtn) showAllBtn.style.display = 'none';
}

function viewerShowAll() {
    if (!viewer) return;
    const models = (viewer.getAllModels) ? viewer.getAllModels() : (viewer.model ? [viewer.model] : []);
    viewer.showAll();
    models.forEach(m => viewer.clearThemingColors(m));
    const showAllBtn = document.getElementById('viewerShowAllBtn');
    if (showAllBtn) showAllBtn.style.display = 'none';
}

function loadModelsInViewer(viewerInstance, files) {
    const loading = document.getElementById('viewerLoading');

    let sharedGlobalOffset = null; // captured from first model, reused for all others

    function loadOne(file, keepCurrentModels) {
        return new Promise((resolve, reject) => {
            if (!file.alternativeIdentifiers?.fileVersionUrn) {
                reject(new Error(`No URN for ${file.name}`));
                return;
            }
            const fileVersionUrn = file.alternativeIdentifiers.fileVersionUrn;
            console.log(`Loading model (${keepCurrentModels ? 'aggregated' : 'primary'}): ${file.name}`);
            const urn = btoa(fileVersionUrn).replace(/=/g, '');
            const documentId = 'urn:' + urn;

            Autodesk.Viewing.Document.load(documentId, (doc) => {
                const viewable = doc.getRoot().getDefaultGeometry();
                if (!viewable) { reject(new Error(`No geometry: ${file.name}`)); return; }

                const opts = {};
                if (keepCurrentModels) {
                    opts.keepCurrentModels = true;
                    // Apply the same globalOffset as the first model so all models
                    // share the same coordinate origin (Revit Shared Coordinates)
                    if (sharedGlobalOffset) {
                        opts.globalOffset = sharedGlobalOffset;
                    }
                }

                viewerInstance.loadDocumentNode(doc, viewable, opts).then((model) => {
                    // Capture the globalOffset from the first model for all subsequent ones
                    if (!keepCurrentModels) {
                        sharedGlobalOffset = model.getData()?.globalOffset
                            || viewerInstance.impl?.camera?.globalOffset
                            || null;
                        if (sharedGlobalOffset) {
                            console.log(`📐 Captured shared globalOffset: ${JSON.stringify(sharedGlobalOffset)}`);
                        }
                    }
                    resolve(model);
                }).catch(reject);
            }, (code, msg) => {
                reject(new Error(`Failed to load ${file.name}: ${msg || code}`));
            });
        });
    }

    (async () => {
        for (let i = 0; i < files.length; i++) {
            loading.textContent = files.length > 1
                ? `Loading model ${i + 1} of ${files.length}...`
                : 'Loading model...';
            try {
                await loadOne(files[i], i > 0);
            } catch (err) {
                console.error(err.message);
                loading.textContent = err.message;
                return;
            }
        }

        loading.style.display = 'none';
        console.log(`✓ ${files.length} model(s) loaded`);

        extractViewerExternalIds();
        setupViewerToSidebarSync();

        const onTreeCreated = () => {
            console.log('Object tree created');
            viewerInstance.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, onTreeCreated);
            // Auto-isolate specific elements (triggered from PE "Show in Viewer")
            if (pendingRevitElementIds && pendingRevitElementIds.length > 0) {
                const ids = pendingRevitElementIds;
                const cat = pendingRevitCategory;
                pendingRevitElementIds = null;
                pendingRevitCategory = null;
                isolateByRevitIds(ids, cat).catch(e => console.warn('Auto-isolate by Revit ID failed:', e.message));
            }
        };
        viewerInstance.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, onTreeCreated);
    })();
}

// Extract all External IDs from the loaded viewer model
function extractViewerExternalIds() {
    if (!viewer || !viewer.model) return;
    
    console.log('🔍 Extracting External IDs from viewer model...');
    
    viewer.model.getExternalIdMapping((externalIdMapping) => {
        viewerExternalIds.clear();
        Object.keys(externalIdMapping).forEach(externalId => {
            viewerExternalIds.add(externalId);
        });
        console.log(`✓ Extracted ${viewerExternalIds.size} External IDs from viewer model`);
    });
}

// Colour specific elements red in the viewer by their Revit Element ID values.
// Uses cachedCategoryDbIds to avoid scanning all nodes — only scans the relevant category.
async function isolateByRevitIds(revitIds, category) {
    if (!viewer || !viewer.model) throw new Error('Viewer or model not loaded');

    const idSet = new Set(revitIds.map(String));
    console.log(`🎯 Highlighting ${idSet.size} element(s) by Revit Element ID (category: ${category || 'all'})...`);

    // Build the list of dbIds to scan:
    // Prefer cachedCategoryDbIds for the category (much smaller set) → fall back to all nodes.
    let dbIdsToScan = [];
    let modelRef = viewer.model;
    if (category && cachedCategoryDbIds && cachedCategoryDbIds.has(category)) {
        for (const { model, dbIds } of cachedCategoryDbIds.get(category)) {
            dbIdsToScan.push(...dbIds);
            modelRef = model; // use the model from the cache
        }
        console.log(`   Scanning ${dbIdsToScan.length} dbIds in category "${category}"`);
    } else {
        // Full scan fallback
        const instanceTree = modelRef.getInstanceTree();
        if (!instanceTree) throw new Error('Instance tree not available');
        instanceTree.enumNodeChildren(instanceTree.getRootId(), dbId => { dbIdsToScan.push(dbId); }, true);
        console.log(`   Full scan: ${dbIdsToScan.length} dbIds`);
    }

    // Get ALL properties for those dbIds (no propFilter — avoids display-name guessing)
    const matchingDbIds = await new Promise((resolve, reject) => {
        modelRef.getBulkProperties(dbIdsToScan, {}, results => {
            const hits = [];
            // Piggyback: build / extend the revitId→dbId cache for PE row-click coloring.
            if (!window._peRevitDbIdCache) window._peRevitDbIdCache = new Map();
            const peCache = window._peRevitDbIdCache;
            results.forEach(result => {
                for (const p of result.properties) {
                    const nameLower = (p.displayName || '').toLowerCase();
                    if (nameLower.includes('elementid') || nameLower.includes('element id') || nameLower.includes('element_id')) {
                        const valStr = String(p.displayValue);
                        peCache.set(valStr, result.dbId);
                        if (idSet.has(valStr)) hits.push(result.dbId);
                        break;
                    }
                }
            });
            resolve(hits);
        }, reject);
    });

    console.log(`✓ Matched ${matchingDbIds.length} viewer object(s)`);
    if (matchingDbIds.length > 0) {
        viewer.clearThemingColors(modelRef);
        // Isolate: selected elements stay opaque, everything else is ghosted (semi-transparent)
        viewer.isolate(matchingDbIds, modelRef);
        // Paint selected elements red on top of the isolation
        const red = new THREE.Vector4(1, 0, 0, 1);
        matchingDbIds.forEach(dbId => viewer.setThemingColor(dbId, red, modelRef));
        viewer.fitToView(matchingDbIds, modelRef);
        // Show the "Show All" button in the viewer header
        const showAllBtn = document.getElementById('viewerShowAllBtn');
        if (showAllBtn) showAllBtn.style.display = '';
    } else {
        console.warn('⚠ No viewer objects matched. Dumping first 3 node property names for diagnosis:');
        // Diagnostic: log all property names from the first few scanned nodes
        await new Promise(resolve => {
            modelRef.getBulkProperties(dbIdsToScan.slice(0, 3), {}, r => {
                r.forEach(item => console.log(`  dbId ${item.dbId} properties:`, item.properties.map(p => `${p.displayName}=${p.displayValue}`)));
                resolve();
            }, resolve);
        });
    }
    return matchingDbIds;
}

function highlightElementInViewer(dbId) {
    if (!viewer) return;
    
    // Find which model this dbId belongs to (for multi-model support)
    const elementData = elementDataMap.get(dbId);
    const model = elementData?.model || viewer.model;
    
    // Clear all theming first
    viewer.clearThemingColors();
    
    // Set red color for the selected element
    const red = new THREE.Vector4(1, 0, 0, 1); // RGBA: Red
    viewer.setThemingColor(dbId, red, model);
    
    // Fit to view the highlighted element
    viewer.fitToView([dbId], model);
    
    // Also highlight in sidebar when clicking from list
    highlightElementInSidebar(dbId);
    
    // Display element properties in the properties panel
    displayElementProperties(dbId);
    
    console.log(`✓ Highlighted element dbId ${dbId} in red`);
}

// Display element properties in the properties panel
function displayElementProperties(dbId) {
    const propertiesPanel = document.getElementById('propertiesPanel');
    const propertiesPanelContent = document.getElementById('propertiesPanelContent');
    const propertiesPanelTitle = document.getElementById('propertiesPanelTitle');
    
    if (!propertiesPanel || !propertiesPanelContent) return;
    
    // Get element data from map
    const element = elementDataMap.get(dbId);
    
    if (!element) {
        propertiesPanelContent.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No properties available</div>';
        propertiesPanel.classList.add('active');
        return;
    }
    
    // Update title with element name
    propertiesPanelTitle.textContent = element.name || 'Element Properties';
    
    // Build properties HTML
    let html = '';
    
    if (element.properties?.results && element.properties.results.length > 0) {
        // Group properties by category (you could enhance this)
        html += '<div class="property-group">';
        html += '<div class="property-group-title">Parameters</div>';
        
        element.properties.results.forEach(prop => {
            html += '<div class="property-item">';
            html += `<div class="property-name">${prop.name}</div>`;
            
            if (prop.value !== null && prop.value !== undefined) {
                let displayValue = prop.value;
                
                // Format the value based on type
                if (typeof prop.value === 'number') {
                    displayValue = prop.value.toLocaleString(undefined, { maximumFractionDigits: 6 });
                }
                
                html += `<div class="property-value">${displayValue}`;
                
                // Add units if available
                if (prop.definition?.units?.name && prop.definition.units.name !== 'General') {
                    html += `<span class="property-units">[${prop.definition.units.name}]</span>`;
                }
                
                html += '</div>';
            } else {
                html += '<div class="property-value null">-</div>';
            }
            
            html += '</div>';
        });
        
        html += '</div>';
    } else {
        html = '<div style="padding: 20px; text-align: center; color: #999;">No properties found for this element</div>';
    }
    
    propertiesPanelContent.innerHTML = html;
    propertiesPanel.classList.add('active');
    
    console.log(`✓ Displayed ${element.properties?.results?.length || 0} properties for element:`, element.name);
}

// Close the properties panel
function closePropertiesPanel() {
    const propertiesPanel = document.getElementById('propertiesPanel');
    if (propertiesPanel) {
        propertiesPanel.classList.remove('active');
    }
}

function highlightElementInSidebar(dbId) {
    // Remove previous highlights
    const allItems = document.querySelectorAll('.element-list-item');
    allItems.forEach(item => {
        item.style.background = 'white';
        item.style.borderLeft = '3px solid transparent';
    });
    
    // Find and highlight the element with this dbId
    const targetItem = document.querySelector(`.element-list-item[data-dbid="${dbId}"]`);
    if (targetItem) {
        // Highlight in red
        targetItem.style.background = '#ffebee';
        targetItem.style.borderLeft = '4px solid #f44336';
        
        // Scroll into view
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        console.log(`✓ Highlighted element dbId ${dbId} in sidebar`);
    }
}

function setupViewerToSidebarSync() {
    if (!viewer) return;
    
    // Remove any existing listeners to avoid duplicates
    viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, handleViewerSelection);
    
    // Add selection changed event listener
    viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, handleViewerSelection);
    
    console.log('✓ Viewer-to-sidebar sync enabled');
}

function handleViewerSelection(event) {
    const dbIds = event.dbIdArray;
    
    if (dbIds && dbIds.length > 0) {
        // Get the first selected element
        const dbId = dbIds[0];
        
        // Highlight in viewer (red)
        highlightElementInViewer(dbId);
        
        // Highlight in sidebar (red background)
        highlightElementInSidebar(dbId);
    } else {
        // No selection - clear sidebar highlights
        const allItems = document.querySelectorAll('.element-list-item');
        allItems.forEach(item => {
            item.style.background = 'white';
            item.style.borderLeft = 'none';
        });
        
        // Clear viewer theming
        if (viewer && viewer.model) {
            viewer.clearThemingColors();
        }
    }
}

// ─── Parameter Edit Panel ─────────────────────────────────────────────────────

window._peTableState = window._peTableState || {
    selected: new Set(),   // Set<number> — selected row indices
    lastClick: -1,
    dragSrc: -1,
    cellSelected: new Set(), // Set<number> — selected "New Value" cell indices
    lastCellClick: -1
};
var _peDragHandleDown = false;
var _peHighlightTimer = null;

function populateParamEditPanel() {
    const panel = document.getElementById('paramEditPanel');
    if (!panel) return;
    const rows = window._pendingParamEditRows || [];
    if (rows.length === 0) {
        panel.innerHTML = '<div style="padding:4px 0 12px;color:#888;font-size:12px;line-height:1.5;">Select parameters in the treemap and click \u201cShow in Viewer \u25ba\u201d to populate this panel.</div>';
        return;
    }
    const st = window._peTableState;
    st.selected = new Set();
    st.lastClick = -1;
    st.dragSrc = -1;
    st.cellSelected = new Set();
    st.lastCellClick = -1;
    window._peRevitDbIdCache = null;   // clear scan cache whenever new rows are loaded
    _peRenderParamTable(panel, rows);
}

function _peRenderParamTable(panel, rows) {
    const st = window._peTableState;
    let html = '<div style="overflow-x:hidden;margin-bottom:2px;">';
    html += '<table id="peParamTable" style="width:100%;border-collapse:collapse;font-size:12px;table-layout:fixed;font-family:\'ArtifaktElement\',\'Helvetica Neue\',Arial,sans-serif;">';
    html += '<colgroup><col style="width:20px"><col style="width:35%"><col style="width:25%"><col></colgroup>';
    html += '<thead><tr style="background:#0696d7;color:white;user-select:none;letter-spacing:0.01em;">';
    html += '<th style="padding:7px 3px;"></th>';
    html += '<th style="padding:7px 6px;text-align:left;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;">Parameter</th>';
    html += '<th style="padding:7px 6px;text-align:left;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;">Current</th>';
    html += '<th style="padding:7px 6px;text-align:left;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;">New Value</th>';
    html += '</tr></thead>';
    html += '<tbody id="peParamTbody">';
    rows.forEach(function(row, i) {
        const isSel = st.selected.has(i);
        const bg = isSel ? '#e3f4fc' : (i % 2 === 0 ? '#ffffff' : '#f4f7f9');
        const bleft = isSel ? '3px solid #0696d7' : '3px solid transparent';
        const isCellSel = st.cellSelected.has(i);
        const cellBg = isCellSel ? '#e3f4fc' : '#ffffff';
        const cellBorder = isCellSel ? '1px solid #0696d7' : '1px solid #d5dbe1';
        html += '<tr draggable="true" data-idx="' + i + '" class="pe-param-row"'
             + ' style="background:' + bg + ';border-left:' + bleft + ';border-bottom:1px solid #d5dbe1;cursor:default;transition:background 0.1s;">';
        html += '<td class="pe-drag-handle" style="padding:4px 3px;text-align:center;color:#b0bec5;cursor:grab;font-size:14px;user-select:none;" title="Drag to reorder">\u2630</td>';
        html += '<td style="padding:6px 7px;color:#3c3c3c;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;" title="' + _peEscapeHtml(row.paramName) + '">'
             + _peEscapeHtml(row.paramName)
             + '</td>';
        html += '<td style="padding:6px 7px;color:#586370;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;" title="' + _peEscapeHtml(row.currentValue) + '">' + _peEscapeHtml(row.currentValue) + '</td>';
        html += '<td class="pe-new-cell" data-idx="' + i + '" style="padding:3px 4px;background:' + cellBg + ';border:' + cellBorder + ';box-sizing:border-box;">';
        html += '<input type="text" class="pe-new-input" data-idx="' + i + '" value="' + _peEscapeHtml(row.newValue || '') + '" placeholder="\u2014"'
             + ' style="width:100%;padding:3px 5px;border:none;background:transparent;font-size:12px;font-family:\'ArtifaktElement\',\'Helvetica Neue\',Arial,sans-serif;box-sizing:border-box;outline:none;color:#3c3c3c;">';
        html += '</td>';
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    html += '<button onclick="applyParamChangesViaDA()" style="margin-top:10px;width:100%;padding:9px 16px;background:#0696d7;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;font-family:\'ArtifaktElement\',\'Helvetica Neue\',Arial,sans-serif;letter-spacing:0.01em;transition:background 0.15s;">Apply via Design Automation \u25ba</button>';
    panel.innerHTML = html;
    _peBindTableEvents();
}

function _peBindTableEvents() {
    const tbody = document.getElementById('peParamTbody');
    if (!tbody) return;
    const st = window._peTableState;

    // ── Unified mousedown (row selection + cell selection) ───────────────────
    tbody.addEventListener('mousedown', function(e) {
        const td = e.target.closest('td.pe-new-cell');
        const tr = e.target.closest('tr.pe-param-row');
        if (!tr) return;
        const idx = parseInt(tr.dataset.idx, 10);
        if (isNaN(idx)) return;

        // Drag handle: set flag, skip selection
        if (e.target.closest('.pe-drag-handle')) {
            _peDragHandleDown = true;
            return;
        }

        // New Value cell clicked
        if (td) {
            if (e.shiftKey && st.lastCellClick >= 0) {
                e.preventDefault();
                const lo = Math.min(st.lastCellClick, idx);
                const hi = Math.max(st.lastCellClick, idx);
                if (!e.ctrlKey && !e.metaKey) st.cellSelected.clear();
                for (let i = lo; i <= hi; i++) st.cellSelected.add(i);
            } else {
                st.cellSelected.clear();
                st.cellSelected.add(idx);
                st.lastCellClick = idx;
            }
            _peRefreshRowStyles();
            return; // don't trigger row selection
        }

        // Input click: don't hijack
        if (e.target.tagName === 'INPUT') return;

        // Row click (parameter / current value columns)
        e.preventDefault();
        if (e.shiftKey && st.lastClick >= 0) {
            const lo = Math.min(st.lastClick, idx);
            const hi = Math.max(st.lastClick, idx);
            if (!e.ctrlKey && !e.metaKey) st.selected.clear();
            for (let i = lo; i <= hi; i++) st.selected.add(i);
        } else if (e.ctrlKey || e.metaKey) {
            if (st.selected.has(idx)) st.selected.delete(idx);
            else st.selected.add(idx);
            st.lastClick = idx;
        } else {
            const wasSingleThis = st.selected.size === 1 && st.selected.has(idx);
            st.selected.clear();
            if (!wasSingleThis) { st.selected.add(idx); st.lastClick = idx; }
            else st.lastClick = -1;
        }
        st.cellSelected.clear();
        _peRefreshRowStyles();
        _peHighlightSelectedInViewer();
    });

    // ── Save newValue on input ───────────────────────────────────────────────
    tbody.addEventListener('input', function(e) {
        if (!e.target.classList.contains('pe-new-input')) return;
        const idx = parseInt(e.target.dataset.idx, 10);
        const rows = window._pendingParamEditRows || [];
        if (!isNaN(idx) && rows[idx]) rows[idx].newValue = e.target.value;
    });

    // ── Paste multi-line (Excel-style column paste) ──────────────────────────
    tbody.addEventListener('paste', function(e) {
        if (!e.target.classList.contains('pe-new-input')) return;
        const idx = parseInt(e.target.dataset.idx, 10);
        if (isNaN(idx)) return;
        const text = (e.clipboardData || window.clipboardData).getData('text');
        const lines = text.split(/\r?\n/);
        // Trim single trailing empty line that Excel appends
        if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
        if (lines.length <= 1) return; // single value — let browser paste normally
        e.preventDefault();
        const rows = window._pendingParamEditRows || [];
        lines.forEach(function(line, offset) {
            const ti = idx + offset;
            if (ti >= rows.length) return;
            rows[ti].newValue = line;
            const inp = tbody.querySelector('.pe-new-input[data-idx="' + ti + '"]');
            if (inp) inp.value = line;
        });
    });

    // ── Right-click context menu on New Value cells ──────────────────────────
    tbody.addEventListener('contextmenu', function(e) {
        if (!e.target.closest('td.pe-new-cell') && !e.target.closest('input.pe-new-input')) return;
        e.preventDefault();
        const idx = parseInt((e.target.closest('[data-idx]') || {}).dataset.idx, 10);
        if (!isNaN(idx)) _peShowContextMenu(e.clientX, e.clientY, idx);
    });

    // ── Drag & drop (handle only) ────────────────────────────────────────────
    tbody.addEventListener('dragstart', function(e) {
        if (!_peDragHandleDown) { e.preventDefault(); return; }
        _peDragHandleDown = false;
        const tr = e.target.closest('tr.pe-param-row');
        if (!tr) return;
        st.dragSrc = parseInt(tr.dataset.idx, 10);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(st.dragSrc)); // required by Firefox
        // Dim all rows being dragged (all selected if dragSrc is part of selection)
        var toDim = (st.selected.has(st.dragSrc) && st.selected.size > 1)
            ? Array.from(st.selected)
            : [st.dragSrc];
        toDim.forEach(function(i) {
            var row = tbody.querySelector('tr.pe-param-row[data-idx="' + i + '"]');
            if (row) row.style.opacity = '0.45';
        });
    });

    tbody.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const tr = e.target.closest('tr.pe-param-row');
        tbody.querySelectorAll('tr.pe-param-row').forEach(function(r) { r.style.boxShadow = ''; });
        if (tr) tr.style.boxShadow = 'inset 0 -2px 0 #0696d7';
    });

    tbody.addEventListener('dragleave', function(e) {
        if (!tbody.contains(e.relatedTarget)) {
            tbody.querySelectorAll('tr.pe-param-row').forEach(function(r) { r.style.boxShadow = ''; });
        }
    });

    tbody.addEventListener('drop', function(e) {
        e.preventDefault();
        tbody.querySelectorAll('tr.pe-param-row').forEach(function(r) { r.style.boxShadow = ''; r.style.opacity = ''; });
        const tr = e.target.closest('tr.pe-param-row');
        if (!tr || st.dragSrc < 0) return;
        const destIdx = parseInt(tr.dataset.idx, 10);
        if (isNaN(destIdx)) return;
        const rows = window._pendingParamEditRows || [];

        // Determine which rows to move: all selected when dragSrc is part of selection
        var dragIndices = (st.selected.has(st.dragSrc) && st.selected.size > 1)
            ? Array.from(st.selected).sort(function(a, b) { return a - b; })
            : [st.dragSrc];

        // No-op: dropping in same spot, or dropping onto the selection itself
        if (dragIndices.length === 1 && dragIndices[0] === destIdx) { st.dragSrc = -1; return; }
        if (dragIndices.indexOf(destIdx) >= 0) { st.dragSrc = -1; return; }

        // Extract rows in their current order
        var dragged = dragIndices.map(function(i) { return rows[i]; });
        // Remove from high index to low so earlier indices stay valid
        for (var k = dragIndices.length - 1; k >= 0; k--) {
            rows.splice(dragIndices[k], 1);
        }
        // Adjust insert position: how many dragged rows were before destIdx?
        var insertAt = destIdx - dragIndices.filter(function(i) { return i < destIdx; }).length;
        insertAt = Math.max(0, Math.min(insertAt, rows.length));
        // Insert all dragged rows together
        dragged.forEach(function(r, k) { rows.splice(insertAt + k, 0, r); });
        // Update selection to the new positions
        st.selected = new Set();
        for (var k = 0; k < dragged.length; k++) st.selected.add(insertAt + k);
        st.dragSrc = -1;
        _peRenderParamTable(document.getElementById('paramEditPanel'), rows);
    });

    tbody.addEventListener('dragend', function() {
        tbody.querySelectorAll('tr.pe-param-row').forEach(function(r) { r.style.boxShadow = ''; r.style.opacity = ''; });
        _peDragHandleDown = false;
        st.dragSrc = -1;
    });

    // Reset drag flag on mouseup anywhere
    document.removeEventListener('mouseup', _peClearDragFlag);
    document.addEventListener('mouseup', _peClearDragFlag);

    // ── Keyboard Ctrl+C: copy New Value column selection ────────────────────
    document.removeEventListener('keydown', _peKeyHandler);
    document.addEventListener('keydown', _peKeyHandler);
}

function _peClearDragFlag() { _peDragHandleDown = false; }

function _peRemapIndices(set, src, dst) {
    const out = new Set();
    set.forEach(function(i) {
        if (i === src) { out.add(dst); return; }
        if (src < dst) {
            if (i > src && i <= dst) out.add(i - 1);
            else out.add(i);
        } else {
            if (i >= dst && i < src) out.add(i + 1);
            else out.add(i);
        }
    });
    return out;
}

function _peKeyHandler(e) {
    // Auto-remove when panel is gone
    if (!document.getElementById('peParamTbody')) {
        document.removeEventListener('keydown', _peKeyHandler);
        return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        const st = window._peTableState;
        if (st.cellSelected.size === 0) return;
        const rows = window._pendingParamEditRows || [];
        const text = Array.from(st.cellSelected).sort(function(a, b) { return a - b; })
            .map(function(i) { return rows[i] ? (rows[i].newValue || '') : ''; }).join('\n');
        navigator.clipboard.writeText(text).catch(function() {
            const ta = Object.assign(document.createElement('textarea'), { value: text });
            ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        });
        e.preventDefault();
    }
}

function _peRefreshRowStyles() {
    const st = window._peTableState;
    const rows = window._pendingParamEditRows || [];
    document.querySelectorAll('#peParamTbody tr.pe-param-row').forEach(function(tr) {
        const i = parseInt(tr.dataset.idx, 10);
        const isSel = st.selected.has(i);
        tr.style.background = isSel ? '#dceeff' : (i % 2 === 0 ? '#ffffff' : '#f6f8fb');
        tr.style.borderLeft = isSel ? '3px solid #1565c0' : '3px solid transparent';
    });
    document.querySelectorAll('#peParamTbody td.pe-new-cell').forEach(function(td) {
        const i = parseInt(td.dataset.idx, 10);
        const isCellSel = st.cellSelected.has(i);
        td.style.background = isCellSel ? '#fff3cd' : '#ffffff';
        td.style.border = isCellSel ? '1px solid #f0a500' : '1px solid #d0d0d0';
    });
}

function _peShowContextMenu(x, y, idx) {
    _peDismissContextMenu();
    const rows = window._pendingParamEditRows || [];
    const inp = document.querySelector('#peParamTbody .pe-new-input[data-idx="' + idx + '"]');
    const val = inp ? inp.value : (rows[idx] ? (rows[idx].newValue || '') : '');
    const st = window._peTableState;

    const menu = document.createElement('div');
    menu.id = 'peContextMenu';
    menu.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;'
        + 'background:#fff;border:1px solid #d0d0d0;border-radius:5px;'
        + 'box-shadow:0 4px 14px rgba(0,0,0,.18);z-index:99999;'
        + 'font-size:13px;min-width:160px;overflow:hidden;';

    function menuItem(label, fn, disabled) {
        const d = document.createElement('div');
        d.textContent = label;
        d.style.cssText = 'padding:8px 14px;cursor:' + (disabled ? 'default' : 'pointer')
            + ';color:' + (disabled ? '#bbb' : '#222') + ';';
        if (!disabled) {
            d.addEventListener('mouseenter', function() { d.style.background = '#e8f0fe'; });
            d.addEventListener('mouseleave', function() { d.style.background = ''; });
            d.addEventListener('mousedown', function(e) {
                e.stopPropagation();
                fn();
                _peDismissContextMenu();
            });
        }
        menu.appendChild(d);
    }
    function sep() {
        const s = document.createElement('div');
        s.style.cssText = 'border-top:1px solid #eee;margin:3px 0;';
        menu.appendChild(s);
    }

    menuItem('Fill Down', function() {
        for (let i = idx; i < rows.length; i++) {
            rows[i].newValue = val;
            const x = document.querySelector('#peParamTbody .pe-new-input[data-idx="' + i + '"]');
            if (x) x.value = val;
        }
    }, !val);

    menuItem('Fill Selection (' + (st.cellSelected.size || 1) + ' cells)', function() {
        (st.cellSelected.size > 0 ? st.cellSelected : new Set([idx])).forEach(function(i) {
            rows[i].newValue = val;
            const x = document.querySelector('#peParamTbody .pe-new-input[data-idx="' + i + '"]');
            if (x) x.value = val;
        });
    }, !val);

    sep();

    menuItem('Clear Cell', function() {
        rows[idx].newValue = '';
        if (inp) inp.value = '';
    });
    menuItem('Clear All', function() {
        rows.forEach(function(r) { r.newValue = ''; });
        document.querySelectorAll('#peParamTbody .pe-new-input').forEach(function(x) { x.value = ''; });
    });

    document.body.appendChild(menu);
    // Flip left if off-screen
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) menu.style.left = (x - rect.width) + 'px';
    if (rect.bottom > window.innerHeight) menu.style.top = (y - rect.height) + 'px';

    setTimeout(function() {
        document.addEventListener('mousedown', _peDismissContextMenu, { once: true });
    }, 0);
}

function _peDismissContextMenu() {
    const m = document.getElementById('peContextMenu');
    if (m) m.parentNode.removeChild(m);
}

function _peHighlightSelectedInViewer() {
    clearTimeout(_peHighlightTimer);
    _peHighlightTimer = setTimeout(async function() {
        if (!viewer || !viewer.model) return;
        const st     = window._peTableState;
        const rows   = window._pendingParamEditRows || [];

        if (st.selected.size === 0) {
            viewer.showAll();
            viewer.clearThemingColors();
            const btn = document.getElementById('viewerShowAllBtn');
            if (btn) btn.style.display = 'none';
            return;
        }

        // All rows supply the full context (red); selected row(s) get the focus color (blue)
        const allRevitIds   = [];
        const focusRevitIds = [];
        rows.forEach(function(r) { if (r && r.revitIds) allRevitIds.push(...r.revitIds); });
        st.selected.forEach(function(i) { if (rows[i] && rows[i].revitIds) focusRevitIds.push(...rows[i].revitIds); });

        if (focusRevitIds.length === 0) {
            console.warn('No Revit IDs for selected row(s) — cannot highlight.');
            return;
        }
        try { await _peIsolateWithFocus(allRevitIds, focusRevitIds); }
        catch(e) { console.warn('Row highlight failed:', e.message); }
    }, 80);
}

// Isolate all matched elements, colour context=red, focus=blue.
// The cache is built by the initial isolateByRevitIds full-model scan (piggybacked above).
// Falls back to its own scan if the viewer was reloaded without a prior isolateByRevitIds call.
async function _peIsolateWithFocus(allRevitIds, focusRevitIds) {
    const modelRef = viewer.model;

    // Build cache if missing — same proven logic as isolateByRevitIds
    if (!window._peRevitDbIdCache || window._peRevitDbIdCache.size === 0) {
        const instanceTree = modelRef.getInstanceTree();
        if (!instanceTree) throw new Error('Instance tree not available');
        const dbIdsToScan = [];
        instanceTree.enumNodeChildren(instanceTree.getRootId(), function(dbId) { dbIdsToScan.push(dbId); }, true);
        const cache = new Map();
        await new Promise(function(resolve, reject) {
            modelRef.getBulkProperties(dbIdsToScan, {}, function(results) {
                results.forEach(function(result) {
                    for (var i = 0; i < result.properties.length; i++) {
                        var p = result.properties[i];
                        var nl = (p.displayName || '').toLowerCase();
                        if (nl.includes('elementid') || nl.includes('element id') || nl.includes('element_id')) {
                            cache.set(String(p.displayValue), result.dbId);
                            break;
                        }
                    }
                });
                resolve();
            }, reject);
        });
        window._peRevitDbIdCache = cache;
        console.log('PE focus: built cache with', cache.size, 'entries');
    }

    const cache    = window._peRevitDbIdCache;
    const allDbIds   = [...new Set(allRevitIds.map(String))  ].map(id => cache.get(id)).filter(Boolean);
    const focusDbIds = [...new Set(focusRevitIds.map(String))].map(id => cache.get(id)).filter(Boolean);

    console.log('PE focus: allDbIds', allDbIds.length, 'focusDbIds', focusDbIds.length);
    if (allDbIds.length === 0) { console.warn('No viewer objects matched for any row.'); return; }

    viewer.clearThemingColors(modelRef);
    viewer.isolate(allDbIds, modelRef);

    const red  = new THREE.Vector4(1,    0.15, 0.1,  1);
    const blue = new THREE.Vector4(0.06, 0.58, 0.85, 1);
    const focusSet = new Set(focusDbIds);
    allDbIds.forEach(function(dbId) {
        viewer.setThemingColor(dbId, focusSet.has(dbId) ? blue : red, modelRef);
    });

    viewer.fitToView(focusDbIds.length > 0 ? focusDbIds : allDbIds, modelRef);
    const btn = document.getElementById('viewerShowAllBtn');
    if (btn) btn.style.display = '';
}

function _peEscapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Look up a friendly type label from the shared paramTypeCache (populated by examples.js).
// Cache stores Autodesk spec strings like "autodesk.parameter.aec:length-1.0.0"
function _peParamTypeLabelForViewer(paramName) {
    var typeCache = window._paramTypeCache || {};
    for (var egId in typeCache) {
        var t = (typeCache[egId] instanceof Map) ? typeCache[egId].get(paramName) : null;
        if (!t) continue;
        var s = t.toLowerCase();
        var urnMatch = s.match(/:([a-z]+)/);
        var typeName = urnMatch ? urnMatch[1] : s;
        var map = {
            'length':'Length','area':'Area','volume':'Volume','angle':'Angle',
            'boolean':'Bool','yesno':'Yes/No','integer':'Int','int':'Int',
            'number':'Number','double':'Number','real':'Number',
            'text':'Text','multilinetext':'Text','string':'Text',
            'url':'URL','material':'Material','force':'Force','mass':'Mass',
            'currency':'Currency','energy':'Energy','speed':'Speed',
            'time':'Time','temperature':'Temp'
        };
        return map[typeName] || (urnMatch ? typeName.charAt(0).toUpperCase() + typeName.slice(1) : null);
    }
    return null;
}

function applyParamChangesViaDA() {
    const rows   = window._pendingParamEditRows || [];
    const ctx    = window._pendingDAFileContext || {};
    const session = sessionId;

    // Collect rows that have a new value entered
    const changes = [];
    rows.forEach(function(row) {
        var newVal = (row.newValue || '').trim();
        if (!newVal || newVal === row.currentValue) return;
        (row.revitIds || []).forEach(function(rid) {
            changes.push({ elementId: String(rid), paramName: row.paramName, newValue: newVal });
        });
    });

    if (changes.length === 0) {
        alert('No new values entered. Edit the "New Value" cells first.');
        return;
    }
    if (!ctx.fileVersionUrn) {
        alert('File context missing — please re-open the viewer from the parameter explorer.');
        return;
    }
    if (!session) {
        alert('No active session. Please log in again.');
        return;
    }

    // Log the full file context to console so the user can verify the correct file is selected
    console.group('DA Submit — file context');
    console.log('fileName:      ', ctx.fileName);
    console.log('fileVersionUrn:', ctx.fileVersionUrn);
    console.log('projectId:     ', ctx.projectId);
    console.log('hubId:         ', ctx.hubId);
    console.log('region:        ', ctx.region);
    console.groupEnd();

    _peShowDAProgress('Resolving file\u2026 (check browser Console for file URN details)', null);

    // Resolve projectId lazily if not already known
    var resolvePromise;
    if (ctx.projectId) {
        resolvePromise = Promise.resolve(ctx.projectId);
    } else if (ctx.hubId) {
        resolvePromise = fetch(
            '/api/da/resolve-project?sessionId=' + encodeURIComponent(session)
            + '&hubId=' + encodeURIComponent(ctx.hubId)
            + '&fileVersionUrn=' + encodeURIComponent(ctx.fileVersionUrn)
            + (ctx.region ? '&region=' + encodeURIComponent(ctx.region) : '')
        )
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (d.error) throw new Error(d.error);
            ctx.projectId = d.projectId;
            return d.projectId;
        });
    } else {
        alert('Cannot determine ACC project. Please re-run the query from the hub selector and try again.');
        return;
    }

    resolvePromise
    .then(function(projectId) {
        ctx.projectId = projectId;
        _peShowDAProgress('Submitting to Design Automation\u2026', null);
        return fetch('/api/da/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId:      session,
                changes:        changes,
                fileVersionUrn: ctx.fileVersionUrn,
                projectId:      ctx.projectId,
                hubId:          ctx.hubId || null,
                revitEngine:    ctx.revitEngine || '',
                fileName:       ctx.fileName || 'model.rvt'
            })
        });
    })
    .then(function(r) {
        if (!r.ok && r.headers.get('content-type')?.includes('text/html')) {
            throw new Error('Server returned HTTP ' + r.status + '. The server may need to be restarted for the new DA routes to take effect.');
        }
        return r.json();
    })
    .then(function(data) {
        if (data.error) throw new Error(data.error);
        _peShowDAProgress('WorkItem queued \u2014 waiting for Revit engine\u2026', null);
        _pePollWorkItem(data.workItemId, data, 0);
    })
    .catch(function(err) {
        _peShowDAProgress(null, 'Submission failed: ' + err.message);
    });
}

function _pePollWorkItem(workItemId, submitData, attempt) {
    var session = sessionId;
    fetch('/api/da/workitem/' + workItemId + '?sessionId=' + encodeURIComponent(session))
        .then(function(r) { return r.json(); })
        .then(function(wi) {
            if (wi.error) throw new Error(wi.error);
            var status = wi.status; // pending | inprogress | success | failed | cancelled
            if (status === 'pending' || status === 'inprogress') {
                var elapsed = attempt * 6;
                _peShowDAProgress(
                    'Revit engine: ' + status + ' (' + elapsed + 's elapsed)\u2026',
                    null
                );
                setTimeout(function() { _pePollWorkItem(workItemId, submitData, attempt + 1); }, 6000);
            } else if (status === 'success') {
                // After DA completes (SaveCloudModel or SynchronizeWithCentral), call C4RModelPublish
                // to create an explicit published version visible in ACC.
                // Legacy download/upload path: finalize by creating a DM version from the OSS object.
                if (submitData.storageObjectId) {
                    _peShowDAProgress('Revit processing complete \u2014 creating new file version in ACC\u2026', null);
                    _peFinalizeDAResult(submitData, wi);
                } else if (submitData.itemId) {
                    _peShowDAProgress('Revit processing complete \u2014 publishing new version to ACC\u2026', null);
                    _pePublishDAResult(submitData, wi);
                } else {
                    _peShowDAProgress('Done! Parameters updated in Revit model.', null, null, 'success');
                }
            } else {
                // failed or cancelled — show link to report
                var msg = 'WorkItem ' + status + '.';
                if (wi.reportUrl) msg += '\n\nView report: ' + wi.reportUrl;
                _peShowDAProgress(null, msg, wi.reportUrl);
            }
        })
        .catch(function(err) {
            _peShowDAProgress(null, 'Poll error: ' + err.message);
        });
}

function _peFinalizeDAResult(submitData, wi) {
    var session = sessionId;
    fetch('/api/da/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId:       session,
            projectId:       submitData.projectId,
            itemId:          submitData.itemId,
            storageObjectId: submitData.storageObjectId,
            fileName:        submitData.fileName,
            versionExtType:  submitData.versionExtType,
            versionExtData:  submitData.versionExtData,
            uploadKey:       submitData.uploadKey,
            outBucket:       submitData.outBucket,
            outObjKey:       submitData.outObjKey
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.error) throw new Error(data.error);
        if (data.newItem) {
            _peShowDAProgress(
                'Done! Parameters updated \u2014 saved as new file \u201c' + (data.name || 'updated file') + '\u201d in ACC.',
                null, null, data.versionId || 'finalized'
            );
        } else {
            _peShowDAProgress(
                'Done! Parameters updated \u2014 new version V' + (data.versionNumber || '?') + ' created in ACC.',
                null, null, data.versionId || 'finalized'
            );
        }
    })
    .catch(function(err) {
        _peShowDAProgress(null, 'Finalize failed: ' + err.message);
    });
}

function _pePublishDAResult(submitData, wi) {
    var session = sessionId;
    fetch('/api/da/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId: session,
            projectId: submitData.projectId,
            itemId:    submitData.itemId
        })
    })
    .then(function(r) {
        // Capture HTTP status before consuming body
        var httpStatus = r.status;
        return r.json().then(function(data) { return { httpStatus: httpStatus, data: data }; });
    })
    .then(function(result) {
        var data = result.data;
        if (result.httpStatus === 403 || (data.error && result.httpStatus === 403)) {
            // 403 means no publish permission — but parameters were already updated by the workitem.
            // Treat as a non-fatal warning and show success with the actual API error detail.
            var apiDetail = data.error || data.detail || '';
            var noteMsg = 'Parameters updated in Revit model.\n\n'
                + '(Note: Could not publish a new ACC version.\n'
                + 'API error: ' + (apiDetail || 'no detail returned') + ')';
            _peShowDAProgress(noteMsg, null, null, 'updated');
            return;
        }
        if (data.error) throw new Error(data.error);
        _peShowDAProgress('Done! New version published to ACC.', null, null, data.commandId || 'published');
    })
    .catch(function(err) {
        _peShowDAProgress(null, 'Publish failed: ' + err.message);
    });
}

function _peShowDAProgress(message, errorMsg, reportUrl, successUrn) {
    var overlay = document.getElementById('peDAOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'peDAOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,19,28,0.72);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(overlay);
    }

    var isError   = !!errorMsg;
    var isDone    = !!successUrn;
    var accentClr = isError ? '#e03' : isDone ? '#22aa55' : '#0696d7';
    var icon      = isError ? '&#9888;' : isDone ? '&#10003;' : '';
    var bodyText  = errorMsg || message;

    overlay.innerHTML =
        '<div style="background:#fff;border-radius:8px;padding:32px 36px;max-width:460px;width:90%;box-shadow:0 8px 40px rgba(0,0,0,0.28);font-family:\'ArtifaktElement\',\'Helvetica Neue\',Arial,sans-serif;">'
      + '<div style="font-size:15px;font-weight:700;color:' + accentClr + ';margin-bottom:12px;">'
      + (icon ? '<span style="margin-right:6px;">' + icon + '</span>' : '')
      + (isError ? 'Design Automation Error' : isDone ? 'Success' : 'Design Automation') + '</div>'
      + '<div style="font-size:13px;color:#3c3c3c;line-height:1.6;white-space:pre-wrap;">' + _peEscapeHtml(bodyText) + '</div>'
      + (!isError && !isDone
          ? '<div style="margin-top:18px;display:flex;align-items:center;gap:10px;">'
          + '<div style="width:18px;height:18px;border:2px solid #d5dbe1;border-top-color:#0696d7;border-radius:50%;animation:pe-spin 0.9s linear infinite;flex-shrink:0;"></div>'
          + '<span style="font-size:12px;color:#586370;">This may take several minutes for large models.</span></div>'
          : '')
      + (reportUrl
          ? '<div style="margin-top:14px;"><a href="' + _peEscapeHtml(reportUrl) + '" target="_blank" rel="noopener noreferrer"'
          + ' style="font-size:12px;color:#0696d7;">View processing report &#8599;</a></div>'
          : '')
      + (successUrn
          ? '<div style="margin-top:10px;font-size:11px;color:#586370;word-break:break-all;">Version: ' + _peEscapeHtml(successUrn) + '</div>'
          : '')
      + ((isError || isDone)
          ? '<button onclick="document.getElementById(\'peDAOverlay\').remove()" '
          + 'style="margin-top:20px;padding:7px 20px;background:#0696d7;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">Close</button>'
          : '')
      + '</div>';

    // Spinner keyframe (injected once)
    if (!document.getElementById('peDASpinStyle')) {
        var s = document.createElement('style');
        s.id = 'peDASpinStyle';
        s.textContent = '@keyframes pe-spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(s);
    }
}

