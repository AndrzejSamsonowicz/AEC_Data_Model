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

    currentElementGroup = primary;
    currentLoadedFiles = files;
    const modal = document.getElementById('viewerModal');
    const title = document.getElementById('viewerModalTitle');
    const loading = document.getElementById('viewerLoading');

    title.textContent = files.length > 1 ? `${files.length} models` : primary.name;
    loading.style.display = 'block';
    modal.classList.add('active');

    // Reset category input
    const categoryInput = document.getElementById('categoryInput');
    const categoryResults = document.getElementById('categoryResults');
    if (categoryInput) categoryInput.value = '';
    if (categoryResults) categoryResults.innerHTML = '';

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

    // Reset category cache and UI
    cachedCategoryDbIds = null;
    const categoryInput = document.getElementById('categoryInput');
    const categoryResults = document.getElementById('categoryResults');
    if (categoryInput) categoryInput.value = '';
    if (categoryResults) categoryResults.innerHTML = '';
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

        const onTreeCreated = () => {
            console.log('Object tree created - loading categories');
            viewerInstance.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, onTreeCreated);
            showAvailableCategories();
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

// Extract categories directly from the viewer model (faster than GraphQL API)
async function getCategoriesFromViewer() {
    const models = (viewer && viewer.getAllModels) ? viewer.getAllModels() : (viewer && viewer.model ? [viewer.model] : []);
    if (!models.length) throw new Error('No models loaded');

    console.log(`🔍 Extracting categories from ${models.length} model(s)...`);
    const categoryMap = new Map();
    cachedCategoryDbIds = new Map(); // Reset cache

    for (const model of models) {
        const instanceTree = await new Promise((resolve) => {
            model.getObjectTree((tree) => resolve(tree), () => resolve(null));
        });
        if (!instanceTree) { console.log('  ⚠ getObjectTree returned null for a model, skipping'); continue; }

        const allDbIds = [];
        instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId) => {
            allDbIds.push(dbId);
        }, true);
        console.log(`  model has ${allDbIds.length} nodes`);

        await new Promise((resolve) => {
            model.getBulkProperties(allDbIds, { propFilter: ['Category'] }, (results) => {
                results.forEach(result => {
                    const categoryProp = result.properties.find(p => p.displayName === 'Category');
                    if (categoryProp && categoryProp.displayValue) {
                        const name = categoryProp.displayValue.replace(/^Revit\s+/i, '');
                        categoryMap.set(name, (categoryMap.get(name) || 0) + 1);
                        // Cache: store model+dbId per category for fast filtering
                        if (!cachedCategoryDbIds.has(name)) cachedCategoryDbIds.set(name, []);
                        const entries = cachedCategoryDbIds.get(name);
                        let modelEntry = entries.find(e => e.model === model);
                        if (!modelEntry) { modelEntry = { model, dbIds: [] }; entries.push(modelEntry); }
                        modelEntry.dbIds.push(result.dbId);
                    }
                });
                resolve();
            }, () => { console.warn('getBulkProperties failed for a model'); resolve(); });
        });
    }

    const categories = Array.from(categoryMap.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value));

    console.log(`✓ Extracted ${categories.length} categories across ${models.length} model(s), cached for filtering`);
    return categories;
}

// INVESTIGATION: Filter by category using ONLY Forge Viewer (no GraphQL)
async function filterByCategoryInViewer(categoryName) {
    return new Promise((resolve, reject) => {
        if (!viewer || !viewer.model) {
            reject(new Error('Viewer or model not loaded'));
            return;
        }

        console.log(`🔍 Filtering by category "${categoryName}" using Forge Viewer only...`);
        
        const instanceTree = viewer.model.getInstanceTree();
        if (!instanceTree) {
            reject(new Error('Instance tree not available'));
            return;
        }

        // Get all dbIds
        const allDbIds = [];
        instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId) => {
            allDbIds.push(dbId);
        }, true);

        console.log(`   Total objects: ${allDbIds.length}`);

        // Get Category property for all objects and filter
        viewer.model.getBulkProperties(allDbIds, { propFilter: ['Category'] }, (results) => {
            const matchingDbIds = [];
            
            results.forEach(result => {
                const categoryProp = result.properties.find(p => p.displayName === 'Category');
                if (categoryProp && categoryProp.displayValue) {
                    let catName = categoryProp.displayValue.replace(/^Revit\s+/i, '');
                    if (catName === categoryName) {
                        matchingDbIds.push(result.dbId);
                    }
                }
            });

            console.log(`✓ Found ${matchingDbIds.length} elements in category "${categoryName}"`);
            console.log(`   Isolating in viewer...`);
            
            // Isolate these elements in the viewer
            viewer.isolate(matchingDbIds);
            viewer.fitToView(matchingDbIds);
            
            resolve(matchingDbIds);
        }, (error) => {
            console.error('Error filtering by category:', error);
            reject(error);
        });
    });
}

// INVESTIGATION: Inspect all properties available for Wall elements
async function inspectWallProperties() {
    return new Promise((resolve, reject) => {
        if (!viewer || !viewer.model) {
            reject(new Error('Viewer or model not loaded'));
            return;
        }

        console.log('🔍 Inspecting Wall properties...');
        
        const instanceTree = viewer.model.getInstanceTree();
        if (!instanceTree) {
            reject(new Error('Instance tree not available'));
            return;
        }

        // Get all dbIds
        const allDbIds = [];
        instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId) => {
            allDbIds.push(dbId);
        }, true);

        // First, find Wall elements
        viewer.model.getBulkProperties(allDbIds, { propFilter: ['Category'] }, (results) => {
            const wallDbIds = [];
            
            results.forEach(result => {
                const categoryProp = result.properties.find(p => p.displayName === 'Category');
                if (categoryProp && categoryProp.displayValue) {
                    let catName = categoryProp.displayValue.replace(/^Revit\s+/i, '');
                    if (catName === 'Walls') {
                        wallDbIds.push(result.dbId);
                    }
                }
            });

            console.log(`   Found ${wallDbIds.length} Wall elements`);

            if (wallDbIds.length === 0) {
                resolve({ dbIds: [], properties: [] });
                return;
            }

            // Get ALL properties for first 3 walls
            const sampleDbIds = wallDbIds.slice(0, 3);
            console.log(`   Getting all properties for ${sampleDbIds.length} sample walls...`);

            viewer.model.getBulkProperties(sampleDbIds, {}, (wallResults) => {
                console.log('\n📋 WALL PROPERTIES AVAILABLE:');
                console.log('================================');
                
                // Get unique property names across all sample walls
                const allPropNames = new Set();
                wallResults.forEach((result, idx) => {
                    console.log(`\n🧱 Wall ${idx + 1} (dbId: ${result.dbId}):`);
                    console.log(`   Total properties: ${result.properties.length}`);
                    
                    result.properties.forEach(prop => {
                        allPropNames.add(prop.displayName);
                        if (idx === 0) { // Log all properties for first wall
                            console.log(`   - ${prop.displayName}: ${prop.displayValue} ${prop.units || ''}`);
                        }
                    });
                });

                console.log(`\n📊 UNIQUE PROPERTY NAMES (${allPropNames.size} total):`);
                Array.from(allPropNames).sort().forEach(name => {
                    console.log(`   - ${name}`);
                });

                resolve({
                    dbIds: wallDbIds,
                    sampleProperties: wallResults,
                    uniquePropertyNames: Array.from(allPropNames)
                });
            }, (error) => {
                console.error('Error getting wall properties:', error);
                reject(error);
            });
        }, (error) => {
            console.error('Error finding walls:', error);
            reject(error);
        });
    });
}

