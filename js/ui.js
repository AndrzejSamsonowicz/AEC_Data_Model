// UI Rendering and DOM Manipulation

function displayLayout(hubs) {
    document.getElementById('mainContainer').innerHTML = `
        <div class="left-column">
            <div class="hubs-section">
                <div class="section-title">Hubs (${hubs.length})</div>
                <div id="hubsList"></div>
            </div>
            <div class="projects-section">
                <div class="section-title">Projects</div>
                <input type="text" id="projectsFilter" class="list-filter" placeholder="Filter projects..." oninput="filterList('projectsList', this.value, 'project-item')">
                <div id="projectsList"></div>
            </div>
        </div>
        <div class="right-column">
            <div class="files-toolbar">
                <div class="section-title" id="filesTitle">Element Groups</div>
                <div class="files-toolbar-controls">
                    <input type="text" id="filesFilter" class="list-filter" placeholder="Filter files..." oninput="filterList('elementGroupsList', this.value, 'element-group-item')">
                    <button class="open-viewer-btn" id="openViewerBtn" onclick="openSelectedInViewer()" disabled>Open in Viewer</button>
                </div>
            </div>
            <div id="elementGroupsList"></div>
        </div>
    `;

    const hubsList = document.getElementById('hubsList');

    // Clear filter inputs when layout is rebuilt
    const pf = document.getElementById('projectsFilter');
    if (pf) pf.value = '';
    const ff = document.getElementById('filesFilter');
    if (ff) ff.value = '';

    hubs.forEach(hub => {
        const hubItem = document.createElement('div');
        hubItem.className = 'hub-item';
        hubItem.textContent = hub.name;
        hubItem.onclick = () => selectHub(hub);
        hubsList.appendChild(hubItem);
    });
}

function filterList(listId, query, itemClass) {
    const q = query.toLowerCase();
    document.querySelectorAll(`#${listId} .${itemClass}`).forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
    });
}

function updateOpenViewerBtn() {
    const count = document.querySelectorAll('.file-checkbox:checked').length;
    const btn = document.getElementById('openViewerBtn');
    if (!btn) return;
    btn.disabled = count === 0;
    btn.textContent = count > 0 ? `Open in Viewer (${count})` : 'Open in Viewer';
}

function openSelectedInViewer() {
    const selected = Array.from(document.querySelectorAll('.file-checkbox:checked'))
        .map(cb => cb.closest('.element-group-item')?._fileData)
        .filter(Boolean);
    if (selected.length === 0) return;
    openViewerModal(selected);
}

// Step rail under the header (Query hub → Pick files → Pick parameters → Edit in viewer).
// Steps before `step` are marked done, `step` is the current one.
function setFlowStep(step) {
    document.querySelectorAll('#flowSteps .flow-step').forEach(function (li) {
        const n = Number(li.dataset.step);
        li.classList.toggle('done', n < step);
        li.classList.toggle('current', n === step);
        if (n === step) li.setAttribute('aria-current', 'step');
        else li.removeAttribute('aria-current');
    });
}

// Closing the viewer returns to whichever main-page step is still open underneath it.
function flowStepBehindViewer() {
    const explorer = document.getElementById('paramExplorerModal');
    return (explorer && explorer.style.display !== 'none') ? 3 : 2;
}

document.addEventListener('DOMContentLoaded', function () { setFlowStep(1); });
