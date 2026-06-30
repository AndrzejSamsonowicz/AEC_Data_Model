// UpdateRevit.js – Phase 3: open selected elements in Viewer, update Revit parameters

async function _peOpenSelectedInViewer() {
    const bar = document.getElementById('peZoomSelBar');
    const paramName = bar?.dataset.paramname;
    if (!paramName) return;
    const selected = [...(window._peZoomSelected || new Set())];
    if (selected.length === 0) return;

    // ── Helper: build viewer data from a byFile map and open viewer modal ────────
    async function _peOpenFromByFileMap(byFileMap) {
        const allRevitIds = [], pendingRows = [], daFileContexts = [];
        for (const [egId, fg] of byFileMap) {
            const fileEntry = (example1State.fileSummary || []).find(f => f.egId === egId);
            if (!fileEntry || fg.revitIds.length === 0) continue;
            allRevitIds.push(...fg.revitIds);
            const fileContext = {
                egId, fileName: fileEntry.egName || 'model.rvt',
                fileVersionUrn: fileEntry.fileVersionUrn,
                projectId: fileEntry.projectId || null,
                hubId: example1State.hubId || null,
                region: example1State.region || null
            };
            daFileContexts.push(fileContext);
            for (const [pv, ids] of fg.paramValMap) {
                pendingRows.push({ paramName, currentValue: pv, newValue: '', revitIds: ids, fileContext });
            }
        }
        if (allRevitIds.length === 0) { alert('No elements found for the current selection.'); return; }
        pendingRevitElementIds = allRevitIds;
        pendingRevitCategory = null;
        currentRegion = example1State.region;
        window._pendingParamEditRows = pendingRows;
        window._pendingDAFileContexts = daFileContexts.length ? daFileContexts : null;
        window._pendingDAFileContext = daFileContexts[0] || null;
        const candidateEgIds = new Set([...byFileMap.keys()]);
        const viewerFiles = (example1State.fileSummary || []).filter(f => candidateEgIds.has(f.egId) && f.fileVersionUrn);
        if (viewerFiles.length === 0) { alert('No viewable file found for selection.'); return; }
        openViewerModal(viewerFiles.map(f => ({ id: f.egId, name: f.egName, alternativeIdentifiers: { fileVersionUrn: f.fileVersionUrn } })));
    }

    // ── Inner element view: direct revitId lookup (no scan needed) ──────────────
    const elementTiles = window._peZoomElementTiles;
    if (elementTiles && selected.some(k => elementTiles.has(k))) {
        const allRevitIds = [], pendingRows = [], daFileContexts = [], seenEgIds = new Set();
        for (const k of selected) {
            const tile = elementTiles.get(k);
            if (!tile) continue;
            const fileEntry = (example1State.fileSummary || []).find(f => f.egId === tile.egId);
            if (!fileEntry) continue;
            const fileContext = {
                egId: tile.egId, fileName: fileEntry.egName || 'model.rvt',
                fileVersionUrn: fileEntry.fileVersionUrn,
                projectId: fileEntry.projectId || null,
                hubId: example1State.hubId || null,
                region: example1State.region || null
            };
            if (!seenEgIds.has(tile.egId)) { seenEgIds.add(tile.egId); daFileContexts.push(fileContext); }
            allRevitIds.push(tile.revitId);
            // One row per element so the user can assign different values to each
            const displayValue = tile.paramValue && tile.paramValue !== '(empty)'
                ? tile.paramValue
                : `(empty) [${tile.revitId}]`;
            pendingRows.push({ paramName, currentValue: displayValue, newValue: '', revitIds: [tile.revitId], fileContext });
        }
        if (allRevitIds.length === 0) { alert('No elements found for the current selection.'); return; }
        pendingRevitElementIds = allRevitIds;
        pendingRevitCategory = null;
        currentRegion = example1State.region;
        window._pendingParamEditRows = pendingRows;
        window._pendingDAFileContexts = daFileContexts.length ? daFileContexts : null;
        window._pendingDAFileContext = daFileContexts[0] || null;
        const viewerFiles = (example1State.fileSummary || []).filter(f => seenEgIds.has(f.egId) && f.fileVersionUrn);
        if (viewerFiles.length === 0) { alert('No viewable file found for selection.'); return; }
        openViewerModal(viewerFiles.map(f => ({ id: f.egId, name: f.egName, alternativeIdentifiers: { fileVersionUrn: f.fileVersionUrn } })));
        return;
    }

    // ── Outer name view: gather all elements of selected names (no scan needed) ──
    const nameAgg = window._peNameAgg;
    if (nameAgg && selected.some(k => nameAgg.has(k))) {
        const allRevitIds = [], pendingRows = [], daFileContexts = [], seenEgIds = new Set();
        for (const nameKey of selected) {
            const grp = nameAgg.get(nameKey);
            if (!grp) continue;
            for (const el of grp.elements) {
                const fileEntry = (example1State.fileSummary || []).find(f => f.egId === el.egId);
                if (!fileEntry) continue;
                const fileContext = {
                    egId: el.egId, fileName: fileEntry.egName || 'model.rvt',
                    fileVersionUrn: fileEntry.fileVersionUrn,
                    projectId: fileEntry.projectId || null,
                    hubId: example1State.hubId || null,
                    region: example1State.region || null
                };
                if (!seenEgIds.has(el.egId)) { seenEgIds.add(el.egId); daFileContexts.push(fileContext); }
                allRevitIds.push(el.revitId);
                // One row per element so the user can assign different values to each
                const displayValue = el.paramValue && el.paramValue !== '(empty)'
                    ? el.paramValue
                    : `(empty) [${el.revitId}]`;
                pendingRows.push({ paramName, currentValue: displayValue, newValue: '', revitIds: [el.revitId], fileContext });
            }
        }
        if (allRevitIds.length === 0) { alert('No elements found for the current selection.'); return; }
        pendingRevitElementIds = allRevitIds;
        pendingRevitCategory = null;
        currentRegion = example1State.region;
        window._pendingParamEditRows = pendingRows;
        window._pendingDAFileContexts = daFileContexts.length ? daFileContexts : null;
        window._pendingDAFileContext = daFileContexts[0] || null;
        const nameViewFiles = (example1State.fileSummary || []).filter(f => seenEgIds.has(f.egId) && f.fileVersionUrn);
        if (nameViewFiles.length === 0) { alert('No viewable file found for selection.'); return; }
        openViewerModal(nameViewFiles.map(f => ({ id: f.egId, name: f.egName, alternativeIdentifiers: { fileVersionUrn: f.fileVersionUrn } })));
        return;
    }

    // ── Fallback: value-based lookup with optional scan for empty/sentinel values ─
    const agg = window._paramExplorerAgg;
    const byValue = agg?.get(paramName);
    const allFileNames = new Set();
    if (byValue) selected.forEach(v => (byValue.get(v)?.files || []).forEach(f => allFileNames.add(f)));
    const candidates = (example1State.fileSummary || [])
        .filter(f => allFileNames.has(f.egName) && f.fileVersionUrn);
    if (candidates.length === 0) { alert('No viewable file found for selection.'); return; }

    const loading  = document.getElementById('paramExplorerLoading');
    const progress = document.getElementById('paramExplorerProgress');
    loading.style.display = 'flex';
    progress.textContent = `Fetching elements from ${candidates.length} file${candidates.length > 1 ? 's' : ''}\u2026`;

    // Clear extraction-status banners
    ['paramExplorerExtStatus', 'peViewerExtStatus'].forEach(id => { const e = document.getElementById(id); if (e) { e.style.display = 'none'; e.innerHTML = ''; } });
    // Fetch extraction status for the first candidate in the background
    _peFetchExtractionStatus(candidates[0], example1State.region).then(_peDisplayExtractionStatus);

    const isV1 = example1State.version === 'v1';
    const dataKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
    const gql = isV1
        ? `query GetElsByVals($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results { properties(pagination: { limit: 500 }) { results { name value } } }
            } }`
        : `query GetElsByVals($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results { properties(pagination: { limit: 500 }) { results { name value } } }
            } }`;

    const allRevitIds = [];          // all revitIds across all files (for viewer isolation)
    const pendingRows = [];          // { paramName, currentValue, newValue, revitIds, fileContext }
    const daFileContexts = [];       // one entry per file that has matching elements

    try {
        // Process each candidate file sequentially to keep progress messages readable
        for (const fileEntry of candidates) {
            const apiParamName = (window._paramApiNameCache[fileEntry.egId]?.get(paramName)) || paramName;
            const propPath = /\s/.test(apiParamName)
                ? `'property.name.${apiParamName.replace(/'/g, "\\'")}'`
                : `property.name.${apiParamName.replace(/'/g, "\\'")}`;

            const fileRevitIds = [];
            const filePerValueIds = new Map(selected.map(v => [String(v), []]));

            // Fetch all values for this file in parallel
            await Promise.all(selected.map(async v => {
                // ── File-qualified empty key: "(empty) [FileName]" ─────────────────────
                // Only process for the matching file; translate to '(empty)' for cache/scan.
                // Note: expanded individual tiles "(empty) [FileName]::N" are handled below.
                let effectiveV = String(v);
                if (effectiveV.startsWith('(empty) [') && !effectiveV.includes('::')) {
                    const qualFileName = effectiveV.slice('(empty) ['.length, -1);
                    if (fileEntry.egName !== qualFileName) return; // skip for non-matching files
                    effectiveV = '(empty)';
                }

                // ── Expanded empty tile: direct revitId lookup (no scan needed) ─────────
                const expInfo = window._peExpandedEmptyTiles?.get(String(v));
                if (expInfo) {
                    if (expInfo.egId !== fileEntry.egId) return; // different file — skip
                    if (expInfo.revitId) {
                        // Individual element tile
                        fileRevitIds.push(expInfo.revitId);
                        filePerValueIds.get(String(v))?.push(expInfo.revitId);
                    } else if (expInfo.startIdx != null) {
                        // Overflow tile: collect remaining revitIds not yet shown individually
                        const allIds = window._peElementScanCache?.[fileEntry.egId]?.[paramName]?.['(empty)'] || [];
                        allIds.slice(expInfo.startIdx).forEach(rid => {
                            fileRevitIds.push(rid);
                            filePerValueIds.get(String(v))?.push(rid);
                        });
                    }
                    return;
                }

                // ── Cache lookup ─────────────────────────────────────────────────────────
                const _cachedIds = window._peElementScanCache?.[fileEntry.egId]?.[paramName]?.[effectiveV];
                if (_cachedIds !== undefined) {
                    _cachedIds.forEach(id => { fileRevitIds.push(id); filePerValueIds.get(String(v))?.push(id); });
                    return;
                }
                if (effectiveV === '(empty)') {
                    const scanQ = isV1
                        ? `query ScanV1($elementGroupId: ID!, $pagination: PaginationInput) {
                               elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, pagination: $pagination) {
                                   pagination { cursor }
                                   results { properties(pagination: { limit: 500 }) { results { name value } } }
                               } }`
                        : `query Scan($elementGroupId: ID!, $pagination: PaginationInput) {
                               elementsByElementGroup(elementGroupId: $elementGroupId, pagination: $pagination) {
                                   pagination { cursor }
                                   results { properties(pagination: { limit: 500 }) { results { name value } } }
                               } }`;
                    const scanKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
                    let scanCursor = null, page = 0;
                    do {
                        page++;
                        progress.textContent = `${fileEntry.egName}: scanning for empty "${paramName}" — page ${page}…`;
                        const rs = await executeGraphQLQuery(scanQ, {
                            elementGroupId: fileEntry.egId,
                            pagination: scanCursor ? { cursor: scanCursor, limit: 200 } : { limit: 200 }
                        }, example1State.region);
                        const pageData = rs.data?.[scanKey];
                        if (page === 1) {
                            const firstEl = (pageData?.results || [])[0];
                            const fp = firstEl?.properties?.results || [];
                            console.log(`[PE Scan (empty)] apiParamName="${apiParamName}" paramName="${paramName}"`);
                            console.log(`[PE Scan (empty)] First element: ${fp.length} props, RevitID="${fp.find(x=>x.name==='Revit Element ID')?.value}"`);
                        }
                        for (const el of (pageData?.results || [])) {
                            const props = el.properties?.results || [];
                            const revitId = _peFindRevitIdValue(props);
                            if (!revitId) continue;
                            const paramProp = _peFindPropByName(props, apiParamName, paramName);
                            if (!paramProp || paramProp.value == null || String(paramProp.value).trim() === '') {
                                fileRevitIds.push(revitId);
                                filePerValueIds.get(String(v)).push(revitId);
                            }
                        }
                        scanCursor = pageData?.pagination?.cursor || null;
                    } while (scanCursor);
                    const emptyEntry = window._paramExplorerAgg?.get(paramName)?.get(String(v));
                    if (emptyEntry) emptyEntry.count = filePerValueIds.get(String(v)).length;
                } else {
                    const knownCount = byValue?.get(v)?.count ?? -1;
                    const isSentinel = (v === 'Null' || v === 'Empty');
                    // Use full scan only for values the filter API cannot index (Null/Empty sentinels,
                    // or Phase-B reported 0 elements).  Normal string values — even those discovered
                    // via forceElementScan (scannedDirectly=true) — are always filterable.
                    if (isSentinel || knownCount === 0) {
                        const scanQ = isV1
                            ? `query ScanV1($elementGroupId: ID!, $pagination: PaginationInput) {
                                   elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, pagination: $pagination) {
                                       pagination { cursor }
                                       results { properties(pagination: { limit: 500 }) { results { name value } } }
                                   } }`
                            : `query Scan($elementGroupId: ID!, $pagination: PaginationInput) {
                                   elementsByElementGroup(elementGroupId: $elementGroupId, pagination: $pagination) {
                                       pagination { cursor }
                                       results { properties(pagination: { limit: 500 }) { results { name value } } }
                                   } }`;
                        const scanKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
                        let scanCursor = null, page = 0;
                        do {
                            page++;
                            progress.textContent = `${fileEntry.egName}: scanning for "${paramName} = ${v}" (page ${page})…`;
                            const rs = await executeGraphQLQuery(scanQ, {
                                elementGroupId: fileEntry.egId,
                                pagination: scanCursor ? { cursor: scanCursor, limit: 200 } : { limit: 200 }
                            }, example1State.region);
                            const pageData = rs.data?.[scanKey];
                            if (page === 1) {
                                const firstEl = (pageData?.results || [])[0];
                                const fp = firstEl?.properties?.results || [];
                                console.log(`[PE Scan (val)] apiParamName="${apiParamName}" paramName="${paramName}" v="${v}"`);
                                console.log(`[PE Scan (val)] First element: ${fp.length} props, RevitID="${fp.find(x=>x.name==='Revit Element ID')?.value}"`);
                            }
                            for (const el of (pageData?.results || [])) {
                                const props = el.properties?.results || [];
                                const revitId = _peFindRevitIdValue(props);
                                if (!revitId) continue;
                                const paramProp = _peFindPropByName(props, apiParamName, paramName);
                                if (_peSentinelValueMatch(paramProp, String(v))) {
                                    fileRevitIds.push(revitId);
                                    filePerValueIds.get(String(v)).push(revitId);
                                }
                            }
                            scanCursor = pageData?.pagination?.cursor || null;
                        } while (scanCursor);
                        const valEntry = window._paramExplorerAgg?.get(paramName)?.get(v);
                        if (valEntry) valEntry.count = filePerValueIds.get(String(v)).length;
                    } else {
                        const _ev = String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                        const singleFilter = `${propPath}=='${_ev}'`;
                        let cursor = null;
                        do {
                            const r = await executeGraphQLQuery(gql, {
                                elementGroupId: fileEntry.egId,
                                filter: { query: singleFilter },
                                pagination: cursor ? { cursor, limit: 100 } : { limit: 100 }
                            }, example1State.region);
                            const data = r.data?.[dataKey];
                            for (const el of (data?.results || [])) {
                                const props = el.properties?.results || [];
                                const revitId = _peFindRevitIdValue(props);
                                if (!revitId) continue;
                                fileRevitIds.push(revitId);
                                filePerValueIds.get(String(v)).push(revitId);
                            }
                            cursor = data?.pagination?.cursor || null;
                        } while (cursor);
                    }
                }
            }));

            if (fileRevitIds.length === 0) continue; // no matching elements in this file

            allRevitIds.push(...fileRevitIds);
            const fileContext = {
                egId:           fileEntry.egId,
                fileName:       fileEntry.egName || 'model.rvt',
                fileVersionUrn: fileEntry.fileVersionUrn,
                projectId:      fileEntry.projectId || null,
                hubId:          example1State.hubId || null,
                region:         example1State.region || null
            };
            daFileContexts.push(fileContext);

            // Build rows: one row per element for empty/sentinel values so the user
            // can assign a different new value to each element individually.
            // Non-empty values with multiple elements sharing the same value are also
            // split so every element gets its own row.
            const rowsByKey = new Map();
            for (const v of selected) {
                const ids = filePerValueIds.get(String(v)) || [];
                if (ids.length === 0) continue;
                const exp = window._peExpandedEmptyTiles?.get(String(v));
                if (exp && exp.revitId) {
                    // Individual expanded element tile → one unique row per element
                    const uniqueKey = `__el__${exp.egId}__${exp.revitId}`;
                    rowsByKey.set(uniqueKey, { ids: [exp.revitId], currentValue: `(empty) [${exp.revitId}]` });
                } else if (exp && !exp.revitId) {
                    // Overflow tile → one grouped row (too many to split)
                    const rowKey = exp.parentKey;
                    if (!rowsByKey.has(rowKey)) rowsByKey.set(rowKey, { ids: [], currentValue: rowKey });
                    rowsByKey.get(rowKey).ids.push(...ids);
                } else {
                    // Plain value tile (including plain (empty) / (empty) [FileName]) —
                    // split into one row per element so each can receive a different value.
                    const baseVal = String(v);
                    const isEmptyLike = baseVal === '(empty)' || baseVal.startsWith('(empty) [')
                        || baseVal === 'Null' || baseVal === 'Empty';
                    if (isEmptyLike && ids.length > 1) {
                        for (const rid of ids) {
                            rowsByKey.set(`__scan__${fileEntry.egId}__${rid}`, { ids: [rid], currentValue: `(empty) [${rid}]` });
                        }
                    } else if (!isEmptyLike && ids.length > 1) {
                        for (const rid of ids) {
                            rowsByKey.set(`__scan__${fileEntry.egId}__${rid}`, { ids: [rid], currentValue: baseVal });
                        }
                    } else {
                        if (!rowsByKey.has(baseVal)) rowsByKey.set(baseVal, { ids: [], currentValue: baseVal });
                        rowsByKey.get(baseVal).ids.push(...ids);
                    }
                }
            }
            for (const [, { ids, currentValue }] of rowsByKey) {
                pendingRows.push({ paramName, currentValue, newValue: '', revitIds: ids, fileContext });
            }
        }
    } catch (err) {
        loading.style.display = 'none';
        alert(`Failed to fetch elements: ${err.message}`);
        return;
    }

    loading.style.display = 'none';
    if (allRevitIds.length === 0) {
        alert(`No elements found for the selected values.`);
        return;
    }

    pendingRevitElementIds = allRevitIds;
    pendingRevitCategory   = null;
    currentRegion          = example1State.region;
    window._pendingParamEditRows    = pendingRows;
    window._pendingDAFileContexts   = daFileContexts.length > 0 ? daFileContexts : null;
    window._pendingDAFileContext    = daFileContexts[0] || null; // backward compat for single-file path

    openViewerModal(candidates.map(f => ({
        id: f.egId, name: f.egName,
        alternativeIdentifiers: { fileVersionUrn: f.fileVersionUrn }
    })));
}

