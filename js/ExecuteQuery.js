// ExecuteQuery.js – Phase 1: hub search, Revit file treemap, compliance check

// Shared state, utilities, and GraphQL query helpers used by ExploreParameters.js and UpdateRevit.js

// AEC Data Model Query Examples


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
                results { id name alternativeIdentifiers { fileUrn fileVersionUrn } }
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
                        list.push({ id: eg.id, name: eg.name, projectName: project.name, projectId: project.id, fileUrn: eg.alternativeIdentifiers?.fileUrn || null, fileVersionUrn: eg.alternativeIdentifiers?.fileVersionUrn || null });
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
    window._paramTypeCache     = {};   // reset param type cache
    resetAecElementGroupCaches();      // re-fetch element group IDs from AEC DM (catches new extractions)
    console.log(`[EQ-INIT] ══ Execute Query start ${new Date().toISOString()} ══`);
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
window._paramTypeCache     = window._paramTypeCache     || {}; // egId → Map<name, typeStr>

const _propDefQuery = `
    query GetPropDefs($elementGroupId: ID!, $pagination: PaginationInput) {
        propertyDefinitionsByElementGroup(elementGroupId: $elementGroupId, pagination: $pagination) {
            pagination { cursor }
            results { name id specification }
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
                    if (!def.name) continue;
                    names.add(def.name);
                    apiMap.set(def.name, def.name);
                    if (def.specification) {
                        if (!window._paramTypeCache[egId]) window._paramTypeCache[egId] = new Map();
                        window._paramTypeCache[egId].set(def.name, def.specification);
                    }
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
            results { id name alternativeIdentifiers { fileUrn fileVersionUrn } }
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
                            fileUrn: eg.alternativeIdentifiers?.fileUrn || null,
                            fileVersionUrn: eg.alternativeIdentifiers?.fileVersionUrn || null });
                    }
                    egCursor = data?.pagination?.cursor || null;
                } catch (err) {
                    logDebug(`EG fetch failed for project ${project.name}: ${err.message.slice(0, 80)}`);
                    egCursor = null;
                }
            } while (egCursor);

            // Deduplicate: keep only the latest element group per file.
            // Primary key = fileUrn (lineage URN shared across all versions of the same file).
            // Fallback key = projectId + ':' + fileName when lineage URN is absent, so that
            // multiple extracted versions of the same file collapse to one tile.
            // Use >= (not >) so that when fileVersionUrn is null (ver=0 for all), the LAST
            // group encountered wins — AEC DM returns groups oldest-first, so last = newest.
            { const latest = new Map();
              const counts = new Map();
              const ver = u => { const m = (u||'').match(/\?version=(\d+)$/); return m ? +m[1] : 0; };
              for (const eg of egs) {
                const key = eg.fileUrn || (project.id + ':' + eg.name);
                counts.set(key, (counts.get(key) || 0) + 1);
                const prev = latest.get(key);
                console.log(`[EG dedup] ${eg.name}: key=${key.slice(-20)}, ver=${ver(eg.fileVersionUrn)}, id=${eg.id.slice(-10)}, fileVersionUrn=${eg.fileVersionUrn || 'null'}`);
                // Prefer higher version; also prefer latest-seen when new extraction has null
                // fileVersionUrn (ver=0) — a fresh AEC DM re-extraction may not yet carry ?version=N
                if (!prev || ver(eg.fileVersionUrn) >= ver(prev.fileVersionUrn) || !eg.fileVersionUrn) latest.set(key, eg);
              }
              for (const [key, eg] of latest) {
                if ((counts.get(key) || 1) > 1)
                  console.log(`[EG dedup] SELECTED for "${eg.name}": id=${eg.id.slice(-10)}, ver=${ver(eg.fileVersionUrn)}, fileVersionUrn=${eg.fileVersionUrn || 'null'} (from ${counts.get(key)} candidates)`);
              }
              egs = [...latest.values()];
            }

            totalFiles += egs.length;

            if (noCategory) {
                // No category filter — list all files immediately, equal-size tiles
                for (const eg of egs) {
                    console.log(`[EQ-FINAL] ${eg.name}: egId=…${eg.id.slice(-15)} fileVersionUrn=${eg.fileVersionUrn || 'null'}`);
                    fileSummary.push({ egId: eg.id, egName: eg.name, projectName: project.name, projectId: project.id, count: 1, hasMore: false, fileUrn: eg.fileUrn, fileVersionUrn: eg.fileVersionUrn });
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
                            fileSummary.push({ egId: eg.id, egName: eg.name, projectName: project.name, projectId: project.id, count, hasMore, fileUrn: eg.fileUrn, fileVersionUrn: eg.fileVersionUrn });
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
            results { id name alternativeIdentifiers { fileUrn fileVersionUrn } }
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
                        fileUrn: eg.alternativeIdentifiers?.fileUrn || null,
                        fileVersionUrn: eg.alternativeIdentifiers?.fileVersionUrn || null });
                }
                egCursor = data?.pagination?.cursor || null;
            } catch (err) {
                logDebug(`EG fetch failed for project ${project.name}: ${err.message.slice(0, 80)}`);
                egCursor = null;
            }
        } while (egCursor);

        // Deduplicate: keep only the latest element group per file.
        // Primary key = fileUrn (lineage URN); fallback = projectId + ':' + fileName
        // so multiple extracted versions of the same file collapse even when fileUrn is absent.
        // Use >= (not >) so that when fileVersionUrn is null (ver=0 for all), the LAST
        // group encountered wins — AEC DM returns groups oldest-first, so last = newest.
        { const latest = new Map();
          const counts = new Map();
          const ver = u => { const m = (u||'').match(/\?version=(\d+)$/); return m ? +m[1] : 0; };
          for (const eg of egs) {
            const key = eg.fileUrn || (project.id + ':' + eg.name);
            counts.set(key, (counts.get(key) || 0) + 1);
            const prev = latest.get(key);
            console.log(`[EG dedup] ${eg.name}: key=${key.slice(-20)}, ver=${ver(eg.fileVersionUrn)}, id=${eg.id.slice(-10)}, fileVersionUrn=${eg.fileVersionUrn || 'null'}`);
            // Prefer higher version; also prefer latest-seen when new extraction has null
            // fileVersionUrn (ver=0) — a fresh AEC DM re-extraction may not yet carry ?version=N
            if (!prev || ver(eg.fileVersionUrn) >= ver(prev.fileVersionUrn) || !eg.fileVersionUrn) latest.set(key, eg);
          }
          for (const [key, eg] of latest) {
            if ((counts.get(key) || 1) > 1)
              console.log(`[EG dedup] SELECTED for "${eg.name}": id=${eg.id.slice(-10)}, ver=${ver(eg.fileVersionUrn)}, fileVersionUrn=${eg.fileVersionUrn || 'null'} (from ${counts.get(key)} candidates)`);
          }
          egs = [...latest.values()];
        }

        totalFiles += egs.length;

        if (noCategory) {
            for (const eg of egs) {
                console.log(`[EQ-FINAL] ${eg.name}: egId=…${eg.id.slice(-15)} fileVersionUrn=${eg.fileVersionUrn || 'null'}`);
                fileSummary.push({ egId: eg.id, egName: eg.name, projectName: project.name, projectId: project.id, count: 1, hasMore: false, fileUrn: eg.fileUrn, fileVersionUrn: eg.fileVersionUrn });
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
                    fileSummary.push({ egId: eg.id, egName: eg.name, projectName: project.name, projectId: project.id, count, hasMore, fileUrn: eg.fileUrn, fileVersionUrn: eg.fileVersionUrn });
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
                    .text('click › select')
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

    // The selection was only needed to open the viewer. Clear it now so returning
    // to the treemap starts from a clean overview instead of the previous subset.
    clearTreemapSelection();
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



// ─── Shared element-property finders (used by ExploreParameters and UpdateRevit) ─

function _peFindPropByName(props, apiName, displayName) {
    let p = props.find(x => x.name === apiName);
    if (p) return p;
    const altUnderscore = apiName.replace(/ /g, '_');
    const altSpaces     = apiName.replace(/_/g, ' ');
    if (altSpaces !== apiName) { p = props.find(x => x.name === altSpaces);     if (p) return p; }
    if (altUnderscore !== apiName) { p = props.find(x => x.name === altUnderscore); if (p) return p; }
    const lower = apiName.toLowerCase();
    p = props.find(x => x.name.toLowerCase() === lower);
    if (p) return p;
    if (displayName && displayName !== apiName) {
        p = props.find(x => x.name === displayName);
        if (p) return p;
        const dl = displayName.toLowerCase();
        p = props.find(x => x.name.toLowerCase() === dl);
        if (p) return p;
    }
    return null;
}

// Match a found property object against a target value from distinctPropertyValuesInElementGroupByName.
// "Null" and "Empty" are API sentinel strings for null and empty-string property values.
// Both also match absent properties (AEC DM omits null/empty props from element results).
function _peSentinelValueMatch(propObj, targetV) {
    if (targetV === 'Null') {
        // Null = property completely absent from element (not in properties array)
        return !propObj;
    }
    if (targetV === 'Empty') {
        // Empty = property present in element data but has no content (null or blank string)
        // AEC DM returns {value: null} for blank Comments, so we must allow null values here
        return !!propObj && (propObj.value == null || String(propObj.value).trim() === '');
    }
    return !!propObj && String(propObj.value) === targetV;
}

// Return the Revit Element ID value string from a properties array, or null if absent.
// Tries multiple naming conventions used across different AEC DM projects/regions.
function _peFindRevitIdValue(props) {
    // Use the general flexible finder with the canonical name and common alternatives.
    const p = _peFindPropByName(props, 'Revit Element ID', 'Element ID');
    if (p && p.value != null && String(p.value).trim() !== '') return String(p.value);
    // Extra fallback: scan for any property whose name contains both "element" and "id"
    const lower = (s) => (s || '').toLowerCase();
    const fb = props.find(x => { const n = lower(x.name); return n.includes('element') && n.includes('id'); });
    if (fb && fb.value != null && String(fb.value).trim() !== '') return String(fb.value);
    return null;
}

// Returns true for Revit categories that have no 3D geometry in the Forge viewer.
// Used as a fallback filter in the Parameter Explorer scan when the viewer element
// index is not yet available.
const _PE_NON_GEOM_CATS = new Set([
    'materials', 'material assets', 'sun path', 'hvac load schedules',
    'building type settings', 'electrical load classification parameter element',
    'wire insulations', 'division rules', 'pattern', 'piping systems',
    'span direction symbol', 'work plane grid', 'fluids', 'rebar shape',
    'space type settings', 'views', 'structural loads', 'boundary conditions',
    'zones', 'system-zones', 'mep analytical surfaces',
]);
function _peIsNonGeometricCategory(catTypeId) {
    if (!catTypeId) return false;
    const lower = String(catTypeId).toLowerCase();
    if (lower.startsWith('analytical')) return true;
    if (lower.includes('analytical surface')) return true;
    if (lower.includes('boundary condition')) return true;
    return _PE_NON_GEOM_CATS.has(lower);
}


