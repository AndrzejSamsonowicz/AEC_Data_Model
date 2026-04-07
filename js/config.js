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
