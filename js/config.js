// Configuration and Global Variables
const API_BASE = window.location.origin;

// Global state
let sessionId = null;
let settings = {
    clientId: '',
    clientSecret: '',
    callbackUrl: 'http://localhost:3000/api/callback',
    region: 'US'
};

// Viewer state
let viewer = null;
let currentHub = null;
let currentElementGroup = null;
let currentProject = null;
let currentRegion = null;
let filteredElementsMap = new Map(); // Stores element -> dbId mapping for interactive highlighting
let elementDataMap = new Map(); // Stores dbId -> full element data for property display
let viewerExternalIds = new Set(); // Stores all External IDs present in the loaded viewer model
let currentFilteredCategories = []; // Categories selected in the last Viewer filter operation
let cachedCategoryDbIds = null; // Map<categoryName, [{model, dbIds}]> — populated on category discovery, reused for filtering
let currentLoadedFiles = []; // All files currently loaded in the viewer (for multi-file AEC DM queries)
let pendingCategoryHighlight = null;   // Set before openViewerModal() to auto-isolate a category after load
let pendingRevitElementIds = null;     // Array of Revit Element ID strings to isolate after model load
let pendingRevitCategory = null;       // Category name paired with pendingRevitElementIds
let pendingComplianceHighlight = null; // { paramName, allowedValues } — color elements green/red after load