// ── Project picker ─────────────────────────────────────────────────────────────
// Returns a Promise resolving to a fileSummary entry, or null if cancelled.
// When all candidates come from a single project, resolves immediately (no UI).
// ── AEC DM extraction-status helpers ─────────────────────────────────────────

// Fetch the extraction status for a fileSummary fileEntry.
// Uses elementGroupExtractionStatusAtTip (latest version) when the lineage fileUrn
// (alternativeIdentifiers.fileUrn = urn:adsk.wip(stg):dm.lineage:xxx) and projectId
// are available — avoids the "version 1 default" bug where an old successful v1
// extraction masks a stale tip version.
// Falls back to elementGroupExtractionStatus when projectId is missing.
// Returns { status, details } or null on any error.
async function _peFetchExtractionStatus(fileEntry, region) {
    if (!fileEntry) return null;
    const { fileUrn, projectId, fileVersionUrn, egId } = fileEntry;

    // Lineage URN from alternativeIdentifiers.fileUrn (preferred); derive from
    // fileVersionUrn by stripping ?version=N as a last resort.
    const lineageUrn = fileUrn || (fileVersionUrn ? fileVersionUrn.replace(/\?.*$/, '') : null);

    // elementGroupExtractionStatusAtTip — status of the LATEST extracted version.
    // When lineageUrn+projectId are available we ONLY use the AtTip query and never
    // fall through to the legacy endpoint.  If AtTip returns null (file not in AEC DM)
    // or throws, we return null immediately — the legacy query would also fail and
    // doubling the API calls causes rate-limiting that blocks param name loading.
    if (lineageUrn && projectId) {
        const gql = `query GetExtractStatusAtTip($fileUrn: ID!, $accProjectId: ID!) {
            elementGroupExtractionStatusAtTip(fileUrn: $fileUrn, accProjectId: $accProjectId) {
                status
                details
            }
        }`;
        try {
            const r = await executeGraphQLQuery(gql, { fileUrn: lineageUrn, accProjectId: projectId }, region);
            return r.data?.elementGroupExtractionStatusAtTip || null;
        } catch (e) { return null; }
    }

    // Legacy fallback — only reached when neither lineageUrn nor projectId is known
    const urn = lineageUrn || egId;
    if (!urn) return null;
    const gql = `query GetExtractStatus($fileUrn: ID!) {
        elementGroupExtractionStatus(fileUrn: $fileUrn) {
            status
            details
        }
    }`;
    try {
        const r = await executeGraphQLQuery(gql, { fileUrn: urn }, region);
        return r.data?.elementGroupExtractionStatus || null;
    } catch (e) {
        return null;
    }
}

