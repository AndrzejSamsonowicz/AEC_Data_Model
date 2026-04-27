// AEC Data Model Query Examples

// Show example function
function showExample(exampleNumber) {
    // Hide all examples
    document.querySelectorAll('.example-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // Remove active state from all nav items
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected example
    document.getElementById(`example${exampleNumber}`).classList.add('active');
    
    // Add active state to selected nav item
    document.querySelectorAll('.nav-item')[exampleNumber - 1].classList.add('active');
}

// Copy query function
function copyQuery(exampleNumber) {
    const queryElement = document.getElementById(`example${exampleNumber}Query`);
    const text = queryElement.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#4CAF50';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '#0696d7';
        }, 2000);
    });
}

// Example 1: Cross-Hub Element Search
// Store pagination state for Example 1
let example1State = {
    allElements: [],
    cursor: null,
    hubId: null,
    category: null,
    region: null,
    totalLoaded: 0,
    projectMap: {},
    elementGroups: [],
    version: 'latest',
    projectFilter: null
};

// Zoom-in drill state
let zoomState = { active: false };

// Multi-select state for "Show in Viewer"
let selectedEgIds = new Set();
let selectMode = false; // When true, clicks select/deselect instead of zooming

// Zoom-view element selection state
let selectedZoomElementIds = new Set(); // AEC DM element IDs selected in the zoom treemap

// Preferred parameter names shown first in the "Group by" dropdown
const PREFERRED_PROPS = ['Type Name', 'Level', 'Fire Rating', 'Width', 'Height', 'Mark', 'Phase Created'];

// Pre-fetch projects and their element groups to build a projectName lookup map
async function buildProjectElementGroupMap(hubId, region) {
    const projectsQuery = `
        query GetProjects($hubId: ID!) {
            projects(hubId: $hubId) {
                results { id name }
            }
        }
    `;
    const projectsResult = await executeGraphQLQuery(projectsQuery, { hubId }, region);
    if (projectsResult.errors) throw new Error('Failed to fetch projects: ' + projectsResult.errors[0].message);

    const projects = projectsResult.data.projects.results || [];
    logDebug(`Pre-fetching element groups for ${projects.length} projects...`);

    const egQuery = `
        query GetEGs($projectId: ID!, $pagination: PaginationInput) {
            elementGroupsByProject(projectId: $projectId, pagination: $pagination) {
                pagination { cursor }
                results { id name alternativeIdentifiers { fileVersionUrn } }
            }
        }
    `;

    const map = {};
    const list = [];

    // Sequential batches of 3 to avoid overwhelming the API
    const batchSize = 3;
    for (let i = 0; i < projects.length; i += batchSize) {
        const batch = projects.slice(i, i + batchSize);
        await Promise.all(batch.map(async (project) => {
            let egCursor = null;
            do {
                try {
                    const egResult = await executeGraphQLQuery(egQuery, {
                        projectId: project.id,
                        pagination: { limit: 100, ...(egCursor ? { cursor: egCursor } : {}) }
                    }, region);
                    const data = egResult.data?.elementGroupsByProject;
                    (data?.results || []).forEach(eg => {
                        map[eg.id] = project.name;
                        list.push({ id: eg.id, name: eg.name, projectName: project.name, fileVersionUrn: eg.alternativeIdentifiers?.fileVersionUrn || null });
                    });
                    egCursor = data?.pagination?.cursor || null;
                } catch (err) {
                    logDebug(`Failed to get element groups for project ${project.name}:`, err.message);
                    egCursor = null;
                }
            } while (egCursor);
        }));
        logDebug(`Project map progress: ${Math.min(i + batchSize, projects.length)}/${projects.length} projects scanned, ${list.length} models found`);
    }

    logDebug(`Project map built: ${list.length} element groups across ${projects.length} projects`);
    return { map, list };
}

