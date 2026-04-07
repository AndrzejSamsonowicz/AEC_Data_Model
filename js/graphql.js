// GraphQL and Data Fetching

// ─── GraphQL helper (used for element parameter queries only) ───────────────

async function graphqlRequest(query, variables = {}, region = null) {
    if (!sessionId) {
        console.error('graphqlRequest called without sessionId!');
        throw new Error('Not logged in');
    }

    console.log(`GraphQL Request - Region: ${region}, Variables:`, variables);
    
    const response = await fetch(`${API_BASE}/api/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables, sessionId, region })
    });

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        console.error(`GraphQL HTTP Error ${response.status}:`, JSON.stringify(errBody));
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(errBody)}`);
    }

    const result = await response.json();
    if (result.errors) {
        console.error(`GraphQL Errors:`, JSON.stringify(result.errors));
    }
    console.log(`GraphQL Response - Region: ${region}:`, result);
    return result;
}

// ─── Data Management REST API helper ────────────────────────────────────────

async function restRequest(path, queryParams = {}) {
    if (!sessionId) throw new Error('Not logged in');
    const params = new URLSearchParams({ sessionId, ...queryParams });
    const response = await fetch(`${API_BASE}${path}?${params}`);
    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(errBody)}`);
    }
    return response.json();
}

// ─── Hub listing (Data Management API – single call, all ACC hubs) ──────────

async function loadHubs() {
    console.log('loadHubs() via Data Management REST API');
    try {
        const data = await restRequest('/api/rest/hubs');
        const accHubs = (data.data || []).filter(h =>
            h.attributes?.extension?.type === 'hubs:autodesk.bim360:Account'
        );
        console.log(`Found ${accHubs.length} ACC hubs`);

        const hubs = accHubs.map(h => ({
            id: h.id,
            name: h.attributes.name,
            region: (h.attributes.region || 'US').toUpperCase()
        }));

        displayLayout(hubs);
    } catch (error) {
        console.error('Error loading hubs:', error);
        alert('Failed to load hubs. Please try logging in again.');
    }
}

// ─── Project listing (Data Management API) ───────────────────────────────────

async function selectHub(hub) {
    document.querySelectorAll('.hub-item').forEach(item => item.classList.remove('selected'));
    event.target.classList.add('selected');

    currentHub = hub;
    // Reset AEC DM caches — hub region may differ
    aecHubsCache = null;
    aecProjectIdCache.clear();
    elementGroupIdCache.clear();
    elementGroupBaseUrnCache.clear();
    elementGroupCacheBuildPromise = null;

    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '<p style="color: #666;">Loading projects...</p>';
    const pf = document.getElementById('projectsFilter');
    if (pf) { pf.value = ''; }

    try {
        const data = await restRequest(`/api/rest/hubs/${hub.id}/projects`);
        const projects = (data.data || []).map(p => ({
            id: p.id,
            name: p.attributes.name
        }));

        projectsList.innerHTML = '';
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.textContent = project.name;
            projectItem.onclick = () => selectProject(project, hub.region);
            projectsList.appendChild(projectItem);
        });

        const sectionTitle = projectsList.previousElementSibling;
        if (sectionTitle?.classList.contains('section-title')) {
            sectionTitle.textContent = `Projects (${projects.length})`;
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        alert('Failed to load projects.');
    }
}

// ─── Revit file listing (Data Management API – replaces AEC DM GraphQL) ─────

async function selectProject(project, region) {
    console.log('📂 Selecting project:', project.name);

    currentProject = project;
    currentRegion = region;

    document.querySelectorAll('.project-item').forEach(item => item.classList.remove('selected'));
    event.target.classList.add('selected');

    const elementGroupsList = document.getElementById('elementGroupsList');
    elementGroupsList.innerHTML = '<p style="color: #666;">Searching for Revit files...</p>';
    const ff = document.getElementById('filesFilter');
    if (ff) { ff.value = ''; }

    try {
        // Step 1: get top-level folders
        console.log(`Fetching topFolders: hub=${currentHub?.id} project=${project.id}`);
        const topFoldersData = await restRequest(
            `/api/rest/hubs/${currentHub.id}/projects/${project.id}/topFolders`
        );
        const topFolders = topFoldersData.data || [];
        console.log(`Found ${topFolders.length} top folders`);

        // Step 2: search each folder recursively for Revit Cloud Models
        const allFiles = [];
        for (const folder of topFolders) {
            const files = await searchFolderForRevitFiles(project.id, folder.id);
            allFiles.push(...files);
        }

        console.log(`✓ Found ${allFiles.length} Revit files in project "${project.name}"`);

        elementGroupsList.innerHTML = '';

        if (allFiles.length === 0) {
            elementGroupsList.innerHTML = '<p style="color: #666;">No Revit files found in this project.</p>';
            return;
        }

        allFiles.forEach(file => {
            const groupItem = document.createElement('div');
            groupItem.className = 'element-group-item';
            groupItem.innerHTML = `
                <label class="file-checkbox-label">
                    <input type="checkbox" class="file-checkbox" onchange="updateOpenViewerBtn()">
                    <div class="file-info">
                        <div class="element-group-name">${file.name}</div>
                    </div>
                </label>
            `;
            groupItem._fileData = file;
            elementGroupsList.appendChild(groupItem);
        });

        const filesTitle = document.getElementById('filesTitle');
        if (filesTitle) filesTitle.textContent = `Revit Files (${allFiles.length})`;
        updateOpenViewerBtn();
    } catch (error) {
        const msg = error.message || String(error);
        console.error('Error loading Revit files:', msg);
        elementGroupsList.innerHTML = `<p style="color: red;">Failed to load files: ${msg}</p>`;
    }
}

// Search a single folder (and handle DM API pagination)
async function searchFolderForRevitFiles(projectId, folderId, depth = 0) {
    if (depth > 10) return []; // prevent runaway recursion
    const files = [];
    let pageNumber = 0;
    let hasMore = true;

    while (hasMore) {
        const data = await restRequest(`/api/rest/projects/${projectId}/folder-contents`, {
            folderId,
            'page[number]': pageNumber
        });

        const items = data.data || [];
        console.log(`  [depth=${depth}] folder ${folderId.slice(-20)}: ${items.length} items on page ${pageNumber}`);

        const subfolderPromises = [];
        for (const item of items) {
            if (item.type === 'folders') {
                subfolderPromises.push(searchFolderForRevitFiles(projectId, item.id, depth + 1));
            } else if (item.type === 'items') {
                const name = item.attributes?.displayName || '';
                const extType = item.attributes?.extension?.type || '';
                const isRvtByName = name.toLowerCase().endsWith('.rvt');
                const isRvtByType = extType.includes('C4RModel') || extType.includes('autodesk.revit');
                if (isRvtByName || isRvtByType) {
                    const tipVersionId = item.relationships?.tip?.data?.id;
                    if (tipVersionId) {
                        console.log(`    ✅ Revit file: "${name}" (ext: ${extType})`);
                        files.push({
                            id: item.id,
                            name,
                            alternativeIdentifiers: { fileVersionUrn: tipVersionId }
                        });
                    }
                } else {
                    console.log(`    - skipping: "${name}" (ext: ${extType})`);
                }
            }
        }

        // Process subfolders in parallel (up to 5 at a time)
        for (let i = 0; i < subfolderPromises.length; i += 5) {
            const batch = subfolderPromises.slice(i, i + 5);
            const results = await Promise.all(batch);
            results.forEach(r => files.push(...r));
        }

        hasMore = !!(data.links?.next);
        pageNumber++;
        if (pageNumber > 50) break; // safety limit
    }

    return files;
}

// ─── AEC Data Model element group ID lookup (lazy, used for parameter queries) ─

// Cache: fileVersionUrn → elementGroupId
const elementGroupIdCache = new Map();
// Cache: DM project ID (b.xxx) → AEC DM project ID (urn:adsk...)
const aecProjectIdCache = new Map();
let aecHubsCache = null;

async function resolveAecProjectId() {
    const dmProjectId = currentProject.id;
    if (aecProjectIdCache.has(dmProjectId)) return aecProjectIdCache.get(dmProjectId);

    console.log(`🔍 Resolving AEC DM project ID for DM project: ${dmProjectId}`);

    // Step 1: Get AEC DM hubs (cached across calls, with pagination)
    if (!aecHubsCache) {
        aecHubsCache = [];
        let hubCursor = null;
        do {
            const variables = {};
            if (hubCursor) variables.cursor = hubCursor;
            const hubsData = await graphqlRequest(
                `query GetHubs($cursor: String) { hubs(pagination: { cursor: $cursor }) { pagination { cursor } results { id name } } }`,
                variables, currentRegion
            );
            const page = hubsData.data?.hubs?.results || [];
            aecHubsCache.push(...page);
            hubCursor = hubsData.data?.hubs?.pagination?.cursor;
        } while (hubCursor);
        console.log(`  AEC DM hubs found: ${aecHubsCache.length}`);
    }

    // Step 2: For each hub, get projects and match by name
    const projectsQuery = `
        query GetProjects($hubId: ID!) {
            projects(hubId: $hubId) {
                results {
                    id
                    name
                }
            }
        }
    `;

    const targetName = currentProject.name;
    console.log(`  Looking for project named: "${targetName}"`);

    for (const hub of aecHubsCache) {
        try {
            const projData = await graphqlRequest(projectsQuery, { hubId: hub.id }, currentRegion);
            const projects = projData.data?.projects?.results || [];
            console.log(`  Hub "${hub.name}" (${hub.id}): ${projects.length} projects`);
            const match = projects.find(p => p.name === targetName);
            if (match) {
                console.log(`  ✅ AEC DM project ID: ${match.id} (hub: ${hub.name})`);
                aecProjectIdCache.set(dmProjectId, match.id);
                return match.id;
            }
        } catch (e) {
            console.log(`  ⚠️ Skipping hub "${hub.name}" (${e.message})`);
        }
    }

    console.warn(`  ❌ Project "${targetName}" not found in AEC DM`);
    return null;
}

// base URN → [{version, elementGroupId}] — for fallback version matching
const elementGroupBaseUrnCache = new Map();
// Single-flight guard: prevents parallel calls from each triggering their own fetch
let elementGroupCacheBuildPromise = null;

function urnBase(urn) {
    // Strip ?version=X suffix: "urn:adsk.wipprod:fs.file:vf.XXXX?version=6" → "urn:adsk.wipprod:fs.file:vf.XXXX"
    return urn ? urn.replace(/\?version=\d+$/, '') : '';
}

function urnVersion(urn) {
    const m = urn && urn.match(/\?version=(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
}

async function resolveElementGroupId(fileVersionUrn) {
    // 1. Exact match (already cached)
    if (elementGroupIdCache.has(fileVersionUrn)) {
        return elementGroupIdCache.get(fileVersionUrn);
    }

    const aecProjectId = await resolveAecProjectId();
    if (!aecProjectId) return null;

    // Only fetch from AEC DM once per project — single-flight to prevent parallel builds
    if (elementGroupBaseUrnCache.size === 0) {
        if (!elementGroupCacheBuildPromise) {
            elementGroupCacheBuildPromise = (async () => {
                console.log(`🔍 Looking up AEC DM element groups for project ${aecProjectId}`);
                const query = `
                    query GetElementGroups($projectId: ID!, $cursor: String) {
                        elementGroupsByProject(projectId: $projectId, pagination: { cursor: $cursor }) {
                            pagination { cursor }
                            results {
                                id
                                alternativeIdentifiers { fileVersionUrn }
                            }
                        }
                    }
                `;
                let cursor = null;
                let totalFound = 0;
                do {
                    const variables = { projectId: aecProjectId };
                    if (cursor) variables.cursor = cursor;
                    const data = await graphqlRequest(query, variables, currentRegion);
                    const results = data.data?.elementGroupsByProject?.results || [];
                    cursor = data.data?.elementGroupsByProject?.pagination?.cursor;
                    totalFound += results.length;
                    for (const group of results) {
                        const urn = group.alternativeIdentifiers?.fileVersionUrn;
                        if (!urn) continue;
                        elementGroupIdCache.set(urn, group.id);
                        const base = urnBase(urn);
                        const ver = urnVersion(urn);
                        if (!elementGroupBaseUrnCache.has(base) || ver > elementGroupBaseUrnCache.get(base).version) {
                            elementGroupBaseUrnCache.set(base, { version: ver, elementGroupId: group.id });
                        }
                    }
                } while (cursor);
                console.log(`   Total element groups in AEC DM: ${totalFound}`);
            })();
        }
        await elementGroupCacheBuildPromise;
    }

    // 2. Exact match after fetch
    if (elementGroupIdCache.has(fileVersionUrn)) {
        console.log(`   ✅ Exact version match for: ${fileVersionUrn}`);
        return elementGroupIdCache.get(fileVersionUrn);
    }

    // 3. Fallback: match by base URN (take highest indexed version)
    const base = urnBase(fileVersionUrn);
    const fallback = elementGroupBaseUrnCache.get(base);
    if (fallback) {
        console.log(`   ✅ Base URN match (viewer v${urnVersion(fileVersionUrn)} → AEC DM v${fallback.version}): ${base}`);
        // Cache the exact URN too for future calls
        elementGroupIdCache.set(fileVersionUrn, fallback.elementGroupId);
        return fallback.elementGroupId;
    }

    console.warn(`   ❌ No AEC DM match for: ${fileVersionUrn}`);
    return null;
}

// ─── Hybrid: query element parameters via AEC DM GraphQL ────────────────────
// Called after Viewer filtering to fetch full Revit parameter values for the
// filtered elements (identified by their AEC DM element group + categories).

async function queryElementParameters(categoryNames) {
    const files = currentLoadedFiles.length > 0 ? currentLoadedFiles : (currentElementGroup ? [currentElementGroup] : []);
    if (files.length === 0) {
        console.error('No files loaded');
        return null;
    }

    console.log(`📡 Querying AEC DM parameters across ${files.length} file(s) for categories: ${categoryNames.join(', ')}`);

    const gqlQuery = `
        query GetElementParameters($elementGroupId: ID!, $cursor: String, $categoryValues: [String!]!) {
            elementsByElementGroup(
                elementGroupId: $elementGroupId,
                filter: { properties: [{ name: "Category", value: $categoryValues }] },
                pagination: { cursor: $cursor }
            ) {
                pagination { cursor }
                results {
                    id
                    name
                    properties {
                        results {
                            name
                            displayValue
                            value
                            definition {
                                id
                                specification
                                collection { name }
                            }
                        }
                    }
                }
            }
        }
    `;

    // Resolve all element group IDs sequentially first (avoids race on cache build)
    // then query each file in parallel for speed
    const resolvedFiles = [];
    for (const file of files) {
        const fileVersionUrn = file.alternativeIdentifiers?.fileVersionUrn;
        if (!fileVersionUrn) continue;
        const elementGroupId = await resolveElementGroupId(fileVersionUrn);
        if (elementGroupId) {
            resolvedFiles.push({ file, elementGroupId });
        } else {
            console.warn(`  ⚠️ ${file.name}: not in AEC DM (skipping)`);
        }
    }

    if (resolvedFiles.length === 0) {
        console.warn('  No files matched AEC DM — check files are Revit 2024+ cloud models');
        return null;
    }

    console.log(`  ✓ ${resolvedFiles.length}/${files.length} file(s) matched AEC DM, querying in parallel...`);

    const queryOneFile = async ({ file, elementGroupId }) => {
        console.log(`  ✓ ${file.name}: querying element group ${elementGroupId}`);
        const allElements = [];
        let cursor = null;
        do {
            const variables = { elementGroupId, categoryValues: categoryNames };
            if (cursor) variables.cursor = cursor;
            const data = await graphqlRequest(gqlQuery, variables, currentRegion);
            const results = data.data?.elementsByElementGroup?.results || [];
            cursor = data.data?.elementsByElementGroup?.pagination?.cursor;
            allElements.push(...results);
        } while (cursor);
        console.log(`  ✓ ${file.name}: ${allElements.length} elements found`);
        return allElements;
    };

    const perFileResults = await Promise.all(resolvedFiles.map(queryOneFile));
    const allElements = perFileResults.flat();

    console.log(`✅ Total elements across all files: ${allElements.length}`);
    if (allElements.length === 0) return null;
    return allElements;
}

// ─── AEC DM: distinct property value distribution (used by Compliance Check) ─
// Returns a Map<value, totalCount> aggregated across all loaded files,
// filtered to the given category. Returns null if AEC DM is unavailable.

async function queryDistinctPropertyValues(category, paramName) {
    const files = currentLoadedFiles;
    if (!files || files.length === 0) return null;

    // Resolve element group IDs (re-uses existing cache)
    const resolvedFiles = [];
    for (const file of files) {
        const fileVersionUrn = file.alternativeIdentifiers?.fileVersionUrn;
        if (!fileVersionUrn) continue;
        const elementGroupId = await resolveElementGroupId(fileVersionUrn);
        if (elementGroupId) resolvedFiles.push({ file, elementGroupId });
    }
    if (resolvedFiles.length === 0) return null;

    const gqlQuery = `
        query GetDistinctValues($elementGroupId: ID!, $name: String!, $filter: ElementFilterInput) {
            distinctPropertyValuesInElementGroupByName(
                elementGroupId: $elementGroupId,
                name: $name,
                filter: $filter
            ) {
                results {
                    definition { id }
                    values(limit: 500) {
                        value
                        count
                    }
                }
            }
        }
    `;

    const valueMap = new Map();

    for (const { file, elementGroupId } of resolvedFiles) {
        try {
            const data = await graphqlRequest(gqlQuery, {
                elementGroupId,
                name: paramName,
                filter: { query: `property.name.category=='${category}'` }
            }, currentRegion);

            const results = data.data?.distinctPropertyValuesInElementGroupByName?.results || [];
            for (const res of results) {
                for (const { value, count } of (res.values || [])) {
                    const key = (value === null || value === '') ? '(empty)' : String(value);
                    valueMap.set(key, (valueMap.get(key) || 0) + count);
                }
            }
        } catch (e) {
            console.warn(`  queryDistinctPropertyValues failed for ${file.name}:`, e.message);
        }
    }

    return valueMap.size > 0 ? valueMap : null;
}
