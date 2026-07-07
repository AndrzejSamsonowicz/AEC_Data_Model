// LoadParameterValues.js – Phase 2: load parameter values and render treemaps

async function _peLoadCheckedValues(forceElementScan = true) {
    // Phase-1 picker (treemap) populates _pePickerSelected; fall back to legacy checkboxes
    const checked = (window._pePickerSelected && window._pePickerSelected.size > 0)
        ? Array.from(window._pePickerSelected)
        : [...document.querySelectorAll('.pe-param-cb:checked')].map(cb => cb.value);
    if (checked.length === 0) { alert('Please select at least one parameter.'); return; }
    // Clear picker state so phase-2 treemap gets a clean container
    window._pePickerTypeGroups = null;

    const modal     = document.getElementById('paramExplorerModal');
    const loading   = document.getElementById('paramExplorerLoading');
    const subtitle  = document.getElementById('paramExplorerSubtitle');
    const treemapDiv = document.getElementById('paramExplorerTreemap');
    const searchInput = document.getElementById('paramExplorerSearch');
    const backBtn   = document.getElementById('paramExplorerBackBtn');

    loading.style.display = 'none';   // keep overlay hidden – live treemap renders show progress
    paramExplorerZoomState   = null;
    window._peHiddenFiles    = new Set(); // reset file filter on each new load
    window._peCategoryFilter = new Set(); // reset category filter on each new load
    if (searchInput) { searchInput.style.display = ''; searchInput.value = ''; }
    if (backBtn)     backBtn.style.display = 'none';
    const refreshBtnL = document.getElementById('paramExplorerRefreshBtn');
    if (refreshBtnL)  refreshBtnL.style.display = 'none';

    const selectedFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId));
    const n = selectedFiles.length;
    const region = example1State.region;

    // â”€â”€ Re-check extraction tip before loading values â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // If AEC DM has extracted a newer version of a file since the initial load,
    // this updates f.egId and clears stale caches so fresh data is fetched.
    subtitle.textContent = `Checking for updated extractions\u2026`;
    let _tipUpdated = false;
    await Promise.all(selectedFiles.map(async f => {
        if (!f.fileUrn || !f.projectId) { console.log(`[PE-REF] ${f.egName}: SKIP \u2013 fileUrn=${f.fileUrn || 'null'} projectId=${f.projectId || 'null'}`); return; }
        const _gql = `query GetEGAtTipRefresh($fileUrn: ID!, $accProjectId: ID!) {
            elementGroupExtractionStatusAtTip(fileUrn: $fileUrn, accProjectId: $accProjectId) {
                elementGroup { id }
            }
        }`;
        try {
            console.log(`[PE-REF] ${f.egName}: calling AtTip | fileUrn=\u2026${f.fileUrn.slice(-30)} | current-egId=\u2026${f.egId.slice(-12)}`);
            const _r = await executeGraphQLQuery(_gql, { fileUrn: f.fileUrn, accProjectId: f.projectId }, region);
            const _tipEgId = _r.data?.elementGroupExtractionStatusAtTip?.elementGroup?.id;
            if (_tipEgId && _tipEgId !== f.egId) {
                console.log(`[PE refresh] ${f.egName}: new AEC DM extraction found \u2013 updating egId \u2026${f.egId.slice(-10)} → \u2026${_tipEgId.slice(-10)}`);
                delete window._paramNamesCache[f.egId];
                delete window._paramApiNameCache[f.egId];
                delete window._paramTypeCache[f.egId];
                delete window._paramNamesPromises[f.egId];
                f.egId = _tipEgId;
                _tipUpdated = true;
            } else {
                console.log(`[PE refresh] ${f.egName}: AEC DM extraction unchanged (\u2026${(_tipEgId || f.egId).slice(-10)}, ${f.fileVersionUrn || 'ver?'})`);
            }
        } catch (_e) { console.warn(`[PE-REF] ${f.egName}: AtTip call failed \u2013 ${_e.message}`); }
    }));
    if (_tipUpdated) {
        // Fetch param names for new egIds before building work items below
        await Promise.all(selectedFiles.map(f => _prefetchParamNames(f.egId, region)));
    }

    // aggregated: paramName → value → { count, categories: Set, files: Set }
    const agg = new Map();
    window._paramExplorerAgg = agg;
    window._peElementScanCache = null;  // cleared on each fresh load; re-populated during Full Scan
    window._peScanCompleted = undefined; // reset so progress bar logic works cleanly

    // â”€â”€ Single-parameter mode: skip overview, zoom directly with a progress screen â”€â”€
    if (checked.length === 1) {
        paramExplorerZoomState = checked[0];
        if (subtitle) subtitle.textContent = checked[0];
        if (!document.getElementById('pe-spin-style')) {
            const _s = document.createElement('style');
            _s.id = 'pe-spin-style';
            _s.textContent = '@keyframes pe-spin{to{transform:rotate(360deg)}}';
            document.head.appendChild(_s);
        }
        treemapDiv.innerHTML =
            `<div id="peSingleParamLoading" style="display:flex;flex-direction:column;align-items:center;` +
            `justify-content:center;height:100%;gap:18px;padding:48px;color:#555;">
                <div style="width:44px;height:44px;border:5px solid #e0e0e0;border-top-color:#0696d7;` +
            `border-radius:50%;animation:pe-spin 0.8s linear infinite;flex-shrink:0;"></div>
                <div style="font-size:14px;font-weight:600;">Scanning elements for` +
            ` <em>${_peEsc(checked[0])}</em>\u2026</div>
                <div id="peScanProgressText" style="font-size:12px;color:#888;">Starting scan\u2026</div>
            </div>`;
    } else {
        treemapDiv.innerHTML = '';   // clear checklist now that we're switching to treemap mode
    }

    // Filter to Instance elements only — excludes unplaced Revit family type definitions
    // which have no geometry and shouldn't appear in the parameter treemap.
    // Uses name-based filter to avoid version-ID mismatches (e.g. elementContext-2.0.0 vs 1.0.0).
    const INSTANCE_FILTER = `'property.name.Element Context'==Instance`;
    const distinctByNameQuery = `
        query GetDistinctByName($elementGroupId: ID!, $name: String!, $filter: ElementFilterInput) {
            distinctPropertyValuesInElementGroupByName(elementGroupId: $elementGroupId, name: $name, filter: $filter) {
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

    console.log(`[PA-ITEMS] ${workItems.length} item(s) \u2013 ${workItems.slice(0,5).map(w=>`"${w.paramName}"[api="${w.apiName !== w.paramName ? w.apiName : '=name'}",egId=\u2026${w.f.egId.slice(-12)}]`).join(' | ')}${workItems.length > 5 ? ` \u2026+${workItems.length-5} more` : ''}`);
    const CONCURRENCY = 6;
    if (forceElementScan) {
        // Use viewer element index if already built from a prior "Show in Viewer" action.
        // Deriving from the existing cache is instant — no extra viewer API call needed.
        // If the cache isn't built yet, fall back to the Element Context filter below.
        const viewerRevitIds = (() => {
            const cache = window._peRevitDbIdCache;
            if (!cache || cache.size <= 1) return null;
            const ids = new Set();
            for (const key of cache.keys()) {
                if (key !== '_modelCount' && !key.includes('::')) ids.add(key);
            }
            return ids.size > 0 ? ids : null;
        })();
        if (viewerRevitIds) console.log(`[PA-SCAN] Viewer index from cache: ${viewerRevitIds.size} elements`);

        const isV1batch = example1State.version === 'v1';
        const batchScanKey = isV1batch ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
        const batchScanQ = isV1batch
            ? `query ScanBatch($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
                   elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, filter: $filter, pagination: $pagination) {
                       pagination { cursor }
                       results { name properties(pagination: { limit: 500 }) { results { name value } } }
                   } }`
            : `query ScanBatch($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
                   elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                       pagination { cursor }
                       results { name properties(pagination: { limit: 500 }) { results { name value } } }
                   } }`;
        // Group workItems by file so each file's elements are scanned exactly once
        const byFile = new Map(); // egId → { f, items: [{paramName, apiName, altName}] }
        for (const { f, paramName, apiName } of workItems) {
            if (!byFile.has(f.egId)) byFile.set(f.egId, { f, items: [] });
            byFile.get(f.egId).items.push({ paramName, apiName, altName: apiName.replace(/_/g, ' ') });
        }
        const scanCache = {};  // egId → paramName → value → [revitId, \u2026]
        window._peElementScanCache = scanCache;
        window._peScanCompleted = new Set(); // egIds that have finished their scan
        let filesDone = 0;
        for (const [egId, { f, items }] of byFile) {
            if (modal.style.display === 'none') return;
            if (window._paramExplorerAgg !== agg) return;
            scanCache[egId] = {};
            scanCache[egId]._names      = {}; // revitId → element name
            scanCache[egId]._categories = {}; // revitId → Revit category name
            const valueCounts = {}; // paramName → Map(value → count)
            for (const { paramName } of items) {
                valueCounts[paramName] = new Map();
                scanCache[egId][paramName] = {};
            }
            const PAGE_LIMIT = 200;
            let batchCursor = null, batchPage = 0;
            let _typeSkipped = 0, _noIdSkipped = 0, _instanceKept = 0;
            // Pipeline: kick off the first fetch immediately so processing
            // of page N overlaps with the network wait for page N+1.
            let nextPagePromise = executeGraphQLQuery(batchScanQ, {
                elementGroupId: egId,
                pagination: { limit: PAGE_LIMIT }
            }, region);
            while (true) {
                if (modal.style.display === 'none') return;
                batchPage++;
                const scannedSoFar = (batchPage - 1) * PAGE_LIMIT;
                subtitle.textContent = `Scanning ${f.egName} \u2014 ~${scannedSoFar.toLocaleString()} elements\u2026`;
                // Update inline scan progress text
                const _pbTxt = document.getElementById('peScanProgressText');
                if (_pbTxt && batchPage > 1) {
                    const _doneF = window._peScanCompleted?.size ?? 0;
                    _pbTxt.textContent = `File ${_doneF + 1} / ${byFile.size}  \u2014  ~${scannedSoFar.toLocaleString()} elements scanned\u2026`;
                }
                const rs = await nextPagePromise;
                const pageData = rs.data?.[batchScanKey];
                batchCursor = pageData?.pagination?.cursor || null;
                // Pipeline: start fetching next page before processing current one
                if (batchCursor) {
                    nextPagePromise = executeGraphQLQuery(batchScanQ, {
                        elementGroupId: egId,
                        pagination: { cursor: batchCursor, limit: PAGE_LIMIT }
                    }, region);
                }
                for (const el of (pageData?.results || [])) {
                    const props = el.properties?.results || [];
                    const revitId = _peFindRevitIdValue(props);
                    // Skip non-Revit elements (lines, annotations, groups, etc.) — only
                    // elements with a "Revit Element ID" are proper geometry elements.
                    if (!revitId) { _noIdSkipped++; continue; }
                    // If viewer element index is available, skip anything not in the viewer
                    // (materials, analytical elements, MEP schedules, sun path, views, etc.)
                    if (viewerRevitIds && !viewerRevitIds.has(revitId)) { _typeSkipped++; continue; }
                    // Fallback when viewer index unavailable: skip Type definitions and
                    // known non-geometric categories (materials, analytical elements, views, etc.)
                    if (!viewerRevitIds) {
                        const _ec  = props.find(p => p.name === 'Element Context')?.value;
                        if (_ec === 'Type') { _typeSkipped++; continue; }
                        const _cat = props.find(p => p.name === 'Revit Category Type Id')?.value;
                        if (_peIsNonGeometricCategory(_cat)) { _typeSkipped++; continue; }
                    }
                    _instanceKept++;
                    scanCache[egId]._names[revitId]      = el.name || '(unnamed)';
                    scanCache[egId]._categories[revitId] = props.find(p => p.name === 'Revit Category Type Id')?.value || '';
                    for (const { paramName, apiName, altName } of items) {
                        const prop = props.find(p => p.name === apiName || p.name === altName);
                        // Skip elements that don't have this parameter at all (e.g. Furniture
                        // when scanning for "Oznaczenie" which only exists on Walls/Floors/Columns).
                        if (!prop) continue;
                        if (prop.value == null || String(prop.value).trim() === '') {
                            // File-qualified empty key gives each file its own tile in the zoom view,
                            // while the scanCache (per-egId) still uses plain '(empty)' for fast lookup.
                            const emptyAggKey = `(empty) [${f.egName}]`;
                            valueCounts[paramName].set(emptyAggKey, (valueCounts[paramName].get(emptyAggKey) || 0) + 1);
                            if (!scanCache[egId][paramName]['(empty)']) scanCache[egId][paramName]['(empty)'] = [];
                            scanCache[egId][paramName]['(empty)'].push(revitId);
                            continue;
                        }
                        const v = String(prop.value).length > 120 ? String(prop.value).slice(0, 120) + '\u2026' : String(prop.value);
                        valueCounts[paramName].set(v, (valueCounts[paramName].get(v) || 0) + 1);
                        if (!scanCache[egId][paramName][v]) scanCache[egId][paramName][v] = [];
                        scanCache[egId][paramName][v].push(revitId);
                    }
                }
                if (!batchCursor) break;
            }
            console.log(`[PA-FILTER] ${f.egName}: kept=${_instanceKept} nonViewerSkipped=${_typeSkipped} noIdSkipped=${_noIdSkipped} viewerIndexUsed=${!!viewerRevitIds}`);
            // Populate agg from scan results (per-file)
            for (const { paramName } of items) {
                if (!agg.has(paramName)) agg.set(paramName, new Map());
                const byValue = agg.get(paramName);
                for (const [v, cnt] of valueCounts[paramName]) {
                    if (!byValue.has(v)) byValue.set(v, { count: 0, categories: new Set(), files: new Set() });
                    const ent = byValue.get(v);
                    ent.files.add(f.egName);
                    ent.count += cnt;
                    ent.scannedDirectly = true;
                }
            }
            filesDone++;
            window._peScanCompleted.add(egId);
            subtitle.textContent = `Full scan: ${filesDone} / ${byFile.size} file(s) done\u2026`;
            _peScheduleRender();
        }
    } // end forceElementScan batched scan
    if (!forceElementScan) {
    let done = 0;
    for (let i = 0; i < workItems.length; i += CONCURRENCY) {
        if (modal.style.display === 'none') return;
        if (window._paramExplorerAgg !== agg) return;  // a newer Refresh has taken over
        await Promise.all(workItems.slice(i, i + CONCURRENCY).map(async ({ f, paramName, apiName }) => {
            try {
                if (!agg.has(paramName)) agg.set(paramName, new Map());
                const byValue = agg.get(paramName);
                const r = await executeGraphQLQuery(distinctByNameQuery, { elementGroupId: f.egId, name: apiName, filter: { query: INSTANCE_FILTER } }, region);
                const nameVals = r.data?.distinctPropertyValuesInElementGroupByName?.results?.[0]?.values || [];
                console.log(`[PA-RESULT] "${paramName}" api="${apiName}" egId=\u2026${f.egId.slice(-12)}: ${nameVals.length} val(s) \u2013 [${nameVals.slice(0,6).map(v=>`${String(v.value??'null').slice(0,25)}:${v.count}`).join(', ')}]`);
                    if (nameVals.length > 0) {
                        for (const { value, count: _phaseACount } of nameVals) {
                            const isEmpty = (value == null || String(value).trim() === '');
                            const v = isEmpty ? '(empty)' : (String(value).length > 120 ? String(value).slice(0, 120) + '\u2026' : String(value));
                            if (!byValue.has(v)) byValue.set(v, { count: 0, categories: new Set(), files: new Set() });
                            const _ent = byValue.get(v);
                            _ent.files.add(f.egName);
                            // Pre-fill count ONLY for shared/GUID-keyed params (apiName â‰  paramName).
                            // For project params (apiName === paramName) Phase B CAN filter correctly,
                            // so skip the pre-fill \u2013 Phase B will zero stale distinctPropertyValues
                            // results (e.g. after a shared→project param migration in Revit).
                            if (_phaseACount > 0 && apiName !== paramName) _ent.count = _phaseACount;
                        }
                    } else {
                        // distinctByName returned empty \u2013 informal property not indexed.
                        // Fall back to full element scan: read property value from each element.
                        // This is reliable but slower; count is derived directly so Phase B will skip.
                        const isV1scan = example1State.version === 'v1';
                        const scanQ = isV1scan
                            ? `query ScanElsV1($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
                                   elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: 1, filter: $filter, pagination: $pagination) {
                                       pagination { cursor }
                                       results { properties(pagination: { limit: 500 }) { results { name value } } }
                                   } }`
                            : `query ScanEls($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
                                   elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
                                       pagination { cursor }
                                       results { properties(pagination: { limit: 500 }) { results { name value } } }
                                   } }`;
                        const scanKey = isV1scan ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
                        const altName = apiName.replace(/_/g, ' ');
                        const valueCounts = new Map();
                        let scanCursor = null;
                        let scanPage = 0;
                        while (true) {
                            if (modal.style.display === 'none') break;
                            scanPage++;
                            subtitle.textContent = `Scanning elements for "${paramName}" (${scanPage * 200} elements)\u2026`;
                            const rs = await executeGraphQLQuery(scanQ, {
                                elementGroupId: f.egId,
                                pagination: scanCursor ? { cursor: scanCursor, limit: 200 } : { limit: 200 }
                            }, region);
                            const pageData = rs.data?.[scanKey];
                            for (const el of (pageData?.results || [])) {
                                const elProps = el.properties?.results || [];
                                if (elProps.find(p => p.name === 'Element Context')?.value === 'Type') continue;
                                for (const p of elProps) {
                                    if (p.name !== apiName && p.name !== altName) continue;
                                    // Skip null/empty \u2013 full scan should match distinctPropertyValues,
                                    // which never indexes absent values; also prevents (empty) dominating.
                                    if (p.value == null || String(p.value).trim() === '') continue;
                                    const v = String(p.value).length > 120 ? String(p.value).slice(0, 120) + '\u2026' : String(p.value);
                                    valueCounts.set(v, (valueCounts.get(v) || 0) + 1);
                                }
                            }
                            scanCursor = pageData?.pagination?.cursor || null;
                            if (!scanCursor) break;
                        }
                        for (const [v, cnt] of valueCounts) {
                            if (!byValue.has(v)) byValue.set(v, { count: 0, categories: new Set(), files: new Set() });
                            const ent = byValue.get(v);
                            ent.files.add(f.egName);
                            ent.count += cnt;  // counted directly \u2013 Phase B will skip (count > 0)
                            ent.scannedDirectly = true;  // viewer must use element-scan path, not filter index
                        }
                        if (valueCounts.size === 0) {
                            logDebug(`peLoadValues: ${f.egName}/${paramName}: informal prop \u2013 scan found no values`);
                        }
                    }
            } catch (err) {
                logDebug(`peLoadValues: ${f.egName}/${paramName}: ${err.message}`);
            }
            done++;
            subtitle.textContent = `Discovering values: ${done} / ${workItems.length}\u2026`;
            _peScheduleRender();
        }));
    }
    } // end !forceElementScan

    if (modal.style.display === 'none') return;
    if (window._paramExplorerAgg !== agg) return;  // a newer Refresh has taken over

    // â”€â”€ Phase B: count actual Revit elements per value â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    // â”€â”€ Reset counts so Phase B provides authoritative values â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Entries pre-filled from the distinctPropertyValues index may be stale.
    // Reset their counts to 0 so Phase B re-counts via filter query and the
    // post-Phase-B pruning step can remove values that no longer exist.
    // Sentinel values (Null/Empty/(empty)) and directly-scanned entries are exempt.
    const _phaseB_sentinels = new Set(['Null', 'Empty', '(empty)']);
    for (const [, _pbv] of agg) {
        for (const [_pbn, _pbe] of _pbv) {
            if (!_pbe.scannedDirectly && !_phaseB_sentinels.has(_pbn)) _pbe.count = 0;
        }
    }

    const countItems = [];
    for (const [paramName, byValue] of agg) {
        for (const [valueName, entry] of byValue) {
            for (const fileName of entry.files) {
                const fc = selectedFiles.find(sf => sf.egName === fileName);
                if (fc) {
                    const an = (window._paramApiNameCache[fc.egId]?.get(paramName)) || paramName;
                    // Skip Phase B for directly-scanned entries (count accurate from scan)
                    // and for sentinel values that the filter API cannot resolve.
                    if (entry.scannedDirectly || _phaseB_sentinels.has(valueName)) continue;
                    countItems.push({ fc, paramName, an, valueName, entry });
                }
            }
        }
    }

    let doneB = 0;
    for (let i = 0; i < countItems.length; i += CONCURRENCY) {
        if (modal.style.display === 'none') return;
        if (window._paramExplorerAgg !== agg) return;  // a newer Refresh has taken over
        await Promise.all(countItems.slice(i, i + CONCURRENCY).map(async ({ fc, paramName, an, valueName, entry }) => {
            try {
                const ev = valueName === '(empty)' ? '' : String(valueName).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                const pp = /\s/.test(an)
                    ? ("'property.name." + an.replace(/'/g, "\\'") + "'")
                    : ("property.name." + an.replace(/'/g, "\\'"));
                const filterArg = { query: `(${pp}=='${ev}') and ${INSTANCE_FILTER}` };
                let cnt = 0, cur = null;
                do {
                    const r = await executeGraphQLQuery(isV1 ? _cqV1 : _cqV2, {
                        elementGroupId: fc.egId,
                        filter: filterArg,
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
            subtitle.textContent = `Counting elements: ${doneB} / ${countItems.length}\u2026`;
            _peScheduleRender();
        }));
    }

    if (modal.style.display === 'none') return;
    if (window._paramExplorerAgg !== agg) return;  // a newer Refresh has taken over
    // Cancel any pending live-render rAF so it can't overwrite the final render
    if (_peRafId) { cancelAnimationFrame(_peRafId); _peRafId = null; }

    // Drop values confirmed absent by Phase B (count still 0 = not found in current extraction)
    // This cleans up stale entries returned by the distinctPropertyValues index.
    for (const { paramName, valueName } of countItems) {
        const bv = agg.get(paramName);
        if (bv && bv.get(valueName)?.count === 0) bv.delete(valueName);
    }
    for (const [pn, bv] of agg) { if (bv.size === 0) agg.delete(pn); }

    if (paramExplorerZoomState) {
        // Single-parameter mode: render zoom view directly instead of overview
        const byValue = (_peFilteredAgg() || agg).get(paramExplorerZoomState);
        const _paramFiles = byValue ? new Set([...byValue.values()].flatMap(e => [...e.files])) : new Set();
        const _zFileSuffix = n > 1 && _paramFiles.size > 0 ? `  \u00b7  found in ${_paramFiles.size} of ${n} files` : '';
        subtitle.textContent = `${paramExplorerZoomState}${_zFileSuffix}`;
        if (backBtn) backBtn.style.display = '';
        if (byValue) {
            _peRenderZoom(byValue, paramExplorerZoomState, treemapDiv);
        } else {
            treemapDiv.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">No data found for this parameter.</div>';
        }
    } else {
        subtitle.textContent = `${n} file${n !== 1 ? 's' : ''} \u00b7 ${checked.length} parameters`;
        _peRenderOverview(agg, treemapDiv, false);
    }
    if (searchInput) searchInput.style.display = '';
    const refreshBtnF = document.getElementById('paramExplorerRefreshBtn');
    if (refreshBtnF)  refreshBtnF.style.display = '';
}

function closeParameterExplorer() {
    const modal = document.getElementById('paramExplorerModal');
    if (modal) modal.style.display = 'none';
    if (paramExplorerTooltip) paramExplorerTooltip.style.display = 'none';
    paramExplorerZoomState = null;
}

// â”€â”€ zoom in: click a parameter tile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function paramExplorerZoomIn(paramName) {
    const agg = window._paramExplorerAgg;
    if (!agg || !agg.has(paramName)) return;
    paramExplorerZoomState = paramName;
    window._peZoomSelected   = new Set();  // clear tile selection on each zoom-in
    window._peCategoryFilter = new Set(); // clear category filter on each zoom-in

    const backBtn  = document.getElementById('paramExplorerBackBtn');
    const subtitle = document.getElementById('paramExplorerSubtitle');
    const search   = document.getElementById('paramExplorerSearch');
    if (backBtn)  backBtn.style.display = '';
    const filtAgg  = _peFilteredAgg() || agg;
    const _zByValue = (filtAgg.get(paramName)) || agg.get(paramName);
    const _zParamFiles = new Set([..._zByValue.values()].flatMap(e => [...e.files]));
    const _zTotalFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId)).length;
    const _zFileSuffix = _zTotalFiles > 1 ? `  \u00b7  found in ${_zParamFiles.size} of ${_zTotalFiles} files` : '';
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
        subtitle.textContent = `${n} file${n !== 1 ? 's' : ''} \u00b7 ${agg.size} parameters`;
    }
    if (agg) _peRenderOverview(_peFilteredAgg() || agg, document.getElementById('paramExplorerTreemap'), false);
}

// â”€â”€ shared tooltip helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ per-param compliance bar shown in zoom view â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    lbl.textContent = `âœ“ Allowed values:`;
    bar.appendChild(lbl);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'e.g. EI60, EI120 \u2013 Enter or Apply';
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
        clearBtn.textContent = 'âœ• Clear';
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
                    `<span style="color:#2e7d32;">âœ“ ${compliant.toLocaleString()}</span>` +
                    `&nbsp;&nbsp;<span style="color:#c62828;">âœ— ${nonCompliant.toLocaleString()}</span>`;
                bar.appendChild(summary);
            }
        }
    }

    input.addEventListener('keydown', e => { if (e.key === 'Enter') doApply(); });
    return bar;
}

// â”€â”€ compliance popover (triggered from âœŽ icon on a parameter tile) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ compliance bar: allowed-values input shown above every treemap view â”€â”€â”€â”€â”€â”€â”€
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
    lbl.textContent = 'âœ“ Compliance – Allowed values:';
    bar.appendChild(lbl);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'peCompAllowedInput';
    input.placeholder = 'e.g. EI60, EI120, EI30  \u2013 press Enter or Apply';
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
        clearBtn.textContent = 'âœ• Clear';
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
                `<span style="color:#2e7d32;">âœ“ ${compliant.toLocaleString()}</span>` +
                `&nbsp;&nbsp;<span style="color:#c62828;">âœ— ${nonCompliant.toLocaleString()}</span>`;
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

// â”€â”€ helper: filter global agg by hidden files â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
                const newCount = Math.round(entry.count * visibleFiles.length / Math.max(entry.files.size, 1));
                filteredByValue.set(value, {
                    count: newCount || entry.count,
                    categories: entry.categories,
                    files: new Set(visibleFiles)
                });
            }
        });
        if (filteredByValue.size > 0) filtered.set(paramName, filteredByValue);
    });
    return filtered;
}

// â”€â”€ helper: build clickable file-filter legend bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
            `border:1px solid ${isHidden ? '#ddd' : fileColor(f) + '88'}`,
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

// â”€â”€ param type helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Look up the friendly type label for a parameter name across all cached egIds.
function _peParamTypeLabel(paramName) {
    const typeCache = window._paramTypeCache || {};
    for (const egId in typeCache) {
        const t = (typeCache[egId] || new Map()).get(paramName);
        if (t) return _peTypeStrToLabel(t);
    }
    return null;
}

// Convert an Autodesk specification string to a short friendly label.
// Real format: "autodesk.parameter.aec:length-1.0.0"
// Extracts the type name between ":" and the version "-x.x.x".
function _peTypeStrToLabel(typeStr) {
    if (!typeStr) return null;
    const s = typeStr.toLowerCase();
    // Extract type name from URN: the segment after last ":" and before "-digit"
    const urnMatch = s.match(/:([a-z]+)/);
    const typeName = urnMatch ? urnMatch[1] : s;
    const map = {
        'length': 'Length',   'area': 'Area',       'volume': 'Volume',
        'angle': 'Angle',     'boolean': 'Bool',    'yesno': 'Yes/No',
        'integer': 'Int',     'int': 'Int',         'number': 'Number',
        'double': 'Number',   'real': 'Number',     'text': 'Text',
        'multilinetext': 'Text', 'string': 'Text',  'url': 'URL',
        'material': 'Material', 'force': 'Force',   'mass': 'Mass',
        'currency': 'Currency', 'energy': 'Energy', 'speed': 'Speed',
        'time': 'Time',       'temperature': 'Temp'
    };
    return map[typeName] || (urnMatch ? typeName.charAt(0).toUpperCase() + typeName.slice(1) : null);
}

// Pick a badge colour per type label (ACC-style muted tones).
function _peTypeBadgeColor(label) {
    const m = {
        'Text': '#0696d7', 'Bool': '#7b1fa2', 'Int': '#ef6c00',
        'Number': '#00897b', 'Length': '#1565c0', 'Area': '#2e7d32',
        'Volume': '#5d4037', 'Angle': '#558b2f', 'Material': '#c62828',
        'Force': '#6a1b9a', 'Mass': '#37474f', 'URL': '#0d47a1'
    };
    return m[label] || '#757575';
}

// â”€â”€ overview treemap (root → param → value) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Each parameter gets an EQUAL share of the canvas height so that parameters
// with few values are just as readable as those with many elements.
function _peRenderOverview(agg, container, isLive) {
    const params = [];
    agg.forEach((byValue, paramName) => {
        let total = 0;
        byValue.forEach(e => { total += e.count; });
        params.push({ paramName, byValue, total });
    });
    params.sort((a, b) => b.total - a.total);

    if (params.length === 0) {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">No parameters found yet\u2026</div>';
        return;
    }

    const color = d3.scaleOrdinal()
        .domain(params.map(p => p.paramName))
        .range(_PE_PALETTE);

    const allValueNames = params.flatMap(p => Array.from(p.byValue.keys()));
    const valueColor = d3.scaleOrdinal().domain(allValueNames).range(_PE_PALETTE);

    const allFiles = [...new Set(params.flatMap(p => [...p.byValue.values()].flatMap(e => [...e.files])))].sort();
    const allFilesForLegend = (() => {
        const src = window._paramExplorerAgg;
        if (!src) return allFiles;
        return [...new Set([...src.values()].flatMap(bv => [...bv.values()].flatMap(e => [...e.files])))].sort();
    })();
    const totalSelectedFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId)).length;
    const fileColor = d3.scaleOrdinal().domain(allFilesForLegend).range(_PE_PALETTE);

    const width   = Math.max(600, (container.clientWidth  || 1100) - 4);
    const height  = Math.max(200, (container.clientHeight || 600) - 4);
    const N       = params.length;
    const ROW_GAP = 6;
    const HEADER_H = 36;

    // Each parameter row gets equal height
    const rowH    = Math.max(80, Math.floor((height - ROW_GAP * (N - 1)) / N));
    const contentH = Math.max(40, rowH - HEADER_H);
    const totalSvgH = N * rowH + (N - 1) * ROW_GAP;

    const svg = d3.create('svg').attr('width', width).attr('height', totalSvgH)
        .style('user-select', 'none');

    params.forEach(({ paramName, byValue, total }, rowIndex) => {
        const y0   = rowIndex * (rowH + ROW_GAP);
        const rowG = svg.append('g').attr('transform', `translate(0,${y0})`).attr('data-paramname', paramName);

        // Row background
        rowG.append('rect')
            .attr('width', width).attr('height', rowH)
            .attr('fill', color(paramName)).attr('opacity', 0.10)
            .attr('rx', 4)
            .attr('stroke', color(paramName)).attr('stroke-width', 1.5).attr('stroke-opacity', 0.30);

        // â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const pav = (window._peParamAllowedValues || {})[paramName] || [];
        let compSuffix = '';
        if (pav.length > 0) {
            let ok = 0, notOk = 0;
            byValue.forEach((entry, val) => { pav.includes(val) ? ok += entry.count : notOk += entry.count; });
            compSuffix = `  âœ“${ok.toLocaleString()} âœ—${notOk.toLocaleString()}`;
        }
        const paramFileSet = new Set([...byValue.values()].flatMap(e => [...e.files]));
        const fileSuffix   = totalSelectedFiles > 1 ? `  \u00b7  ${paramFileSet.size}/${totalSelectedFiles} files` : '';

        const btnLabel = pav.length > 0 ? 'âœ“ Active' : 'Check Compliance';
        const btnW = pav.length > 0 ? 74 : 124;
        const btnH = 26;
        const showBtn = width >= btnW + 100;

        const reservedRight = showBtn ? btnW + 12 : 8;
        const maxChars = Math.max(6, Math.floor((width - reservedRight - 8) / 7.5));
        const label = paramName.length > maxChars ? paramName.slice(0, maxChars - 1) + '\u2026' : paramName;

        const typeLabel = _peParamTypeLabel(paramName);
        const hdrText = rowG.append('text')
            .attr('x', 8).attr('y', 23)
            .attr('font-size', '12px')
            .attr('font-weight', '700')
            .style('pointer-events', 'none');
        hdrText.append('tspan')
            .text(label)
            .attr('fill', pav.length > 0 ? '#1565c0' : '#111');
        if (typeLabel && width > 220) {
            hdrText.append('tspan')
                .text('  ' + typeLabel)
                .attr('font-size', '10px')
                .attr('font-weight', '600')
                .attr('fill', _peTypeBadgeColor(typeLabel))
                .attr('dx', 3);
        }
        if (width > 200 && (fileSuffix || compSuffix)) {
            hdrText.append('tspan')
                .text(fileSuffix + compSuffix)
                .attr('font-size', '11px')
                .attr('font-weight', '400')
                .attr('fill', '#586370');
        }

        if (showBtn) {
            const bx = width - btnW - 6;
            const by = 5;
            const btnG = rowG.append('g')
                .style('cursor', 'pointer')
                .style('pointer-events', 'all')
                .on('click', (event) => { event.stopPropagation(); _peShowCompliancePopover(event, paramName); });
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
                .attr('font-size', '11px').attr('fill', 'white').attr('font-weight', '600')
                .style('pointer-events', 'none');
        }

        // Transparent overlay on header area for zoom-in click
        rowG.append('rect')
            .attr('width', width - (showBtn ? btnW + 14 : 0)).attr('height', HEADER_H)
            .attr('fill', 'transparent')
            .style('cursor', 'zoom-in')
            .on('click', (event) => { event.stopPropagation(); paramExplorerZoomIn(paramName); })
            .on('mousemove', (event) => {
                _peShowTooltip(event,
                    `<div style="font-weight:700;margin-bottom:3px;">${paramName}</div>` +
                    `<div style="opacity:.8">Click to zoom in and explore values</div>` +
                    `<div><span style="opacity:.7">Distinct values:</span> ${byValue.size}</div>`
                );
            })
            .on('mouseout', _peHideTooltip);

        // â”€â”€ Per-parameter mini-treemap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const entries = Array.from(byValue.entries())
            .map(([value, entry]) => ({
                name: value, value: entry.count || 0, paramName,
                categories: [...entry.categories].sort(),
                files: [...entry.files].sort()
            }))
            .sort((a, b) => b.value - a.value);

        // When all counts are 0 (still loading), show equal-area placeholder tiles
        const allZero = entries.every(e => e.value === 0);
        if (allZero) entries.forEach(e => { e._sizeVal = 1; });
        else         entries.forEach(e => { e._sizeVal = e.value; });

        const vData = { name: paramName, children: entries };
        const vRoot = d3.hierarchy(vData).sum(d => d._sizeVal || 0).sort((a, b) => b.value - a.value);
        d3.treemap()
            .size([width, contentH])
            .paddingInner(2)
            .paddingOuter(3)
            .round(true)(vRoot);

        const tilesG = rowG.append('g').attr('transform', `translate(0,${HEADER_H})`);
        vRoot.leaves().forEach(leaf => {
            const lw = leaf.x1 - leaf.x0, lh = leaf.y1 - leaf.y0;
            if (lw < 2 || lh < 2) return;
            const tg = tilesG.append('g').attr('transform', `translate(${leaf.x0},${leaf.y0})`);
            const isSkipped = leaf.data.name === 'Skipped, Data Too Large';
            const tileColor = (() => {
                if (isSkipped) return '#bdbdbd';
                if (pav.length > 0) return pav.includes(leaf.data.name) ? '#388e3c' : '#e53935';
                if (allFilesForLegend.length > 1) {
                    const fs = leaf.data.files || [];
                    return fs.length === 1 ? fileColor(fs[0]) : '#9e9e9e';
                }
                return valueColor(leaf.data.name);
            })();
            tg.append('rect')
                .attr('width', lw).attr('height', lh)
                .attr('fill', tileColor).attr('opacity', 0.88)
                .attr('stroke', 'white').attr('stroke-width', 1).attr('rx', 2);
            if (lw >= 16 && lh >= 12) {
                const maxChars = Math.max(3, Math.floor(lw / 6.5));
                const rawName = leaf.data.name || '';
                const displayName = isSkipped ? rawName : _peFormatValue(rawName);
                const txt = displayName.length > maxChars
                    ? displayName.slice(0, maxChars - 1) + '\u2026'
                    : displayName;
                tg.append('text').attr('x', 4).attr('y', 13)
                    .text(isSkipped ? (lw > 80 ? 'âš  ' + txt : txt) : txt)
                    .attr('font-size', '10px')
                    .attr('fill', isSkipped ? '#616161' : '#111')
                    .attr('font-weight', '600')
                    .attr('font-style', isSkipped ? 'italic' : 'normal')
                    .style('pointer-events', 'none');
                if (lh >= 26 && !allZero && leaf.data.value > 0) {
                    tg.append('text').attr('x', 4).attr('y', 24)
                        .text(`${leaf.data.value.toLocaleString()}Ã—`)
                        .attr('font-size', '9px').attr('fill', isSkipped ? '#757575' : '#333')
                        .style('pointer-events', 'none');
                }
            }
            tg.style('cursor', 'zoom-in')
                .on('click', (event) => { event.stopPropagation(); paramExplorerZoomIn(leaf.data.paramName); })
                .on('mousemove', (event) => {
                    _peShowTooltip(event,
                        `<div style="font-weight:700;font-size:13px;margin-bottom:4px;">${leaf.data.paramName}</div>` +
                        `<div><span style="opacity:.7">Value:</span> <strong>${_peFormatValue(leaf.data.name)}</strong></div>` +
                        (isSkipped
                            ? `<div style="color:#f57c00;font-size:11px;margin-top:4px;">âš  The Autodesk API returned this placeholder because the property value exceeded its size limit. The actual value cannot be retrieved.</div>`
                            : `<div><span style="opacity:.7">Elements:</span> <strong>${allZero ? '\u2013' : leaf.data.value.toLocaleString()}</strong></div>`) +
                        `<div><span style="opacity:.7">Categories:</span> ${(leaf.data.categories || []).join(', ') || '\u2013'}</div>` +
                        `<div><span style="opacity:.7">Files:</span> ${(leaf.data.files || []).join(', ') || '\u2013'}</div>` +
                        `<div style="opacity:.6;font-size:10px;margin-top:4px;">Click to explore all values â€º</div>`
                    );
                })
                .on('mouseout', _peHideTooltip);
        });
    });

    // Live-load progress indicator
    if (isLive) {
        const totalToScan = Object.keys(window._peElementScanCache || {}).length;
        const doneSoFar   = window._peScanCompleted?.size ?? 0;
        const pct = totalToScan > 0 ? Math.round(doneSoFar / totalToScan * 100) : 0;
        svg.append('text')
            .attr('x', width - 6).attr('y', 14)
            .attr('text-anchor', 'end')
            .text('âŸ³ loading\u2026')
            .attr('font-size', '10px').attr('fill', '#999').attr('font-style', 'italic');

        container.innerHTML = '';
        // Progress bar strip above the SVG
        if (totalToScan > 0) {
            const pbWrap = document.createElement('div');
            pbWrap.style.cssText = 'padding:6px 8px 4px;background:#f5f5f5;border-bottom:1px solid #e0e0e0;';
            pbWrap.innerHTML =
                `<div style="display:flex;align-items:center;gap:8px;font-size:11px;color:#666;">` +
                `<span style="white-space:nowrap;flex-shrink:0;">Scanning ${doneSoFar}\u00a0/\u00a0${totalToScan} file${totalToScan !== 1 ? 's' : ''}</span>` +
                `<div style="flex:1;height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden;">` +
                `<div style="width:${pct}%;height:100%;background:#0696d7;border-radius:3px;transition:width .4s ease;"></div></div>` +
                `<span style="white-space:nowrap;flex-shrink:0;">${pct}%</span></div>`;
            container.appendChild(pbWrap);
        }
    } else {
        container.innerHTML = '';
    }
    if (allFilesForLegend.length > 1) {
        container.appendChild(_peBuildLegend(allFilesForLegend, fileColor));
    }
    container.appendChild(svg.node());
}

// â”€â”€ Zoom-view tile multi-select helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


function _peUpdateZoomSelBar(paramName) {
    const bar = document.getElementById('peZoomSelBar');
    if (!bar) return;
    const sel = window._peZoomSelected || new Set();
    if (sel.size === 0) {
        bar.innerHTML = '<span style="color:#bbb;font-size:12px;">Click tiles to select \xb7 then use Show in Viewer \u25ba</span>';
        return;
    }
    let totalEls = 0;
    if (window._peZoomElementTiles) {
        // Inner element view: each selected tile = 1 element
        sel.forEach(v => { if (window._peZoomElementTiles.has(v)) totalEls += 1; });
    } else if (window._peNameAgg) {
        // Outer name view: count all elements with that name
        sel.forEach(v => { totalEls += (window._peNameAgg.get(v)?.count || 0); });
    } else {
        // Fallback value view (Phase B / no scan cache)
        const agg = window._paramExplorerAgg;
        const byValue = agg?.get(paramName);
        if (byValue) sel.forEach(v => {
            const exp = window._peExpandedEmptyTiles?.get(v);
            if (exp) { totalEls += exp.overflow ?? 1; }
            else { totalEls += (byValue.get(v)?.count || 0); }
        });
    }
    // Check if scan is still in progress for any selected files
    const scanCompleted = window._peScanCompleted;
    let scanInProgress = false;
    if (scanCompleted !== undefined && window._peElementScanCache) {
        // Collect egIds referenced by current selection
        let selEgIds = new Set();
        if (window._peZoomElementTiles) {
            sel.forEach(v => { const t = window._peZoomElementTiles.get(v); if (t) selEgIds.add(t.egId); });
        } else if (window._peNameAgg) {
            sel.forEach(v => { (window._peNameAgg.get(v)?.elements || []).forEach(e => selEgIds.add(e.egId)); });
        }
        scanInProgress = [...selEgIds].some(id => !scanCompleted.has(id));
    }

    const isElemView = !!window._peZoomElementTiles;
    const isNameView = !isElemView && !!window._peNameAgg;
    const selLabel = isElemView
        ? `<strong>${totalEls.toLocaleString()}</strong> element${totalEls !== 1 ? 's' : ''} selected`
        : `<strong>${sel.size}</strong> ${isNameView ? 'name' : 'value'}${sel.size > 1 ? 's' : ''} selected &nbsp;\xb7&nbsp; <strong>${totalEls.toLocaleString()}</strong> element${totalEls !== 1 ? 's' : ''}`;

    const viewerBtn = scanInProgress
        ? `<button id="peZoomSelView" disabled style="padding:4px 14px;font-size:12px;background:#b0bec5;color:white;border:none;border-radius:4px;cursor:not-allowed;font-weight:600;" title="Scan still running \u2014 please wait">\u23f3 Scanning\u2026</button>`
        : `<button id="peZoomSelView" style="padding:4px 14px;font-size:12px;background:#0696d7;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;">Show in Viewer \u25ba</button>`;

    bar.innerHTML =
        `<span>${selLabel}</span>` +
        `<button id="peZoomSelClear" style="margin-left:auto;padding:4px 10px;font-size:12px;background:transparent;color:#c62828;border:1px solid #ef9a9a;border-radius:4px;cursor:pointer;">\u2715 Clear</button>` +
        viewerBtn;
    document.getElementById('peZoomSelClear').addEventListener('click', _peClearZoomSelection);
    if (!scanInProgress) document.getElementById('peZoomSelView').addEventListener('click', _peOpenSelectedInViewer);
}

function _peClearZoomSelection() {
    window._peZoomSelected = new Set();
    // In inner element view, go back to name view on clear
    if (window._peZoomElementTiles) {
        window._peZoomDrillName = null;
        window._peZoomElementTiles = null;
    }
    const bar = document.getElementById('peZoomSelBar');
    const paramName = bar?.dataset.paramname;
    if (!paramName) return;
    const agg = _peFilteredAgg() || window._paramExplorerAgg;
    const byValue = agg?.get(paramName);
    const cont = document.getElementById('paramExplorerTreemap');
    if (byValue) _peRenderZoom(byValue, paramName, cont);
}

// Flexible property finder used in element scans.
// Tries: exact API name → underscoreâ†”space → case-insensitive → display name variants.


async function _peBgCountSentinel(paramName, sentinelValue, byValue, container) {
    const entry = byValue?.get(sentinelValue);
    if (!entry || entry._counting) return;
    entry._counting = true;

    // Show a "\u2026" count while scanning
    container.querySelectorAll(`[data-peval="${CSS.escape(sentinelValue)}"] text:nth-child(2)`)
        .forEach(t => t.textContent = '\u2026');

    const isV1 = example1State.version === 'v1';
    const scanKey = isV1 ? 'elementsByElementGroupAtVersion' : 'elementsByElementGroup';
    const scanQ = isV1
        ? `query ScanV1($elementGroupId:ID!,$pagination:PaginationInput){elementsByElementGroupAtVersion(elementGroupId:$elementGroupId,versionNumber:1,pagination:$pagination){pagination{cursor}results{properties(pagination:{limit:500}){results{name value}}}}}`
        : `query Scan($elementGroupId:ID!,$pagination:PaginationInput){elementsByElementGroup(elementGroupId:$elementGroupId,pagination:$pagination){pagination{cursor}results{properties(pagination:{limit:500}){results{name value}}}}}`;

    let totalCount = 0;
    try {
        for (const fileName of entry.files) {
            const fc = (example1State.fileSummary || []).find(f => selectedEgIds.has(f.egId) && f.egName === fileName);
            if (!fc) continue;
            const an = (window._paramApiNameCache[fc.egId]?.get(paramName)) || paramName;
            let cursor = null;
            do {
                const rs = await executeGraphQLQuery(scanQ, {
                    elementGroupId: fc.egId,
                    pagination: cursor ? { cursor, limit: 200 } : { limit: 200 }
                }, example1State.region);
                const pageData = rs.data?.[scanKey];
                for (const el of (pageData?.results || [])) {
                    const props = el.properties?.results || [];
                    if (!_peFindRevitIdValue(props)) continue;
                    const pp = _peFindPropByName(props, an, paramName);
                    if (_peSentinelValueMatch(pp, sentinelValue)) totalCount++;
                }
                cursor = pageData?.pagination?.cursor || null;
            } while (cursor);
        }
    } catch (e) {
        logDebug(`_peBgCountSentinel ${sentinelValue}: ${e.message}`);
    }

    entry.count = totalCount;
    entry._counting = false;

    // Re-render zoom to show the real count
    if (paramExplorerZoomState === paramName && document.getElementById('paramExplorerTreemap') === container) {
        _peRenderZoom(byValue, paramName, container);
    }
}

// â”€â”€ Name-based aggregation helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Builds Map<elementName, {count, files: Set, elements: [{revitId, paramValue, egId, fileName}]}>
// from the forceElementScan cache. Returns null if no cache is available.
function _peBuildNameAgg(paramName) {
    const cache = window._peElementScanCache;
    if (!cache) return null;
    const hidden = window._peHiddenFiles || new Set();
    const nameAgg = new Map();
    const allFiles = example1State.fileSummary || [];
    for (const egId of Object.keys(cache)) {
        const fileCache = cache[egId];
        if (!fileCache?.[paramName]) continue;
        const fileEntry = allFiles.find(f => f.egId === egId);
        const fileName = fileEntry?.egName || egId;
        if (hidden.has(fileName)) continue;
        const names      = fileCache._names      || {};
        const categories = fileCache._categories || {};
        for (const [value, revitIds] of Object.entries(fileCache[paramName])) {
            if (!Array.isArray(revitIds)) continue;
            for (const revitId of revitIds) {
                const elName  = names[revitId]      || '(unnamed)';
                const catName = categories[revitId] || '';
                if (!nameAgg.has(elName)) nameAgg.set(elName, { count: 0, files: new Set(), categories: new Set(), elements: [] });
                const grp = nameAgg.get(elName);
                grp.count++;
                grp.files.add(fileName);
                if (catName) grp.categories.add(catName);
                grp.elements.push({ revitId, paramValue: value, egId, fileName, category: catName });
            }
        }
    }
    return nameAgg.size > 0 ? nameAgg : null;
}

// â”€â”€ Outer name-tile view â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Renders one tile per unique element name. Double-click drills into that name.
function _peRenderZoomNames(byValue, paramName, container, nameAgg) {
    window._peNameAgg = nameAgg;
    window._peZoomElementTiles = null;

    const allNameEntries = [...nameAgg.entries()].sort((a, b) => b[1].count - a[1].count);

    // ── Category filter ────────────────────────────────────────────────────────
    const allCategories = [...new Set(allNameEntries.flatMap(([, g]) => [...(g.categories || [])]))].sort();
    const selectedCats  = window._peCategoryFilter instanceof Set ? window._peCategoryFilter : new Set();
    const nameEntries   = selectedCats.size > 0
        ? allNameEntries.filter(([, g]) => [...(g.categories || [])].some(c => selectedCats.has(c)))
        : allNameEntries;

    const allFilesForLegend = (() => {
        const src = window._paramExplorerAgg;
        if (!src) return [...new Set(nameEntries.flatMap(([, g]) => [...g.files]))].sort();
        return [...new Set([...src.values()].flatMap(bv => [...bv.values()].flatMap(e => [...e.files])))].sort();
    })();
    const fileColor = d3.scaleOrdinal().domain(allFilesForLegend).range(_PE_PALETTE);

    container.innerHTML = '';

    // ── Combined filter bar: [Files | Categories] toggle + pills ────────────────
    const _CAT_PALETTE = ['#78909c','#8d6e63','#66bb6a','#ffa726','#ab47bc','#42a5f5','#ef5350','#26a69a','#d4e157','#ff7043'];
    const catColor     = d3.scaleOrdinal().domain(allCategories).range(_CAT_PALETTE);
    const hasMultiFile = allFilesForLegend.length > 1;
    const hasMultiCat  = allCategories.length > 1;
    const showToggle   = hasMultiFile && hasMultiCat;
    const activeMode   = showToggle ? (window._peColorBy || 'file') : (hasMultiFile ? 'file' : 'category');

    if (hasMultiFile || hasMultiCat) {
        const bar = document.createElement('div');
        bar.style.cssText = [
            'display:flex', 'flex-wrap:wrap', 'gap:5px',
            'padding:5px 10px', 'background:#f5f5f5',
            'border-bottom:1px solid #e0e0e0',
            'font-size:11px', 'color:#333', 'align-items:center'
        ].join(';');

        if (showToggle) {
            const seg = document.createElement('span');
            seg.style.cssText = 'display:inline-flex;border-radius:6px;overflow:hidden;border:1px solid #bbb;flex-shrink:0;margin-right:4px;';
            [['file','Files'],['category','Categories']].forEach(([val, label], i) => {
                const btn = document.createElement('span');
                const isOn = activeMode === val;
                btn.style.cssText = [
                    'padding:2px 10px', 'cursor:pointer',
                    `background:${isOn ? '#555' : 'white'}`, `color:${isOn ? 'white' : '#777'}`,
                    'font-size:10px', 'font-weight:600', 'user-select:none',
                    ...(i === 0 ? ['border-right:1px solid #bbb'] : [])
                ].join(';');
                btn.textContent = label;
                btn.addEventListener('click', () => {
                    window._peColorBy = val;
                    _peRenderZoomNames(byValue, paramName, container, nameAgg);
                });
                seg.appendChild(btn);
            });
            bar.appendChild(seg);
        } else {
            const lbl = document.createElement('span');
            lbl.style.cssText = 'font-weight:600;color:#888;margin-right:4px;flex-shrink:0;font-size:10px;text-transform:uppercase;letter-spacing:.04em;';
            lbl.textContent = activeMode === 'file' ? 'Filter files:' : 'Filter category:';
            bar.appendChild(lbl);
        }

        if (activeMode === 'file') {
            const hidden = window._peHiddenFiles || new Set();
            allFilesForLegend.forEach(f => {
                const isHidden = hidden.has(f);
                const item = document.createElement('span');
                item.title = isHidden ? `Click to show "${f}"` : `Click to hide "${f}"`;
                item.style.cssText = [
                    'display:inline-flex', 'align-items:center', 'gap:4px',
                    'cursor:pointer', 'padding:2px 8px 2px 5px', 'border-radius:10px',
                    `border:1px solid ${isHidden ? '#ddd' : fileColor(f) + '88'}`,
                    `background:${isHidden ? '#f0f0f0' : 'white'}`,
                    `opacity:${isHidden ? '0.45' : '1'}`,
                    'transition:opacity .15s,border-color .15s', 'user-select:none'
                ].join(';');
                const sw = document.createElement('span');
                sw.style.cssText = ['width:10px','height:10px','border-radius:2px',`background:${fileColor(f)}`,'display:inline-block','flex-shrink:0'].join(';');
                const txt = document.createElement('span');
                txt.style.cssText = isHidden ? 'text-decoration:line-through;color:#aaa;' : '';
                txt.textContent = f;
                item.appendChild(sw); item.appendChild(txt);
                item.addEventListener('click', () => {
                    if (!window._peHiddenFiles) window._peHiddenFiles = new Set();
                    if (window._peHiddenFiles.has(f)) window._peHiddenFiles.delete(f);
                    else window._peHiddenFiles.add(f);
                    const cont = document.getElementById('paramExplorerTreemap');
                    const filtAgg = _peFilteredAgg();
                    if (paramExplorerZoomState) {
                        const bv = (filtAgg || window._paramExplorerAgg)?.get(paramExplorerZoomState);
                        const na = _peBuildNameAgg(paramExplorerZoomState);
                        if (bv && na) _peRenderZoomNames(bv, paramExplorerZoomState, cont, na);
                    } else _peRenderOverview(filtAgg || new Map(), cont, false);
                });
                bar.appendChild(item);
            });
        } else {
            allCategories.forEach(cat => {
                const isActive = selectedCats.size === 0 || selectedCats.has(cat);
                const item = document.createElement('span');
                item.title = selectedCats.has(cat) ? `Click to deselect "${cat}"` : `Click to filter by "${cat}"`;
                item.style.cssText = [
                    'display:inline-flex', 'align-items:center', 'gap:4px',
                    'cursor:pointer', 'padding:2px 8px 2px 5px', 'border-radius:10px',
                    `border:1px solid ${isActive ? catColor(cat) + '88' : '#ddd'}`,
                    `background:${isActive ? 'white' : '#f0f0f0'}`,
                    `opacity:${isActive ? '1' : '0.45'}`,
                    'transition:opacity .15s,border-color .15s', 'user-select:none'
                ].join(';');
                const sw = document.createElement('span');
                sw.style.cssText = ['width:10px','height:10px','border-radius:2px',`background:${catColor(cat)}`,'display:inline-block','flex-shrink:0'].join(';');
                const txt = document.createElement('span');
                txt.style.cssText = isActive ? '' : 'text-decoration:line-through;color:#aaa;';
                txt.textContent = cat;
                item.appendChild(sw); item.appendChild(txt);
                item.addEventListener('click', () => {
                    if (!(window._peCategoryFilter instanceof Set)) window._peCategoryFilter = new Set();
                    if (window._peCategoryFilter.has(cat)) window._peCategoryFilter.delete(cat);
                    else window._peCategoryFilter.add(cat);
                    _peRenderZoomNames(byValue, paramName, container, nameAgg);
                });
                bar.appendChild(item);
            });
        }
        container.appendChild(bar);
    }

    const selBar = document.createElement('div');
    selBar.id = 'peZoomSelBar';
    selBar.dataset.paramname = paramName;
    selBar.style.cssText = 'display:flex;padding:7px 12px;background:#f0f7ff;border:1px solid #b8d9f5;border-radius:6px;margin:4px 4px 0;flex-direction:row;align-items:center;gap:10px;font-size:13px;flex-wrap:wrap;';
    container.appendChild(selBar);
    _peUpdateZoomSelBar(paramName);

    const _nonSvgH = Array.from(container.children).reduce((s, el) => s + el.offsetHeight, 0);
    const width  = Math.max(600, (container.clientWidth  || 1100) - 4);
    const height = Math.max(200, (container.clientHeight || 600) - _nonSvgH - 4);

    const data = {
        name: paramName,
        children: nameEntries.map(([name, grp]) => ({
            name, value: Math.max(grp.count, 1), count: grp.count,
            files: [...grp.files].sort(),
            categories: [...(grp.categories || [])].sort()
        }))
    };

    const root = d3.hierarchy(data).sum(d => d.value || 0).sort((a, b) => b.value - a.value);
    d3.treemap().size([width, height]).paddingInner(3).paddingOuter(6).round(true)(root);

    const svg  = d3.create('svg').attr('width', width).attr('height', height).style('user-select', 'none');
    const node = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .attr('data-peval', d => d.data.name)
        .style('cursor', 'pointer')
        .on('mousedown', e => e.preventDefault());

    node.append('rect')
        .attr('width',  d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill', d => {
            if (activeMode === 'category') {
                const cats = d.data.categories || [];
                return cats.length === 1 ? catColor(cats[0]) : '#9e9e9e';
            }
            const fs = d.data.files || [];
            return allFilesForLegend.length > 1
                ? (fs.length === 1 ? fileColor(fs[0]) : '#9e9e9e')
                : '#5c97bd';
        })
        .attr('opacity', 0.88).attr('stroke', 'white').attr('stroke-width', 1).attr('rx', 3);

    node.each(function(d) {
        const w = d.x1 - d.x0, h = d.y1 - d.y0;
        if (w < 16 || h < 14) return;
        const g = d3.select(this);
        const maxChars = Math.max(4, Math.floor(w / 7));
        const label = d.data.name.length > maxChars ? d.data.name.slice(0, maxChars - 1) + '\u2026' : d.data.name;
        g.append('text').attr('x', 6).attr('y', 15).text(label)
            .attr('font-size', '11px').attr('fill', '#111').attr('font-weight', '700')
            .style('pointer-events', 'none');
        if (h >= 30) {
            g.append('text').attr('x', 6).attr('y', 28).text(d.data.count.toLocaleString())
                .attr('font-size', '9px').attr('fill', '#333').style('pointer-events', 'none');
        }
        if (h >= 44) {
            g.append('text').attr('x', 6).attr('y', 40).text('\u25b6 double-click to expand')
                .attr('font-size', '8px').attr('fill', '#555').attr('font-style', 'italic')
                .style('pointer-events', 'none');
        }
    });

    node.on('click', (event, d) => {
        if (!window._peZoomSelected) window._peZoomSelected = new Set();
        if (event.detail >= 2) {
            // Double-click: drill into this name
            window._peZoomDrillName = d.data.name;
            window._peZoomDrillParam = paramName;
            window._peZoomSelected = new Set();
            _peRenderZoom(byValue, paramName, container);
        } else {
            // Single click: toggle selection
            if (window._peZoomSelected.has(d.data.name)) {
                window._peZoomSelected.delete(d.data.name);
                d3.select(event.currentTarget).select('rect').attr('stroke', 'white').attr('stroke-width', 1).attr('opacity', 0.88);
            } else {
                window._peZoomSelected.add(d.data.name);
                d3.select(event.currentTarget).select('rect').attr('stroke', '#1565c0').attr('stroke-width', 3).attr('opacity', 1.0);
            }
            _peUpdateZoomSelBar(paramName);
        }
    });
    node.on('mousemove', (event, d) => {
        const isSelected = window._peZoomSelected?.has(d.data.name);
        _peShowTooltip(event,
            `<div style="font-weight:700;font-size:13px;margin-bottom:4px;">${paramName}</div>` +
            `<div><span style="opacity:.7">Element name:</span> <strong>${d.data.name}</strong></div>` +
            `<div><span style="opacity:.7">Elements:</span> <strong>${d.data.count.toLocaleString()}</strong></div>` +
            `<div><span style="opacity:.7">Files:</span> ${(d.data.files || []).join(', ') || '\u2014'}</div>` +
            `<div style="opacity:.6;font-size:10px;margin-top:4px;">${isSelected ? 'Click to deselect \xb7 Double-click to drill in' : 'Click to select \xb7 Double-click to see individual elements'}</div>`
        );
    }).on('mouseout', _peHideTooltip);

    container.appendChild(svg.node());

    if (window._peZoomSelected?.size > 0) {
        node.each(function(d) {
            if (window._peZoomSelected.has(d.data.name)) {
                d3.select(this).select('rect').attr('stroke', '#1565c0').attr('stroke-width', 3).attr('opacity', 1.0);
            }
        });
    }
}

// â”€â”€ Inner element-tile view (drill-down for one element name) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Shows one tile per element. Label = parameter value. Back button returns to name view.
function _peRenderZoomElements(byValue, paramName, container, nameAgg, drillName) {
    const elements = nameAgg.get(drillName)?.elements || [];

    // Sort alphanumerically by paramValue; (empty) always last
    const sorted = [...elements].sort((a, b) => {
        if (a.paramValue === '(empty)' && b.paramValue !== '(empty)') return 1;
        if (a.paramValue !== '(empty)' && b.paramValue === '(empty)') return -1;
        return a.paramValue.localeCompare(b.paramValue, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Build lookup map: synthetic key → tile data (preserving sorted order)
    window._peZoomElementTiles = new Map();
    sorted.forEach((el, idx) => {
        window._peZoomElementTiles.set(`elem::${idx}`, {
            revitId: el.revitId, egId: el.egId, fileName: el.fileName, paramValue: el.paramValue
        });
    });

    // Value-based color scale: distinct non-empty values → palette; (empty) → grey
    const distinctValues = [...new Set(sorted.map(e => e.paramValue).filter(v => v !== '(empty)'))];
    const valueColor = d3.scaleOrdinal().domain(distinctValues).range(_PE_PALETTE);
    const getElemColor = pv => pv === '(empty)' ? '#b0bec5' : valueColor(pv);

    container.innerHTML = '';

    // Back navigation bar
    const backBar = document.createElement('div');
    backBar.style.cssText = 'padding:6px 12px;background:#e3f2fd;border-bottom:1px solid #90caf9;display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;border-radius:4px 4px 0 0;';
    backBar.innerHTML = `<span style="font-size:16px;">\u25c4</span><strong>${drillName}</strong><span style="opacity:.6;font-size:11px;">${elements.length.toLocaleString()} element${elements.length !== 1 ? 's' : ''} \xb7 ${paramName}</span>`;
    backBar.title = 'Back to element names';
    backBar.addEventListener('click', () => {
        window._peZoomDrillName = null;
        window._peZoomSelected = new Set();
        window._peZoomElementTiles = null;
        _peRenderZoom(byValue, paramName, container);
    });
    container.appendChild(backBar);

    // Value legend (one swatch per distinct value)
    const legendValues = [...distinctValues];
    const hasEmpty = sorted.some(e => e.paramValue === '(empty)');
    if (hasEmpty) legendValues.push('(empty)');
    if (legendValues.length > 0) {
        const legend = document.createElement('div');
        legend.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px 12px;padding:5px 12px;font-size:11px;background:#fafafa;border-bottom:1px solid #e0e0e0;';
        legendValues.forEach(v => {
            const item = document.createElement('span');
            item.style.cssText = 'display:inline-flex;align-items:center;gap:4px;cursor:pointer;';
            item.innerHTML = `<span style="width:12px;height:12px;border-radius:2px;background:${getElemColor(v)};display:inline-block;flex-shrink:0;"></span>${_peFormatValue(v)}`;
            item.title = `Select all "${v}"`;
            item.addEventListener('click', () => {
                if (!window._peZoomSelected) window._peZoomSelected = new Set();
                window._peZoomElementTiles.forEach((tile, key) => {
                    if (tile.paramValue === v) window._peZoomSelected.add(key);
                });
                _peRenderZoom(byValue, paramName, container);
            });
            legend.appendChild(item);
        });
        container.appendChild(legend);
    }

    const selBar = document.createElement('div');
    selBar.id = 'peZoomSelBar';
    selBar.dataset.paramname = paramName;
    selBar.style.cssText = 'display:flex;padding:7px 12px;background:#f0f7ff;border:1px solid #b8d9f5;border-radius:6px;margin:4px 4px 0;flex-direction:row;align-items:center;gap:10px;font-size:13px;flex-wrap:wrap;';
    container.appendChild(selBar);
    _peUpdateZoomSelBar(paramName);

    const _nonSvgH = Array.from(container.children).reduce((s, el) => s + el.offsetHeight, 0);
    const width  = Math.max(600, (container.clientWidth  || 1100) - 4);
    const height = Math.max(200, (container.clientHeight || 600) - _nonSvgH - 4);

    const data = {
        name: paramName,
        children: [...window._peZoomElementTiles.entries()].map(([key, tile]) => ({
            name: key, value: 1, count: 1,
            paramValue: tile.paramValue, revitId: tile.revitId,
            files: [tile.fileName]
        }))
    };

    // Do not re-sort \u2013 preserve the alphanumeric order established above
    const root = d3.hierarchy(data).sum(d => d.value || 0);
    d3.treemap().size([width, height]).paddingInner(2).paddingOuter(4).round(true)(root);

    const svg  = d3.create('svg').attr('width', width).attr('height', height).style('user-select', 'none');
    const node = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .attr('data-peval', d => d.data.paramValue)
        .style('cursor', 'pointer')
        .on('mousedown', e => e.preventDefault());

    node.append('rect')
        .attr('width',  d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill', d => getElemColor(d.data.paramValue))
        .attr('opacity', 0.88).attr('stroke', 'white').attr('stroke-width', 1).attr('rx', 2);

    node.each(function(d) {
        const w = d.x1 - d.x0, h = d.y1 - d.y0;
        if (w < 16 || h < 14) return;
        const g = d3.select(this);
        const label = _peFormatValue(d.data.paramValue);
        const maxChars = Math.max(4, Math.floor(w / 7));
        g.append('text').attr('x', 4).attr('y', 13)
            .text(label.length > maxChars ? label.slice(0, maxChars - 1) + '\u2026' : label)
            .attr('font-size', '10px').attr('fill', '#111').attr('font-weight', '600')
            .style('pointer-events', 'none');
        if (h >= 26) {
            const shortId = d.data.revitId ? String(d.data.revitId).slice(-6) : '';
            g.append('text').attr('x', 4).attr('y', 24).text(shortId)
                .attr('font-size', '8px').attr('fill', '#444').style('pointer-events', 'none');
        }
    });

    node.on('click', (event, d) => {
        if (!window._peZoomSelected) window._peZoomSelected = new Set();
        if (window._peZoomSelected.has(d.data.name)) {
            window._peZoomSelected.delete(d.data.name);
            d3.select(event.currentTarget).select('rect').attr('stroke', 'white').attr('stroke-width', 1).attr('opacity', 0.88);
        } else {
            window._peZoomSelected.add(d.data.name);
            d3.select(event.currentTarget).select('rect').attr('stroke', '#1565c0').attr('stroke-width', 3).attr('opacity', 1.0);
        }
        _peUpdateZoomSelBar(paramName);
    });
    node.on('mousemove', (event, d) => {
        const isSelected = window._peZoomSelected?.has(d.data.name);
        const tile = window._peZoomElementTiles?.get(d.data.name);
        _peShowTooltip(event,
            `<div style="font-weight:700;font-size:13px;margin-bottom:4px;">${paramName}</div>` +
            `<div><span style="opacity:.7">Element:</span> <strong>${drillName}</strong></div>` +
            `<div><span style="opacity:.7">Value:</span> <strong>${_peFormatValue(d.data.paramValue)}</strong></div>` +
            `<div><span style="opacity:.7">Revit ID:</span> ${tile?.revitId || '\u2014'}</div>` +
            `<div><span style="opacity:.7">File:</span> ${(d.data.files || []).join(', ') || '\u2014'}</div>` +
            `<div style="opacity:.6;font-size:10px;margin-top:4px;">${isSelected ? 'Click to deselect' : 'Click to select \xb7 then use Show in Viewer \u25ba'}</div>`
        );
    }).on('mouseout', _peHideTooltip);

    container.appendChild(svg.node());

    if (window._peZoomSelected?.size > 0) {
        node.each(function(d) {
            if (window._peZoomSelected.has(d.data.name)) {
                d3.select(this).select('rect').attr('stroke', '#1565c0').attr('stroke-width', 3).attr('opacity', 1.0);
            }
        });
    }
}

// â”€â”€ zoom treemap (flat: root → values for one parameter) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _peRenderZoom(byValue, paramName, container) {
    // â”€â”€ Two-level name hierarchy (when forceElementScan cache is available) â”€â”€â”€â”€â”€
    const nameAgg = _peBuildNameAgg(paramName);
    if (nameAgg) {
        window._peNameAgg = nameAgg;
        // Reset drill state when switching parameters
        if (window._peZoomDrillParam !== paramName) {
            window._peZoomDrillName = null;
            window._peZoomDrillParam = paramName;
            window._peZoomSelected = new Set();
        }
        const drillName = window._peZoomDrillName;
        if (drillName && nameAgg.has(drillName)) {
            _peRenderZoomElements(byValue, paramName, container, nameAgg, drillName);
        } else {
            if (drillName) window._peZoomDrillName = null; // stale drill name \u2013 reset
            _peRenderZoomNames(byValue, paramName, container, nameAgg);
        }
        return;
    }
    // â”€â”€ If the scan is still in progress, show a progress state instead of
    // the flat fallback (the zoom view will auto-refresh via _peScheduleRender
    // once each file's data is ready).
    if (window._peScanCompleted !== undefined && window._peElementScanCache !== null) {
        const totalToScan = Object.keys(window._peElementScanCache).length;
        const doneSoFar   = window._peScanCompleted.size;
        if (doneSoFar < totalToScan) {
            const pct = totalToScan > 0 ? Math.round(doneSoFar / totalToScan * 100) : 0;
            container.innerHTML =
                `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;` +
                `height:100%;gap:16px;padding:48px;color:#555;">
                    <div style="font-size:14px;font-weight:600;">Scanning elements for <em>${_peEsc(paramName)}</em>\u2026</div>
                    <div style="width:min(420px,80%);background:#e0e0e0;height:10px;border-radius:5px;overflow:hidden;">
                        <div style="width:${pct}%;height:100%;background:#0696d7;border-radius:5px;transition:width .4s ease;"></div>
                    </div>
                    <div style="font-size:12px;color:#888;">${doneSoFar} / ${totalToScan} file${totalToScan !== 1 ? 's' : ''} done \u2013 view updates automatically</div>
                </div>`;
            return;
        }
    }
    // â”€â”€ Fallback: value-based flat treemap (Phase B counts / no scan cache) â”€â”€â”€â”€â”€
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

    // â”€â”€ Expand (empty)[FileName] tiles into per-element tiles using the scan cache.
    // Each file gets at most EMPTY_TILE_CAP individual tiles; the rest become one overflow tile.
    // _peExpandedEmptyTiles maps synthetic tile name → {revitId, parentKey, fileName, egId, startIdx?}
    const EMPTY_TILE_CAP = 150;
    window._peExpandedEmptyTiles = new Map();
    const fileSummaryList = example1State.fileSummary || [];
    const displayValues = [];
    for (const v of values) {
        if (!v.value.startsWith('(empty) [')) { displayValues.push(v); continue; }
        const fileName = v.value.slice('(empty) ['.length, -1);
        const fileEnt = fileSummaryList.find(f => f.egName === fileName);
        const cachedIds = fileEnt
            ? (window._peElementScanCache?.[fileEnt.egId]?.[paramName]?.['(empty)'] || [])
            : [];
        if (cachedIds.length === 0) { displayValues.push(v); continue; } // no cache \u2013 keep original
        const shown = cachedIds.slice(0, EMPTY_TILE_CAP);
        shown.forEach((rid, idx) => {
            const synKey = `${v.value}::${idx}`;
            window._peExpandedEmptyTiles.set(synKey, { revitId: rid, parentKey: v.value, fileName, egId: fileEnt.egId });
            displayValues.push({ value: synKey, count: 1, categories: v.categories, files: v.files,
                                  _parentKey: v.value, _displayName: rid });
        });
        if (cachedIds.length > EMPTY_TILE_CAP) {
            const overflow = cachedIds.length - EMPTY_TILE_CAP;
            const overflowKey = `${v.value}::\u2026more`;
            window._peExpandedEmptyTiles.set(overflowKey, { revitId: null, parentKey: v.value,
                fileName, egId: fileEnt.egId, overflow, startIdx: EMPTY_TILE_CAP });
            displayValues.push({ value: overflowKey, count: overflow, categories: v.categories, files: v.files,
                                  _parentKey: v.value, _displayName: `\u2026${overflow} more` });
        }
    }

    // Per-file coloring \u2013 stable scale from full unfiltered agg so colors don't shift when toggling
    const allFiles = [...new Set(displayValues.flatMap(v => v.files))].sort();
    const allFilesForLegend = (() => {
        const src = window._paramExplorerAgg;
        if (!src) return allFiles;
        return [...new Set([...src.values()].flatMap(bv => [...bv.values()].flatMap(e => [...e.files])))].sort();
    })();
    const totalSelectedFiles = (example1State.fileSummary || []).filter(f => selectedEgIds.has(f.egId)).length;
    const fileColor  = d3.scaleOrdinal().domain(allFilesForLegend).range(_PE_PALETTE);
    const colorDomain = [...new Set(displayValues.map(v => v._parentKey || v.value))];
    const valueColor = d3.scaleOrdinal().domain(colorDomain).range(_PE_PALETTE);

    // When ALL values have count=0 (Phase B hasn't run), give every tile equal area=1.
    const allZeroCount = values.every(v => v.count === 0);

    const data = {
        name: paramName,
        children: displayValues.map(v => ({
            name: v.value,
            // individual expanded tiles already have count=1; non-indexed params (allZeroCount) get 1
            value: allZeroCount ? 1 : Math.max(v.count, 1),
            count: v.count,
            categories: v.categories, files: v.files,
            _parentKey: v._parentKey, _displayName: v._displayName
        }))
    };

    // Set up fixed elements first so their height can be measured for accurate SVG sizing.
    // This prevents layout shift when the selection bar updates (it's always present).
    container.innerHTML = '';
    if (allFilesForLegend.length > 1) {
        container.appendChild(_peBuildLegend(allFilesForLegend, fileColor));
    }
    const selBar = document.createElement('div');
    selBar.id = 'peZoomSelBar';
    selBar.dataset.paramname = paramName;
    selBar.style.cssText = 'display:flex;padding:7px 12px;background:#f0f7ff;border:1px solid #b8d9f5;border-radius:6px;margin:4px 4px 0;flex-direction:row;align-items:center;gap:10px;font-size:13px;flex-wrap:wrap;';
    container.appendChild(selBar);
    _peUpdateZoomSelBar(paramName);  // populate bar with current state before measuring height
    const _nonSvgH = Array.from(container.children).reduce((s, el) => s + el.offsetHeight, 0);

    const width  = Math.max(600, (container.clientWidth  || 1100) - 4);
    const height = Math.max(200, (container.clientHeight || 600) - _nonSvgH - 4);

    const root = d3.hierarchy(data).sum(d => d.value || 0).sort((a, b) => b.value - a.value);
    d3.treemap()
        .size([width, height])
        .paddingInner(3)
        .paddingOuter(6)
        .round(true)(root);

    const svg  = d3.create('svg').attr('width', width).attr('height', height)
        .style('user-select', 'none');
    const node = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .attr('data-peval', d => d.data.name)
        .style('cursor', 'pointer')
        .on('mousedown', (event) => { event.preventDefault(); });

    node.append('rect')
        .attr('width',  d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill', d => {
            const pav = (window._peParamAllowedValues || {})[paramName] || [];
            if (pav.length > 0) return pav.includes(d.data._parentKey || d.data.name) ? '#388e3c' : '#e53935';
            if (allFilesForLegend.length > 1) {
                const fs = d.data.files || [];
                return fs.length === 1 ? fileColor(fs[0]) : '#9e9e9e';
            }
            // Single-file: use parent key so all expanded empty tiles share one color
            return valueColor(d.data._parentKey || d.data.name);
        })
        .attr('opacity', 0.88)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('rx', 3);

    node.each(function(d) {
        const w = d.x1 - d.x0, h = d.y1 - d.y0;
        if (w < 16 || h < 14) return;
        const g = d3.select(this);
        const displayVal = _peFormatValue(d.data._displayName || d.data.name);
        const maxChars = Math.max(4, Math.floor(w / 7));
        const label = displayVal.length > maxChars ? displayVal.slice(0, maxChars - 1) + '\u2026' : displayVal;

        g.append('text').attr('x', 6).attr('y', 15)
            .text(label)
            .attr('font-size', '11px').attr('fill', '#111').attr('font-weight', '700')
            .style('pointer-events', 'none');

        if (h >= 30) {
            g.append('text').attr('x', 6).attr('y', 28)
                .text((d.data.count === 0 && (d.data.name === 'Null' || d.data.name === 'Empty')) ? '?' : (d.data.count != null ? d.data.count.toLocaleString() : d.data.value.toLocaleString()))
                .attr('font-size', '9px').attr('fill', '#333')
                .style('pointer-events', 'none');
        }
        if (h >= 44 && d.data.categories?.length) {
            const catLabel = d.data.categories.slice(0, 3).join(', ') + (d.data.categories.length > 3 ? '\u2026' : '');
            const maxCatChars = Math.max(4, Math.floor(w / 6.5));
            g.append('text').attr('x', 6).attr('y', 40)
                .text(catLabel.length > maxCatChars ? catLabel.slice(0, maxCatChars - 1) + '\u2026' : catLabel)
                .attr('font-size', '9px').attr('fill', '#555').attr('font-style', 'italic')
                .style('pointer-events', 'none');
        }
    });

    node.on('click', (event, d) => {
        if (!window._peZoomSelected) window._peZoomSelected = new Set();
        if (window._peZoomSelected.has(d.data.name)) {
            window._peZoomSelected.delete(d.data.name);
            d3.select(event.currentTarget).select('rect')
                .attr('stroke', 'white').attr('stroke-width', 1).attr('opacity', 0.88);
        } else {
            window._peZoomSelected.add(d.data.name);
            d3.select(event.currentTarget).select('rect')
                .attr('stroke', '#1565c0').attr('stroke-width', 3).attr('opacity', 1.0);
            // Trigger background count for sentinel tiles that haven't been counted yet
            if ((d.data.name === 'Null' || d.data.name === 'Empty') && d.data.count === 0) {
                _peBgCountSentinel(paramName, d.data.name, byValue, container);
            }
        }
        _peUpdateZoomSelBar(paramName);
    });
    node.on('mousemove', (event, d) => {
        const isSelected = window._peZoomSelected?.has(d.data.name);
        const hint = isSelected ? 'Click to deselect' : ((d.data.name === 'Null' || d.data.name === 'Empty') && d.data.count === 0) ? 'Click to count \u00b7 then use Show in Viewer â–º' : 'Click to select \u00b7 then use Show in Viewer â–º';
        const tooltipLabel = d.data._parentKey
            ? `<strong>(empty)</strong><span style="opacity:.5;font-size:10px;"> Revit ID: ${d.data._displayName || ''}</span>`
            : `<strong>${_peFormatValue(d.data.name)}</strong>`;
        _peShowTooltip(event,
            `<div style="font-weight:700;font-size:13px;margin-bottom:4px;">${paramName}</div>` +
            `<div><span style="opacity:.7">Value:</span> ${tooltipLabel}</div>` +
            `<div><span style="opacity:.7">Elements:</span> <strong>${(d.data.count === 0 && (d.data.name === 'Null' || d.data.name === 'Empty')) ? '? (click to count)' : (d.data.count != null ? d.data.count : d.data.value).toLocaleString()}</strong></div>` +
            `<div><span style="opacity:.7">Categories:</span> ${(d.data.categories || []).join(', ') || '\u2013'}</div>` +
            `<div><span style="opacity:.7">Files:</span> ${(d.data.files || []).join(', ') || '\u2013'}</div>` +
            `<div style="opacity:.6;font-size:10px;margin-top:4px;">${hint}</div>`
        );
    }).on('mouseout', _peHideTooltip);

    container.appendChild(svg.node());
    // Restore visual selection state on re-render (e.g. legend toggle)
    if (window._peZoomSelected?.size > 0) {
        node.each(function(d) {
            if (window._peZoomSelected.has(d.data.name)) {
                d3.select(this).select('rect').attr('stroke', '#1565c0').attr('stroke-width', 3).attr('opacity', 1.0);
            }
        });
    }
}