// Fetch elements at version 1 (oldest) across all element groups
// onProgress(accumulatedElements) is called as soon as each model resolves
async function fetchAllAtVersion1(elementGroups, category, region, onProgress) {
    const filter = { query: `property.name.category=='${category}'` };
    const query = `
        query GetElementsByEGAtV1($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, filter: $filter, pagination: $pagination) {
                results {
                    id
                    name
                    elementGroup { id name }
                }
            }
        }
    `;

    const allElements = [];
    let processedCount = 0;

    for (const eg of elementGroups) {
        let elements = [];
        try {
            const result = await executeGraphQLQuery(query, {
                elementGroupId: eg.id,
                filter,
                pagination: {}
            }, region);
            elements = result.data?.elementsByElementGroupAtVersion?.results || [];
        } catch (err) {
            logDebug(`Skipped ${eg.name}: ${err.message.slice(0, 80)}`);
        }

        allElements.push(...elements);
        processedCount++;

        document.getElementById('example1Stats').textContent =
            `Loading oldest versions: ${processedCount}/${elementGroups.length} models checked, ${allElements.length} ${category} found...`;

        if (elements.length > 0 && onProgress) {
            onProgress([...allElements]);
            // Yield to the browser so the treemap repaint happens before the next query
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    return allElements;
}

async function executeExample1() {
    const hubSelect = document.getElementById('hubSelect');
    const hubId = hubSelect.value;
    const category = document.getElementById('categorySelect')?.value || '';

    if (!hubId) { alert('Please select a hub first'); return; }

    const selectedOption = hubSelect.options[hubSelect.selectedIndex];
    const region = selectedOption.dataset.region || 'US';
    const version = document.querySelector('input[name="versionSelect"]:checked')?.value || 'latest';

    example1State = {
        allElements: [],
        fileSummary: [],
        cursor: null,
        hubId,
        category,
        region,
        totalLoaded: 0,
        projectMap: {},
        elementGroups: [],
        version,
        projectFilter: null,
        _queryBarShown: false
    };
    // Restore action bar visibility for the new query
    const _actionBar = document.getElementById('queryActionBar');
    if (_actionBar) _actionBar.style.display = 'none';

    document.getElementById('example1Loading').style.display = 'flex';
    document.getElementById('example1Treemap').innerHTML = '';
    const _sb = document.getElementById('treemapSearchBar');
    if (_sb) { _sb.style.display = 'none'; document.getElementById('treemapSearchInput').value = ''; }
    document.getElementById('example1Stats').textContent = 'Starting query...';
    document.getElementById('example1Stats').style.color = '';
    document.getElementById('loadMoreBtn').style.display = 'none';
    selectedEgIds.clear();
    selectMode = false;
    window._paramNamesCache    = {};   // reset prefetch cache on new query
    window._paramApiNameCache  = {};
    window._paramNamesPromises = {};
    const smBtn = document.getElementById('selectModeBtn');
    if (smBtn) { smBtn.style.display = 'none'; smBtn.classList.remove('active'); }
    updateViewerButton();

    try {
        if (version === 'v1') {
            await executeV1Query(hubId, category, region);
        } else {
            await executeLatestQuery(hubId, category, region);
        }
        // Show the "Select Files" button now that results are loaded
        const selBtn = document.getElementById('selectModeBtn');
        if (selBtn) selBtn.style.display = '';
    } catch (error) {
        logError('Example 1 execution failed', error);
        const isTimeout = error.message.includes('504') || error.message.includes('timeout') || error.message.includes('Time-out');
        if (!isTimeout) {
            alert(`Query failed: ${error.message}`);
        }
        if (example1State.totalLoaded === 0) {
            document.getElementById('example1Stats').textContent = isTimeout ? 'Request timed out. Try again.' : `Error: ${error.message}`;
            document.getElementById('example1Stats').style.color = '#f44336';
        }
    } finally {
        document.getElementById('example1Loading').style.display = 'none';
    }
}

// ── Background param-name prefetch ────────────────────────────────────────────
// _paramNamesCache   : egId → Set<string>  (display names, completed fetches)
// _paramApiNameCache : egId → Map<displayName, apiName>
//   Some Revit params appear with underscores in element data (Fire_Resistance_Rating)
//   but the API's distinctPropertyValues / filter queries require spaces (Fire Resistance Rating).
//   This map translates display → API name transparently.
// _paramNamesPromises: egId → Promise<Set<string>>  (in-progress OR done)
window._paramNamesCache    = window._paramNamesCache    || {};
window._paramApiNameCache  = window._paramApiNameCache  || {};
window._paramNamesPromises = window._paramNamesPromises || {};

const _propDefQuery = `
    query GetPropDefs($elementGroupId: ID!, $pagination: PaginationInput) {
        propertyDefinitionsByElementGroup(elementGroupId: $elementGroupId, pagination: $pagination) {
            pagination { cursor }
            results { name }
        }
    }`;

// Sample query: first page of elements to catch params not in property definitions
// (propertyDefinitionsByElementGroup only returns formally-registered defs;
//  element-level properties like Fire_Resistance_Rating require sampling actual elements)
const _elemSampleQuery = `
    query SampleEls($elementGroupId: ID!, $pagination: PaginationInput) {
        elementsByElementGroup(elementGroupId: $elementGroupId, pagination: $pagination) {
            pagination { cursor }
            results { properties(pagination: { limit: 500 }) { results { name } } }
        }
    }`;
const _elemSampleQueryV1 = `
    query SampleElsV1($elementGroupId: ID!, $pagination: PaginationInput) {
        elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, pagination: $pagination) {
            pagination { cursor }
            results { properties(pagination: { limit: 500 }) { results { name } } }
        }
    }`;

function _prefetchParamNames(egId, region) {
    // Return existing promise (in-progress or resolved) — never double-fetch
    if (window._paramNamesPromises[egId]) return window._paramNamesPromises[egId];

    const isV1 = example1State.version === 'v1';

    const promise = (async () => {
        const names  = new Set();
        const apiMap = new Map();   // displayName → apiName

        // ── Part 1: property definitions (fast, paginated) ────────────────────
        let cursor = null;
        do {
            try {
                const r = await executeGraphQLQuery(_propDefQuery, {
                    elementGroupId: egId,
                    pagination: cursor ? { cursor, limit: 200 } : { limit: 200 }
                }, region);
                const data = r.data?.propertyDefinitionsByElementGroup;
                for (const def of (data?.results || [])) {
                    if (def.name) { names.add(def.name); apiMap.set(def.name, def.name); }
                }
                cursor = data?.pagination?.cursor || null;
            } catch (_) { cursor = null; }
        } while (cursor);

        // ── Part 2: sample elements to catch informal properties ──────────────
        // Some Revit parameters (e.g. Fire_Resistance_Rating) only appear on
        // element data, not in the property definitions index.
        // We paginate up to 3 pages of 100 elements (300 total) and stop early
        // once a page adds no new names — giving good coverage without excess latency.
        // IMPORTANT: The API's distinctPropertyValues and filter queries use the
        // space-normalised name.  When an underscore name's spaces-version is
        // already known from definitions, we keep the underscore display name but
        // map it to the spaces API name so queries work correctly.
        try {
            const sampleQuery = isV1 ? _elemSampleQueryV1 : _elemSampleQuery;
            const dataKey     = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
            let sampleCursor = null;
            const MAX_SAMPLE_PAGES = 3;
            for (let page = 0; page < MAX_SAMPLE_PAGES; page++) {
                const r = await executeGraphQLQuery(sampleQuery, {
                    elementGroupId: egId,
                    pagination: sampleCursor ? { cursor: sampleCursor, limit: 100 } : { limit: 100 }
                }, region);
                const pageData = r.data?.[dataKey];
                const results  = pageData?.results || [];
                let newNamesFound = 0;
                for (const el of results) {
                    for (const p of (el.properties?.results || [])) {
                        if (!p.name || names.has(p.name)) continue;
                        const spacesVer = p.name.replace(/_/g, ' ');
                        names.add(p.name);
                        apiMap.set(p.name, names.has(spacesVer) ? spacesVer : p.name);
                        newNamesFound++;
                    }
                }
                sampleCursor = pageData?.pagination?.cursor || null;
                // Stop only if there are no more pages
                if (!sampleCursor) break;
            }
        } catch (_) { /* non-fatal */ }

        window._paramNamesCache[egId]   = names;
        window._paramApiNameCache[egId] = apiMap;
        return names;
    })();

    window._paramNamesPromises[egId] = promise;
    return promise;
}

// Latest mode: same per-file count pipeline as V1, but uses elementsByElementGroup (latest version, no versionNumber)
async function executeLatestQuery(hubId, category, region) {
    const projectsResult = await executeGraphQLQuery(
        `query GetProjects($hubId: ID!) { projects(hubId: $hubId) { results { id name } } }`,
        { hubId }, region
    );
    const projects = projectsResult.data?.projects?.results || [];
    const noCategory = !category;
    document.getElementById('example1Stats').textContent = noCategory
        ? `Found ${projects.length} projects. Retrieving all Revit files…`
        : `Found ${projects.length} projects. Scanning for ${category}...`;
    document.getElementById('loadMoreBtn').style.display = 'none';

    const egQuery = `query GetEGs($projectId: ID!, $pagination: PaginationInput) {
        elementGroupsByProject(projectId: $projectId, pagination: $pagination) {
            pagination { cursor }
            results { id name alternativeIdentifiers { fileVersionUrn } }
        }
    }`;
    const countQuery = `query CountEls($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
        elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
            pagination { cursor }
            results { id }
        }
    }`;
    const filter = category ? { query: `property.name.category=='${category}'` } : null;

    const fileSummary = [];
    let scanned = 0;
    let totalFiles = 0;

    function updateStats() {
        document.getElementById('example1Stats').textContent = noCategory
            ? `${scanned}/${totalFiles || '?'} files scanned — ${fileSummary.length} Revit files found`
            : `${scanned}/${totalFiles || '?'} files scanned — ${category} found in ${fileSummary.length} files`;
    }

    const BATCH = 3;
    for (let i = 0; i < projects.length; i += BATCH) {
        await Promise.all(projects.slice(i, i + BATCH).map(async (project) => {
            let egs = [];
            let egCursor = null;
            do {
                try {
                    const r = await executeGraphQLQuery(egQuery, {
                        projectId: project.id,
                        pagination: { limit: 100, ...(egCursor ? { cursor: egCursor } : {}) }
                    }, region);
                    const data = r.data?.elementGroupsByProject;
                    for (const eg of (data?.results || [])) {
                        egs.push({ id: eg.id, name: eg.name, projectName: project.name,
                            fileVersionUrn: eg.alternativeIdentifiers?.fileVersionUrn || null });
                    }
                    egCursor = data?.pagination?.cursor || null;
                } catch (err) {
                    logDebug(`EG fetch failed for project ${project.name}: ${err.message.slice(0, 80)}`);
                    egCursor = null;
                }
            } while (egCursor);

            totalFiles += egs.length;

            if (noCategory) {
                // No category filter — list all files immediately, equal-size tiles
                for (const eg of egs) {
                    fileSummary.push({ egId: eg.id, egName: eg.name, projectName: project.name, count: 1, hasMore: false, fileVersionUrn: eg.fileVersionUrn });
                    _prefetchParamNames(eg.id, region);  // fire-and-forget
                }
                scanned += egs.length;
                createTreemapVisualization([...fileSummary], 'All Files');
                updateStats();
                await new Promise(r => setTimeout(r, 0));
            } else {
                updateStats();
                await Promise.all(egs.map(async (eg) => {
                    try {
                        const r = await executeGraphQLQuery(countQuery, { elementGroupId: eg.id, filter, pagination: { limit: 1 } }, region);
                        const data = r.data?.elementsByElementGroup;
                        const count = data?.results?.length || 0;
                        const hasMore = !!(data?.pagination?.cursor);
                        if (count > 0) {
                            fileSummary.push({ egId: eg.id, egName: eg.name, projectName: project.name, count, hasMore, fileVersionUrn: eg.fileVersionUrn });
                            _prefetchParamNames(eg.id, region);  // fire-and-forget
                            createTreemapVisualization([...fileSummary], category);
                            await new Promise(r => setTimeout(r, 0));
                        }
                    } catch (err) {
                        logDebug(`Skipped ${eg.name}: ${err.message.slice(0, 80)}`);
                    }
                    scanned++;
                    updateStats();
                }));
            }
        }));
    }

    example1State.fileSummary = fileSummary;
    document.getElementById('example1Stats').textContent = noCategory
        ? `${fileSummary.length} Revit files across ${projects.length} projects (click a file to inspect)`
        : `Found ${category} in ${fileSummary.length} of ${totalFiles} files (click a file to inspect)`;
}

// V1 mode: parallel count-only scan — just count elements per file, no element IDs stored
// Full element details are fetched on-demand when user zooms in
async function executeV1Query(hubId, category, region) {
    const projectsResult = await executeGraphQLQuery(
        `query GetProjects($hubId: ID!) { projects(hubId: $hubId) { results { id name } } }`,
        { hubId }, region
    );
    const projects = projectsResult.data?.projects?.results || [];
    const noCategory = !category;
    document.getElementById('example1Stats').textContent = noCategory
        ? `Found ${projects.length} projects. Retrieving all Revit files…`
        : `Found ${projects.length} projects. Scanning for ${category}...`;

    const egQuery = `query GetEGs($projectId: ID!, $pagination: PaginationInput) {
        elementGroupsByProject(projectId: $projectId, pagination: $pagination) {
            pagination { cursor }
            results { id name alternativeIdentifiers { fileVersionUrn } }
        }
    }`;
    const countQuery = `query CountEls($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
        elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, filter: $filter, pagination: $pagination) {
            pagination { cursor }
            results { id }
        }
    }`;
    const filter = category ? { query: `property.name.category=='${category}'` } : null;

    const fileSummary = [];
    let scanned = 0;
    let totalFiles = 0;

    function updateStats() {
        document.getElementById('example1Stats').textContent = noCategory
            ? `${scanned}/${totalFiles || '?'} files scanned — ${fileSummary.length} Revit files found`
            : `${scanned}/${totalFiles || '?'} files scanned — ${category} found in ${fileSummary.length} files`;
    }

    // Pipeline: batches of 3 projects to avoid rate-limiting (same as buildProjectElementGroupMap).
    const BATCH_V1 = 3;
    for (let i = 0; i < projects.length; i += BATCH_V1) {
        await Promise.all(projects.slice(i, i + BATCH_V1).map(async (project) => {
        let egs = [];
        let egCursor = null;
        do {
            try {
                const r = await executeGraphQLQuery(egQuery, {
                    projectId: project.id,
                    pagination: { limit: 100, ...(egCursor ? { cursor: egCursor } : {}) }
                }, region);
                const data = r.data?.elementGroupsByProject;
                for (const eg of (data?.results || [])) {
                    egs.push({ id: eg.id, name: eg.name, projectName: project.name,
                        fileVersionUrn: eg.alternativeIdentifiers?.fileVersionUrn || null });
                }
                egCursor = data?.pagination?.cursor || null;
            } catch (err) {
                logDebug(`EG fetch failed for project ${project.name}: ${err.message.slice(0, 80)}`);
                egCursor = null;
            }
        } while (egCursor);

        totalFiles += egs.length;

        if (noCategory) {
            for (const eg of egs) {
                fileSummary.push({ egId: eg.id, egName: eg.name, projectName: project.name, count: 1, hasMore: false, fileVersionUrn: eg.fileVersionUrn });
                _prefetchParamNames(eg.id, region);  // fire-and-forget
            }
            scanned += egs.length;
            createTreemapVisualization([...fileSummary], 'All Files');
            updateStats();
            await new Promise(r => setTimeout(r, 0));
        } else {
            updateStats();
        // Immediately count all files in this project in parallel
        await Promise.all(egs.map(async (eg) => {
            try {
                const r = await executeGraphQLQuery(countQuery, { elementGroupId: eg.id, filter, pagination: { limit: 1 } }, region);
                const data = r.data?.elementsByElementGroupAtVersion;
                const count = data?.results?.length || 0;
                const hasMore = !!(data?.pagination?.cursor);
                if (count > 0) {
                    fileSummary.push({ egId: eg.id, egName: eg.name, projectName: project.name, count, hasMore, fileVersionUrn: eg.fileVersionUrn });
                    _prefetchParamNames(eg.id, region);  // fire-and-forget
                    createTreemapVisualization([...fileSummary], category);
                    await new Promise(r => setTimeout(r, 0)); // yield for repaint
                }
            } catch (err) {
                logDebug(`Skipped ${eg.name}: ${err.message.slice(0, 80)}`);
            }
            scanned++;
            updateStats();
        }));
        }
        }));
    }

    example1State.fileSummary = fileSummary;
    document.getElementById('example1Stats').textContent = noCategory
        ? `${fileSummary.length} Revit files across ${projects.length} projects (click a file to inspect)`
        : `Found ${category} in ${fileSummary.length} of ${totalFiles} files (click a file to inspect)`;
}

async function loadMoreExample1() {
    if (!example1State.cursor) {
        return;
    }
    
    document.getElementById('example1Loading').style.display = 'flex';
    await fetchExample1Batch(false); // false = manual mode, show Load More on success
}

// autoPaginate: true = hide Load More on success; false = show Load More on success (manual mode)
async function fetchExample1Batch(autoPaginate = false) {
    try {
        // RSQL filter - simplified to just category
        const filter = {
            query: `property.name.category=='${example1State.category}'`
        };
        
        // Hub-level query with minimal fields and pagination
        const query = `
            query GetElementsByHub($hubId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
                elementsByHub(hubId: $hubId, filter: $filter, pagination: $pagination) {
                    pagination {
                        pageSize
                        cursor
                    }
                    results {
                        id
                        name
                        elementGroup {
                            id
                            name
                        }
                    }
                }
            }
        `;
        
        const variables = {
            hubId: example1State.hubId,
            filter: filter,
            pagination: {}
        };
        
        // Add cursor to pagination if it exists
        if (example1State.cursor) {
            variables.pagination.cursor = example1State.cursor;
        }
        
        logDebug('Executing Example 1 hub query', { 
            hubId: example1State.hubId, 
            category: example1State.category, 
            region: example1State.region,
            cursor: example1State.cursor 
        });
        
        const result = await executeGraphQLQuery(query, variables, example1State.region);
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        const newElements = result.data.elementsByHub.results;
        const newCursor = result.data.elementsByHub.pagination?.cursor;
        
        // Accumulate elements
        example1State.allElements = example1State.allElements.concat(newElements);
        example1State.cursor = newCursor;
        example1State.totalLoaded = example1State.allElements.length;

        // Rebuild fileSummary from all accumulated elements
        const summaryMap = {};
        example1State.allElements.forEach(el => {
            const egId = el.elementGroup?.id;
            if (!egId) return;
            const egName = el.elementGroup?.name || 'Unknown';
            const projectName = (example1State.projectMap && example1State.projectMap[egId]) || egName;
            if (!summaryMap[egId]) summaryMap[egId] = { egId, egName, projectName, count: 0, hasMore: !!newCursor };
            summaryMap[egId].count++;
        });
        example1State.fileSummary = Object.values(summaryMap);
        
        // Update stats
        const statsText = `Found ${example1State.totalLoaded} ${example1State.category} elements across all projects${newCursor ? ' (more available)' : ''}`;
        document.getElementById('example1Stats').textContent = statsText;
        
        if (!autoPaginate) {
            document.getElementById('loadMoreBtn').style.display = newCursor ? 'block' : 'none';
        }
        
        createTreemapVisualization(example1State.fileSummary, example1State.category);
        
        logDebug(`Example 1 batch completed: ${newElements.length} new elements, ${example1State.totalLoaded} total`);
        return !!newCursor;
        
    } catch (error) {
        logError('Example 1 execution failed', error);

        // Check if this is a timeout and we already have some data
        const isTimeout = error.message.includes('504') || error.message.includes('timeout') || error.message.includes('Time-out');

        if (isTimeout && example1State.totalLoaded > 0) {
            const statsText = `Found ${example1State.totalLoaded} ${example1State.category} elements (timed out — click Load More to retry)`;
            document.getElementById('example1Stats').textContent = statsText;
            document.getElementById('example1Stats').style.color = '#ff9800';
            document.getElementById('loadMoreBtn').style.display = 'block'; // always show retry button
            // Keep example1State.cursor so Load More can retry the same page
            logDebug(`API timed out after loading ${example1State.totalLoaded} elements - displaying partial results`);
        } else if (isTimeout) {
            document.getElementById('example1Stats').textContent = 'Query timed out. Try choosing a smaller hub or use the "Load More" approach.';
            document.getElementById('example1Stats').style.color = '#f44336';
        } else {
            document.getElementById('example1Stats').textContent = `Error: ${error.message}`;
            document.getElementById('example1Stats').style.color = '#f44336';
        }
    } finally {
        document.getElementById('example1Loading').style.display = 'none';
    }
}

// Create D3 Treemap Visualization
// fileSummary: [{egId, egName, projectName, count, hasMore}]
function createTreemapVisualization(fileSummary, category) {
    // On first render after a real query: swap Execute Query for action bar
    if (!example1State._queryBarShown) {
        example1State._queryBarShown = true;
        const actionBar = document.getElementById('queryActionBar');
        if (actionBar) actionBar.style.display = 'flex';
    }
    const container = document.getElementById('example1Treemap');
    container.innerHTML = '';

    // Project zoom: filter to a single project when active
    const activeProjectFilter = example1State.projectFilter || null;
    let files = fileSummary.filter(f => f.count > 0);
    if (activeProjectFilter) files = files.filter(f => f.projectName === activeProjectFilter);

    if (files.length === 0) {
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: #999;">No elements found</div>';
        return;
    }

    // Project breadcrumb when zoomed
    if (activeProjectFilter) {
        const crumb = document.createElement('div');
        crumb.className = 'zoom-bar';
        crumb.style.marginBottom = '8px';
        crumb.innerHTML =
            `<button class="btn-zoom-back" onclick="example1State.projectFilter=null;createTreemapVisualization(example1State.fileSummary,example1State.category)">← All Projects</button>` +
            `<span style="font-weight:600;color:#3c3c3c;">${activeProjectFilter}</span>` +
            `<span style="opacity:0.55;font-size:11px;">· click file to inspect · ⇧+click to select</span>`;
        container.appendChild(crumb);
    }

    // Group: projectName → [fileSummary entries]
    const byProject = {};
    files.forEach(f => {
        if (!byProject[f.projectName]) byProject[f.projectName] = [];
        byProject[f.projectName].push(f);
    });

    // Build D3 hierarchy: Root → Project → Category → RVT File (leaf)
    const data = {
        name: 'Results',
        children: Object.keys(byProject).map(projectName => ({
            name: projectName,
            children: [{
                name: category || 'All Files',
                children: byProject[projectName].map(f => ({
                    name: f.egName,
                    value: f.count,
                    egId: f.egId,
                    hasMore: f.hasMore,
                    projectName: f.projectName,
                    modelName: f.egName
                }))
            }]
        }))
    };

    // Subtract horizontal padding (25px each side) so SVG fits inside container
    const style = window.getComputedStyle(container);
    const hPad = parseFloat(style.paddingLeft || 0) + parseFloat(style.paddingRight || 0);
    const width = Math.max(200, (container.clientWidth || 1000) - hPad);
    const projectNames = Object.keys(byProject);

    // Fit treemap to the visible viewport — no scrolling
    const containerRect = container.getBoundingClientRect();
    const height = Math.max(300, window.innerHeight - Math.max(containerRect.top, 60) - 20);

    // Light pastel palette — readable with black text
    const LIGHT_PALETTE = [
        '#aed6f1','#a9dfbf','#f9e79f','#f5cba7','#d2b4de',
        '#a3d8d8','#f1948a','#abebc6','#fad7a0','#c9cfe8'
    ];
    // Always build the color scale from ALL project names (not the filtered subset)
    // so that zoomed-in tiles keep the same colour they had in the overview.
    const allProjectNames = Object.keys(
        (example1State.fileSummary || []).reduce((acc, f) => { acc[f.projectName] = true; return acc; }, {})
    );
    const color = d3.scaleOrdinal()
        .domain(allProjectNames.length ? allProjectNames : projectNames)
        .range(LIGHT_PALETTE);

    const treemap = d3.treemap()
        .size([width, height])
        .paddingTop(d => d.depth === 0 ? 0 : d.depth === 1 ? 24 : 18)
        .paddingRight(d => d.depth >= 1 ? 4 : 0)
        .paddingBottom(d => d.depth >= 1 ? 4 : 0)
        .paddingLeft(d => d.depth >= 1 ? 4 : 0)
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

    // Draw all non-root nodes
    const node = svg.selectAll('g')
        .data(root.descendants().filter(d => d.depth > 0))
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.append('rect')
        .attr('width', d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill', d => {
            if (d.depth === 1) return color(d.data.name) + '28';    // Project bg
            if (d.depth === 2) return color(d.parent.data.name) + '18'; // Category bg
            return color(d.data.projectName);                             // RVT file leaf (light)
        })
        .attr('stroke', d => {
            if (d.data.egId && selectedEgIds.has(d.data.egId)) return '#FFD600';
            if (d.depth === 1) return color(d.data.name);
            if (d.depth === 2) return color(d.parent.data.name) + '60';
            return 'white';
        })
        .attr('stroke-width', d => {
            if (d.data.egId && selectedEgIds.has(d.data.egId)) return 3;
            return d.depth === 1 ? 2 : 1;
        })
        .attr('rx', d => d.depth <= 2 ? 4 : 2)
        .attr('opacity', d => {
            if (d.data.egId && selectedEgIds.has(d.data.egId)) return 1;
            return d.depth === 3 ? 0.85 : 1;
        })
        .style('filter', d => d.data.egId && selectedEgIds.has(d.data.egId) ? 'drop-shadow(0 0 6px rgba(255,214,0,0.85))' : null)
        .attr('data-egid', d => d.depth === 3 ? d.data.egId : null)
        .style('cursor', d => d.depth === 1 ? 'zoom-in' : 'default')
        .on('mouseover', function(event, d) {
            if (d.depth === 3) {
                if (!selectedEgIds.has(d.data.egId)) {
                    d3.select(this).attr('opacity', 1).attr('stroke', '#fff').attr('stroke-width', 3);
                }
                showTooltip(event, d);
            }
        })
        .on('mouseout', function(event, d) {
            if (d.depth === 3) {
                const isSelected = selectedEgIds.has(d.data.egId);
                d3.select(this)
                    .attr('opacity', isSelected ? 1 : 0.85)
                    .attr('stroke', isSelected ? '#FFD600' : 'white')
                    .attr('stroke-width', isSelected ? 3 : 1)
                    .style('filter', isSelected ? 'drop-shadow(0 0 6px rgba(255,214,0,0.85))' : null);
                hideTooltip();
            }
        });

    // Stamp data attributes onto the leaf g nodes (for event delegation below)
    node.filter(d => !!d.data.egId)
        .attr('data-egid', d => d.data.egId)
        .attr('data-egname', d => d.data.name)
        .attr('data-projectname', d => d.data.projectName)
        .style('cursor', 'default');

    // Stamp project-zoom attribute onto depth-1 (project header) g nodes
    node.filter(d => d.depth === 1)
        .attr('data-projectzoom', d => d.data.name)
        .style('cursor', 'zoom-in');

    // Project labels (depth 1)
    node.filter(d => d.depth === 1).each(function(d) {
        const w = d.x1 - d.x0;
        const g = d3.select(this);
        const HINT_TEXT = 'click to zoom into project';
        const HINT_W = HINT_TEXT.length * 6.5 + 16; // approx px width of hint
        const maxChars = Math.floor((w - 12) / 7);
        const label = d.data.name.length > maxChars ? d.data.name.slice(0, maxChars - 1) + '…' : d.data.name;
        const labelPxW = label.length * 7 + 12;
        g.append('text')
            .attr('x', 6).attr('y', 16)
            .text(label)
            .attr('font-size', '12px').attr('fill', '#1a1a1a').attr('font-weight', '700')
            .style('pointer-events', 'none');
        // Show zoom hint only if there's room alongside the project name
        if (w > 130 && !activeProjectFilter && (labelPxW + HINT_W) <= w) {
            g.append('text')
                .attr('x', w - 5).attr('y', 16)
                .attr('text-anchor', 'end')
                .text(HINT_TEXT)
                .attr('font-size', '9px').attr('fill', '#555').attr('opacity', 0.55)
                .style('pointer-events', 'none');
        }
    });

    // Category labels (depth 2)
    node.filter(d => d.depth === 2)
        .append('text')
        .attr('x', 4)
        .attr('y', 14)
        .text(d => (d.x1 - d.x0) > 70 ? d.data.name : '')
        .attr('font-size', '10px')
        .attr('fill', '#333')
        .attr('font-weight', '600')
        .attr('opacity', 0.8)
        .style('pointer-events', 'none');

    // RVT file labels (depth 3 = leaves)
    node.filter(d => d.depth === 3)
        .each(function(d) {
            const w = d.x1 - d.x0;
            const h = d.y1 - d.y0;
            if (w < 18 || h < 14) return;

            const g = d3.select(this);
            const fileName = (d.data.name || '(unnamed)').replace(/\.rvt$/i, '');
            const maxChars = Math.max(4, Math.floor(w / 7));
            const displayName = fileName.length > maxChars ? fileName.slice(0, maxChars - 1) + '…' : fileName;

            g.append('text')
                .attr('x', 4).attr('y', 13)
                .text(displayName)
                .attr('font-size', '10px')
                .attr('fill', '#111')
                .attr('font-weight', '600')
                .style('pointer-events', 'none');

            if (h >= 28 && (d.data.value > 1 || d.data.hasMore)) {
                g.append('text')
                    .attr('x', 4).attr('y', 25)
                    .text(`${d.data.value}${d.data.hasMore ? '+' : ''} elements`)
                    .attr('font-size', '9px')
                    .attr('fill', '#444')
                    .style('pointer-events', 'none');
            }
            if (h >= 44) {
                g.append('text')
                    .attr('x', 4).attr('y', h - 6)
                    .text('⇧+click › select')
                    .attr('font-size', '8px')
                    .attr('fill', 'rgba(0,0,0,0.4)')
                    .attr('font-style', 'italic')
                    .style('pointer-events', 'none');
            }
        });

    container.appendChild(svg.node());

    // Native event delegation — catches all clicks on the SVG regardless of D3's event system.
    // Walks up from the click target to find the nearest g[data-egid] (the leaf file tile).
    svg.node().addEventListener('click', function(e) {
        let el = e.target;
        while (el && el !== this) {
            const egId = el.getAttribute && el.getAttribute('data-egid');
            if (egId) {
                const egName = el.getAttribute('data-egname');
                const projectName = el.getAttribute('data-projectname');
                hideTooltip();
                const isMultiSelect = selectMode || e.shiftKey;
                if (isMultiSelect) {
                    e.preventDefault();
                    const rect = el.querySelector('rect');
                    if (selectedEgIds.has(egId)) {
                        selectedEgIds.delete(egId);
                        if (rect) { rect.setAttribute('stroke', 'white'); rect.setAttribute('stroke-width', '1'); rect.setAttribute('opacity', '0.85'); rect.style.filter = ''; }
                    } else {
                        selectedEgIds.add(egId);
                        if (rect) { rect.setAttribute('stroke', '#FFD600'); rect.setAttribute('stroke-width', '3'); rect.setAttribute('opacity', '1'); rect.style.filter = 'drop-shadow(0 0 6px rgba(255,214,0,0.85))'; }
                    }
                    updateViewerButton();
                }
                // Plain click on a file tile intentionally does nothing
                return;
            }
            // Project zoom: click on a project header band zooms into that project
            const pzoom = el.getAttribute && el.getAttribute('data-projectzoom');
            if (pzoom) {
                example1State.projectFilter = pzoom;
                createTreemapVisualization(fileSummary, category);
                return;
            }
            el = el.parentElement;
        }
    });

    createLegend(container, color, projectNames);

    // Show the search bar now that results are rendered
    const searchBar = document.getElementById('treemapSearchBar');
    if (searchBar) {
        searchBar.style.display = 'block';
        const input = document.getElementById('treemapSearchInput');
        if (input) input.value = '';
    }
}

// Filter treemap tiles by file name. Dims non-matching leaf nodes; restores all if query is empty.
function filterTreemap(query) {
    const svg = document.querySelector('#example1Treemap svg');
    if (!svg) return;
    const term = query.trim().toLowerCase();
    svg.querySelectorAll('g[data-egid]').forEach(g => {
        const name = (g.getAttribute('data-egname') || '').toLowerCase();
        const match = !term || name.includes(term);
        g.style.opacity = match ? '' : '0.12';
    });
}

// Filter zoom treemap tiles by group (parameter value). Dims non-matching groups.
function filterZoomTreemap(query) {
    const svg = document.querySelector('.zoom-treemap-area svg');
    if (!svg) return;
    const term = query.trim().toLowerCase();
    // Only target group-level nodes (not individual element leaves which have data-elementid)
    svg.querySelectorAll('g[data-groupval]:not([data-elementid])').forEach(g => {
        const val = (g.getAttribute('data-groupval') || '').toLowerCase();
        g.style.opacity = (!term || val.includes(term)) ? '' : '0.12';
    });
    const panel = document.getElementById('zoomLegendPanel');
    if (panel) {
        panel.querySelectorAll('[data-legend-groupval]').forEach(chip => {
            const val = (chip.getAttribute('data-legend-groupval') || '').toLowerCase();
            chip.style.opacity = (!term || val.includes(term)) ? '' : '0.25';
        });
    }
}

// Create legend (by project name)
function createLegend(container, colorScale, items) {
    const legend = document.createElement('div');
    legend.style.cssText = 'display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; padding: 12px; background: #f8f9fa; border-radius: 6px;';

    items.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = 'display: flex; align-items: center; gap: 6px;';

        const box = document.createElement('div');
        box.style.cssText = `width: 14px; height: 14px; background: ${colorScale(item)}; border-radius: 3px; flex-shrink: 0;`;

        const label = document.createElement('span');
        label.textContent = item;
        label.style.cssText = 'font-size: 12px; color: #333;';

        div.appendChild(box);
        div.appendChild(label);
        legend.appendChild(div);
    });

    container.appendChild(legend);
}

// Tooltip functions
let tooltip = null;