// Render the extraction status as a persistent banner.
// Targets both #paramExplorerExtStatus (Parameter Explorer modal) AND
// #peViewerExtStatus (viewer sidebar) so the banner is visible regardless
// of which panel is on screen when the async API response arrives.
function _peDisplayExtractionStatus(extStatus) {
    const targets = [
        document.getElementById('paramExplorerExtStatus'),
        document.getElementById('peViewerExtStatus')
    ].filter(Boolean);
    if (targets.length === 0) return;
    if (!extStatus) { targets.forEach(el => el.style.display = 'none'); return; }
    const s = (extStatus.status || '').toUpperCase();
    const detail = extStatus.details ? ` — ${extStatus.details}` : '';

    let icon, msg, bg, border, color;
    if (s === 'SUCCESS') {
        icon = '✓';
        msg  = `AEC DM extraction successful — treemap values are up to date`;
        bg   = '#e8f5e9'; border = '#c8e6c9'; color = '#2e7d32';
    } else if (s === 'IN_PROGRESS' || s.includes('PROGRESS')) {
        icon = '⏳';
        msg  = `AEC DM extraction in progress${detail} — treemap data may reflect an older model version`;
        bg   = '#fff3e0'; border = '#ffe0b2'; color = '#e65100';
    } else if (s === 'FAILED' || s.includes('FAIL')) {
        icon = '✗';
        msg  = `AEC DM extraction failed${detail} — shared/custom parameters may be missing or stale`;
        bg   = '#ffebee'; border = '#ffcdd2'; color = '#c62828';
    } else {
        icon = 'ℹ';
        msg  = `AEC DM status: ${extStatus.status}${detail}`;
        bg   = '#f5f5f5'; border = '#e0e0e0'; color = '#555';
    }

    const cssText = [
        `background:${bg}`,
        `border-bottom:2px solid ${border}`,
        'padding:6px 12px',
        'display:flex',
        'align-items:center',
        'gap:8px',
        'font-size:12px',
        `color:${color}`,
        'font-weight:600',
        'line-height:1.4',
        'flex-shrink:0'
    ].join(';');
    const html =
        `<span style="flex:1">${icon} ${msg}</span>` +
        `<button title="Dismiss" onclick="this.parentElement.style.display='none'" ` +
        `style="background:none;border:none;cursor:pointer;font-size:16px;line-height:1;` +
        `color:${color};padding:0 2px;flex-shrink:0;">&times;</button>`;
    targets.forEach(el => { el.style.cssText = cssText; el.innerHTML = html; });
}

