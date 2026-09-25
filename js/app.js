// Main Application Initialization

// Initialize application
loadSettings();

const HUB_REGIONS = ['US', 'EMEA', 'APAC', 'AUS', 'CAN', 'GBR', 'DEU', 'IND', 'JPN'];

function cloneSelectOptions(sourceSelect, targetSelect) {
    targetSelect.innerHTML = '';
    Array.from(sourceSelect.children).forEach((child) => {
        targetSelect.appendChild(child.cloneNode(true));
    });
}

// Load hubs when authenticated
async function loadHubs() {
    const hubSelect = document.getElementById('hubSelect');
    
    if (!hubSelect) {
        logDebug('Hub select element not found, retrying...');
        return;
    }
    
    if (!sessionId) {
        logDebug('No session ID, user not authenticated');
        return;
    }
    
    try {
        logDebug('Loading ACC hubs from all regions via GraphQL...');
        
        // Query all regions for ACC hubs
        const hubQuery = `
            query GetHubs {
                hubs {
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
        
        // Load hubs from all regions in parallel
        const hubPromises = HUB_REGIONS.map(region => 
            executeGraphQLQuery(hubQuery, {}, region)
                .then(result => ({
                    region,
                    hubs: result.data?.hubs?.results || []
                }))
                .catch(error => {
                    logDebug(`Failed to load hubs from ${region}:`, error.message);
                    return { region, hubs: [] };
                })
        );
        
        const results = await Promise.all(hubPromises);
        
        // Flatten and deduplicate hubs
        const hubMap = new Map();
        results.forEach(({ region, hubs }) => {
            hubs.forEach(hub => {
                // Skip if already added (from another region)
                if (hubMap.has(hub.id)) return;
                
                // Filter out "Team Hub" entries (not ACC hubs)
                if (hub.name.includes('Team Hub')) {
                    logDebug(`Filtered out Team Hub: ${hub.name}`);
                    return;
                }
                
                // Add hub with region info
                hubMap.set(hub.id, {
                    id: hub.id,
                    name: hub.name,
                    region: region
                });
            });
        });
        
        let hubs = Array.from(hubMap.values());
        
        logDebug(`Found ${hubs.length} ACC hubs across all regions`);
        
        // Sort hubs by region and then by name
        hubs.sort((a, b) => {
            if (a.region !== b.region) {
                return a.region.localeCompare(b.region);
            }
            return a.name.localeCompare(b.name);
        });
        
        // Clear and populate hub select with region labels
        const fragment = document.createDocumentFragment();
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select ACC Hub...';
        fragment.appendChild(defaultOption);

        let currentRegion = null;
        let currentGroup = null;
        hubs.forEach(hub => {
            if (currentRegion !== hub.region) {
                currentGroup = document.createElement('optgroup');
                currentGroup.label = `━━━ ${hub.region} Region ━━━`;
                fragment.appendChild(currentGroup);
                currentRegion = hub.region;
            }

            const option = document.createElement('option');
            option.value = hub.id;
            option.textContent = `${hub.name} [${hub.region}]`;
            option.dataset.region = hub.region;
            currentGroup.appendChild(option);
        });
        hubSelect.innerHTML = '';
        hubSelect.appendChild(fragment);

        // Sync Example 2 and 5 hub selectors with the same options
        const hub2Select = document.getElementById('hub2Select');
        if (hub2Select) cloneSelectOptions(hubSelect, hub2Select);
        const hub5Select = document.getElementById('hub5Select');
        if (hub5Select) cloneSelectOptions(hubSelect, hub5Select);
        
        logDebug(`Loaded ${hubs.length} ACC hubs`);
        
    } catch (error) {
        logError('Failed to load hubs', error);
        alert('Failed to load ACC hubs: ' + error.message);
    }
}

// Load projects for selected hub (legacy - kept for compatibility)
async function loadProjects() {
    // Projects are now loaded per-example
    // This function is kept for backward compatibility
    logDebug('loadProjects() called - using example-specific loaders');
}