function showTooltip(event, d) {
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 12px 15px;
            border-radius: 6px;
            font-size: 13px;
            pointer-events: none;
            z-index: 10000;
            max-width: 320px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            line-height: 1.6;
        `;
        document.body.appendChild(tooltip);
    }

    const projectName = d.data.projectName || '—';
    const categoryName = d.parent?.data?.name || '—';
    const fileName = d.data.name;
    const count = d.data.value;

    tooltip.innerHTML = `
        <div style="font-weight:700; margin-bottom:6px; font-size:14px;">${fileName}</div>
        <div style="font-size:12px; opacity:0.85;">📁 <strong>Project:</strong> ${projectName}</div>
        <div style="font-size:12px; opacity:0.85;">🏷️ <strong>Category:</strong> ${categoryName}</div>
        <div style="font-size:12px; font-weight:600; margin-top:5px; color:#64b5f6;">🔢 ${(count > 1 || d.data.hasMore) ? `${count}${d.data.hasMore ? '+' : ''} element${count !== 1 ? 's' : ''}` : 'Revit file'}</div>
        <div style="font-size:11px; opacity:0.6; margin-top:4px;">&#x21e7;+click to select</div>
    `;

    tooltip.style.left = (event.clientX + 15) + 'px';
    tooltip.style.top = (event.clientY + 15) + 'px';
    tooltip.style.display = 'block';
}

function hideTooltip() {
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Rounds numeric strings to 2 decimal places; leaves non-numeric values unchanged.
function formatLegendVal(val) {
    const n = Number(val);
    if (!isNaN(n) && isFinite(n) && String(val).trim() !== '' && String(val).includes('.')) {
        return n.toFixed(2);
    }
    return val;
}

// Shared tooltip for zoom treemap tiles.
function showZoomTooltip(event, html) {
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.style.cssText = 'position:fixed;background:rgba(0,0,0,0.88);color:white;padding:10px 14px;border-radius:6px;font-size:13px;pointer-events:none;z-index:10000;max-width:300px;box-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.6;';
        document.body.appendChild(tooltip);
    }
    tooltip.innerHTML = html;
    tooltip.style.left = (event.clientX + 15) + 'px';
    tooltip.style.top  = (event.clientY + 10) + 'px';
    tooltip.style.display = 'block';
}

// Dim all non-matching group tiles to 15% opacity; matching group stays fully visible.
function applyZoomGroupHighlight(container, groupVal) {
    const panel = document.getElementById('example1Treemap') || container;
    panel.querySelectorAll('svg g[data-groupval]').forEach(g => {
        g.style.opacity = g.getAttribute('data-groupval') === groupVal ? '' : '0.4';
    });
    panel.querySelectorAll('[data-legend-groupval]').forEach(chip => {
        const match = chip.getAttribute('data-legend-groupval') === groupVal;
        chip.style.opacity = match ? '1' : '0.3';
        chip.style.boxShadow = match ? '0 0 0 2px #0696d7' : '';
    });
}

// Restore all group tiles and legend chips to normal visibility.
function clearZoomGroupHighlight(container) {
    const panel = document.getElementById('example1Treemap') || container;
    panel.querySelectorAll('svg g[data-groupval]').forEach(g => {
        g.style.opacity = '';
    });
    panel.querySelectorAll('[data-legend-groupval]').forEach(chip => {
        chip.style.opacity = '';
        chip.style.boxShadow = '';
    });
}

// ─── Drill-down zoom view ────────────────────────────────────────────────────

async function zoomIntoFile(egId, egName, projectName) {
    document.getElementById('example1Loading').style.display = 'flex';

    const isV1 = example1State.version === 'v1';
    const filter = { query: `property.name.category=='${example1State.category}'` };

    if (!isV1) {
        // ── FAST PATH (latest) ────────────────────────────────────────────────
        // Fire parallel distinctPropertyValues queries for all preferred props.
        document.getElementById('example1Loading').lastElementChild.textContent = 'Loading overview…';

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

    // ── SLOW PATH (V1 or fallback) ────────────────────────────────────────────
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
            `Loading elements… page ${page}`;
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
        if (badge) badge.textContent = `Loading details… ${elementsWithProps.length}${zoomState.totalCount ? ' / ' + zoomState.totalCount : ''}`;

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
        ? `<span id="zoomLoadingBadge" class="zoom-loading-badge">Loading details…</span>`
        : '';

    // ── Top bar ────────────────────────────────────────
    const bar = document.createElement('div');
    bar.className = 'zoom-bar';
    bar.innerHTML = `
        <button class="btn-zoom-back" onclick="exitZoom()">← Overview</button>
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

    // ── Search bar ─────────────────────────────────────
    const zoomSearchBar = document.createElement('div');
    zoomSearchBar.style.cssText = 'margin-bottom:8px;';
    zoomSearchBar.innerHTML = `<input id="zoomSearchInput" type="text" placeholder="🔍 Filter by value…"
        oninput="filterZoomTreemap(this.value)"
        style="width:100%;box-sizing:border-box;padding:7px 12px;border:1px solid #d0d0d0;border-radius:6px;font-size:13px;outline:none;" />`;
    container.appendChild(zoomSearchBar);

    // ── Treemap + legend side by side ──────────────────
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
            .text(label.length > maxChars ? label.slice(0, maxChars - 1) + '…' : label)
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

    // Legend — sorted by count desc, placed in the right panel
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

    // ── Full mode: individual element tiles ───────────────────────────────────
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
            return label.length > maxChars ? label.slice(0, maxChars - 1) + '…' : label;
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
            const label = (d.data.name || '').length > maxChars ? d.data.name.slice(0, maxChars - 1) + '…' : (d.data.name || '');
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

    // Legend — sorted by count desc, placed in the right panel
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

// ─── Zoom-view element selection → Viewer ────────────────────────────────────

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
        alert('Selected elements have no "Revit Element ID" property — cannot map to viewer objects.');
        return;
    }

    pendingRevitElementIds = revitIds;
    pendingRevitCategory = example1State.category;
    pendingCategoryHighlight = null; // don't also isolate by category
    currentRegion = example1State.region; // ensure viewer knows the region
    openViewerModal([{ id: fileEntry.egId, name: fileEntry.egName, alternativeIdentifiers: { fileVersionUrn: fileEntry.fileVersionUrn } }]);
}

// ─── Treemap multi-select → Viewer ───────────────────────────────────────────

function updateViewerButton() {
    const countEl = document.getElementById('treemapSelectionCount');
    if (!countEl) return;
    const n = selectedEgIds.size;
    countEl.textContent = `${n} file${n !== 1 ? 's' : ''} selected`;
}

function clearTreemapSelection() {
    selectedEgIds.clear();
    updateViewerButton();
    // Redraw treemap to remove highlights (only if overview is shown)
    if (!zoomState.active && example1State.fileSummary?.length) {
        createTreemapVisualization(example1State.fileSummary, example1State.category);
    }
}

function _resetToNewQuery() {
    // Show Execute Query, hide action bar, clear state
    const execBtn = document.getElementById('executeQueryBtn');
    const actionBar = document.getElementById('queryActionBar');
    if (actionBar) actionBar.style.display = 'none';
    selectedEgIds.clear();
    selectMode = false;
    example1State._queryBarShown = false;
    document.getElementById('example1Treemap').innerHTML = '';
    const sb = document.getElementById('treemapSearchBar');
    if (sb) { sb.style.display = 'none'; }
    document.getElementById('example1Stats').textContent = '';
    document.getElementById('loadMoreBtn').style.display = 'none';
}

function toggleSelectMode() {
    selectMode = !selectMode;
    const btn = document.getElementById('selectModeBtn');
    if (btn) {
        btn.classList.toggle('active', selectMode);
        btn.textContent = selectMode ? '✕ Cancel Select' : '⊕ Select Files';
    }
    if (!selectMode) {
        clearTreemapSelection();
    }
}

function showSelectionInViewer() {
    if (selectedEgIds.size === 0) return;

    // Build viewer-compatible file objects from the fileSummary
    const files = (example1State.fileSummary || [])
        .filter(f => selectedEgIds.has(f.egId) && f.fileVersionUrn)
        .map(f => ({ id: f.egId, name: f.egName, alternativeIdentifiers: { fileVersionUrn: f.fileVersionUrn } }));

    if (files.length === 0) {
        alert('No viewable files in selection (missing file version URN). Try using the file browser instead.');
        return;
    }

    // Store category so viewer auto-highlights it after loading
    pendingCategoryHighlight = example1State.category;
    currentRegion = example1State.region; // ensure viewer knows the region
    openViewerModal(files);
}

// ─── Example 1: Compliance Check (Hub-Level) ─────────────────────────────────

// Probe by running distinctPropertyValuesInElementGroupByName on a few sample EGs.
// Tries exact name, then underscore→space, then space→underscore.
// Returns the first variant that produces data, or null.
async function _probeComplianceParamName(sampleEgs, region, category, userInput) {
    const PROBE_Q = `
        query Probe($elementGroupId: ID!, $name: String!, $filter: ElementFilterInput) {
            distinctPropertyValuesInElementGroupByName(
                elementGroupId: $elementGroupId, name: $name, filter: $filter
            ) { results { values(limit: 1) { count } } }
        }
    `;
    const filter  = { query: `property.name.category=='${category}'` };
    const variants = [userInput, userInput.replace(/_/g, ' '), userInput.replace(/ /g, '_')]
        .filter((v, i, a) => a.indexOf(v) === i);

    for (const name of variants) {
        const hits = await Promise.all(sampleEgs.map(async eg => {
            try {
                const r = await executeGraphQLQuery(PROBE_Q, { elementGroupId: eg.id, name, filter }, region, 2);
                const vals = r.data?.distinctPropertyValuesInElementGroupByName?.results?.[0]?.values || [];
                return vals.some(v => v.count > 0);
            } catch { return false; }
        }));
        if (hits.some(Boolean)) return name;
    }
    return null;
}

// Registry: regKey → [revitId, …]  (populated each time compliance renders)
window._complianceElemsRegistry = {};

async function executeExample1Compliance() {
    const hubSelect = document.getElementById('hubSelect');
    const hubId    = hubSelect.value;
    const region   = hubSelect.options[hubSelect.selectedIndex]?.dataset.region || 'US';
    const category = document.getElementById('categorySelect')?.value || '';
    let   paramName     = (document.getElementById('comp1ParamName')?.value || '').trim();
    const allowedRaw    = (document.getElementById('comp1AllowedValues')?.value || '').trim();
    const panel         = document.getElementById('example1CompliancePanel');
    const resultsDiv    = document.getElementById('example1ComplianceResults');
    const treemapDiv    = document.getElementById('example1ComplianceTreemap');

    if (!hubId)      { alert('Please select a Hub first');              return; }
    if (!paramName)  { alert('Please enter a Parameter Name');          return; }
    if (!allowedRaw) { alert('Please enter at least one Allowed Value'); return; }

    const allowedValues = allowedRaw.split(',').map(v => v.trim()).filter(Boolean);

    panel.style.display = 'block';
    if (treemapDiv) treemapDiv.innerHTML = '';
    resultsDiv.innerHTML = `<div style="color:#555;font-size:13px;padding:8px 0;">⏳ Fetching all files in hub…</div>`;
    window._complianceElemsRegistry = {};

    try {
        // Step 1 — discover all element groups across the hub
        const { list: elementGroups } = await buildProjectElementGroupMap(hubId, region);
        if (elementGroups.length === 0) {
            resultsDiv.innerHTML = `<div style="color:#c62828;font-size:13px;padding:8px;">No files found in this hub.</div>`;
            return;
        }

        // Step 2 — Element-level scan: always fetch individual elements to get Revit Element IDs
        const ELEMENT_Q = `
            query ComplianceElements($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
                elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                    pagination { cursor }
                    results {
                        id
                        name
                        properties(pagination: { limit: 500 }) {
                            results { name value }
                        }
                    }
                }
            }
        `;
        const filter = { query: `property.name.category=='${category}'` };
        const BATCH  = 5;

        const paramNormalized = paramName.replace(/_/g, ' ');
        const paramAlt        = paramName.replace(/ /g, '_');
        const matchesProp    = (n) => n === paramName || n === paramNormalized || n === paramAlt;
        const matchesRevitId = (n) => {
            const nl = n.toLowerCase().replace(/\s+/g, '');
            return nl === 'revitelementid' || nl === 'elementid';
        };

        let fileResults = [];
        const globalValueMap = new Map();
        let filesWithData = 0, scanned = 0;

        for (let i = 0; i < elementGroups.length; i += BATCH) {
            await Promise.all(elementGroups.slice(i, i + BATCH).map(async eg => {
                let fileTotal = 0, fileCompliant = 0;
                const fileValues = {};
                const fileElements = []; // individual element records
                try {
                    let cursor = null;
                    do {
                        const res = await executeGraphQLQuery(ELEMENT_Q, {
                            elementGroupId: eg.id,
                            filter,
                            pagination: cursor ? { cursor, limit: 200 } : { limit: 200 }
                        }, region, 2);
                        const data = res.data?.elementsByElementGroup;
                        for (const el of (data?.results || [])) {
                            let paramVal = null, revitId = '';
                            for (const p of (el.properties?.results || [])) {
                                if (paramVal === null && matchesProp(p.name)) paramVal = p.value;
                                if (!revitId && matchesRevitId(p.name)) revitId = String(p.value ?? '');
                            }
                            if (paramVal !== null && paramVal !== undefined) {
                                const key = paramVal === '' ? '(not set)' : String(paramVal);
                                fileValues[key] = (fileValues[key] || 0) + 1;
                                globalValueMap.set(key, (globalValueMap.get(key) || 0) + 1);
                                fileTotal++;
                                const ok = allowedValues.includes(key);
                                if (ok) fileCompliant++;
                                fileElements.push({ revitId, paramValue: key, compliant: ok, elementName: el.name || '' });
                            }
                        }
                        cursor = data?.pagination?.cursor || null;
                    } while (cursor);
                    if (fileTotal > 0) filesWithData++;
                } catch (e) {
                    logDebug(`Compliance scan: skipped ${eg.name}: ${e.message.slice(0, 60)}`);
                }
                if (fileTotal > 0) {
                    fileResults.push({
                        egId: eg.id, egName: eg.name, projectName: eg.projectName || '',
                        fileVersionUrn: eg.fileVersionUrn || null,
                        total: fileTotal, compliant: fileCompliant,
                        violations: fileTotal - fileCompliant, values: fileValues,
                        elements: fileElements
                    });
                }
                scanned++;
            }));
            resultsDiv.innerHTML = `<div style="color:#555;font-size:13px;padding:8px 0;">⏳ Scanned ${scanned}/${elementGroups.length} files…</div>`;
        }

        // Step 3 — render results
        if (globalValueMap.size === 0) {
            resultsDiv.innerHTML =
                `<div style="background:#fff8e1;border-radius:6px;padding:12px;font-size:13px;color:#795548;">` +
                `No <strong>${paramName}</strong> data found for <strong>${category}</strong> across ${elementGroups.length} files.` +
                `<br><span style="font-size:12px;">Check the spelling — AEC DM stores Revit shared parameter names exactly as in Revit (e.g. <code>Fire_Resistance_Rating</code>).</span></div>`;
            return;
        }

        const totalElements  = [...globalValueMap.values()].reduce((s, c) => s + c, 0);
        const compliantCount = [...globalValueMap.entries()].filter(([v]) => allowedValues.includes(v)).reduce((s, [, c]) => s + c, 0);
        const violationCount = totalElements - compliantCount;
        const pct = totalElements > 0 ? Math.round(compliantCount / totalElements * 100) : 0;

        // ── Summary box ──────────────────────────────────────────────────────
        const summaryBg    = violationCount === 0 ? '#e8f5e9' : '#ffebee';
        const summaryColor = violationCount === 0 ? '#2e7d32' : '#c62828';
        let html = `<div style="background:${summaryBg};border-radius:6px;padding:10px 12px;margin-bottom:12px;font-size:13px;">`;
        if (violationCount === 0) {
            html += `<div style="color:#2e7d32;font-weight:bold;">✅ 100% compliant — all ${totalElements.toLocaleString()} elements have allowed values.</div>`;
        } else {
            html += `<div style="color:${summaryColor};font-weight:bold;">⚠️ ${violationCount.toLocaleString()} of ${totalElements.toLocaleString()} elements (${100 - pct}%) have non-allowed values.</div>`;
            html += `<div style="color:#2e7d32;margin-top:2px;">✓ ${compliantCount.toLocaleString()} compliant (${pct}%)</div>`;
        }
        html += `<div style="color:#555;font-size:11px;margin-top:4px;">Scanned ${filesWithData} of ${elementGroups.length} files with <strong>${category}</strong> data · Parameter: <strong>${paramName}</strong></div>`;
        html += `</div>`;
        resultsDiv.innerHTML = html;

        // ── Per-file collapsible sections, sorted by violations desc ─────────
        // Build a global registry key per (fileId, paramValue) → [revitId, …]
        // row key format: `${egId}__${paramValue}`
        const sortedFiles = [...fileResults].sort((a, b) => b.violations - a.violations);
        let regKeySeq = 0;

        for (const f of sortedFiles) {
            // Build per-value buckets for this file
            const valueBuckets = {}; // paramValue → [revitId, …]
            for (const el of f.elements) {
                if (!valueBuckets[el.paramValue]) valueBuckets[el.paramValue] = [];
                if (el.revitId) valueBuckets[el.paramValue].push(el.revitId);
            }

            const section = document.createElement('div');
            section.style.cssText = 'border:1px solid #e0e0e0;border-radius:6px;margin-bottom:8px;overflow:hidden;font-size:12px;';

            // File header
            const filePct    = f.total > 0 ? Math.round(f.compliant / f.total * 100) : 0;
            const headerBg   = f.violations === 0 ? '#e8f5e9' : (filePct >= 80 ? '#fff8e1' : '#ffebee');
            const statusIcon = f.violations === 0 ? '✅' : '⚠️';

            const header = document.createElement('div');
            header.style.cssText = `background:${headerBg};padding:8px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;`;
            header.innerHTML =
                `<span style="font-weight:600;color:#333;">${statusIcon} ${f.egName}</span>` +
                `<span style="display:flex;gap:16px;font-size:11px;align-items:center;">` +
                `<span style="color:#c62828;">${f.violations.toLocaleString()} non-compliant</span>` +
                `<span style="color:#2e7d32;">${f.compliant.toLocaleString()} compliant</span>` +
                (f.projectName ? `<span style="color:#888;">${f.projectName}</span>` : '') +
                `<span class="comp-arrow" style="color:#999;min-width:10px;">${f.violations > 0 ? '▼' : '▶'}</span>` +
                `</span>`;

            const tableWrap = document.createElement('div');
            tableWrap.style.display = f.violations > 0 ? 'block' : 'none';

            // Table header — checkbox col | value | elements | status
            let tableHtml = `<div style="background:#f5f5f5;padding:5px 12px;display:grid;grid-template-columns:24px 1fr 70px 56px;gap:8px;font-weight:600;color:#555;border-top:1px solid #e0e0e0;">`;
            tableHtml += `<span></span><span>${paramName} value</span><span style="text-align:right;">Elements</span><span style="text-align:center;">Status</span>`;
            tableHtml += `</div>`;

            // Rows: one per unique paramValue, sorted by count desc, non-compliant first
            const sorted = Object.entries(f.values).sort((a, b) => {
                const aOk = allowedValues.includes(a[0]) ? 1 : 0;
                const bOk = allowedValues.includes(b[0]) ? 1 : 0;
                if (aOk !== bOk) return aOk - bOk; // non-compliant first
                return b[1] - a[1]; // then by count desc
            });

            for (const [value, count] of sorted) {
                const allowed = allowedValues.includes(value);
                const rowBg   = allowed ? '#fff' : '#fff3f3';
                const badge   = allowed
                    ? `<span style="color:#2e7d32;font-weight:bold;">✓</span>`
                    : `<span style="color:#c62828;font-weight:bold;">✗</span>`;

                // Register ids for this value in this file
                const regKey = `r${regKeySeq++}`;
                window._complianceElemsRegistry[regKey] = valueBuckets[value] || [];

                const cbHtml = `<input type="checkbox" class="comp-row-cb" data-regkey="${regKey}" style="cursor:pointer;accent-color:${allowed ? '#2e7d32' : '#c62828'};">`;

                tableHtml += `<div style="background:${rowBg};padding:5px 12px;border-top:1px solid #f0f0f0;display:grid;grid-template-columns:24px 1fr 70px 56px;gap:8px;align-items:center;">`;
                tableHtml += cbHtml;
                tableHtml += `<span style="color:${allowed ? '#333' : '#c62828'};font-weight:${allowed ? 400 : 600};">${value}</span>`;
                tableHtml += `<span style="text-align:right;color:#555;">${count.toLocaleString()}</span>`;
                tableHtml += `<span style="text-align:center;">${badge}</span>`;
                tableHtml += `</div>`;
            }

            tableWrap.innerHTML = tableHtml;

            header.addEventListener('click', () => {
                const open = tableWrap.style.display !== 'none';
                tableWrap.style.display = open ? 'none' : 'block';
                const arrow = header.querySelector('.comp-arrow');
                if (arrow) arrow.textContent = open ? '▶' : '▼';
            });

            section.appendChild(header);
            section.appendChild(tableWrap);
            resultsDiv.appendChild(section);
        }

        // ── Global "Copy selected IDs" button ────────────────────────────────
        const copyBar = document.createElement('div');
        copyBar.style.cssText = 'margin-top:12px;display:flex;align-items:center;gap:10px;';
        const copySelBtn = document.createElement('button');
        copySelBtn.textContent = '📋 Copy selected IDs';
        copySelBtn.style.cssText = 'padding:8px 16px;font-size:13px;font-weight:600;background:#1565c0;color:white;border:none;border-radius:5px;cursor:pointer;flex:1;';
        const copyFeedback = document.createElement('span');
        copyFeedback.style.cssText = 'font-size:12px;color:#2e7d32;display:none;';
        copySelBtn.addEventListener('click', () => {
            const checked = resultsDiv.querySelectorAll('.comp-row-cb:checked');
            const ids = [];
            checked.forEach(cb => {
                const list = window._complianceElemsRegistry[cb.dataset.regkey] || [];
                ids.push(...list);
            });
            if (ids.length === 0) { alert('No rows checked. Select at least one non-compliant value row.'); return; }
            navigator.clipboard.writeText(ids.join(';'));
            copyFeedback.textContent = `✓ Copied ${ids.length} IDs`;
            copyFeedback.style.display = 'inline';
            setTimeout(() => { copyFeedback.style.display = 'none'; }, 3000);
        });
        copyBar.appendChild(copySelBtn);
        copyBar.appendChild(copyFeedback);
        resultsDiv.appendChild(copyBar);

        // Step 4 — treemap
        if (treemapDiv) {
            renderComplianceTreemap(treemapDiv, fileResults.filter(f => f.total > 0), allowedValues, paramName, category, region);
        }

    } catch (err) {
        resultsDiv.innerHTML = `<div style="color:#c62828;padding:8px;font-size:13px;">Error: ${err.message}</div>`;
        logError('Compliance check failed', err);
    }
}