// Returns an HTML snippet for a status badge inside the file-picker dialog.
// Updated asynchronously — starts as "Checking…" and resolves once the API responds.
function _peExtractionStatusBadgeHtml(idx) {
    return `<span id="_extStatus_${idx}" style="font-size:10px;display:block;font-weight:normal;color:#888;margin-top:2px;">⏳ Checking AEC DM status\u2026</span>`;
}
function _peUpdatePickerStatusBadge(idx, extStatus) {
    const el = document.getElementById(`_extStatus_${idx}`);
    if (!el) return;
    if (!extStatus) { el.style.display = 'none'; return; }
    const s = (extStatus.status || '').toUpperCase();
    const detail = extStatus.details ? ` — ${extStatus.details}` : '';
    if (s === 'SUCCESS') {
        el.innerHTML = `<span style="color:#2e7d32">✓ AEC DM: extracted successfully</span>`;
    } else if (s === 'IN_PROGRESS' || s.includes('PROGRESS')) {
        el.innerHTML = `<span style="color:#e65100">⏳ AEC DM: extraction in progress${detail}</span>`;
    } else if (s === 'FAILED' || s.includes('FAIL')) {
        el.innerHTML = `<span style="color:#c62828">✗ AEC DM: extraction failed${detail}</span>`;
    } else {
        el.innerHTML = `<span style="color:#777">AEC DM: ${extStatus.status}</span>`;
    }
}