// Filter elements to only include those with External IDs present in the viewer
function filterViewableElements(elements) {
    if (viewerExternalIds.size === 0) {
        console.warn('⚠ Viewer External IDs not yet loaded, returning all elements');
        return elements;
    }
    
    const viewableElements = elements.filter(element => {
        if (element.properties?.results) {
            const externalIdProp = element.properties.results.find(p => p.name === 'External ID');
            if (externalIdProp && externalIdProp.value) {
                return viewerExternalIds.has(externalIdProp.value);
            }
        }
        return false;
    });
    
    console.log(`🔍 Filtered to viewable elements: ${viewableElements.length}/${elements.length} (${Math.round(viewableElements.length/elements.length*100)}% viewable)`);
    
    return viewableElements;
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

// Isolate elements in viewer and display them in sidebar
async function isolateAndDisplayElements(dbIds, elements, categoryNames) {
    if (!viewer || !viewer.model) return;
    
    // Isolate and fit view
    viewer.isolate(dbIds);
    viewer.fitToView(dbIds);
    
    // Build element-to-dbId mapping for interactive highlighting
    filteredElementsMap.clear();
    elementDataMap.clear();
    
    // Get the external ID mapping from viewer (async callback)
    viewer.model.getExternalIdMapping((externalIdMapping) => {
        // Build the mapping
        elements.forEach(element => {
            // Extract External ID from element properties
            if (element.properties?.results) {
                const externalIdProp = element.properties.results.find(p => p.name === 'External ID');
                if (externalIdProp && externalIdProp.value) {
                    const dbId = externalIdMapping[externalIdProp.value];
                    if (dbId) {
                        filteredElementsMap.set(element.id, dbId);
                        elementDataMap.set(dbId, element); // Store full element data by dbId
                    }
                }
            }
        });
        console.log(`✓ Created mapping for ${filteredElementsMap.size} elements`);
        
        // Display elements in sidebar
        const sidebar = document.getElementById('elementList');
        if (!sidebar) return;
        
        const categoryLabel = Array.isArray(categoryNames) ? categoryNames.join(', ') : categoryNames;
        
        let html = `<div style="padding: 10px; background: #2196f3; color: white; font-weight: bold; margin-bottom: 5px; border-radius: 4px;">`;
        html += `${dbIds.length} element(s) - ${categoryLabel}`;
        html += `</div>`;
        html += '<div class="category-results-hint" style="padding: 8px; background: #e3f2fd; color: #1976d2; font-size: 12px; margin-bottom: 5px; border-radius: 4px;">💡 Click elements in viewer or list for highlighting</div>';
        
        elements.slice(0, Math.min(200, elements.length)).forEach((element, index) => {
            const dbId = filteredElementsMap.get(element.id);
            if (dbId) {
                html += `<div class="element-list-item" data-dbid="${dbId}" onclick="highlightElementInViewer(${dbId})" style="padding: 8px; border-bottom: 1px solid #ddd; font-size: 13px; cursor: pointer; transition: background 0.2s; background: white;" onmouseover="this.style.background='#e3f2fd'" onmouseout="this.style.background='white'">`;
                html += `<strong style="color: #333;">${index + 1}. ${element.name || 'Unnamed'}</strong><br/>`;
                html += `<span style="color: #666; font-size: 11px;">ID: ${element.id}</span>`;
                html += `</div>`;
            }
        });
        
        if (elements.length > 200) {
            html += `<div style="padding: 8px; color: #666; font-size: 12px; text-align: center;">... and ${elements.length - 200} more</div>`;
        }
        
        sidebar.innerHTML = html;
        
        // Setup bidirectional interaction: clicking in viewer highlights in sidebar
        setupViewerToSidebarSync();
    });
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

// ─── Compliance Check: AEC DM value distribution + Viewer highlighting ───────

async function runComplianceCheck() {
    const category       = (document.getElementById('compCategory')?.value || '').trim();
    const paramName      = (document.getElementById('compParamName')?.value || '').trim();
    const allowedRaw     = (document.getElementById('compAllowedValues')?.value || '').trim();
    const resultsDiv     = document.getElementById('complianceResults');

    if (!category || !paramName || !allowedRaw) {
        if (resultsDiv) resultsDiv.innerHTML = `<div class="category-results warning">Please fill in all three fields.</div>`;
        return;
    }

    const allowedValues = allowedRaw.split(',').map(v => v.trim()).filter(Boolean);

    if (resultsDiv) resultsDiv.innerHTML = `<div class="category-results info">⏳ Step 1/2: Querying AEC DM for value distribution...</div>`;

    // ── Step 1: AEC DM — get value distribution (fast, server-side) ──
    let aecValueMap = null;
    try {
        aecValueMap = await queryDistinctPropertyValues(category, paramName);
    } catch (e) {
        console.warn('AEC DM distinct values query failed (non-critical):', e.message);
    }

    // ── Step 2: Viewer — scan loaded elements for violations ──
    if (resultsDiv) resultsDiv.innerHTML = `<div class="category-results info">⏳ Step 2/2: Scanning viewer elements...</div>`;

    if (!cachedCategoryDbIds || !cachedCategoryDbIds.has(category)) {
        if (resultsDiv) resultsDiv.innerHTML = `<div class="category-results warning">Category "<strong>${category}</strong>" not found in the viewer. Check the spelling matches the Category Filter panel above.</div>`;
        return;
    }

    // Collect dbIds per model for the given category
    const catEntries = cachedCategoryDbIds.get(category) || [];
    const modelDbIdsMap = new Map();
    for (const { model, dbIds } of catEntries) {
        if (!modelDbIdsMap.has(model)) modelDbIdsMap.set(model, []);
        modelDbIdsMap.get(model).push(...dbIds);
    }

    // Isolate the category in the viewer
    const allModels = (viewer && viewer.getAllModels) ? viewer.getAllModels() : (viewer && viewer.model ? [viewer.model] : []);
    for (const model of allModels) {
        const dbIds = modelDbIdsMap.get(model);
        if (dbIds && dbIds.length > 0) {
            viewer.isolate(dbIds, model);
        } else {
            const tree = model.getInstanceTree();
            if (tree) viewer.hide(tree.getRootId(), model);
        }
    }

    // Scan element properties and highlight violations red
    viewer.clearThemingColors();
    const RED   = new THREE.Vector4(1, 0, 0, 1);

    let totalElements = 0;
    const violations = [];

    for (const [model, dbIds] of modelDbIdsMap) {
        totalElements += dbIds.length;
        await new Promise((resolve, reject) => {
            model.getBulkProperties(dbIds, { propFilter: [paramName] }, (results) => {
                for (const elem of results) {
                    const prop = elem.properties?.find(
                        p => p.attributeName === paramName || p.displayName === paramName
                    );
                    const val = prop ? String(prop.displayValue ?? '') : '';
                    if (!val || !allowedValues.includes(val)) {
                        viewer.setThemingColor(elem.dbId, RED, model);
                        violations.push({ dbId: elem.dbId, value: val || '(empty)' });
                    }
                }
                resolve();
            }, reject);
        });
    }

    viewer.fitToView();
    const compliantCount = totalElements - violations.length;

    // ── Build results HTML ──
    let html = '';

    // AEC DM distribution block (Step 1)
    if (aecValueMap && aecValueMap.size > 0) {
        html += `<div style="background:#e3f2fd;border-radius:4px;padding:8px;margin-bottom:8px;font-size:12px;">`;
        html += `<div style="font-weight:bold;color:#1565c0;margin-bottom:4px;">📊 AEC DM — Value Distribution:</div>`;
        const sorted = [...aecValueMap.entries()].sort((a, b) => b[1] - a[1]);
        for (const [value, count] of sorted) {
            const allowed = allowedValues.includes(value);
            const color  = allowed ? '#2e7d32' : '#c62828';
            const marker = allowed ? '✓' : '✗';
            html += `<div style="color:${color};padding:2px 0;">${marker} <strong>${value}</strong>: ${count} elements</div>`;
        }
        html += `</div>`;
    } else if (aecValueMap === null) {
        html += `<div style="background:#fff8e1;border-radius:4px;padding:6px;margin-bottom:8px;font-size:11px;color:#795548;">ℹ️ AEC DM summary unavailable (file may not be Revit 2024+ or not yet indexed).</div>`;
    }

    // Viewer scan summary (Step 2)
    const bgColor = violations.length === 0 ? '#e8f5e9' : '#ffebee';
    html += `<div style="background:${bgColor};border-radius:4px;padding:8px;font-size:12px;">`;
    if (violations.length === 0) {
        html += `<div style="color:#2e7d32;font-weight:bold;">✅ All ${totalElements} elements are compliant.</div>`;
    } else {
        html += `<div style="color:#c62828;font-weight:bold;">⚠️ ${violations.length} of ${totalElements} non-compliant — highlighted in red.</div>`;
        html += `<div style="color:#388e3c;margin-top:2px;">✓ ${compliantCount} compliant</div>`;
    }
    html += `</div>`;

    if (resultsDiv) resultsDiv.innerHTML = html;
}

// Filter by multiple selected categories
async function filterBySelectedCategories() {
    const statusDiv = document.getElementById('filterStatus');
    const elementListDiv = document.getElementById('elementList');
    
    // Get all checked checkboxes
    const checkboxes = document.querySelectorAll('#categoryResults input[type="checkbox"]:checked');
    const selectedCategories = Array.from(checkboxes).map(cb => cb.value);
    
    if (selectedCategories.length === 0) {
        alert('Please select at least one category');
        return;
    }
    
    console.log('🔍 Filtering elements by categories using Forge Viewer (NO GraphQL):', selectedCategories.join(', '));
    
    const loadingMsg = selectedCategories.length === 1 
        ? `🔍 Loading ${selectedCategories[0]} elements...`
        : `🔍 Loading ${selectedCategories.length} categories...`;
    if (statusDiv) statusDiv.innerHTML = `<div class="category-results info" style="margin-top: 10px;">${loadingMsg}</div>`;
    if (elementListDiv) elementListDiv.innerHTML = '';
    
    try {
        // Use Forge Viewer-only filtering (NO GraphQL!)
        const result = await filterByCategoriesInViewer(selectedCategories);
        
        if (result.dbIds.length === 0) {
            if (statusDiv) statusDiv.innerHTML = `<div class="category-results warning">No elements found for selected categories</div>`;
            return;
        }
        
        console.log(`✓ Found ${result.dbIds.length} element(s) using Forge Viewer`);
        console.log(`✓ Retrieved properties for all elements`);
        
        // Isolation applied per-model inside filterByCategoriesInViewer
        viewer.fitToView();
        
        // Store element data and create reverse mapping (for click events)
        elementDataMap.clear();
        filteredElementsMap.clear();
        
        result.elements.forEach(element => {
            elementDataMap.set(element.dbId, element);
            filteredElementsMap.set(element.dbId, element.dbId); // Simple mapping for viewer-only mode
        });
        
        // Store for parameter query
        currentFilteredCategories = selectedCategories;

        // Show treemap button
        if (elementListDiv) elementListDiv.innerHTML = `
            <button onclick="showTreemapModal()"
                style="width:100%;padding:8px;margin-top:4px;background:#7b1fa2;color:white;
                       border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">
                🌳 Show Treemap
            </button>`;

        const categoryList = selectedCategories.join(', ');
        if (statusDiv) statusDiv.innerHTML = `
            <div class="category-results success">✓ Showing ${result.dbIds.length} elements (${categoryList})</div>
        `;
        // Auto-fill compliance category when a single category is selected
        const compCat = document.getElementById('compCategory');
        if (compCat && selectedCategories.length === 1) compCat.value = selectedCategories[0];
    } catch (error) {
        console.error('Error filtering by categories:', error);
        if (statusDiv) statusDiv.innerHTML = `<div class="category-results warning">Error: ${error.message}</div>`;
    }
}

// ─── Hybrid workflow: query Revit parameters via AEC DM after Viewer filtering ─
async function loadParametersFromAecDM() {
    const statusDiv = document.getElementById('filterStatus');

    if (!currentFilteredCategories || currentFilteredCategories.length === 0) {
        alert('Please filter elements first');
        return;
    }

    if (statusDiv) statusDiv.innerHTML = `
        <div class="category-results info">⏳ Querying AEC Data Model for parameters... (Revit 2024+ only)</div>
    `;

    try {
        const elements = await queryElementParameters(currentFilteredCategories);

        if (!elements) {
            if (statusDiv) statusDiv.innerHTML = `
                <div class="category-results warning">
                    ⚠️ AEC DM lookup failed — file may not be Revit 2024+ or not yet indexed.
                </div>
                <button onclick="loadParametersFromAecDM()" style="margin-top:6px;width:100%;padding:7px;background:#ff9800;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">📊 Retry Load Parameters (AEC DM)</button>
            `;
            return;
        }

        console.log(`✓ Received ${elements.length} elements with full parameters from AEC DM`);
        displayParameterResults(elements);

        if (statusDiv) statusDiv.innerHTML = `
            <div class="category-results success">✓ Loaded parameters for ${elements.length} elements from AEC DM</div>
            <button onclick="loadParametersFromAecDM()" style="margin-top:6px;width:100%;padding:7px;background:#ff9800;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">📊 Reload Parameters (AEC DM)</button>
        `;
    } catch (error) {
        console.error('Error loading parameters:', error);
        if (statusDiv) statusDiv.innerHTML = `
            <div class="category-results warning">Error: ${error.message}</div>
            <button onclick="loadParametersFromAecDM()" style="margin-top:6px;width:100%;padding:7px;background:#ff9800;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">📊 Retry Load Parameters (AEC DM)</button>
        `;
    }
}

// Display parameter results from AEC DM in the element list panel
function displayParameterResults(elements) {
    const elementListDiv = document.getElementById('elementList');
    if (!elementListDiv) return;

    let html = `<div style="margin-top:10px;padding:10px;background:white;border-radius:4px;border:1px solid #ddd;">`;
    html += `<div style="font-weight:bold;margin-bottom:8px;color:#333;">📊 ${elements.length} Elements with Full Parameters:</div>`;
    html += `<div style="max-height:400px;overflow-y:auto;">`;

    elements.forEach(element => {
        const params = element.properties?.results || [];
        const filled = params.filter(p => p.displayValue !== null && p.displayValue !== undefined && p.displayValue !== '');

        // Group by collection name (Revit parameter group)
        const groups = {};
        filled.forEach(p => {
            const group = p.definition?.collection?.name || 'Other';
            if (!groups[group]) groups[group] = [];
            groups[group].push(p);
        });
        const sortedGroups = Object.keys(groups).sort();

        html += `<div style="border:1px solid #e0e0e0;border-radius:4px;margin-bottom:6px;overflow:hidden;">`;
        html += `<div style="background:#1976d2;color:white;padding:6px 10px;font-size:12px;font-weight:bold;cursor:pointer"
                      onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
                    ${element.name || 'Unnamed'} <span style="float:right;font-weight:normal">${filled.length} params ▼</span>
                 </div>`;
        html += `<div style="display:none;padding:6px;">`;
        sortedGroups.forEach(group => {
            html += `<div style="font-size:10px;font-weight:bold;color:#1976d2;padding:4px 4px 2px;text-transform:uppercase;letter-spacing:0.5px;">${group}</div>`;
            html += `<table style="width:100%;font-size:11px;border-collapse:collapse;margin-bottom:4px;">`;
            groups[group].forEach(p => {
                html += `<tr style="border-bottom:1px solid #f0f0f0;">
                    <td style="padding:2px 6px;color:#555;width:50%">${p.name}</td>
                    <td style="padding:2px 6px;color:#333;">${p.displayValue}</td>
                </tr>`;
            });
            html += `</table>`;
        });
        html += `</div></div>`;
    });

    html += `</div></div>`;
    elementListDiv.innerHTML = html;
}

// Filter by multiple categories using Forge Viewer only (NO GraphQL!)
async function filterByCategoriesInViewer(categoryNames) {
    if (!cachedCategoryDbIds) throw new Error('Category cache not available — open categories panel first');

    const allModels = (viewer && viewer.getAllModels) ? viewer.getAllModels() : (viewer && viewer.model ? [viewer.model] : []);
    console.log(`   Filtering ${categoryNames.length} categories using cache across ${allModels.length} model(s)...`);

    // Build model → matching dbIds map from cache
    const modelDbIds = new Map(); // model → dbIds[]
    for (const catName of categoryNames) {
        const entries = cachedCategoryDbIds.get(catName) || [];
        for (const { model, dbIds } of entries) {
            if (!modelDbIds.has(model)) modelDbIds.set(model, []);
            modelDbIds.get(model).push(...dbIds);
        }
    }

    // Apply isolation per model
    for (const model of allModels) {
        const dbIds = modelDbIds.get(model) || [];
        if (dbIds.length > 0) {
            viewer.isolate(dbIds, model);
        } else {
            const tree = model.getInstanceTree();
            if (tree) viewer.hide(tree.getRootId(), model);
        }
    }

    const allDbIds = [...modelDbIds.values()].flat();
    console.log(`   ✓ Found ${allDbIds.length} matching elements across all models (from cache)`);
    return { dbIds: allDbIds, elements: [], perModel: [...modelDbIds.entries()].map(([model, dbIds]) => ({ model, dbIds, elements: [] })) };
}

// Display element list in the sidebar
function displayElementList(elements, selectedCategories) {
    const elementListDiv = document.getElementById('elementList');
    if (!elementListDiv) return;
    
    let html = '<div style="margin-top: 10px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd;">';
    html += `<div style="font-weight: bold; margin-bottom: 8px; color: #333;">📋 ${elements.length} Elements:</div>`;
    html += '<div style="max-height: 200px; overflow-y: auto;">';
    
    elements.forEach((element, idx) => {
        const categoryProp = element.properties.results.find(p => p.name === 'Category');
        const categoryName = categoryProp ? categoryProp.value.replace(/^Revit\s+/i, '') : 'Unknown';
        
        html += `<div style="padding: 6px; border-bottom: 1px solid #eee; cursor: pointer; font-size: 12px;" 
                      onmouseover="this.style.background='#f0f0f0'" 
                      onmouseout="this.style.background='white'"
                      onclick="highlightElementInViewer(${element.dbId})">`;
        html += `<strong>${element.name || 'Unnamed'}</strong>`;
        html += `<br><span style="color: #666; font-size: 11px;">${categoryName}</span>`;
        html += `</div>`;
    });
    
    html += '</div></div>';
    elementListDiv.innerHTML = html;
}

// Clear category filter and show all elements
async function clearCategoryFilter() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('#categoryResults input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    // Clear element mappings
    filteredElementsMap.clear();
    elementDataMap.clear();
    
    // Show all elements across all loaded models
    if (viewer) {
        viewer.showAll();
        viewer.clearThemingColors();
        viewer.fitToView();
    }
    
    // Clear element list and status
    const elementListDiv = document.getElementById('elementList');
    const statusDiv = document.getElementById('filterStatus');
    if (elementListDiv) elementListDiv.innerHTML = '';
    if (statusDiv) statusDiv.innerHTML = '';
    
    // Close properties panel
    closePropertiesPanel();
    
    console.log('✓ Category filter cleared');
}

// Generic function to fetch elements by any property filter
async function getElementsByCategoryFilter(elementGroupId, propertyFilter) {
    console.log('📋 Fetching elements with filter from AEC Data Model API');
    console.log('   Element Group ID:', elementGroupId);
    console.log('   Filter:', propertyFilter);
    console.log('   Region:', currentRegion);

    const query = `
        query GetElementsFromCategory($elementGroupId: ID!, $propertyFilter: String!, $cursor: String, $limit: Int) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: {query: $propertyFilter}, pagination: {cursor: $cursor, limit: $limit}) {
                pagination {
                    cursor
                }
                results {
                    id
                    name
                    properties {
                        results {
                            name
                            value
                            definition {
                                units {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    let allElements = [];
    const pageSize = 100;
    const concurrentRequests = 5; // Fetch 5 pages in parallel
    
    // Helper function to fetch a single page
    const fetchPage = async (cursor) => {
        const variables = {
            elementGroupId: elementGroupId,
            propertyFilter: propertyFilter,
            limit: pageSize
        };
        
        if (cursor) {
            variables.cursor = cursor;
        }

        const data = await graphqlRequest(query, variables, currentRegion);

        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            throw new Error(data.errors[0].message || 'GraphQL query failed');
        }

        if (!data.data || !data.data.elementsByElementGroup) {
            return { results: [], cursor: null };
        }

        return {
            results: data.data.elementsByElementGroup.results || [],
            cursor: data.data.elementsByElementGroup.pagination?.cursor
        };
    };

    // Fetch first page to get initial cursor
    console.log(`   Starting parallel pagination (${concurrentRequests} concurrent requests, ${pageSize} elements/page)...`);
    const firstPage = await fetchPage(null);
    allElements = firstPage.results;
    console.log(`   ✓ Page 1: ${firstPage.results.length} elements`);

    // Collect all cursors for parallel fetching
    let cursors = firstPage.cursor ? [firstPage.cursor] : [];
    let batchNum = 1;

    while (cursors.length > 0) {
        // Take up to concurrentRequests cursors
        const batchCursors = cursors.splice(0, concurrentRequests);
        
        console.log(`   📦 Batch ${batchNum}: Fetching ${batchCursors.length} pages in parallel...`);
        
        // Fetch all pages in this batch concurrently
        const batchPromises = batchCursors.map(cursor => fetchPage(cursor));
        const batchResults = await Promise.all(batchPromises);
        
        // Collect results and new cursors
        let batchElementCount = 0;
        batchResults.forEach(pageData => {
            allElements = allElements.concat(pageData.results);
            batchElementCount += pageData.results.length;
            if (pageData.cursor) {
                cursors.push(pageData.cursor);
            }
        });
        
        console.log(`   ✓ Batch ${batchNum}: ${batchElementCount} elements (total: ${allElements.length})`);
        batchNum++;
    }

    console.log(`✓ Retrieved ${allElements.length} element(s) using parallel pagination`);

    // Filter to only include viewable elements (those with External IDs in the viewer)
    const viewableElements = filterViewableElements(allElements);
    
    return viewableElements;
}

// Legacy single-category filter function (kept for backwards compatibility)
async function filterByCategory() {
    const input = document.getElementById('categoryInput');
    const resultsDiv = document.getElementById('categoryResults');
    const categoryName = input?.value?.trim();

    if (!categoryName) {
        resultsDiv.innerHTML = '<div class="category-results warning">Please enter a category name</div>';
        return;
    }

    if (!currentElementGroup) {
        resultsDiv.innerHTML = '<div class="category-results warning">No element group selected</div>';
        return;
    }

    if (!sessionId) {
        resultsDiv.innerHTML = '<div class="category-results warning">Not logged in</div>';
        return;
    }

    resultsDiv.innerHTML = '<div class="category-results info">Querying AEC Data Model for "' + categoryName + '"...</div>';

    try {
        console.log('🔍 Filtering elements by category:', categoryName);
        console.log('   Element Group ID:', currentElementGroup.id);
        console.log('   Filter:', `property.name."Revit Category Type Id"==${categoryName}`);

        const elements = await getElementsByCategory(currentElementGroup.id, categoryName);
        
        if (elements.length > 0) {
            console.log(`✓ Found ${elements.length} element(s) from AEC Data Model API`);
            
            // Isolate elements in viewer
            if (viewer && viewer.model) {
                resultsDiv.innerHTML = '<div class="category-results info">Mapping elements to viewer...</div>';
                const dbIds = await mapElementsToViewerDbIds(elements);
                
                if (dbIds.length > 0) {
                    console.log(`✓ Mapped ${dbIds.length} element(s) to viewer dbIds`);
                    
                    viewer.isolate(dbIds);
                    viewer.fitToView(dbIds);
                    
                    // Build element-to-dbId mapping for interactive highlighting
                    // We need to map based on External ID to ensure correct pairing
                    filteredElementsMap.clear();
                    elementDataMap.clear();
                    
                    // Get the external ID mapping from viewer (async callback)
                    viewer.model.getExternalIdMapping((externalIdMapping) => {
                        // Build the mapping
                        elements.forEach(element => {
                            // Extract External ID from element properties
                            if (element.properties?.results) {
                                const externalIdProp = element.properties.results.find(p => p.name === 'External ID');
                                if (externalIdProp && externalIdProp.value) {
                                    const dbId = externalIdMapping[externalIdProp.value];
                                    if (dbId) {
                                        filteredElementsMap.set(element.id, dbId);
                                        elementDataMap.set(dbId, element); // Store full element data by dbId
                                    }
                                }
                            }
                        });
                        console.log(`✓ Created mapping for ${filteredElementsMap.size} elements`);
                        
                        // Now build and display the HTML list (inside callback so mapping is complete)
                        let resultsHtml = `<div class="category-results success">✓ Found and isolated ${dbIds.length} element(s) with category "${categoryName}"</div>`;
                        resultsHtml += '<div class="category-results-hint" style="padding: 8px; background: #e3f2fd; color: #1976d2; font-size: 12px; margin-top: 5px; border-radius: 4px;">💡 Click elements in viewer or list for bidirectional highlighting</div>';
                        resultsHtml += '<div id="elementsListContainer" style="max-height: 300px; overflow-y: auto; margin-top: 10px;">';
                        
                        elements.slice(0, Math.min(50, elements.length)).forEach((element, index) => {
                            const dbId = filteredElementsMap.get(element.id);
                            if (dbId) {
                                resultsHtml += `<div class="element-list-item" data-dbid="${dbId}" onclick="highlightElementInViewer(${dbId})" style="padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">`;
                                resultsHtml += `<strong>${index + 1}. ${element.name || 'Unnamed'}</strong><br/>`;
                                resultsHtml += `<span style="color: #666; font-size: 11px;">ID: ${element.id}</span>`;
                                resultsHtml += `</div>`;
                            }
                        });
                        
                        if (elements.length > 50) {
                            resultsHtml += `<div style="padding: 8px; color: #666; font-size: 12px; text-align: center;">... and ${elements.length - 50} more</div>`;
                        }
                        
                        resultsHtml += '</div>';
                        resultsDiv.innerHTML = resultsHtml;
                        
                        // Setup bidirectional interaction: clicking in viewer highlights in sidebar
                        setupViewerToSidebarSync();
                    });
                } else {
                    console.warn('⚠ Could not map AEC elements to viewer dbIds');
                    let resultsHtml = `<div class="category-results warning">Found ${elements.length} element(s) in AEC Data Model, but could not map them to the viewer</div>`;
                    resultsDiv.innerHTML = resultsHtml;
                }
            } else {
                // Viewer not loaded, just show results
                let resultsHtml = `<div class="category-results success">✓ Found ${elements.length} element(s) with category "${categoryName}"</div>`;
                resultsHtml += '<div style="max-height: 300px; overflow-y: auto; margin-top: 10px;">';
                
                elements.forEach((element, index) => {
                    resultsHtml += `<div style="padding: 8px; border-bottom: 1px solid #eee; font-size: 13px;">`;
                    resultsHtml += `<strong>${index + 1}. ${element.name || 'Unnamed'}</strong><br/>`;
                    resultsHtml += `<span style="color: #666; font-size: 11px;">ID: ${element.id}</span>`;
                    resultsHtml += `</div>`;
                });
                
                resultsHtml += '</div>';
                resultsDiv.innerHTML = resultsHtml;
            }
        } else {
            resultsDiv.innerHTML = '<div class="category-results warning">No elements found with category "' + categoryName + '"<br/>Try: Walls, Doors, Windows, Floors, Roofs, etc.</div>';
        }
    } catch (error) {
        console.error('Error filtering by category:', error);
        resultsDiv.innerHTML = '<div class="category-results warning">Error: ' + error.message + '</div>';
    }
}



async function mapElementsToViewerDbIds(elements) {
    console.log('🔗 Mapping AEC Data Model elements to viewer dbIds...');
    
    if (!viewer || !viewer.model) {
        console.warn('Viewer or model not available');
        return [];
    }

    console.log(`   Processing ${elements.length} AEC elements`);

    // Step 1: Extract "External ID" property from AEC elements
    // This is the Revit UniqueId that's persistent across Revit, Viewer, and AEC Data Model
    const externalIds = [];
    
    elements.forEach(elem => {
        if (elem.properties?.results) {
            const externalIdProp = elem.properties.results.find(p => p.name === 'External ID');
            if (externalIdProp && externalIdProp.value) {
                externalIds.push(externalIdProp.value);
            }
        }
    });

    console.log(`   Extracted ${externalIds.length} External IDs from AEC elements`);
    if (externalIds.length > 0) {
        console.log(`   Sample External IDs: ${externalIds.slice(0, 3).join(', ')}`);
    }

    // Step 2: Use getExternalIdMapping to get the externalId->dbId dictionary
    return new Promise((resolve) => {
        viewer.model.getExternalIdMapping((externalIdMapping) => {
            console.log(`   Viewer has ${Object.keys(externalIdMapping).length} objects with external IDs`);
            
            // Log sample viewer external IDs for comparison
            const sampleViewerIds = Object.keys(externalIdMapping).slice(0, 3);
            console.log(`   Sample Viewer External IDs: ${sampleViewerIds.join(', ')}`);
            
            // Step 3: Look up each AEC External ID in the viewer mapping
            const matchedDbIds = [];
            externalIds.forEach(externalId => {
                const dbId = externalIdMapping[externalId];
                if (dbId) {
                    matchedDbIds.push(dbId);
                }
            });

            console.log(`✓ Mapping complete: ${matchedDbIds.length}/${externalIds.length} elements matched`);
            
            if (matchedDbIds.length === 0 && externalIds.length > 0) {
                console.warn('⚠ No matches found between AEC External IDs and Viewer external IDs');
                console.warn('   This might indicate:');
                console.warn('   - Different model versions between AEC Data Model and Viewer');
                console.warn('   - Model loaded in Viewer is not the same as queried element group');
            }

            resolve(matchedDbIds);
        }, (error) => {
            console.error('Error getting external ID mapping:', error);
            resolve([]);
        });
    });
}

async function getElementsByCategory(elementGroupId, categoryName) {
    console.log('📋 Fetching elements by category from AEC Data Model API');
    console.log('   Element Group ID:', elementGroupId);
    console.log('   Category:', categoryName);
    console.log('   Region:', currentRegion);

    const query = `
        query GetElementsFromCategory($elementGroupId: ID!, $propertyFilter: String!) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: {query: $propertyFilter}) {
                pagination {
                    cursor
                }
                results {
                    id
                    name
                    properties {
                        results {
                            name
                            value
                            definition {
                                units {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    const categoryPropertyId = 'autodesk.revit.parameter:parameter.category-2.0.0';
    const variables = {
        elementGroupId: elementGroupId,
        propertyFilter: `property.id.${categoryPropertyId}==${categoryName}`
    };

    console.log('   Variables:', JSON.stringify(variables, null, 2));

    const data = await graphqlRequest(query, variables, currentRegion);

    if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        throw new Error(data.errors[0].message || 'GraphQL query failed');
    }

    if (!data.data || !data.data.elementsByElementGroup) {
        console.error('No data returned from elementsByElementGroup query');
        return [];
    }

    const elements = data.data.elementsByElementGroup.results || [];
    console.log(`✓ Retrieved ${elements.length} element(s)`);

    // Filter to only include viewable elements
    const viewableElements = filterViewableElements(elements);
    
    return viewableElements;
}

// Test function for multi-category filter syntax
async function testMultiCategoryFilters(elementGroupId, categories) {
    console.log('🧪 Testing multi-category filter syntaxes...');
    console.log(`   Categories to test: ${categories.join(', ')}`);
    
    const categoryPropertyId = 'autodesk.revit.parameter:parameter.category-2.0.0';
    const testSyntaxes = [
        {
            name: '✅ Official RSQL: OR with lowercase',
            filter: categories.map(c => `property.id.${categoryPropertyId}==${c}`).join(' or ')
        },
        {
            name: '✅ Official RSQL: OR with parentheses',
            filter: `(${categories.map(c => `property.id.${categoryPropertyId}==${c}`).join(' or ')})`
        },
        {
            name: 'RSQL: OR with uppercase',
            filter: categories.map(c => `property.id.${categoryPropertyId}==${c}`).join(' OR ')
        },
        {
            name: 'Double pipe OR (||)',
            filter: `property.id.${categoryPropertyId}==${categories.join('||')}`
        },
        {
            name: 'Comma-separated values',
            filter: `property.id.${categoryPropertyId}==${categories.join(',')}`
        },
        {
            name: 'IN operator with brackets',
            filter: `property.id.${categoryPropertyId} IN [${categories.join(',')}]`
        },
        {
            name: 'Single pipe OR (|)',
            filter: `property.id.${categoryPropertyId}==${categories.join('|')}`
        }
    ];

    const query = `
        query GetElementsFromCategory($elementGroupId: ID!, $propertyFilter: String!) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: {query: $propertyFilter}) {
                pagination {
                    cursor
                }
                results {
                    id
                    name
                }
            }
        }
    `;

    console.log('\n' + '='.repeat(80));
    
    for (let i = 0; i < testSyntaxes.length; i++) {
        const test = testSyntaxes[i];
        console.log(`\nTest ${i + 1}/${testSyntaxes.length}: ${test.name}`);
        console.log(`Filter: ${test.filter}`);
        
        try {
            const variables = {
                elementGroupId: elementGroupId,
                propertyFilter: test.filter
            };
            
            const data = await graphqlRequest(query, variables, currentRegion);
            
            if (data.errors) {
                console.log(`❌ ERROR: ${JSON.stringify(data.errors[0].message)}`);
            } else if (data.data?.elementsByElementGroup?.results) {
                const count = data.data.elementsByElementGroup.results.length;
                console.log(`✅ SUCCESS: ${count} elements found`);
                if (count > 0) {
                    console.log(`   Sample elements: ${data.data.elementsByElementGroup.results.slice(0, 3).map(e => e.name).join(', ')}`);
                }
            } else {
                console.log(`⚠️ No data returned`);
            }
        } catch (error) {
            console.log(`❌ EXCEPTION: ${error.message}`);
        }
        
        // Small delay between tests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('🧪 Multi-category filter syntax testing complete!');
}

// Button handler for running multi-category tests
async function runMultiCategoryTest() {
    const resultsDiv = document.getElementById('categoryResults');
    
    if (!currentElementGroup) {
        resultsDiv.innerHTML = '<div class="category-results warning">No element group loaded</div>';
        return;
    }
    
    if (!sessionId) {
        resultsDiv.innerHTML = '<div class="category-results warning">Not logged in</div>';
        return;
    }
    
    resultsDiv.innerHTML = '<div class="category-results info">🧪 Running multi-category syntax tests...<br/>Check browser console for detailed results.</div>';
    
    // Test with common Revit categories
    const testCategories = ['Walls', 'Doors'];
    
    console.log('\n' + '█'.repeat(80));
    console.log('🧪 MULTI-CATEGORY FILTER SYNTAX TEST');
    console.log('   Testing categories: ' + testCategories.join(' + '));
    console.log('   Element Group: ' + currentElementGroup.name);
    console.log('█'.repeat(80));
    
    await testMultiCategoryFilters(currentElementGroup.id, testCategories);
    
    resultsDiv.innerHTML = '<div class="category-results success">✓ Test complete! Check browser console for results.<br/><br/>Look for syntax that shows "✅ SUCCESS" with multiple elements found.</div>';
}

// Get sample elements to discover available property names
async function discoverPropertyNames(elementGroupId, maxSamples = 5) {
    console.log('🔍 Fetching sample elements to discover property names...');
    
    const query = `
        query GetSampleElements($elementGroupId: ID!) {
            elementsByElementGroup(elementGroupId: $elementGroupId) {
                results {
                    id
                    name
                    properties {
                        results {
                            name
                            value
                        }
                    }
                }
            }
        }
    `;

    try {
        const variables = { elementGroupId };
        const data = await graphqlRequest(query, variables, currentRegion);
        
        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            return new Set();
        }
        
        const elements = data.data?.elementsByElementGroup?.results || [];
        const propertyNames = new Set();
        const propertyExamples = {}; // Store sample values for each property
        
        // Collect all unique property names from sample elements
        elements.slice(0, maxSamples).forEach(element => {
            if (element.properties?.results) {
                element.properties.results.forEach(prop => {
                    propertyNames.add(prop.name);
                    
                    // Store first 3 example values for each property
                    if (!propertyExamples[prop.name]) {
                        propertyExamples[prop.name] = [];
                    }
                    if (propertyExamples[prop.name].length < 3) {
                        propertyExamples[prop.name].push(prop.value);
                    }
                });
            }
        });
        
        console.log(`✓ Found ${propertyNames.size} unique property names in ${Math.min(maxSamples, elements.length)} sample elements:`);
        Array.from(propertyNames).sort().forEach(name => {
            console.log(`   - ${name}`);
        });
        
        // Log sample values for key properties
        console.log('\n📋 Sample values for key properties:');
        const keyProperties = ['Family Name', 'Revit Category Type Id', 'Element Name', 'Revit Element ID'];
        keyProperties.forEach(propName => {
            if (propertyExamples[propName]) {
                console.log(`   ${propName}:`);
                propertyExamples[propName].forEach((value, idx) => {
                    console.log(`      [${idx + 1}] ${value}`);
                });
            }
        });
        
        return propertyNames;
    } catch (error) {
        console.error('Error discovering property names:', error);
        return new Set();
    }
}

// Discover available categories in the current element group
async function discoverCategories(elementGroupId) {
    console.log('🔍 Discovering available categories in element group...');
    
    // Use "Revit Category Type Id" property which contains category names
    const categoryPropertyName = "Revit Category Type Id";
    console.log(`✓ Using property: "${categoryPropertyName}"`);
    
    const query = `
        query GetDistinctCategoryValues($elementGroupId: ID!, $name: String!) {
            distinctPropertyValuesInElementGroupByName(
                elementGroupId: $elementGroupId,
                name: $name
            ) {
                results {
                    definition {
                        id
                    }
                    values {
                        value
                        count
                    }
                }
            }
        }
    `;

    try {
        const variables = { 
            elementGroupId: elementGroupId,
            name: categoryPropertyName
        };
        
        const data = await graphqlRequest(query, variables, currentRegion);
        
        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            return [];
        }
        
        if (!data.data?.distinctPropertyValuesInElementGroupByName?.results) {
            console.warn('No category data returned');
            return [];
        }
        
        // Extract categories from the nested structure
        const results = data.data.distinctPropertyValuesInElementGroupByName.results;
        const categories = [];
        
        results.forEach(result => {
            if (result.values) {
                result.values.forEach(valueObj => {
                    categories.push({
                        value: valueObj.value,
                        count: valueObj.count
                    });
                });
            }
        });
        
        console.log(`✓ Found ${categories.length} categories:`);
        categories.forEach(cat => {
            console.log(`   - ${cat.value} (${cat.count} elements)`);
        });
        
        return categories;
    } catch (error) {
        console.error('Error discovering categories:', error);
        return [];
    }
}

// Button handler for discovering available categories
async function showAvailableCategories() {
    const resultsDiv = document.getElementById('categoryResults');
    
    if (!currentElementGroup) {
        resultsDiv.innerHTML = '<div class="category-results warning">No element group loaded</div>';
        return;
    }
    
    resultsDiv.innerHTML = '<div class="category-results info">🔍 Discovering available categories...</div>';
    
    try {
        // Get categories directly from the viewer model (faster and only shows viewable elements!)
        const categories = await getCategoriesFromViewer();
        
        if (categories.length > 0) {
            let html = `<div class="category-results success" style="margin-bottom: 10px;">✓ Found ${categories.length} Viewable Categories:</div>`;
            html += '<div style="max-height: 300px; overflow-y: auto; margin-bottom: 10px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; background: white;">';
            
            categories.forEach((cat, idx) => {
                html += `<div style="padding: 6px 8px; border-bottom: 1px solid #eee; display: flex; align-items: center;">`;
                html += `<input type="checkbox" id="cat_${idx}" value="${cat.value}" style="margin-right: 8px; cursor: pointer;" onchange="triggerCategoryFilter()">`;
                html += `<label for="cat_${idx}" style="cursor: pointer; flex: 1; color: #333;">`;
                html += `<strong>${cat.value}</strong> <span style="color: #666; font-size: 12px;">(${cat.count})</span>`;
                html += `</label>`;
                html += `</div>`;
            });
            
            html += '</div>';
            html += '<div id="filterStatus" style="margin-top: 10px;"></div>';
            html += `
            <div style="margin-top:14px;border-top:1px solid #ccc;padding-top:12px;">
                <div style="font-weight:bold;font-size:13px;color:#1565c0;margin-bottom:8px;">🔍 Compliance Check (AEC DM)</div>
                <input id="compCategory" placeholder="Category (e.g. Walls)" style="width:100%;box-sizing:border-box;padding:6px 8px;margin-bottom:6px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
                <input id="compParamName" placeholder="Parameter name (e.g. Fire_Resistance_Rating)" style="width:100%;box-sizing:border-box;padding:6px 8px;margin-bottom:6px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
                <input id="compAllowedValues" placeholder="Allowed values, comma-separated (e.g. EI40,EI60,EI80)" style="width:100%;box-sizing:border-box;padding:6px 8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
                <button onclick="runComplianceCheck()" style="width:100%;padding:8px;background:#1565c0;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">▶ Check Compliance</button>
                <div id="complianceResults" style="margin-top:8px;"></div>
            </div>`;
            resultsDiv.innerHTML = html;
        } else {
            resultsDiv.innerHTML = '<div class="category-results warning">No categories found</div>';
        }
    } catch (error) {
        console.error('Error getting categories from viewer:', error);
        resultsDiv.innerHTML = '<div class="category-results error">Failed to load categories</div>';
    }
}

// ============================================================================
// INVESTIGATION FUNCTIONS - Expose to window for console testing
// ============================================================================
// Usage from browser console after loading a model:
//   await window.testFilterByCategory('Walls')
//   await window.testInspectWallProperties()
// ============================================================================

async function triggerCategoryFilter() {
    const checked = document.querySelectorAll('#categoryResults input[type="checkbox"]:checked');
    if (checked.length === 0) {
        await clearCategoryFilter();
    } else {
        await filterBySelectedCategories();
    }
}

window.testFilterByCategory = filterByCategoryInViewer;
window.testInspectWallProperties = inspectWallProperties;
window.testGetCategoriesFromViewer = getCategoriesFromViewer;