function renderComplianceTreemap(container, fileResults, allowedValues, paramName, category, region) {
    container.innerHTML = '';
    if (!fileResults || fileResults.length === 0) return;

    const W = container.clientWidth || 700;
    const H = Math.max(260, Math.min(420, Math.round(W * 0.45)));

    // D3 hierarchy: root → project → file
    const byProject = {};
    for (const f of fileResults) {
        const proj = f.projectName || '(No Project)';
        if (!byProject[proj]) byProject[proj] = [];
        byProject[proj].push(f);
    }

    const hierarchyData = {
        name: 'hub',
        children: Object.entries(byProject).map(([proj, files]) => ({
            name: proj,
            children: files.map(f => ({
                name: f.egName,
                egId: f.egId,
                egName: f.egName,
                projectName: f.projectName,
                fileVersionUrn: f.fileVersionUrn || null,
                total: f.total,
                compliant: f.compliant,
                violations: f.violations,
                values: f.values,
                value: f.total
            }))
        }))
    };

    const root = d3.hierarchy(hierarchyData).sum(d => d.value || 0).sort((a, b) => b.value - a.value);
    d3.treemap().size([W, H]).paddingOuter(4).paddingInner(2).paddingTop(18)(root);

    const complianceColor = (f) => {
        if (f.total === 0) return '#e0e0e0';
        const ratio = f.compliant / f.total;
        if (ratio >= 1)   return '#388e3c';
        if (ratio >= 0.8) return '#7cb342';
        if (ratio >= 0.5) return '#ffa726';
        if (ratio >= 0.2) return '#ef5350';
        return '#b71c1c';
    };

    const svg = d3.select(container).append('svg')
        .attr('width', W).attr('height', H)
        .style('font-family', 'sans-serif').style('font-size', '11px');

    // Tooltip div
    let tooltip = document.getElementById('complianceTreemapTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'complianceTreemapTooltip';
        tooltip.style.cssText = 'position:fixed;pointer-events:none;background:rgba(30,30,30,0.92);color:#fff;padding:8px 12px;border-radius:5px;font-size:12px;line-height:1.5;display:none;z-index:9999;max-width:280px;';
        document.body.appendChild(tooltip);
    }

    // Project label cells (depth=1)
    svg.selectAll('.projCell')
        .data(root.descendants().filter(d => d.depth === 1))
        .enter().append('rect')
        .attr('x', d => d.x0).attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0).attr('height', d => d.y1 - d.y0)
        .attr('fill', '#eceff1').attr('stroke', '#90a4ae').attr('stroke-width', 1);

    svg.selectAll('.projLabel')
        .data(root.descendants().filter(d => d.depth === 1))
        .enter().append('text')
        .attr('x', d => d.x0 + 4).attr('y', d => d.y0 + 13)
        .style('fill', '#37474f').style('font-weight', '600').style('font-size', '11px')
        .text(d => d.data.name);

    // File tiles (depth=2)
    const leaves = root.leaves();
    const cells = svg.selectAll('.cell')
        .data(leaves).enter().append('g').attr('class', 'cell');

    cells.append('rect')
        .attr('x', d => d.x0 + 1).attr('y', d => d.y0 + 1)
        .attr('width',  d => Math.max(0, d.x1 - d.x0 - 2))
        .attr('height', d => Math.max(0, d.y1 - d.y0 - 2))
        .attr('rx', 3)
        .attr('fill', d => complianceColor(d.data))
        .attr('stroke', 'white').attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('mousemove', function(event, d) {
            const f = d.data;
            const pct = f.total > 0 ? Math.round(f.compliant / f.total * 100) : 0;
            const vBreakdown = Object.entries(f.values || {})
                .sort((a, b) => b[1] - a[1])
                .map(([v, c]) => {
                    const ok = allowedValues.includes(v);
                    return `<span style="color:${ok ? '#a5d6a7' : '#ef9a9a'}">${ok ? '✓' : '✗'} ${v}: ${c.toLocaleString()}</span>`;
                }).join('<br>');
            tooltip.innerHTML =
                `<strong>${f.name}</strong><br>` +
                `<span style="color:#bbb">${f.projectName}</span><br>` +
                `Total: ${f.total.toLocaleString()} ${category}<br>` +
                `Compliant: ${pct}% (${f.compliant.toLocaleString()})<br>` +
                `Non-compliant: ${f.violations.toLocaleString()}<br>` +
                (vBreakdown ? `<hr style="border:0;border-top:1px solid #555;margin:4px 0">${vBreakdown}` : '');
            tooltip.style.display = 'block';
            tooltip.style.left = (event.clientX + 14) + 'px';
            tooltip.style.top  = (event.clientY - 10) + 'px';
        })
        .on('mouseleave', () => { tooltip.style.display = 'none'; })
        .on('click', function(event, d) {
            const f = d.data;
            if (!f.fileVersionUrn) {
                alert(`No viewable file URN for "${f.egName || f.name}".`);
                return;
            }
            tooltip.style.display = 'none';
            pendingCategoryHighlight = category;
            pendingComplianceHighlight = { paramName, allowedValues };
            currentRegion = region;
            openViewerModal([{ id: f.egId, name: f.egName || f.name, alternativeIdentifiers: { fileVersionUrn: f.fileVersionUrn } }]);
        });

    cells.filter(d => (d.x1 - d.x0) > 30 && (d.y1 - d.y0) > 16)
        .append('text')
        .attr('x', d => d.x0 + 4).attr('y', d => d.y0 + 14)
        .style('fill', 'white').style('font-size', '10px').style('pointer-events', 'none')
        .text(d => {
            const f = d.data;
            const pct = f.total > 0 ? Math.round(f.compliant / f.total * 100) : 0;
            const label = f.name.length > 20 ? f.name.slice(0, 18) + '…' : f.name;
            return `${label} (${pct}%)`;
        });

    // Legend
    const legend = [
        { color: '#388e3c', label: '100% compliant' },
        { color: '#7cb342', label: '≥ 80%' },
        { color: '#ffa726', label: '50–79%' },
        { color: '#ef5350', label: '20–49%' },
        { color: '#b71c1c', label: '< 20%' },
    ];
    const lgDiv = document.createElement('div');
    lgDiv.style.cssText = 'display:flex;gap:14px;flex-wrap:wrap;margin-top:6px;font-size:11px;color:#555;align-items:center;';
    lgDiv.innerHTML = legend.map(l =>
        `<span style="display:inline-flex;align-items:center;gap:4px;">` +
        `<span style="width:12px;height:12px;border-radius:2px;background:${l.color};display:inline-block;"></span>${l.label}</span>`
    ).join('') + `<span style="margin-left:auto;color:#888;">Tile size = element count · Hover for details · Click to open in Viewer</span>`;
    container.appendChild(lgDiv);
}

// ─── Example 2: Material Usage Analysis ──────────────────────────────────────

let example2State = {
    hubId: null,
    region: null,
    category: null,
    materialProp: null,
    fileData: [],     // [{egId, egName, projectName, materials: {mat: count}, total: n}]
    allMaterials: []  // unique material names sorted by global total desc
};

async function executeExample2() {
    const hubSelect = document.getElementById('hub2Select');
    const hubId = hubSelect.value;
    if (!hubId) { alert('Please select a hub first'); return; }

    const category = document.getElementById('category2Select').value;
    if (!category) { alert('Please select an element category'); return; }

    const materialProp = document.getElementById('materialProp2Select').value;
    const region = hubSelect.options[hubSelect.selectedIndex].dataset.region || 'US';

    example2State = { hubId, region, category, materialProp, fileData: [], allMaterials: [] };

    const loadingEl   = document.getElementById('example2Loading');
    const loadingText = document.getElementById('example2LoadingText');
    const chartEl     = document.getElementById('example2Chart');
    const statsEl     = document.getElementById('example2Stats');

    loadingEl.style.display = 'flex';
    chartEl.innerHTML = '';
    statsEl.textContent = 'Building file list...';

    try {
        // 1. Build project/EG map (reuses Example 1's helper)
        const { list: elementGroups } = await buildProjectElementGroupMap(hubId, region);
        const totalFiles = elementGroups.length;

        if (totalFiles === 0) {
            loadingEl.style.display = 'none';
            statsEl.textContent = 'No files found in this hub.';
            return;
        }

        // 2a. Phase A — fast: distinctPropertyValuesInElementGroupByName
        // Works for standard indexed Revit properties. Returns empty for custom shared params.
        const MATERIAL_QUERY = `
            query GetMaterialDist($elementGroupId: ID!, $name: String!, $filter: ElementFilterInput) {
                distinctPropertyValuesInElementGroupByName(
                    elementGroupId: $elementGroupId, name: $name, filter: $filter
                ) {
                    results {
                        values(limit: 500) { value count }
                    }
                }
            }
        `;
        const ELEMENT_Q2 = `
            query GetMaterialElements($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
                elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                    pagination { cursor }
                    results {
                        properties(pagination: { limit: 500 }) {
                            results { name value }
                        }
                    }
                }
            }
        `;

        let fileResults = [];
        let processed = 0;
        const BATCH = 5;
        const catFilter = { query: `property.name.category=='${category}'` };
        const propNorm = materialProp.replace(/_/g, ' ');
        const propAlt  = materialProp.replace(/ /g, '_');
        const matchProp = (n) => n === materialProp || n === propNorm || n === propAlt;

        for (let i = 0; i < elementGroups.length; i += BATCH) {
            const batch = elementGroups.slice(i, i + BATCH);
            await Promise.all(batch.map(async (eg) => {
                try {
                    const res = await executeGraphQLQuery(MATERIAL_QUERY, {
                        elementGroupId: eg.id,
                        name: materialProp,
                        filter: catFilter
                    }, region, 2);

                    const results = res.data?.distinctPropertyValuesInElementGroupByName?.results || [];
                    const materials = {};
                    for (const r of results) {
                        for (const { value, count } of (r.values || [])) {
                            if (value == null || value === '') continue;
                            const key = String(value);
                            materials[key] = (materials[key] || 0) + count;
                        }
                    }
                    const total = Object.values(materials).reduce((s, c) => s + c, 0);
                    if (total > 0) {
                        fileResults.push({ egId: eg.id, egName: eg.name, projectName: eg.projectName, materials, total });
                    }
                } catch (err) {
                    logDebug(`Example2 fast: skipped ${eg.name}: ${err.message.slice(0, 60)}`);
                }
                processed++;
                loadingText.textContent = `Scanning ${processed}/${totalFiles} files… (${fileResults.length} with results)`;
            }));
        }

        // 2b. Phase B — element-level fallback for custom/non-indexed properties
        if (fileResults.length === 0) {
            loadingText.textContent = `Custom property detected — scanning element properties…`;
            fileResults = [];
            processed = 0;

            for (let i = 0; i < elementGroups.length; i += BATCH) {
                const batch = elementGroups.slice(i, i + BATCH);
                await Promise.all(batch.map(async (eg) => {
                    const materials = {};
                    try {
                        let cursor = null;
                        do {
                            const res = await executeGraphQLQuery(ELEMENT_Q2, {
                                elementGroupId: eg.id,
                                filter: catFilter,
                                pagination: cursor ? { cursor, limit: 200 } : { limit: 200 }
                            }, region, 2);
                            const data = res.data?.elementsByElementGroup;
                            for (const el of (data?.results || [])) {
                                for (const p of (el.properties?.results || [])) {
                                    if (matchProp(p.name) && p.value != null && p.value !== '') {
                                        const key = String(p.value);
                                        materials[key] = (materials[key] || 0) + 1;
                                        break;
                                    }
                                }
                            }
                            cursor = data?.pagination?.cursor || null;
                        } while (cursor);
                    } catch (err) {
                        logDebug(`Example2 elements: skipped ${eg.name}: ${err.message.slice(0, 60)}`);
                    }
                    const total = Object.values(materials).reduce((s, c) => s + c, 0);
                    if (total > 0) {
                        fileResults.push({ egId: eg.id, egName: eg.name, projectName: eg.projectName, materials, total });
                    }
                    processed++;
                    loadingText.textContent = `Scanning ${processed}/${totalFiles} files… (${fileResults.length} with results)`;
                }));
            }
        }

        // Sort files by total element count, most elements first
        example2State.fileData = fileResults.sort((a, b) => b.total - a.total);

        // Collect unique material names sorted by global total desc
        const matTotals = {};
        for (const fd of fileResults) {
            for (const [mat, count] of Object.entries(fd.materials)) {
                matTotals[mat] = (matTotals[mat] || 0) + count;
            }
        }
        example2State.allMaterials = Object.keys(matTotals).sort((a, b) => matTotals[b] - matTotals[a]);

        loadingEl.style.display = 'none';
        const totalElements = fileResults.reduce((s, fd) => s + fd.total, 0);
        statsEl.textContent =
            `${totalElements.toLocaleString()} ${category} elements · ` +
            `${fileResults.length} file${fileResults.length !== 1 ? 's' : ''} · ` +
            `${example2State.allMaterials.length} unique "${materialProp}" value${example2State.allMaterials.length !== 1 ? 's' : ''}`;

        if (fileResults.length === 0) {
            chartEl.innerHTML =
                `<div style="padding:48px;text-align:center;color:#666;font-size:15px;">` +
                `No <strong>${category}</strong> elements with <strong>"${materialProp}"</strong> data found in this hub.` +
                `<br><br><span style="font-size:13px;color:#999;">Try a different category or material property.</span></div>`;
            return;
        }

        renderMaterialBarChart(chartEl);

    } catch (err) {
        loadingEl.style.display = 'none';
        statsEl.textContent = '';
        chartEl.innerHTML = `<div style="padding:40px;text-align:center;color:#c00;">Error: ${err.message}</div>`;
        logError('Example2 failed', err);
    }
}

// Render a horizontal stacked bar chart for material distribution
function renderMaterialBarChart(container) {
    container.innerHTML = '';
    const { fileData, allMaterials } = example2State;
    if (!fileData.length || !allMaterials.length) return;

    const BAR_H      = 28;
    const LABEL_W    = 200;
    const margin     = { top: 20, right: 30, bottom: 44, left: LABEL_W };
    const containerW = container.clientWidth || 780;
    const innerW     = containerW - margin.left - margin.right;
    const innerH     = fileData.length * (BAR_H + 6);
    const svgH       = margin.top + innerH + margin.bottom;

    const color = d3.scaleOrdinal(d3.schemeTableau10).domain(allMaterials);

    // D3 stack — one layer per material
    const layers = d3.stack()
        .keys(allMaterials)
        .value((d, key) => d.materials[key] || 0)(fileData);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(fileData, d => d.total)])
        .range([0, innerW]);

    const yScale = d3.scaleBand()
        .domain(fileData.map((_, i) => i))
        .range([0, innerH])
        .paddingInner(0.15);

    const svg = d3.create('svg')
        .attr('width', containerW)
        .attr('height', svgH)
        .style('font-family', 'Arial, sans-serif')
        .style('overflow', 'visible');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Stacked bar segments — one layer per material
    layers.forEach(layer => {
        const matName = layer.key;
        g.selectAll(null)
            .data(layer)
            .join('rect')
            .attr('x', d => xScale(d[0]))
            .attr('y', (d, i) => yScale(i))
            .attr('width', d => Math.max(0, xScale(d[1]) - xScale(d[0])))
            .attr('height', yScale.bandwidth())
            .attr('fill', color(matName))
            .attr('opacity', 0.85)
            .attr('data-mat', matName)
            .on('mousemove', function(event, d) {
                const fd = d.data;
                const cnt = fd.materials[matName] || 0;
                const pct = ((cnt / fd.total) * 100).toFixed(1);
                showZoomTooltip(event,
                    `<strong>${matName}</strong><br>` +
                    `${fd.egName}<br>` +
                    `<span style="opacity:0.8">${cnt.toLocaleString()} elements · ${pct}%` +
                    ` of ${fd.total.toLocaleString()}</span>`
                );
                applyMat2Highlight(svg.node(), container, matName);
            })
            .on('mouseout', function() {
                hideTooltip();
                clearMat2Highlight(svg.node(), container);
            });
    });

    // File name labels on the left
    fileData.forEach((fd, i) => {
        const maxChars = Math.floor(LABEL_W / 7);
        const label = fd.egName.length > maxChars ? fd.egName.slice(0, maxChars - 1) + '…' : fd.egName;
        const txt = g.append('text')
            .attr('x', -8)
            .attr('y', yScale(i) + yScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .attr('font-size', '11px')
            .attr('fill', '#444')
            .text(label);
        txt.append('title').text(`${fd.egName} · ${fd.projectName} · ${fd.total.toLocaleString()} elements`);
    });

    // X axis
    g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(',.0f')))
        .call(ax => ax.select('.domain').attr('stroke', '#ccc'))
        .call(ax => ax.selectAll('.tick line').attr('stroke', '#ddd'));

    // X axis label
    g.append('text')
        .attr('x', innerW / 2)
        .attr('y', innerH + 36)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#888')
        .text('Number of elements');

    container.appendChild(svg.node());

    // Color legend
    const legend = document.createElement('div');
    legend.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;padding:8px 16px 16px;';
    allMaterials.forEach(mat => {
        const total = example2State.fileData.reduce((s, fd) => s + (fd.materials[mat] || 0), 0);
        const chip = document.createElement('div');
        chip.setAttribute('data-mat2-chip', mat);
        chip.style.cssText = 'display:flex;align-items:center;gap:5px;background:#f5f5f5;border-radius:12px;' +
            'padding:3px 10px;font-size:12px;cursor:default;transition:opacity 0.15s,box-shadow 0.15s;';
        chip.innerHTML =
            `<span style="width:10px;height:10px;background:${color(mat)};border-radius:50%;` +
            `display:inline-block;flex-shrink:0;"></span>${mat} <strong>(${total.toLocaleString()})</strong>`;
        chip.addEventListener('mousemove', (event) => {
            showZoomTooltip(event, `<strong>${mat}</strong><br>${total.toLocaleString()} total elements`);
            applyMat2Highlight(svg.node(), container, mat);
        });
        chip.addEventListener('mouseout', () => {
            hideTooltip();
            clearMat2Highlight(svg.node(), container);
        });
        legend.appendChild(chip);
    });
    container.insertBefore(legend, container.firstChild);
}