function _pickProjectForFile(candidates) {
    // Narrow to files the user explicitly selected in the treemap (if any match).
    // This avoids asking again when the same filename exists in multiple projects.
    const selectedCandidates = candidates.filter(c => selectedEgIds.has(c.egId));
    const pool = selectedCandidates.length > 0 ? selectedCandidates : candidates;

    const byProject = new Map();
    for (const c of pool) {
        const key = c.projectId || '__unknown__';
        if (!byProject.has(key)) byProject.set(key, c);
    }
    if (byProject.size <= 1) return Promise.resolve(pool[0]);

    return new Promise((resolve) => {
        const entries = [...byProject.values()];
        const overlay = document.createElement('div');
        overlay.className = 'modal active';
        overlay.style.zIndex = '100000';

        const btnHtml = entries.map((e, i) =>
            `<button class="btn btn-primary" style="width:100%;margin-bottom:8px;text-align:left;" data-idx="${i}">
                \uD83D\uDCC1 ${e.projectName || e.projectId || 'Unknown project'}
                <span style="font-size:11px;opacity:0.75;display:block;font-weight:normal;">${e.egName}</span>
                ${_peExtractionStatusBadgeHtml(i)}
            </button>`
        ).join('');

        overlay.innerHTML = `
            <div class="modal-content" style="max-width:440px;">
                <div class="modal-header">Select Project</div>
                <p style="margin:0 0 14px;color:#555;">
                    <strong>"${entries[0].egName}"</strong> exists in ${entries.length} projects.<br>
                    Which project's file should be opened and updated?
                </p>
                ${btnHtml}
                <div class="modal-footer" style="margin-top:8px;">
                    <button class="btn btn-secondary" id="_pickCancelBtn">Cancel</button>
                </div>
            </div>`;

        document.body.appendChild(overlay);

        // Fetch AEC DM extraction status for each file and update badges in-place
        entries.forEach((e, i) => {
            _peFetchExtractionStatus(e, example1State.region)
                .then(s => _peUpdatePickerStatusBadge(i, s));
        });

        overlay.querySelectorAll('[data-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(entries[parseInt(btn.dataset.idx, 10)]);
            });
        });
        overlay.querySelector('#_pickCancelBtn').addEventListener('click', () => {
            document.body.removeChild(overlay);
            resolve(null);
        });
    });
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

    const fileEntry = await _pickProjectForFile(candidates);
    if (!fileEntry) return;
    // Resolve to API name (e.g. 'Fire_Resistance_Rating' → 'Fire Resistance Rating')
    const apiParamName = (window._paramApiNameCache[fileEntry.egId]?.get(paramName)) || paramName;
    const loading = document.getElementById('paramExplorerLoading');
    const progress = document.getElementById('paramExplorerProgress');
    loading.style.display = 'flex';
    progress.textContent = `Fetching elements with "${paramName} = ${value}" in ${fileEntry.egName}…`;
    // Fetch AEC DM extraction status in the background.
    ['paramExplorerExtStatus', 'peViewerExtStatus'].forEach(id => { const e = document.getElementById(id); if (e) { e.style.display = 'none'; e.innerHTML = ''; } });
    _peFetchExtractionStatus(fileEntry, example1State.region).then(_peDisplayExtractionStatus);

    const isV1 = example1State.version === 'v1';
    const dataKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
    // Use apiParamName (spaces form) for filter — the API requires the normalised name
    const propPath = /\s/.test(apiParamName)
        ? `'property.name.${apiParamName.replace(/'/g, "\\'")}'`
        : `property.name.${apiParamName.replace(/'/g, "\\'")}`;
    const escapedValue = value === '(empty)' ? '' : String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const filterQuery = `${propPath}=='${escapedValue}'`;

    const gql = isV1
        ? `query GetElsByVal($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results { properties(pagination: { limit: 500 }) { results { name value } } }
            } }`
        : `query GetElsByVal($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
            elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                pagination { cursor }
                results { properties(pagination: { limit: 500 }) { results { name value } } }
            } }`;

    const revitIds = [];
    let cursor = null;
    try {
        if (value === '(empty)') {
            // ── Cache lookup: if PE Full Scan ran, (empty) Revit IDs are already cached ──
            const _cachedEmptyIds = window._peElementScanCache?.[fileEntry.egId]?.[paramName]?.['(empty)'];
            if (_cachedEmptyIds !== undefined) {
                revitIds.push(..._cachedEmptyIds);
            } else {
            // AEC DM does not index absent/empty property values; scan all elements instead.
            const scanQ = isV1
                ? `query ScanV1($elementGroupId: ID!, $pagination: PaginationInput) {
                       elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, pagination: $pagination) {
                           pagination { cursor }
                           results { properties(pagination: { limit: 500 }) { results { name value } } }
                       } }`
                : `query Scan($elementGroupId: ID!, $pagination: PaginationInput) {
                       elementsByElementGroup(elementGroupId: $elementGroupId, pagination: $pagination) {
                           pagination { cursor }
                           results { properties(pagination: { limit: 500 }) { results { name value } } }
                       } }`;
            const scanKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
            let scanCursor = null, page = 0;
            do {
                page++;
                progress.textContent = `Scanning for empty "${paramName}" — page ${page}…`;
                const rs = await executeGraphQLQuery(scanQ, {
                    elementGroupId: fileEntry.egId,
                    pagination: scanCursor ? { cursor: scanCursor, limit: 200 } : { limit: 200 }
                }, example1State.region);
                const pageData = rs.data?.[scanKey];
                if (page === 1) {
                    const firstEl = (pageData?.results || [])[0];
                    const fp = firstEl?.properties?.results || [];
                    console.log(`[PE Scan2 (empty)] apiParamName="${apiParamName}" paramName="${paramName}"`);
                    console.log(`[PE Scan2 (empty)] First element: ${fp.length} props, RevitID="${fp.find(x=>x.name==='Revit Element ID')?.value}"`);
                    const commentLike = fp.filter(x => x.name.toLowerCase().includes('comment'));
                    console.log(`[PE Scan2 (empty)] "comment*" props: ${commentLike.map(x=>`"${x.name}"="${x.value}"`).join(', ')||'(none)'}`);
                }
                for (const el of (pageData?.results || [])) {
                    const props = el.properties?.results || [];
                    const revitId = _peFindRevitIdValue(props);
                    if (!revitId) continue;
                    const paramProp = _peFindPropByName(props, apiParamName, paramName);
                    if (!paramProp || paramProp.value == null || String(paramProp.value).trim() === '') {
                        revitIds.push(revitId);
                    }
                }
                scanCursor = pageData?.pagination?.cursor || null;
            } while (scanCursor);
            } // end else (no cache hit for (empty))
        } else {
            // filter-indexable; fall back to full element scan with JS-side value match.
            const agg = window._paramExplorerAgg;
            const knownCount = agg?.get(paramName)?.get(value)?.count ?? -1;
            if (knownCount === 0 || agg?.get(paramName)?.get(value)?.scannedDirectly) {
                // ── Cache lookup: if PE Full Scan ran, Revit IDs are already cached ──────
                const _cachedIds = window._peElementScanCache?.[fileEntry.egId]?.[paramName]?.[String(value)];
                if (_cachedIds !== undefined) {
                    revitIds.push(..._cachedIds);
                } else {
                const scanQ = isV1
                    ? `query ScanV1($elementGroupId: ID!, $pagination: PaginationInput) {
                           elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, pagination: $pagination) {
                               pagination { cursor }
                               results { properties(pagination: { limit: 500 }) { results { name value } } }
                           } }`
                    : `query Scan($elementGroupId: ID!, $pagination: PaginationInput) {
                           elementsByElementGroup(elementGroupId: $elementGroupId, pagination: $pagination) {
                               pagination { cursor }
                               results { properties(pagination: { limit: 500 }) { results { name value } } }
                           } }`;
                const scanKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
                let scanCursor = null, page = 0;
                do {
                    page++;
                    progress.textContent = `Scanning for "${paramName} = ${value}" — page ${page}…`;
                    const rs = await executeGraphQLQuery(scanQ, {
                        elementGroupId: fileEntry.egId,
                        pagination: scanCursor ? { cursor: scanCursor, limit: 200 } : { limit: 200 }
                    }, example1State.region);
                    const pageData = rs.data?.[scanKey];
                    if (page === 1) {
                        const firstEl = (pageData?.results || [])[0];
                        const fp = firstEl?.properties?.results || [];
                        console.log(`[PE Scan2 (val)] apiParamName="${apiParamName}" paramName="${paramName}" value="${value}"`);
                        console.log(`[PE Scan2 (val)] First element: ${fp.length} props, RevitID="${fp.find(x=>x.name==='Revit Element ID')?.value}"`);
                        const commentLike = fp.filter(x => x.name.toLowerCase().includes('comment'));
                        console.log(`[PE Scan2 (val)] "comment*" props: ${commentLike.map(x=>`"${x.name}"="${x.value}"`).join(', ')||'(none)'}`);
                    }
                    for (const el of (pageData?.results || [])) {
                        const props = el.properties?.results || [];
                        const revitId = _peFindRevitIdValue(props);
                        if (!revitId) continue;
                        const paramProp = _peFindPropByName(props, apiParamName, paramName);
                        if (_peSentinelValueMatch(paramProp, String(value))) {
                            revitIds.push(revitId);
                        }
                    }
                    scanCursor = pageData?.pagination?.cursor || null;
                } while (scanCursor);
                // Update count in agg after scan
                const valEntry = agg?.get(paramName)?.get(value);
                if (valEntry && valEntry.count === 0) valEntry.count = revitIds.length;
                } // end else (no cache hit)
            } else {
                do {
                    const r = await executeGraphQLQuery(gql, {
                        elementGroupId: fileEntry.egId,
                        filter: { query: filterQuery },
                        pagination: cursor ? { cursor, limit: 100 } : { limit: 100 }
                    }, example1State.region);
                    const data = r.data?.[dataKey];
                    for (const el of (data?.results || [])) {
                        const revitId = _peFindRevitIdValue(el.properties?.results || []);
                        if (revitId) revitIds.push(revitId);
                    }
                    cursor = data?.pagination?.cursor || null;
                } while (cursor);
            }
        }
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

// ── background count for Null/Empty sentinel tiles ────────────────────────────
// Scans all elements for a given file entry to count those matching a sentinel.
// Updates entry.count in the agg and re-renders the zoom view when done.