// Highlight a specific material across bars and legend chips
function applyMat2Highlight(svgNode, container, matName) {
    svgNode.querySelectorAll('rect[data-mat]').forEach(r => {
        r.style.opacity = r.getAttribute('data-mat') === matName ? '1' : '0.2';
    });
    container.querySelectorAll('[data-mat2-chip]').forEach(c => {
        const match = c.getAttribute('data-mat2-chip') === matName;
        c.style.opacity      = match ? '1' : '0.4';
        c.style.boxShadow    = match ? '0 0 0 2px #1976d2' : '';
    });
}

// Restore all materials to normal opacity
function clearMat2Highlight(svgNode, container) {
    svgNode.querySelectorAll('rect[data-mat]').forEach(r => { r.style.opacity = '0.85'; });
    container.querySelectorAll('[data-mat2-chip]').forEach(c => {
        c.style.opacity   = '1';
        c.style.boxShadow = '';
    });
}

// ─── Example 5: Smart Folder Search ──────────────────────────────────────────

let example5State = {
    hubId:            null,
    region:           null,
    projectId:        null,
    projectName:      null,
    folderPath:       [],    // [{id, name, objectCount}] accumulated from root to current level
    currentSubfolders:[],    // subfolders visible at the current level
    fileCounts:       {},    // egId → {name, count}
    totalLoaded:      0,
    activeLoad:       0      // incremented per search; stale async loops check this
};

// ── Project loader (called when hub5Select changes) ──────────────────────────
async function loadExample5Projects() {
    const hubSel = document.getElementById('hub5Select');
    const hubId  = hubSel.value;
    const region = hubSel.options[hubSel.selectedIndex]?.dataset.region || 'US';

    example5State.hubId   = hubId;
    example5State.region  = region;
    example5State.projectId = null;
    example5State.folderPath = [];
    example5State.currentSubfolders = [];

    const projSel = document.getElementById('project5Select');
    projSel.disabled = true;
    projSel.innerHTML = '<option value="">Loading projects…</option>';
    renderExample5FolderBrowser();

    if (!hubId) {
        projSel.innerHTML = '<option value="">Select a hub first…</option>';
        return;
    }

    try {
        const q = `query GetProjects($hubId: ID!) {
            projects(hubId: $hubId) { results { id name } }
        }`;
        const res = await executeGraphQLQuery(q, { hubId }, region);
        const projects = (res.data?.projects?.results || []).sort((a, b) => a.name.localeCompare(b.name));

        projSel.innerHTML = '<option value="">Select Project…</option>';
        projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.name;
            projSel.appendChild(opt);
        });
        projSel.disabled = false;
    } catch (err) {
        projSel.innerHTML = '<option value="">Failed to load projects</option>';
        projSel.disabled = false;
        logError('Example5: load projects failed', err);
    }
}

// ── Top-folder loader (called when project5Select changes) ───────────────────
async function loadExample5TopFolders() {
    const projSel   = document.getElementById('project5Select');
    const projectId = projSel.value;

    example5State.projectId      = projectId || null;
    example5State.projectName    = projSel.options[projSel.selectedIndex]?.textContent || '';
    example5State.folderPath     = [];
    example5State.currentSubfolders = [];

    if (!projectId) { renderExample5FolderBrowser(); return; }

    await _ex5LoadTopFolders();
}

async function _ex5LoadTopFolders() {
    renderExample5FolderBrowser('loading');
    try {
        const q = `query GetTopFolders($projectId: ID!) {
            foldersByProject(projectId: $projectId) {
                results { id name objectCount }
            }
        }`;
        const res = await executeGraphQLQuery(q, { projectId: example5State.projectId }, example5State.region);
        example5State.currentSubfolders = res.data?.foldersByProject?.results || [];
        renderExample5FolderBrowser();
    } catch (err) {
        renderExample5FolderBrowser('error');
        logError('Example5: load top folders failed', err);
    }
}

async function _ex5LoadSubFolders(folderId) {
    renderExample5FolderBrowser('loading');
    try {
        const q = `query GetSubFolders($projectId: ID!, $folderId: ID!) {
            foldersByFolder(projectId: $projectId, folderId: $folderId) {
                results { id name objectCount }
            }
        }`;
        const res = await executeGraphQLQuery(q,
            { projectId: example5State.projectId, folderId }, example5State.region);
        example5State.currentSubfolders = res.data?.foldersByFolder?.results || [];
        renderExample5FolderBrowser();
    } catch (err) {
        renderExample5FolderBrowser('error');
        logError('Example5: load subfolders failed', err);
    }
}

// Navigate into subfolder at `index` in currentSubfolders
async function example5NavigateInto(index) {
    const f = example5State.currentSubfolders[index];
    if (!f) return;
    example5State.folderPath.push({ id: f.id, name: f.name, objectCount: f.objectCount });
    example5State.currentSubfolders = [];
    await _ex5LoadSubFolders(f.id);
}

// Navigate back: levelIndex=-1 means project root, otherwise go to folderPath[levelIndex]
async function example5NavigateTo(levelIndex) {
    if (levelIndex < 0) {
        example5State.folderPath = [];
        example5State.currentSubfolders = [];
        await _ex5LoadTopFolders();
    } else {
        example5State.folderPath = example5State.folderPath.slice(0, levelIndex + 1);
        example5State.currentSubfolders = [];
        await _ex5LoadSubFolders(example5State.folderPath[levelIndex].id);
    }
}

// ── Folder browser renderer ───────────────────────────────────────────────────
function renderExample5FolderBrowser(state) {
    const browser = document.getElementById('example5FolderBrowser');
    if (!browser) return;

    if (!example5State.projectId) {
        browser.innerHTML = `<div style="color:#999;font-size:13px;">Select a project to browse folders</div>`;
        return;
    }

    const breadcrumb = _ex5BreadcrumbHTML();

    if (state === 'loading') {
        browser.innerHTML = breadcrumb +
            `<div style="color:#888;font-size:13px;padding:8px 0;display:flex;align-items:center;gap:8px;">` +
            `<span class="spinner" style="display:inline-block;width:14px;height:14px;border-width:2px;margin:0;flex-shrink:0;"></span>` +
            `Loading folders…</div>`;
        return;
    }

    if (state === 'error') {
        browser.innerHTML = breadcrumb +
            `<div style="color:#c00;font-size:13px;padding:6px 0;">⚠ Failed to load folders</div>`;
        return;
    }

    let html = breadcrumb;
    const subs = example5State.currentSubfolders;

    if (subs.length === 0) {
        const msg = example5State.folderPath.length > 0
            ? '— leaf folder (no subfolders) · click Search Folder to query here'
            : '— no folders found at project root';
        html += `<div style="color:#888;font-size:12px;margin-top:8px;font-style:italic;">${msg}</div>`;
    } else {
        html += `<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:10px;">`;
        subs.forEach((f, i) => {
            const cnt = f.objectCount != null
                ? ` <span style="opacity:0.55;font-size:11px;">(${f.objectCount})</span>`
                : '';
            html += `<button data-ex5idx="${i}"
                style="background:#f0f4ff;border:1px solid #c5d3f0;border-radius:6px;padding:5px 12px;
                       font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;
                       white-space:nowrap;transition:background 0.12s;font-family:inherit;"
                onmouseover="this.style.background='#dce8ff'"
                onmouseout="this.style.background='#f0f4ff'"
                onclick="example5NavigateInto(${i})">
                &#128193; ${f.name}${cnt}
            </button>`;
        });
        html += `</div>`;
    }

    browser.innerHTML = html;
}

function _ex5BreadcrumbHTML() {
    const { projectName, folderPath } = example5State;
    let html = `<div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;font-size:13px;line-height:1.8;">`;

    if (folderPath.length > 0) {
        html += `<span onclick="example5NavigateTo(-1)"
            style="cursor:pointer;color:#1565c0;font-weight:600;"
            title="Back to project root">📦 ${projectName}</span>`;
    } else {
        html += `<span style="color:#333;font-weight:600;">📦 ${projectName}</span>`;
    }

    folderPath.forEach((f, i) => {
        const isLast = i === folderPath.length - 1;
        html += `<span style="color:#bbb;padding:0 2px;">›</span>`;
        if (isLast) {
            html += `<span style="color:#1976d2;font-weight:600;background:#e3f2fd;
                padding:2px 8px;border-radius:4px;">&#128193; ${f.name}</span>`;
        } else {
            html += `<span onclick="example5NavigateTo(${i})"
                style="cursor:pointer;color:#1565c0;">&#128193; ${f.name}</span>`;
        }
    });

    html += `</div>`;
    return html;
}

// ── Query execution ───────────────────────────────────────────────────────────
async function executeExample5() {
    if (!example5State.projectId) { alert('Please select a project first'); return; }

    const fp = example5State.folderPath;
    if (fp.length === 0) { alert('Please navigate into a folder before searching'); return; }

    const selectedFolder = fp[fp.length - 1];
    const category       = document.getElementById('category5Select').value;
    if (!category) { alert('Please select an element category'); return; }

    const includeSubfolders = document.getElementById('include5Subfolders').checked;
    const loadToken = ++example5State.activeLoad;

    const loadingEl   = document.getElementById('example5Loading');
    const loadingText = document.getElementById('example5LoadingText');
    const chartEl     = document.getElementById('example5Chart');
    const statsEl     = document.getElementById('example5Stats');

    loadingEl.style.display = 'flex';
    chartEl.innerHTML = '';
    statsEl.textContent = 'Querying folder…';
    example5State.fileCounts  = {};
    example5State.totalLoaded = 0;

    try {
        if (!includeSubfolders) {
            // ── Shallow: elementsByFolder (exact folder only) ──────────────────
            // Paginate through all elements in this folder, group counts by file.
            const SHALLOW_Q = `
                query SearchFolder($projectId: ID!, $folderId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
                    elementsByFolder(projectId: $projectId, folderId: $folderId, filter: $filter, pagination: $pagination) {
                        pagination { pageSize cursor }
                        results { id elementGroup { id name } }
                    }
                }
            `;
            const filter = { query: `property.name.category=='${category}'` };
            let cursor = null, pageCount = 0;
            do {
                if (example5State.activeLoad !== loadToken) return;
                const res = await executeGraphQLQuery(SHALLOW_Q, {
                    projectId:  example5State.projectId,
                    folderId:   selectedFolder.id,
                    filter,
                    pagination: { limit: 100, ...(cursor ? { cursor } : {}) }
                }, example5State.region, 2);
                if (example5State.activeLoad !== loadToken) return;
                const page    = res.data?.elementsByFolder || {};
                const results = page.results || [];
                cursor = page.pagination?.cursor || null;
                pageCount++;
                results.forEach(el => {
                    const egId = el.elementGroup?.id;
                    if (!egId) return;
                    if (!example5State.fileCounts[egId])
                        example5State.fileCounts[egId] = { name: el.elementGroup?.name || 'Unknown', count: 0 };
                    example5State.fileCounts[egId].count++;
                });
                example5State.totalLoaded += results.length;
                loadingText.textContent =
                    `${example5State.totalLoaded.toLocaleString()} ${category} found` +
                    (cursor ? ' – loading more…' : '');
                if (example5State.totalLoaded > 0) renderExample5Treemap(chartEl);
            } while (cursor && pageCount < 50);

        } else {
            // ── Recursive: elementGroupsByFolderAndSubFolders → fast count per EG ──
            // Get all element groups under the folder tree, then count per EG using
            // distinctPropertyValuesInElementGroupByName (one API call per file).
            const EG_Q = `
                query GetEGsInFolderTree($projectId: ID!, $folderId: ID!) {
                    elementGroupsByFolderAndSubFolders(projectId: $projectId, folderId: $folderId) {
                        results { id name }
                    }
                }
            `;
            const egRes = await executeGraphQLQuery(EG_Q, {
                projectId: example5State.projectId,
                folderId:  selectedFolder.id
            }, example5State.region, 2);
            if (example5State.activeLoad !== loadToken) return;

            const egs = egRes.data?.elementGroupsByFolderAndSubFolders?.results || [];
            loadingText.textContent = `Found ${egs.length} file${egs.length !== 1 ? 's' : ''} – scanning for ${category}…`;

            // Count elements per EG using elementsByElementGroup (same query as Example 1)
            const COUNT_Q = `
                query CountEls($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
                    elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                        pagination { cursor }
                        results { id }
                    }
                }
            `;
            const filter  = { query: `property.name.category=='${category}'` };
            const BATCH   = 5;
            let scanned   = 0;
            for (let i = 0; i < egs.length; i += BATCH) {
                if (example5State.activeLoad !== loadToken) return;
                await Promise.all(egs.slice(i, i + BATCH).map(async eg => {
                    try {
                        let count = 0, cursor = null;
                        do {
                            const res = await executeGraphQLQuery(COUNT_Q, {
                                elementGroupId: eg.id,
                                filter,
                                pagination: { limit: 100, ...(cursor ? { cursor } : {}) }
                            }, example5State.region, 2);
                            const page = res.data?.elementsByElementGroup || {};
                            count += (page.results || []).length;
                            cursor = page.pagination?.cursor || null;
                        } while (cursor && count < 500);

                        if (count > 0) {
                            example5State.fileCounts[eg.id] = { name: eg.name, count };
                            example5State.totalLoaded += count;
                        }
                    } catch (e) {
                        logDebug(`Example5 recursive: skipped ${eg.name}: ${e.message.slice(0, 60)}`);
                    }
                    scanned++;
                }));
                loadingText.textContent =
                    `Scanned ${scanned}/${egs.length} files` +
                    ` – ${example5State.totalLoaded.toLocaleString()} ${category} found`;
                if (example5State.totalLoaded > 0) renderExample5Treemap(chartEl);
            }
        }

        if (example5State.activeLoad !== loadToken) return;

        loadingEl.style.display = 'none';
        const fileCount = Object.keys(example5State.fileCounts).length;
        statsEl.textContent =
            `${example5State.totalLoaded.toLocaleString()} ${category} · ` +
            `${fileCount} file${fileCount !== 1 ? 's' : ''} · ` +
            `📁 ${selectedFolder.name}` +
            (includeSubfolders ? ' + subfolders' : '');

        if (example5State.totalLoaded === 0) {
            chartEl.innerHTML =
                `<div style="padding:48px;text-align:center;color:#666;font-size:15px;">` +
                `No <strong>${category}</strong> elements found in ` +
                `<strong>${selectedFolder.name}</strong>` +
                (includeSubfolders ? ' or its subfolders.' : '.') +
                `<br><br><span style="font-size:13px;color:#999;">Try a different category or folder, or enable "Include subfolders".</span></div>`;
        }
    } catch (err) {
        if (example5State.activeLoad !== loadToken) return;
        loadingEl.style.display = 'none';
        statsEl.textContent = '';
        chartEl.innerHTML = `<div style="padding:40px;text-align:center;color:#c00;">Error: ${err.message}</div>`;
        logError('Example5 failed', err);
    }
}

// ── D3 treemap: elements grouped by file ─────────────────────────────────────
function renderExample5Treemap(container) {
    const entries = Object.entries(example5State.fileCounts)
        .sort((a, b) => b[1].count - a[1].count);
    if (!entries.length) return;

    container.innerHTML = '';

    const W    = container.clientWidth || 760;
    const H    = Math.max(280, Math.min(600, entries.length * 38));
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const root = d3.hierarchy({
        children: entries.map(([egId, { name, count }]) => ({ id: egId, name, value: count }))
    }).sum(d => d.value || 0);

    d3.treemap().size([W, H]).paddingInner(2).paddingOuter(4)(root);

    const svg = d3.create('svg')
        .attr('width', W)
        .attr('height', H)
        .style('font-family', 'Arial, sans-serif');

    const node = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.append('rect')
        .attr('width',  d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill',   d => color(d.data.id))
        .attr('rx', 3)
        .attr('opacity', 0.88);

    node.each(function(d) {
        const w = d.x1 - d.x0, h = d.y1 - d.y0;
        if (w < 28 || h < 14) return;
        const g = d3.select(this);
        const maxChars = Math.max(3, Math.floor(w / 7));
        const label = d.data.name.length > maxChars
            ? d.data.name.slice(0, maxChars - 1) + '…'
            : d.data.name;
        g.append('text')
            .attr('x', 5).attr('y', 15)
            .text(label)
            .attr('font-size', Math.min(13, Math.max(9, h / 3)) + 'px')
            .attr('font-weight', '600')
            .attr('fill', 'white')
            .style('pointer-events', 'none');
        if (h > 30) {
            g.append('text')
                .attr('x', 5).attr('y', 30)
                .text(d.data.value.toLocaleString() + ' elements')
                .attr('font-size', '10px')
                .attr('fill', 'rgba(255,255,255,0.82)')
                .style('pointer-events', 'none');
        }
    });

    node.on('mousemove', (event, d) => {
        showZoomTooltip(event,
            `<strong>${d.data.name}</strong><br>` +
            `<span style="opacity:0.8">${d.data.value.toLocaleString()} elements</span>`
        );
    }).on('mouseout', () => hideTooltip());

    container.appendChild(svg.node());
}

// ── Parameter Explorer ────────────────────────────────────────────────────────

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
        if (paramExplorerZoomState) return;   // don't clobber active zoom
        const treemapDiv = document.getElementById('paramExplorerTreemap');
        if (treemapDiv) _peRenderOverview(_peFilteredAgg() || agg, treemapDiv, /*loading=*/true);
    });
}

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
    window._peHiddenFiles = new Set();
    window._peAllowedValues = [];
    window._peParamAllowedValues = {};
    if (searchInput) { searchInput.style.display = 'none'; searchInput.value = ''; }
    if (backBtn)     backBtn.style.display = 'none';

    const selectedFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId));
    const n = selectedFiles.length;
    subtitle.textContent = `${n} file${n !== 1 ? 's' : ''} — collecting parameter names…`;

    const region = example1State.region;

    // ── Phase 1: collect param names ────────────────────────────────────────
    // For files whose fetch hasn't completed yet, await the in-progress promise
    // (or start a new one).  This correctly handles the race where the background
    // prefetch started but hasn't finished yet — the old code read an empty Set
    // and thought it was done.
    const notReady = selectedFiles.filter(f => !window._paramNamesCache[f.egId]);
    if (notReady.length > 0) {
        let done = 0;
        const CONCURRENCY = 4;
        for (let i = 0; i < notReady.length; i += CONCURRENCY) {
            if (modal.style.display === 'none') return;
            await Promise.all(notReady.slice(i, i + CONCURRENCY).map(async f => {
                await _prefetchParamNames(f.egId, region);   // awaits existing promise if in-flight
                done++;
                progress.textContent = `Collecting parameter names: ${done} / ${notReady.length} files…`;
            }));
        }
    }

    if (modal.style.display === 'none') return;
    loading.style.display = 'none';

    // ── Phase 2: build aggregated param list across all selected files ────────
    // paramName → Set of egIds that have it
    const paramFileMap = new Map();
    for (const f of selectedFiles) {
        const names = window._paramNamesCache[f.egId] || new Set();
        for (const name of names) {
            if (!paramFileMap.has(name)) paramFileMap.set(name, new Set());
            paramFileMap.get(name).add(f.egId);
        }
    }

    const totalParams = paramFileMap.size;
    subtitle.textContent = `${n} file${n !== 1 ? 's' : ''} · ${totalParams} parameters — select which to explore`;

    // Render the checklist
    _peRenderChecklist(paramFileMap, selectedFiles, treemapDiv);
    if (searchInput) searchInput.style.display = '';
}

function _peRenderChecklist(paramFileMap, selectedFiles, container) {
    // Store state so compliance back-navigation can re-render
    window._peLastChecklistState = { paramFileMap, selectedFiles };

    // Sort: params present in most files first, then alphabetically
    const params = Array.from(paramFileMap.entries())
        .map(([name, egIds]) => ({ name, fileCount: egIds.size }))
        .sort((a, b) => b.fileCount - a.fileCount || a.name.localeCompare(b.name));

    const n = selectedFiles.length;

    container.innerHTML = `
        <div id="peChecklist">
            <div id="peChecklistToolbar">
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                    <input type="checkbox" id="peSelectAll" onchange="_peToggleAll(this.checked)">
                    <span>Select all (${params.length})</span>
                </label>
                <span id="peSelectedCount" style="color:#1565c0;font-weight:600;">0 selected</span>
                <button class="btn btn-execute" style="margin-left:auto;padding:7px 18px;"
                    onclick="_peLoadCheckedValues()">
                    Load Values &#8594;
                </button>
            </div>
            <div id="peChecklistBody">
                ${params.map(p => `
                    <label class="pe-param-row">
                        <input type="checkbox" class="pe-param-cb" value="${_peEsc(p.name)}"
                            onchange="_peCountSelected()">
                        <span class="pe-param-name">${_peEsc(p.name)}</span>
                        <span class="pe-param-files">${p.fileCount === n ? 'all files' : `${p.fileCount} / ${n} files`}</span>
                    </label>`).join('')}
            </div>
        </div>`;
}

function _peEsc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
        // checklist phase — no compliance bar yet, nothing to do
    }
}

// filter search on checklist
function filterParamExplorerTreemap(query) {
    const term = query.trim().toLowerCase();
    // checklist mode
    const rows = document.querySelectorAll('.pe-param-row');
    if (rows.length > 0) {
        rows.forEach(row => {
            const name = (row.querySelector('.pe-param-name')?.textContent || '').toLowerCase();
            row.style.display = (!term || name.includes(term)) ? '' : 'none';
        });
        return;
    }
    // treemap mode
    const svg = document.querySelector('#paramExplorerTreemap svg');
    if (!svg) return;
    if (paramExplorerZoomState) {
        svg.querySelectorAll('g[data-peval]').forEach(g => {
            const val = (g.getAttribute('data-peval') || '').toLowerCase();
            g.style.opacity = (!term || val.includes(term)) ? '' : '0.07';
        });
    } else {
        svg.querySelectorAll('g[data-paramname]').forEach(g => {
            const name = (g.getAttribute('data-paramname') || '').toLowerCase();
            g.style.opacity = (!term || name.includes(term)) ? '' : '0.07';
        });
    }
}

// ── (legacy kept for potential external callers) ─────────────────────────────
async function _peRunCompliance_UNUSED() {
    const paramName  = (document.getElementById('peCompParamName')?.value  || '').trim();
    const allowedRaw = (document.getElementById('peCompAllowedValues')?.value || '').trim();

    if (!paramName)  { alert('Please enter a Parameter Name.');            return; }
    if (!allowedRaw) { alert('Please enter at least one Allowed Value.'); return; }

    const allowedValues = allowedRaw.split(',').map(v => v.trim()).filter(Boolean);

    const selectedFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId));
    if (selectedFiles.length === 0) { alert('No files selected.'); return; }

    const region = example1State.region || 'US';

    // Switch PE to compliance-results view
    const loading    = document.getElementById('paramExplorerLoading');
    const progress   = document.getElementById('paramExplorerProgress');
    const subtitle   = document.getElementById('paramExplorerSubtitle');
    const treemapDiv = document.getElementById('paramExplorerTreemap');
    const backBtn    = document.getElementById('paramExplorerBackBtn');
    const search     = document.getElementById('paramExplorerSearch');

    loading.style.display = 'flex';
    progress.textContent  = `Scanning ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}…`;
    if (subtitle) subtitle.textContent = `Compliance: ${paramName}`;
    if (search)   search.style.display = 'none';
    treemapDiv.innerHTML = '';
    if (backBtn) { backBtn.style.display = ''; backBtn.onclick = null; }
    window._complianceElemsRegistry = {};

    const ELEMENT_Q = `
        query ComplianceElements($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results {
                    id name
                    properties(pagination: { limit: 500 }) { results { name value } }
                }
            }
        }`;

    const paramNormalized = paramName.replace(/_/g, ' ');
    const paramAlt        = paramName.replace(/ /g, '_');
    const matchesProp     = (n) => n === paramName || n === paramNormalized || n === paramAlt;
    const matchesRevitId  = (n) => {
        const nl = n.toLowerCase().replace(/\s+/g, '');
        return nl === 'revitelementid' || nl === 'elementid';
    };

    const fileResults = [];
    const globalValueMap = new Map();
    let filesWithData = 0, scanned = 0;
    const BATCH = 5;

    try {
        for (let i = 0; i < selectedFiles.length; i += BATCH) {
            await Promise.all(selectedFiles.slice(i, i + BATCH).map(async eg => {
                let fileTotal = 0, fileCompliant = 0;
                const fileValues = {};
                const fileElements = [];
                try {
                    let cursor = null;
                    do {
                        const res = await executeGraphQLQuery(ELEMENT_Q, {
                            elementGroupId: eg.egId,
                            filter: {},
                            pagination: cursor ? { cursor, limit: 200 } : { limit: 200 }
                        }, region, 2);
                        const data = res.data?.elementsByElementGroup;
                        for (const el of (data?.results || [])) {
                            let paramVal = null, revitId = '';
                            for (const p of (el.properties?.results || [])) {
                                if (paramVal === null && matchesProp(p.name)) paramVal = p.value;
                                if (!revitId && matchesRevitId(p.name)) revitId = String(p.value ?? '');
                            }
                            if (paramVal !== null && paramVal !== undefined) {
                                const key = paramVal === '' ? '(not set)' : String(paramVal);
                                fileValues[key] = (fileValues[key] || 0) + 1;
                                globalValueMap.set(key, (globalValueMap.get(key) || 0) + 1);
                                fileTotal++;
                                const ok = allowedValues.includes(key);
                                if (ok) fileCompliant++;
                                fileElements.push({ revitId, paramValue: key, compliant: ok, elementName: el.name || '' });
                            }
                        }
                        cursor = data?.pagination?.cursor || null;
                    } while (cursor);
                    if (fileTotal > 0) filesWithData++;
                } catch (e) {
                    logDebug(`PE compliance: skipped ${eg.egName}: ${e.message.slice(0, 60)}`);
                }
                if (fileTotal > 0) {
                    fileResults.push({
                        egId: eg.egId, egName: eg.egName, projectName: eg.projectName || '',
                        fileVersionUrn: eg.fileVersionUrn || null,
                        total: fileTotal, compliant: fileCompliant,
                        violations: fileTotal - fileCompliant,
                        values: fileValues, elements: fileElements
                    });
                }
                scanned++;
            }));
            progress.textContent = `Scanned ${scanned} / ${selectedFiles.length} files…`;
        }
    } catch (err) {
        loading.style.display = 'none';
        treemapDiv.innerHTML = `<div style="color:#c62828;padding:16px;font-size:13px;">Error: ${err.message}</div>`;
        return;
    }

    loading.style.display = 'none';

    // ── Render results ────────────────────────────────────────────────────────
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding:12px;';

    if (globalValueMap.size === 0) {
        wrap.innerHTML =
            `<div style="background:#fff8e1;border-radius:6px;padding:12px;font-size:13px;color:#795548;">` +
            `No <strong>${paramName}</strong> data found across the ${selectedFiles.length} selected file${selectedFiles.length !== 1 ? 's' : ''}.` +
            `<br><span style="font-size:12px;">Check spelling — parameter names are case-sensitive (e.g. <code>Fire_Resistance_Rating</code>).</span></div>`;
        treemapDiv.appendChild(wrap);
        return;
    }

    const totalElements  = [...globalValueMap.values()].reduce((s, c) => s + c, 0);
    const compliantCount = [...globalValueMap.entries()].filter(([v]) => allowedValues.includes(v)).reduce((s, [, c]) => s + c, 0);
    const violationCount = totalElements - compliantCount;
    const pct = totalElements > 0 ? Math.round(compliantCount / totalElements * 100) : 0;

    // Summary
    const summaryBg    = violationCount === 0 ? '#e8f5e9' : '#ffebee';
    const summaryColor = violationCount === 0 ? '#2e7d32' : '#c62828';
    const summaryDiv = document.createElement('div');
    summaryDiv.style.cssText = `background:${summaryBg};border-radius:6px;padding:10px 12px;margin-bottom:12px;font-size:13px;`;
    if (violationCount === 0) {
        summaryDiv.innerHTML = `<div style="color:#2e7d32;font-weight:bold;">✅ 100% compliant — all ${totalElements.toLocaleString()} elements have allowed values.</div>`;
    } else {
        summaryDiv.innerHTML =
            `<div style="color:${summaryColor};font-weight:bold;">⚠️ ${violationCount.toLocaleString()} of ${totalElements.toLocaleString()} elements (${100 - pct}%) have non-allowed values.</div>` +
            `<div style="color:#2e7d32;margin-top:2px;">✓ ${compliantCount.toLocaleString()} compliant (${pct}%)</div>`;
    }
    summaryDiv.innerHTML += `<div style="color:#555;font-size:11px;margin-top:4px;">Parameter: <strong>${paramName}</strong> · Allowed: <strong>${allowedValues.join(', ')}</strong> · ${filesWithData} file${filesWithData !== 1 ? 's' : ''} with data</div>`;
    wrap.appendChild(summaryDiv);

    // Per-file collapsible sections
    const resultsDiv = document.createElement('div');
    const sortedFiles = [...fileResults].sort((a, b) => b.violations - a.violations);
    let regKeySeq = 0;

    for (const f of sortedFiles) {
        const valueBuckets = {};
        for (const el of f.elements) {
            if (!valueBuckets[el.paramValue]) valueBuckets[el.paramValue] = [];
            if (el.revitId) valueBuckets[el.paramValue].push(el.revitId);
        }
        const section  = document.createElement('div');
        section.style.cssText = 'border:1px solid #e0e0e0;border-radius:6px;margin-bottom:8px;overflow:hidden;font-size:12px;';
        const filePct    = f.total > 0 ? Math.round(f.compliant / f.total * 100) : 0;
        const headerBg   = f.violations === 0 ? '#e8f5e9' : (filePct >= 80 ? '#fff8e1' : '#ffebee');
        const statusIcon = f.violations === 0 ? '✅' : '⚠️';
        const header = document.createElement('div');
        header.style.cssText = `background:${headerBg};padding:8px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;`;
        header.innerHTML =
            `<span style="font-weight:600;color:#333;">${statusIcon} ${f.egName}</span>` +
            `<span style="display:flex;gap:16px;font-size:11px;align-items:center;">` +
            `<span style="color:#c62828;">${f.violations.toLocaleString()} non-compliant</span>` +
            `<span style="color:#2e7d32;">${f.compliant.toLocaleString()} compliant</span>` +
            (f.projectName ? `<span style="color:#888;">${f.projectName}</span>` : '') +
            `<span class="comp-arrow" style="color:#999;min-width:10px;">${f.violations > 0 ? '▼' : '▶'}</span></span>`;

        const tableWrap = document.createElement('div');
        tableWrap.style.display = f.violations > 0 ? 'block' : 'none';

        let tableHtml = `<div style="background:#f5f5f5;padding:5px 12px;display:grid;grid-template-columns:24px 1fr 70px 56px;gap:8px;font-weight:600;color:#555;border-top:1px solid #e0e0e0;">`;
        tableHtml += `<span></span><span>${paramName} value</span><span style="text-align:right;">Elements</span><span style="text-align:center;">Status</span></div>`;

        const sorted = Object.entries(f.values).sort((a, b) => {
            const aOk = allowedValues.includes(a[0]) ? 1 : 0;
            const bOk = allowedValues.includes(b[0]) ? 1 : 0;
            if (aOk !== bOk) return aOk - bOk;
            return b[1] - a[1];
        });
        for (const [value, count] of sorted) {
            const allowed = allowedValues.includes(value);
            const regKey  = `r${regKeySeq++}`;
            window._complianceElemsRegistry[regKey] = valueBuckets[value] || [];
            tableHtml +=
                `<div style="background:${allowed ? '#fff' : '#fff3f3'};padding:5px 12px;border-top:1px solid #f0f0f0;display:grid;grid-template-columns:24px 1fr 70px 56px;gap:8px;align-items:center;">` +
                `<input type="checkbox" class="comp-row-cb" data-regkey="${regKey}" style="cursor:pointer;accent-color:${allowed ? '#2e7d32' : '#c62828'};">` +
                `<span style="color:${allowed ? '#333' : '#c62828'};font-weight:${allowed ? 400 : 600};">${value}</span>` +
                `<span style="text-align:right;color:#555;">${count.toLocaleString()}</span>` +
                `<span style="text-align:center;">${allowed ? '<span style="color:#2e7d32;font-weight:bold;">✓</span>' : '<span style="color:#c62828;font-weight:bold;">✗</span>'}</span>` +
                `</div>`;
        }
        tableWrap.innerHTML = tableHtml;
        header.addEventListener('click', () => {
            const open = tableWrap.style.display !== 'none';
            tableWrap.style.display = open ? 'none' : 'block';
            const arrow = header.querySelector('.comp-arrow');
            if (arrow) arrow.textContent = open ? '▶' : '▼';
        });
        section.appendChild(header);
        section.appendChild(tableWrap);
        resultsDiv.appendChild(section);
    }

    // Copy-IDs bar
    const copyBar = document.createElement('div');
    copyBar.style.cssText = 'margin-top:12px;display:flex;align-items:center;gap:10px;';
    const copySelBtn = document.createElement('button');
    copySelBtn.textContent = '📋 Copy selected IDs';
    copySelBtn.style.cssText = 'padding:8px 16px;font-size:13px;font-weight:600;background:#1565c0;color:white;border:none;border-radius:5px;cursor:pointer;flex:1;';
    const copyFeedback = document.createElement('span');
    copyFeedback.style.cssText = 'font-size:12px;color:#2e7d32;display:none;';
    copySelBtn.addEventListener('click', () => {
        const cbs = resultsDiv.querySelectorAll('.comp-row-cb:checked');
        const ids = [];
        cbs.forEach(cb => { ids.push(...(window._complianceElemsRegistry[cb.dataset.regkey] || [])); });
        if (ids.length === 0) { alert('Select at least one value row first.'); return; }
        navigator.clipboard.writeText(ids.join(';'));
        copyFeedback.textContent = `✓ Copied ${ids.length} IDs`;
        copyFeedback.style.display = 'inline';
        setTimeout(() => { copyFeedback.style.display = 'none'; }, 3000);
    });
    copyBar.appendChild(copySelBtn);
    copyBar.appendChild(copyFeedback);
    resultsDiv.appendChild(copyBar);

    wrap.appendChild(resultsDiv);

    // Compliance treemap (coloured by compliance ratio)
    const tmDiv = document.createElement('div');
    tmDiv.style.cssText = 'margin-top:16px;';
    wrap.appendChild(tmDiv);
    renderComplianceTreemap(tmDiv, fileResults.filter(f => f.total > 0), allowedValues, paramName, '', region);

    treemapDiv.appendChild(wrap);
}

async function _peLoadCheckedValues() {
    const checked = [...document.querySelectorAll('.pe-param-cb:checked')].map(cb => cb.value);
    if (checked.length === 0) { alert('Please select at least one parameter.'); return; }

    const modal     = document.getElementById('paramExplorerModal');
    const loading   = document.getElementById('paramExplorerLoading');
    const progress  = document.getElementById('paramExplorerProgress');
    const subtitle  = document.getElementById('paramExplorerSubtitle');
    const treemapDiv = document.getElementById('paramExplorerTreemap');
    const searchInput = document.getElementById('paramExplorerSearch');
    const backBtn   = document.getElementById('paramExplorerBackBtn');

    loading.style.display = 'flex';
    // Don't clear treemap yet — let live renders fill it progressively;
    // it will be replaced on the first _peScheduleRender call.
    paramExplorerZoomState = null;
    if (searchInput) { searchInput.style.display = ''; searchInput.value = ''; }
    if (backBtn)     backBtn.style.display = 'none';

    const selectedFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId));
    const n = selectedFiles.length;
    const region = example1State.region;

    // aggregated: paramName → value → { count, categories: Set, files: Set }
    const agg = new Map();
    window._paramExplorerAgg = agg;
    treemapDiv.innerHTML = '';   // clear checklist now that we're switching to treemap mode

    const distinctQuery = `
        query GetDistinctByName($elementGroupId: ID!, $name: String!) {
            distinctPropertyValuesInElementGroupByName(elementGroupId: $elementGroupId, name: $name) {
                results { values(limit: 1000) { value count } }
            }
        }`;

    // Build (file, paramName) work items
    // Use the API-normalised name for the actual query (handles Fire_Resistance_Rating → Fire Resistance Rating)
    const workItems = [];
    for (const f of selectedFiles) {
        const cache  = window._paramNamesCache[f.egId]   || new Set();
        const apiMap = window._paramApiNameCache[f.egId] || new Map();
        for (const paramName of checked) {
            if (cache.has(paramName)) {
                const apiName = apiMap.get(paramName) || paramName;
                workItems.push({ f, paramName, apiName });
            }
        }
    }

    let done = 0;
    const CONCURRENCY = 6;
    for (let i = 0; i < workItems.length; i += CONCURRENCY) {
        if (modal.style.display === 'none') return;
        await Promise.all(workItems.slice(i, i + CONCURRENCY).map(async ({ f, paramName, apiName }) => {
            try {
                const r = await executeGraphQLQuery(distinctQuery, { elementGroupId: f.egId, name: apiName }, region);
                const vals = r.data?.distinctPropertyValuesInElementGroupByName?.results?.[0]?.values || [];
                if (!agg.has(paramName)) agg.set(paramName, new Map());
                const byValue = agg.get(paramName);
                for (const { value } of vals) {
                    if (value == null || String(value).trim() === '') continue;
                    const v = String(value).length > 120 ? String(value).slice(0, 120) + '…' : String(value);
                    if (!byValue.has(v)) byValue.set(v, { count: 0, categories: new Set(), files: new Set() });
                    byValue.get(v).files.add(f.egName);
                }
            } catch (err) {
                logDebug(`peLoadValues: ${f.egName}/${paramName}: ${err.message}`);
            }
            done++;
            progress.textContent = `Discovering values: ${done} / ${workItems.length}…`;
        }));
    }

    if (modal.style.display === 'none') return;

    // ── Phase B: count actual Revit elements per value ────────────────────────
    const isV1 = example1State.version === 'v1';
    const _cqV1 = `
        query CountElsV1($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results { id }
            }
        }`;
    const _cqV2 = `
        query CountEls($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results { id }
            }
        }`;
    const _cKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';

    const countItems = [];
    for (const [paramName, byValue] of agg) {
        for (const [valueName, entry] of byValue) {
            for (const fileName of entry.files) {
                const fc = selectedFiles.find(sf => sf.egName === fileName);
                if (fc) {
                    const an = (window._paramApiNameCache[fc.egId]?.get(paramName)) || paramName;
                    countItems.push({ fc, an, valueName, entry });
                }
            }
        }
    }

    let doneB = 0;
    for (let i = 0; i < countItems.length; i += CONCURRENCY) {
        if (modal.style.display === 'none') return;
        await Promise.all(countItems.slice(i, i + CONCURRENCY).map(async ({ fc, an, valueName, entry }) => {
            try {
                const pp = /\s/.test(an)
                    ? ("'property.name." + an.replace(/'/g, "\\'") + "'")
                    : ("property.name." + an.replace(/'/g, "\\'"));
                const ev = String(valueName).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                let cnt = 0, cur = null;
                do {
                    const r = await executeGraphQLQuery(isV1 ? _cqV1 : _cqV2, {
                        elementGroupId: fc.egId,
                        filter: { query: pp + "=='" + ev + "'" },
                        pagination: cur ? { cursor: cur, limit: 500 } : { limit: 500 }
                    }, region);
                    const d2 = r.data?.[_cKey];
                    cnt += (d2?.results || []).length;
                    cur = d2?.pagination?.cursor || null;
                } while (cur);
                entry.count += cnt;
            } catch (err) {
                logDebug(`peCountEls: ${fc.egName}/${valueName}: ${err.message}`);
            }
            doneB++;
            progress.textContent = `Counting elements: ${doneB} / ${countItems.length}…`;
            _peScheduleRender();
        }));
    }

    if (modal.style.display === 'none') return;
    // Cancel any pending live-render rAF so it can't overwrite the final render
    if (_peRafId) { cancelAnimationFrame(_peRafId); _peRafId = null; }
    loading.style.display = 'none';
    subtitle.textContent = `${n} file${n !== 1 ? 's' : ''} · ${checked.length} parameters`;
    _peRenderOverview(agg, treemapDiv, false);
    if (searchInput) searchInput.style.display = '';
}

function closeParameterExplorer() {
    const modal = document.getElementById('paramExplorerModal');
    if (modal) modal.style.display = 'none';
    if (paramExplorerTooltip) paramExplorerTooltip.style.display = 'none';
    paramExplorerZoomState = null;
}

// ── zoom in: click a parameter tile ──────────────────────────────────────────
function paramExplorerZoomIn(paramName) {
    const agg = window._paramExplorerAgg;
    if (!agg || !agg.has(paramName)) return;
    paramExplorerZoomState = paramName;

    const backBtn  = document.getElementById('paramExplorerBackBtn');
    const subtitle = document.getElementById('paramExplorerSubtitle');
    const search   = document.getElementById('paramExplorerSearch');
    if (backBtn)  backBtn.style.display = '';
    const filtAgg  = _peFilteredAgg() || agg;
    const _zByValue = (filtAgg.get(paramName)) || agg.get(paramName);
    const _zParamFiles = new Set([..._zByValue.values()].flatMap(e => [...e.files]));
    const _zTotalFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId)).length;
    const _zFileSuffix = _zTotalFiles > 1 ? `  ·  found in ${_zParamFiles.size} of ${_zTotalFiles} files` : '';
    if (subtitle) subtitle.textContent  = `${paramName}${_zFileSuffix}`;
    if (search)   search.value = '';

    _peRenderZoom(_zByValue, paramName, document.getElementById('paramExplorerTreemap'));
}

function paramExplorerZoomOut() {
    paramExplorerZoomState = null;
    const backBtn  = document.getElementById('paramExplorerBackBtn');
    const subtitle = document.getElementById('paramExplorerSubtitle');
    const search   = document.getElementById('paramExplorerSearch');
    const agg      = window._paramExplorerAgg;
    if (backBtn)  backBtn.style.display = 'none';
    if (search)   search.value = '';
    if (subtitle && agg) {
        const n = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId)).length;
        subtitle.textContent = `${n} file${n !== 1 ? 's' : ''} · ${agg.size} parameters`;
    }
    if (agg) _peRenderOverview(_peFilteredAgg() || agg, document.getElementById('paramExplorerTreemap'), false);
}

// ── shared tooltip helper ─────────────────────────────────────────────────────
function _peShowTooltip(event, html) {
    if (!paramExplorerTooltip) {
        paramExplorerTooltip = document.createElement('div');
        paramExplorerTooltip.style.cssText = [
            'position:fixed','background:rgba(0,0,0,0.9)','color:white',
            'padding:10px 14px','border-radius:6px','font-size:12px',
            'max-width:380px','pointer-events:none','z-index:9999','line-height:1.6'
        ].join(';');
        document.body.appendChild(paramExplorerTooltip);
    }
    paramExplorerTooltip.innerHTML = html;
    paramExplorerTooltip.style.left    = (event.clientX + 16) + 'px';
    paramExplorerTooltip.style.top     = (event.clientY + 12) + 'px';
    paramExplorerTooltip.style.display = 'block';
}
function _peHideTooltip() {
    if (paramExplorerTooltip) paramExplorerTooltip.style.display = 'none';
}

// ── per-param compliance bar shown in zoom view ─────────────────────────────
function _peBuildParamComplianceBar(paramName) {
    const av = (window._peParamAllowedValues || {})[paramName] || [];
    const bar = document.createElement('div');
    bar.style.cssText = [
        'display:flex', 'align-items:center', 'gap:8px', 'flex-wrap:wrap',
        'padding:5px 10px',
        `background:${av.length > 0 ? '#e8f5e9' : '#f5f5f5'}`,
        `border-bottom:1px solid ${av.length > 0 ? '#c8e6c9' : '#e0e0e0'}`,
        'font-size:11px'
    ].join(';');

    const lbl = document.createElement('span');
    lbl.style.cssText = `font-weight:600;color:${av.length > 0 ? '#2e7d32' : '#666'};white-space:nowrap;flex-shrink:0;font-size:11px;`;
    lbl.textContent = `✓ Allowed values:`;
    bar.appendChild(lbl);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'e.g. EI60, EI120 — Enter or Apply';
    input.value = av.join(', ');
    input.style.cssText = [
        'flex:1', 'min-width:160px', 'padding:4px 8px',
        `border:1px solid ${av.length > 0 ? '#a5d6a7' : '#d0d0d0'}`,
        'border-radius:4px', 'font-size:12px', 'outline:none', 'background:white'
    ].join(';');
    bar.appendChild(input);

    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply';
    applyBtn.style.cssText = 'padding:4px 12px;font-size:12px;font-weight:600;background:#0696d7;color:white;border:none;border-radius:4px;cursor:pointer;flex-shrink:0;';
    const doApply = () => {
        const vals = input.value.split(',').map(v => v.trim()).filter(Boolean);
        if (!window._peParamAllowedValues) window._peParamAllowedValues = {};
        if (vals.length > 0) window._peParamAllowedValues[paramName] = vals;
        else delete window._peParamAllowedValues[paramName];
        _peReRender();
    };
    applyBtn.addEventListener('click', doApply);
    bar.appendChild(applyBtn);

    if (av.length > 0) {
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '✕ Clear';
        clearBtn.style.cssText = 'padding:4px 10px;font-size:12px;background:transparent;color:#c62828;border:1px solid #ef9a9a;border-radius:4px;cursor:pointer;flex-shrink:0;';
        clearBtn.addEventListener('click', () => {
            if (window._peParamAllowedValues) delete window._peParamAllowedValues[paramName];
            _peReRender();
        });
        bar.appendChild(clearBtn);

        const filtAgg = _peFilteredAgg() || new Map();
        const byValue = filtAgg.get(paramName);
        if (byValue) {
            let compliant = 0, nonCompliant = 0;
            byValue.forEach((entry, value) => {
                if (av.includes(value)) compliant += entry.count;
                else nonCompliant += entry.count;
            });
            if (compliant + nonCompliant > 0) {
                const summary = document.createElement('span');
                summary.style.cssText = 'font-size:11px;white-space:nowrap;font-weight:600;';
                summary.innerHTML =
                    `<span style="color:#2e7d32;">✓ ${compliant.toLocaleString()}</span>` +
                    `&nbsp;&nbsp;<span style="color:#c62828;">✗ ${nonCompliant.toLocaleString()}</span>`;
                bar.appendChild(summary);
            }
        }
    }

    input.addEventListener('keydown', e => { if (e.key === 'Enter') doApply(); });
    return bar;
}

// ── compliance popover (triggered from ✎ icon on a parameter tile) ──────────
function _peShowCompliancePopover(event, paramName) {
    let pop = document.getElementById('peCompParamPopover');
    if (pop && pop._currentParam === paramName && pop.style.display !== 'none') {
        pop.style.display = 'none';
        return;
    }
    if (!pop) {
        pop = document.createElement('div');
        pop.id = 'peCompParamPopover';
        pop.style.cssText = [
            'position:fixed', 'z-index:5100', 'background:#ffffff',
            'border:1px solid #d5dbe1', 'border-radius:4px',
            'box-shadow:0 4px 16px rgba(0,0,0,0.14)',
            'padding:16px 18px', 'min-width:320px', 'max-width:440px',
            "font-family:'ArtifaktElement','Helvetica Neue',Arial,sans-serif",
            'font-size:13px'
        ].join(';');
        document.body.appendChild(pop);
        document.addEventListener('mousedown', e => {
            if (pop.style.display !== 'none' && !pop.contains(e.target)) pop.style.display = 'none';
        }, true);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') pop.style.display = 'none';
        });
    }
    pop._currentParam = paramName;
    const current = (window._peParamAllowedValues || {})[paramName] || [];

    pop.innerHTML = `
        <div style="font-size:10px;font-weight:700;color:#0696d7;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">Compliance Check</div>
        <div style="font-size:13px;color:#3c3c3c;font-weight:600;margin-bottom:12px;word-break:break-word;">${paramName}</div>
        <label style="display:block;font-size:11px;font-weight:600;color:#3c3c3c;margin-bottom:5px;">
            Allowed values <span style="font-weight:400;color:#7a7a7a;">(comma-separated)</span>
        </label>
        <input id="pePopoverInput" type="text"
            placeholder="e.g. EI60, EI120"
            value="${current.join(', ')}"
            style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid #d5dbe1;border-radius:4px;font-size:13px;outline:none;margin-bottom:12px;font-family:inherit;color:#3c3c3c;transition:border-color .15s;"
            onfocus="this.style.borderColor='#0696d7';this.style.boxShadow='0 0 0 2px rgba(6,150,215,.18)'"
            onblur="this.style.borderColor='#d5dbe1';this.style.boxShadow='none'">
        <div style="display:flex;gap:8px;">
            <button id="pePopoverApply" style="flex:1;height:32px;font-size:13px;font-weight:600;background:#0696d7;color:white;border:none;border-radius:4px;cursor:pointer;font-family:inherit;transition:background .15s;"
                onmouseover="this.style.background='#0484bd'" onmouseout="this.style.background='#0696d7'">Apply</button>
            <button id="pePopoverClear" style="height:32px;padding:0 14px;font-size:13px;font-weight:500;background:transparent;color:#d33;border:1px solid #d5dbe1;border-radius:4px;cursor:pointer;font-family:inherit;transition:border-color .15s;"
                onmouseover="this.style.borderColor='#d33'" onmouseout="this.style.borderColor='#d5dbe1'">Clear</button>
        </div>`;

    const input    = pop.querySelector('#pePopoverInput');
    const applyBtn = pop.querySelector('#pePopoverApply');
    const clearBtn = pop.querySelector('#pePopoverClear');

    const apply = () => {
        const vals = (input.value || '').split(',').map(v => v.trim()).filter(Boolean);
        if (!window._peParamAllowedValues) window._peParamAllowedValues = {};
        if (vals.length > 0) window._peParamAllowedValues[paramName] = vals;
        else delete window._peParamAllowedValues[paramName];
        pop.style.display = 'none';
        _peReRender();
    };
    applyBtn.addEventListener('click', apply);
    clearBtn.addEventListener('click', () => {
        if (window._peParamAllowedValues) delete window._peParamAllowedValues[paramName];
        pop.style.display = 'none';
        _peReRender();
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') apply(); });

    pop.style.display = 'block';
    const left = Math.min(event.clientX + 8, window.innerWidth - 440);
    const top  = Math.min(event.clientY + 8, window.innerHeight - 190);
    pop.style.left = Math.max(8, left) + 'px';
    pop.style.top  = Math.max(8, top)  + 'px';
    setTimeout(() => input.focus(), 30);
}

// ── compliance bar: allowed-values input shown above every treemap view ───────
function _peBuildComplianceBar() {
    const av = window._peAllowedValues || [];
    const bar = document.createElement('div');
    bar.id = 'peComplianceBar';
    bar.style.cssText = [
        'display:flex', 'align-items:center', 'gap:8px', 'flex-wrap:wrap',
        'padding:5px 10px',
        `background:${av.length > 0 ? '#e8f5e9' : '#f5f5f5'}`,
        `border-bottom:1px solid ${av.length > 0 ? '#c8e6c9' : '#e0e0e0'}`,
        'font-size:11px'
    ].join(';');

    const lbl = document.createElement('span');
    lbl.style.cssText = `font-weight:600;color:${av.length > 0 ? '#2e7d32' : '#666'};white-space:nowrap;flex-shrink:0;`;
    lbl.textContent = '✓ Compliance – Allowed values:';
    bar.appendChild(lbl);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'peCompAllowedInput';
    input.placeholder = 'e.g. EI60, EI120, EI30  — press Enter or Apply';
    input.value = av.join(', ');
    input.style.cssText = [
        'flex:1', 'min-width:200px', 'padding:4px 8px',
        `border:1px solid ${av.length > 0 ? '#a5d6a7' : '#d0d0d0'}`,
        'border-radius:4px', 'font-size:12px', 'outline:none', 'background:white'
    ].join(';');
    bar.appendChild(input);

    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply';
    applyBtn.style.cssText = 'padding:4px 12px;font-size:12px;font-weight:600;background:#0696d7;color:white;border:none;border-radius:4px;cursor:pointer;flex-shrink:0;';
    applyBtn.addEventListener('click', () => {
        const raw = document.getElementById('peCompAllowedInput')?.value || '';
        window._peAllowedValues = raw.split(',').map(v => v.trim()).filter(Boolean);
        _peReRender();
    });
    bar.appendChild(applyBtn);

    if (av.length > 0) {
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '✕ Clear';
        clearBtn.style.cssText = 'padding:4px 10px;font-size:12px;background:transparent;color:#c62828;border:1px solid #ef9a9a;border-radius:4px;cursor:pointer;flex-shrink:0;';
        clearBtn.addEventListener('click', () => {
            window._peAllowedValues = [];
            _peReRender();
        });
        bar.appendChild(clearBtn);

        // Live summary counts from current filtered agg
        const filtAgg = _peFilteredAgg() || new Map();
        let compliant = 0, nonCompliant = 0;
        filtAgg.forEach(byValue => {
            byValue.forEach((entry, value) => {
                if (av.includes(value)) compliant += entry.count;
                else nonCompliant += entry.count;
            });
        });
        if (compliant + nonCompliant > 0) {
            const summary = document.createElement('span');
            summary.style.cssText = 'font-size:11px;white-space:nowrap;font-weight:600;';
            summary.innerHTML =
                `<span style="color:#2e7d32;">✓ ${compliant.toLocaleString()}</span>` +
                `&nbsp;&nbsp;<span style="color:#c62828;">✗ ${nonCompliant.toLocaleString()}</span>`;
            bar.appendChild(summary);
        }
    }

    input.addEventListener('keydown', e => { if (e.key === 'Enter') applyBtn.click(); });
    return bar;
}

function _peReRender() {
    const cont = document.getElementById('paramExplorerTreemap');
    if (!cont) return;
    const filtAgg = _peFilteredAgg() || new Map();
    if (paramExplorerZoomState) {
        const byValue = filtAgg.get(paramExplorerZoomState);
        if (byValue) _peRenderZoom(byValue, paramExplorerZoomState, cont);
        else { paramExplorerZoomState = null; _peRenderOverview(filtAgg, cont, false); }
    } else {
        _peRenderOverview(filtAgg, cont, false);
    }
}

// ── helper: filter global agg by hidden files ───────────────────────────────
function _peFilteredAgg() {
    const hidden = window._peHiddenFiles || new Set();
    const source = window._paramExplorerAgg;
    if (!source || hidden.size === 0) return source;
    const filtered = new Map();
    source.forEach((byValue, paramName) => {
        const filteredByValue = new Map();
        byValue.forEach((entry, value) => {
            const visibleFiles = [...entry.files].filter(f => !hidden.has(f));
            if (visibleFiles.length > 0) {
                filteredByValue.set(value, {
                    count: entry.count,
                    categories: entry.categories,
                    files: new Set(visibleFiles)
                });
            }
        });
        if (filteredByValue.size > 0) filtered.set(paramName, filteredByValue);
    });
    return filtered;
}

// ── helper: build clickable file-filter legend bar ───────────────────────────
function _peBuildLegend(allFilesForLegend, fileColor) {
    const hidden  = window._peHiddenFiles || new Set();
    const legendEl = document.createElement('div');
    legendEl.style.cssText = [
        'display:flex', 'flex-wrap:wrap', 'gap:5px',
        'padding:5px 10px', 'background:#f5f5f5',
        'border-bottom:1px solid #e0e0e0',
        'font-size:11px', 'color:#333', 'align-items:center'
    ].join(';');
    const lbl = document.createElement('span');
    lbl.style.cssText = 'font-weight:600;color:#888;margin-right:4px;flex-shrink:0;font-size:10px;text-transform:uppercase;letter-spacing:.04em;';
    lbl.textContent = 'Filter files:';
    legendEl.appendChild(lbl);
    allFilesForLegend.forEach(f => {
        const isHidden = hidden.has(f);
        const item = document.createElement('span');
        item.title = isHidden ? `Click to show "${f}"` : `Click to hide "${f}"`;
        item.style.cssText = [
            'display:inline-flex', 'align-items:center', 'gap:4px',
            'cursor:pointer', 'padding:2px 8px 2px 5px',
            'border-radius:10px',
            `border:1px solid ${isHidden ? '#ddd' : fileColor(f) + '66'}`,
            `background:${isHidden ? '#f0f0f0' : 'white'}`,
            `opacity:${isHidden ? '0.45' : '1'}`,
            'transition:opacity .15s,border-color .15s',
            'user-select:none'
        ].join(';');
        const sw = document.createElement('span');
        sw.style.cssText = [
            'width:10px', 'height:10px', 'border-radius:2px',
            `background:${fileColor(f)}`, 'display:inline-block', 'flex-shrink:0'
        ].join(';');
        const txt = document.createElement('span');
        txt.style.cssText = isHidden ? 'text-decoration:line-through;color:#aaa;' : '';
        txt.textContent = f;
        item.appendChild(sw);
        item.appendChild(txt);
        item.addEventListener('click', () => {
            if (!window._peHiddenFiles) window._peHiddenFiles = new Set();
            if (window._peHiddenFiles.has(f)) window._peHiddenFiles.delete(f);
            else window._peHiddenFiles.add(f);
            const cont = document.getElementById('paramExplorerTreemap');
            const filtAgg = _peFilteredAgg();
            if (paramExplorerZoomState) {
                const byValue = filtAgg && filtAgg.get(paramExplorerZoomState);
                if (byValue) _peRenderZoom(byValue, paramExplorerZoomState, cont);
                else { paramExplorerZoomState = null; _peRenderOverview(filtAgg || new Map(), cont, false); }
            } else {
                _peRenderOverview(filtAgg || new Map(), cont, false);
            }
        });
        legendEl.appendChild(item);
    });
    return legendEl;
}

// ── overview treemap (root → param → value) ───────────────────────────────────
function _peRenderOverview(agg, container, isLive) {
    const params = [];
    agg.forEach((byValue, paramName) => {
        let total = 0;
        byValue.forEach(e => { total += e.count; });
        params.push({ paramName, byValue, total });
    });
    params.sort((a, b) => b.total - a.total);

    if (params.length === 0) {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">No parameters found yet…</div>';
        return;
    }

    const color = d3.scaleOrdinal()
        .domain(params.map(p => p.paramName))
        .range(_PE_PALETTE);

    // Per-value coloring (fallback for single-file scenarios)
    const allValueNames = params.flatMap(p => Array.from(p.byValue.keys()));
    const valueColor = d3.scaleOrdinal().domain(allValueNames).range(_PE_PALETTE);

    // Per-file coloring — stable scale from full unfiltered agg so colors don't shift when toggling
    const allFiles = [...new Set(params.flatMap(p => [...p.byValue.values()].flatMap(e => [...e.files])))].sort();
    const allFilesForLegend = (() => {
        const src = window._paramExplorerAgg;
        if (!src) return allFiles;
        return [...new Set([...src.values()].flatMap(bv => [...bv.values()].flatMap(e => [...e.files])))].sort();
    })();
    const totalSelectedFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId)).length;
    const fileColor = d3.scaleOrdinal().domain(allFilesForLegend).range(_PE_PALETTE);

    const data = {
        name: 'Parameters',
        children: params.map(({ paramName, byValue }) => ({
            name: paramName,
            children: Array.from(byValue.entries())
                .map(([value, entry]) => ({
                    name: value, value: entry.count, paramName,
                    categories: [...entry.categories].sort(),
                    files: [...entry.files].sort()
                }))
                .sort((a, b) => b.value - a.value)
        }))
    };

    const width  = Math.max(600, (container.clientWidth  || 1100) - 4);
    const height = Math.max(200, (container.clientHeight || 600) - 4);

    const root = d3.hierarchy(data).sum(d => d.value || 0).sort((a, b) => b.value - a.value);
    d3.treemap()
        .size([width, height])
        .paddingTop(d  => d.depth === 0 ? 0 : d.depth === 1 ? 32 : 0)
        .paddingRight( d => d.depth >= 1 ? 3 : 0)
        .paddingBottom(d => d.depth >= 1 ? 3 : 0)
        .paddingLeft(  d => d.depth >= 1 ? 3 : 0)
        .round(true)(root);

    const svg  = d3.create('svg').attr('width', width).attr('height', height);
    const node = svg.selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.filter(d => d.depth === 1).attr('data-paramname', d => d.data.name);

    node.append('rect')
        .attr('width',  d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill', d => {
            if (d.depth === 0) return 'transparent';
            if (d.depth === 1) return color(d.data.name);
            const pav = (window._peParamAllowedValues || {})[d.data.paramName] || [];
            if (pav.length > 0) return pav.includes(d.data.name) ? '#388e3c' : '#e53935';
            if (allFilesForLegend.length > 1) {
                const fs = d.data.files || [];
                return fs.length === 1 ? fileColor(fs[0]) : '#9e9e9e';
            }
            return valueColor(d.data.name);
        })
        .attr('opacity', d => d.depth === 1 ? 0.15 : 0.88)
        .attr('stroke', 'white')
        .attr('stroke-width', d => d.depth === 1 ? 2 : 1)
        .attr('rx', d => d.depth <= 1 ? 4 : 2);

    // Depth-1 parameter header — label + "Check Compliance" button
    node.filter(d => d.depth === 1).each(function(d) {
        const w = d.x1 - d.x0, h = d.y1 - d.y0;
        if (w < 22 || h < 16) return;
        const g = d3.select(this);
        const paramFileSet = new Set((d.children || []).flatMap(c => c.data.files || []));
        const fileSuffix = totalSelectedFiles > 1 ? `  ·  ${paramFileSet.size}/${totalSelectedFiles} files` : '';

        // Per-param compliance state
        const pav = (window._peParamAllowedValues || {})[d.data.name] || [];
        let compSuffix = '';
        if (pav.length > 0 && d.children) {
            let ok = 0, notOk = 0;
            d.children.forEach(c => { pav.includes(c.data.name) ? ok += c.data.value : notOk += c.data.value; });
            compSuffix = `  ✓${ok.toLocaleString()} ✗${notOk.toLocaleString()}`;
        }

        // "Check Compliance" button dimensions
        const btnLabel = pav.length > 0 ? '✓ Active' : 'Check Compliance';
        const btnW = pav.length > 0 ? 74 : 124;
        const btnH = 28;
        const showBtn = w >= btnW + 24 && h >= 34;

        const reservedRight = showBtn ? btnW + 8 : 6;
        const maxChars = Math.max(4, Math.floor((w - reservedRight - 6) / 7.2));
        const label = d.data.name.length > maxChars ? d.data.name.slice(0, maxChars - 1) + '…' : d.data.name;

        g.append('text')
            .attr('x', 5).attr('y', 20)
            .text(label + (w > 140 ? fileSuffix + compSuffix : ''))
            .attr('font-size', '11px')
            .attr('fill', pav.length > 0 ? '#1565c0' : '#111')
            .attr('font-weight', '700')
            .style('pointer-events', 'none');

        if (showBtn) {
            const bx = w - btnW - 4;
            const by = 2;
            const btnG = g.append('g')
                .style('cursor', 'pointer')
                .style('pointer-events', 'all')
                .on('click', function(event) {
                    event.stopPropagation();
                    _peShowCompliancePopover(event, d.data.name);
                });
            btnG.append('rect')
                .attr('x', bx).attr('y', by)
                .attr('width', btnW).attr('height', btnH)
                .attr('rx', 3)
                .attr('fill', pav.length > 0 ? '#2e7d32' : '#0696d7')
                .attr('opacity', 0.92);
            btnG.append('text')
                .attr('x', bx + btnW / 2).attr('y', by + btnH / 2 + 4)
                .attr('text-anchor', 'middle')
                .text(btnLabel)
                .attr('font-size', '11px')
                .attr('fill', 'white')
                .attr('font-weight', '600')
                .style('pointer-events', 'none');
        }
    });
    node.filter(d => d.depth === 1)
        .style('cursor', 'zoom-in')
        .on('click', (event, d) => { event.stopPropagation(); paramExplorerZoomIn(d.data.name); })
        .on('mousemove', (event, d) => {
            _peShowTooltip(event,
                `<div style="font-weight:700;margin-bottom:3px;">${d.data.name}</div>` +
                `<div style="opacity:.8">Click to zoom in and explore values</div>` +
                `<div><span style="opacity:.7">Distinct values:</span> ${d.data.byValue ? d.data.byValue.size : d.children?.length}</div>`
            );
        })
        .on('mouseout', _peHideTooltip);

    // Depth-2 leaves (values)
    node.filter(d => d.depth === 2).each(function(d) {
        const w = d.x1 - d.x0, h = d.y1 - d.y0;
        if (w < 16 || h < 12) return;
        const g = d3.select(this);
        const maxChars = Math.max(3, Math.floor(w / 6.5));
        const label = (d.data.name || '').length > maxChars
            ? (d.data.name || '').slice(0, maxChars - 1) + '…'
            : (d.data.name || '');
        g.append('text').attr('x', 4).attr('y', 13)
            .text(label)
            .attr('font-size', '10px').attr('fill', '#111').attr('font-weight', '600')
            .style('pointer-events', 'none');
        if (h >= 26 && d.data.value > 0) {
            g.append('text').attr('x', 4).attr('y', 24)
                .text(`${d.data.value.toLocaleString()}×`)
                .attr('font-size', '9px').attr('fill', '#333')
                .style('pointer-events', 'none');
        }
    });
    node.filter(d => d.depth === 2)
        .style('cursor', 'zoom-in')
        .on('click', (event, d) => { event.stopPropagation(); paramExplorerZoomIn(d.data.paramName); })
        .on('mousemove', (event, d) => {
            _peShowTooltip(event,
                `<div style="font-weight:700;font-size:13px;margin-bottom:4px;">${d.data.paramName}</div>` +
                `<div><span style="opacity:.7">Value:</span> <strong>${d.data.name}</strong></div>` +
                `<div><span style="opacity:.7">Elements:</span> <strong>${d.data.value.toLocaleString()}</strong></div>` +
                `<div><span style="opacity:.7">Categories:</span> ${(d.data.categories || []).join(', ') || '—'}</div>` +
                `<div><span style="opacity:.7">Files:</span> ${(d.data.files || []).join(', ') || '—'}</div>` +
                `<div style="opacity:.6;font-size:10px;margin-top:4px;">Click to explore all values ›</div>`
            );
        })
        .on('mouseout', _peHideTooltip);

    // Live-load indicator
    if (isLive) {
        svg.append('text')
            .attr('x', width - 6).attr('y', 14)
            .attr('text-anchor', 'end')
            .text('⟳ loading…')
            .attr('font-size', '10px').attr('fill', '#999').attr('font-style', 'italic');
    }

    container.innerHTML = '';
    if (allFilesForLegend.length > 1) {
        container.appendChild(_peBuildLegend(allFilesForLegend, fileColor));
    }
    container.appendChild(svg.node());
}

// ── Open viewer for a specific param=value (from zoom-view tile click) ────────
async function _peOpenValueInViewer(paramName, value, fileNames) {
    // Map file names back to fileSummary entries that have a viewable URN
    const candidates = (example1State.fileSummary || [])
        .filter(f => (fileNames || []).includes(f.egName) && f.fileVersionUrn);

    if (candidates.length === 0) {
        alert('No viewable file found for this value. The file may not have a URN yet.');
        return;
    }

    // If multiple files contain this value, use the first one
    // (future: could show a picker)
    const fileEntry = candidates[0];
    // Resolve to API name (e.g. 'Fire_Resistance_Rating' → 'Fire Resistance Rating')
    const apiParamName = (window._paramApiNameCache[fileEntry.egId]?.get(paramName)) || paramName;
    const loading = document.getElementById('paramExplorerLoading');
    const progress = document.getElementById('paramExplorerProgress');
    loading.style.display = 'flex';
    progress.textContent = `Fetching elements with "${paramName} = ${value}" in ${fileEntry.egName}…`;

    const isV1 = example1State.version === 'v1';
    const dataKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
    // Use apiParamName (spaces form) for filter — the API requires the normalised name
    const propPath = /\s/.test(apiParamName)
        ? `'property.name.${apiParamName.replace(/'/g, "\\'")}'`
        : `property.name.${apiParamName.replace(/'/g, "\\'")}`;
    const escapedValue = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const filterQuery = `${propPath}=='${escapedValue}'`;

    const gql = isV1
        ? `query GetElsByVal($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results { properties(pagination: { limit: 50 }) { results { name value } } }
            } }`
        : `query GetElsByVal($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results { properties(pagination: { limit: 50 }) { results { name value } } }
            } }`;

    const revitIds = [];
    let cursor = null;
    try {
        do {
            const r = await executeGraphQLQuery(gql, {
                elementGroupId: fileEntry.egId,
                filter: { query: filterQuery },
                pagination: cursor ? { cursor, limit: 100 } : { limit: 100 }
            }, example1State.region);
            const data = r.data?.[dataKey];
            for (const el of (data?.results || [])) {
                const revitId = (el.properties?.results || []).find(p => p.name === 'Revit Element ID')?.value;
                if (revitId != null && String(revitId).trim() !== '') revitIds.push(String(revitId));
            }
            cursor = data?.pagination?.cursor || null;
        } while (cursor);
    } catch (err) {
        loading.style.display = 'none';
        alert(`Failed to fetch elements: ${err.message}`);
        return;
    }

    loading.style.display = 'none';

    if (revitIds.length === 0) {
        alert(`No elements found for "${paramName} = ${value}" in ${fileEntry.egName}.`);
        return;
    }

    // Hand off to viewer (same mechanism as zoom-view "Show in Viewer")
    pendingRevitElementIds = revitIds;
    pendingRevitCategory = null;   // search all categories in viewer
    currentRegion = example1State.region;
    openViewerModal([{ id: fileEntry.egId, name: fileEntry.egName,
        alternativeIdentifiers: { fileVersionUrn: fileEntry.fileVersionUrn } }]);
}

// ── zoom treemap (flat: root → values for one parameter) ─────────────────────
function _peRenderZoom(byValue, paramName, container) {
    const values = Array.from(byValue.entries())
        .map(([value, entry]) => ({
            value, count: entry.count,
            categories: [...entry.categories].sort(),
            files: [...entry.files].sort()
        }))
        .sort((a, b) => b.count - a.count);

    if (values.length === 0) {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">No values found.</div>';
        return;
    }

    // Per-file coloring — stable scale from full unfiltered agg so colors don't shift when toggling
    const allFiles = [...new Set(values.flatMap(v => v.files))].sort();
    const allFilesForLegend = (() => {
        const src = window._paramExplorerAgg;
        if (!src) return allFiles;
        return [...new Set([...src.values()].flatMap(bv => [...bv.values()].flatMap(e => [...e.files])))].sort();
    })();
    const totalSelectedFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId)).length;
    const fileColor  = d3.scaleOrdinal().domain(allFilesForLegend).range(_PE_PALETTE);
    const valueColor = d3.scaleOrdinal().domain(values.map(v => v.value)).range(_PE_PALETTE);

    const data = {
        name: paramName,
        children: values.map(v => ({
            name: v.value, value: v.count,
            categories: v.categories, files: v.files
        }))
    };

    const width  = Math.max(600, (container.clientWidth  || 1100) - 4);
    const height = Math.max(200, (container.clientHeight || 600) - 4);

    const root = d3.hierarchy(data).sum(d => d.value || 0).sort((a, b) => b.value - a.value);
    d3.treemap()
        .size([width, height])
        .paddingInner(3)
        .paddingOuter(6)
        .round(true)(root);

    const svg  = d3.create('svg').attr('width', width).attr('height', height);
    const node = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .attr('data-peval', d => d.data.name)
        .style('cursor', 'pointer');

    node.append('rect')
        .attr('width',  d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill', d => {
            const pav = (window._peParamAllowedValues || {})[paramName] || [];
            if (pav.length > 0) return pav.includes(d.data.name) ? '#388e3c' : '#e53935';
            if (allFilesForLegend.length > 1) {
                const fs = d.data.files || [];
                return fs.length === 1 ? fileColor(fs[0]) : '#9e9e9e';
            }
            return valueColor(d.data.name);
        })
        .attr('opacity', 0.88)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('rx', 3);

    node.each(function(d) {
        const w = d.x1 - d.x0, h = d.y1 - d.y0;
        if (w < 16 || h < 14) return;
        const g = d3.select(this);
        const maxChars = Math.max(4, Math.floor(w / 7));
        const label = d.data.name.length > maxChars ? d.data.name.slice(0, maxChars - 1) + '…' : d.data.name;

        g.append('text').attr('x', 6).attr('y', 15)
            .text(label)
            .attr('font-size', '11px').attr('fill', '#111').attr('font-weight', '700')
            .style('pointer-events', 'none');

        if (h >= 30) {
            g.append('text').attr('x', 6).attr('y', 28)
                .text(d.data.value.toLocaleString())
                .attr('font-size', '9px').attr('fill', '#333')
                .style('pointer-events', 'none');
        }
        if (h >= 44 && d.data.categories?.length) {
            const catLabel = d.data.categories.slice(0, 3).join(', ') + (d.data.categories.length > 3 ? '…' : '');
            const maxCatChars = Math.max(4, Math.floor(w / 6.5));
            g.append('text').attr('x', 6).attr('y', 40)
                .text(catLabel.length > maxCatChars ? catLabel.slice(0, maxCatChars - 1) + '…' : catLabel)
                .attr('font-size', '9px').attr('fill', '#555').attr('font-style', 'italic')
                .style('pointer-events', 'none');
        }
    });

    node.on('click', (event, d) => {
        _peOpenValueInViewer(paramName, d.data.name, d.data.files);
    });
    node.on('mousemove', (event, d) => {
        _peShowTooltip(event,
            `<div style="font-weight:700;font-size:13px;margin-bottom:4px;">${paramName}</div>` +
            `<div><span style="opacity:.7">Value:</span> <strong>${d.data.name}</strong></div>` +
            `<div><span style="opacity:.7">Elements:</span> <strong>${d.data.value.toLocaleString()}</strong></div>` +
            `<div><span style="opacity:.7">Categories:</span> ${(d.data.categories || []).join(', ') || '—'}</div>` +
            `<div><span style="opacity:.7">Files:</span> ${(d.data.files || []).join(', ') || '—'}</div>` +
            `<div style="opacity:.6;font-size:10px;margin-top:4px;">Click to open in Viewer ►</div>`
        );
    }).on('mouseout', _peHideTooltip);



    container.innerHTML = '';
    if (allFilesForLegend.length > 1) {
        container.appendChild(_peBuildLegend(allFilesForLegend, fileColor));
    }
    container.appendChild(_peBuildParamComplianceBar(paramName));
    container.appendChild(svg.node());
}