/**
 * AEC Data Model API Documentation Scraper — Puppeteer edition
 * Uses local headless Chrome to render JS pages — no rate limits, no external service.
 *
 * Usage:
 *   node scripts/scrape-aecdm-puppeteer.js           # fresh run
 *   node scripts/scrape-aecdm-puppeteer.js --resume  # continue after interruption
 *
 * After completion:
 *   node scripts/clean-docs.js --file "API Documentation/AEC-DataModel-API.md"
 *
 * Output: API Documentation/AEC-DataModel-API.md
 */

'use strict';

const puppeteer = require('puppeteer');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const OUTPUT_FILE = path.join(__dirname, '..', 'API Documentation', 'AEC-DataModel-API.md');
const RESUME      = process.argv.includes('--resume');
/** ms to wait after navigation before extracting — gives React time to hydrate */
const SETTLE_MS   = 2500;

const BASE = 'https://aps.autodesk.com/en/docs/aecdatamodel/v1';

const PAGES = [
  // ── Developer's Guide ────────────────────────────────────────────────────
  { section: "Developer's Guide", title: 'Overview',                            url: `${BASE}/developers_guide/overview` },
  { section: "Developer's Guide", title: 'Onboarding to AEC Data Model',        url: `${BASE}/developers_guide/onboarding` },
  { section: "Developer's Guide", title: 'About GraphQL',                       url: `${BASE}/developers_guide/about-graphql` },
  { section: "Developer's Guide", title: 'Regions Supported',                   url: `${BASE}/developers_guide/regions` },
  { section: "Developer's Guide", title: 'API Essentials',                      url: `${BASE}/developers_guide/API%20Essentials` },
  { section: "Developer's Guide", title: 'API Constructs',                      url: `${BASE}/developers_guide/API%20Essentials/constructs` },
  { section: "Developer's Guide", title: 'API Capabilities',                    url: `${BASE}/developers_guide/API%20Essentials/capabilities` },
  { section: "Developer's Guide", title: 'Using the API',                       url: `${BASE}/developers_guide/API%20Essentials/usage` },
  { section: "Developer's Guide", title: 'Filtering Options',                   url: `${BASE}/developers_guide/filtering` },
  { section: "Developer's Guide", title: 'Standard Filtering',                  url: `${BASE}/developers_guide/filtering/standard-filtering` },
  { section: "Developer's Guide", title: 'Advanced Filtering Using RSQL',       url: `${BASE}/developers_guide/filtering/advanced-filtering` },
  { section: "Developer's Guide", title: 'Special Considerations of Filtering', url: `${BASE}/developers_guide/filtering/special-considerations-filtering` },
  { section: "Developer's Guide", title: 'Pagination',                          url: `${BASE}/developers_guide/pagination` },
  { section: "Developer's Guide", title: 'Rate Limits',                         url: `${BASE}/developers_guide/ratelimit` },
  { section: "Developer's Guide", title: 'AEC Data Model Explorer',             url: `${BASE}/developers_guide/aecima_data_explorer` },
  { section: "Developer's Guide", title: 'Known Limitations',                   url: `${BASE}/developers_guide/knownlimitations` },
  { section: "Developer's Guide", title: 'FAQ',                                 url: `${BASE}/developers_guide/faq` },

  // ── How-to Guide ─────────────────────────────────────────────────────────
  { section: 'How-to Guide', title: 'Before You Begin',                              url: `${BASE}/tutorials/before_you_begin` },
  { section: 'How-to Guide', title: 'Getting Started',                               url: `${BASE}/tutorials/tutorial01` },
  { section: 'How-to Guide', title: 'Get Hubs',                                      url: `${BASE}/tutorials/tutorial01/gethubs` },
  { section: 'How-to Guide', title: 'Get Projects',                                  url: `${BASE}/tutorials/tutorial01/getprojects` },
  { section: 'How-to Guide', title: 'Navigate to ElementGroups within a Project',    url: `${BASE}/tutorials/tutorial01/nav-elements` },
  { section: 'How-to Guide', title: 'Get Elements from a Category',                  url: `${BASE}/tutorials/tutorial01/elementsbycategory` },
  { section: 'How-to Guide', title: 'Working with Advanced Queries',                 url: `${BASE}/tutorials/tutorial02` },
  { section: 'How-to Guide', title: 'Get ElementGroups Based on Metadata',           url: `${BASE}/tutorials/tutorial02/task1a` },
  { section: 'How-to Guide', title: 'Get Versions of an ElementGroup',               url: `${BASE}/tutorials/tutorial02/task2a` },
  { section: 'How-to Guide', title: 'Get Element Instances of a Particular Type',    url: `${BASE}/tutorials/tutorial02/task3a` },
  { section: 'How-to Guide', title: 'Get Element Instances in a Category by Version',url: `${BASE}/tutorials/tutorial02/task4a` },
  { section: 'How-to Guide', title: 'Get Project Elements with specific Properties', url: `${BASE}/tutorials/tutorial02/task5a` },
  { section: 'How-to Guide', title: 'Get Elements by Using Instances or Reference',  url: `${BASE}/tutorials/tutorial02/task6a` },
  { section: 'How-to Guide', title: 'Get Distinct Values of Properties',             url: `${BASE}/tutorials/tutorial02/distinctvaluesquery` },
  { section: 'How-to Guide', title: 'Extensibility of Element Data',                 url: `${BASE}/tutorials/extend_element_data` },
  { section: 'How-to Guide', title: 'Task 1 – Property Definition Creation',         url: `${BASE}/tutorials/extend_element_data/create_property_definition` },
  { section: 'How-to Guide', title: 'Task 2 – Add Custom Cost Property to Elements', url: `${BASE}/tutorials/extend_element_data/custom_property_elements` },
  { section: 'How-to Guide', title: 'Task 3 – Update Cost Property',                 url: `${BASE}/tutorials/extend_element_data/update_cost_property` },
  { section: 'How-to Guide', title: 'Task 4 – Retrieve Door Elements',               url: `${BASE}/tutorials/extend_element_data/retrieve_all_elements` },
  { section: 'How-to Guide', title: 'Task 5 – Remove Cost Property',                 url: `${BASE}/tutorials/extend_element_data/remove_cost_property` },
  { section: 'How-to Guide', title: 'Task 6 – Add, Update and Remove Using Category Filter', url: `${BASE}/tutorials/extend_element_data/category_binding_filter_workflow` },
  { section: 'How-to Guide', title: 'Extensibility – Additional Information',        url: `${BASE}/tutorials/extend_element_data/additional_information` },
  { section: 'How-to Guide', title: 'Retrieve Differences of an Element Group',      url: `${BASE}/tutorials/diff_api` },
  { section: 'How-to Guide', title: 'Task 1 – Retrieve Differences Tutorial',        url: `${BASE}/tutorials/diff_api/diff_api_tutorial` },
  { section: 'How-to Guide', title: 'Retrieve Geometry Data',                        url: `${BASE}/tutorials/geometry` },
  { section: 'How-to Guide', title: 'Get axis and origin information for elements',  url: `${BASE}/tutorials/geometry/get-axis-origin-elements` },
  { section: 'How-to Guide', title: 'Filter elements by their origin',               url: `${BASE}/tutorials/geometry/filter-elements-by-origin` },
  { section: 'How-to Guide', title: 'Working with Work In Progress Data',            url: `${BASE}/tutorials/revit_sync` },
  { section: 'How-to Guide', title: 'Query Work In Progress Data',                   url: `${BASE}/tutorials/revit_sync/query_sync_data` },

  // ── Code Samples ─────────────────────────────────────────────────────────
  { section: 'Code Samples', title: 'Elementgroup Validation',        url: `${BASE}/code-samples/elementGroupvalidation` },
  { section: 'Code Samples', title: 'Quantity TakeOff',               url: `${BASE}/code-samples/quantity` },
  { section: 'Code Samples', title: 'Window Schedule',                url: `${BASE}/code-samples/schedule` },
  { section: 'Code Samples', title: 'Furniture Procurement Dashboard',url: `${BASE}/code-samples/procurementdashboard` },
  { section: 'Code Samples', title: 'Compare Designs',                url: `${BASE}/code-samples/compareversions` },

  // ── Reference – GraphQL Endpoint ─────────────────────────────────────────
  { section: 'Reference – GraphQL Endpoint', title: 'GraphQL Endpoint', url: `${BASE}/reference/graphqlendpoint` },

  // ── Reference – Queries ───────────────────────────────────────────────────
  { section: 'Reference – Queries', title: 'Queries (overview)',                           url: `${BASE}/reference/queries` },
  { section: 'Reference – Queries', title: 'associatedElementGroupsByGroup',               url: `${BASE}/reference/queries/associatedelementgroupsbygroup` },
  { section: 'Reference – Queries', title: 'associatedElementsByElements',                 url: `${BASE}/reference/queries/associatedelementsbyelements` },
  { section: 'Reference – Queries', title: 'elementGroupByVersionNumber',                  url: `${BASE}/reference/queries/elementgroupbyversionnumber` },
  { section: 'Reference – Queries', title: 'elementGroupExtractionStatus',                 url: `${BASE}/reference/queries/elementgroupextractionstatus` },
  { section: 'Reference – Queries', title: 'elementGroupExtractionStatusAtTip',            url: `${BASE}/reference/queries/elementgroupextractionstatusattip` },
  { section: 'Reference – Queries', title: 'diffElementByVersionWithLatest',               url: `${BASE}/reference/queries/diffelementbyversionwithlatest` },
  { section: 'Reference – Queries', title: 'diffElementGroupByVersionWithLatest',          url: `${BASE}/reference/queries/diffelementgroupbyversionwithlatest` },
  { section: 'Reference – Queries', title: 'elementGroupAtTip',                            url: `${BASE}/reference/queries/elementgroupattip` },
  { section: 'Reference – Queries', title: 'elementGroupsByHub',                           url: `${BASE}/reference/queries/elementgroupsbyhub` },
  { section: 'Reference – Queries', title: 'elementGroupsByProject',                       url: `${BASE}/reference/queries/elementgroupsbyproject` },
  { section: 'Reference – Queries', title: 'elementGroupsByFolder',                        url: `${BASE}/reference/queries/elementgroupsbyfolder` },
  { section: 'Reference – Queries', title: 'elementGroupsByFolderAndSubFolders',           url: `${BASE}/reference/queries/elementgroupsbyfolderandsubfolders` },
  { section: 'Reference – Queries', title: 'elementAtTip',                                 url: `${BASE}/reference/queries/elementattip` },
  { section: 'Reference – Queries', title: 'elementsByHub',                                url: `${BASE}/reference/queries/elementsbyhub` },
  { section: 'Reference – Queries', title: 'elementsByProject',                            url: `${BASE}/reference/queries/elementsbyproject` },
  { section: 'Reference – Queries', title: 'elementsByFolder',                             url: `${BASE}/reference/queries/elementsbyfolder` },
  { section: 'Reference – Queries', title: 'elementsByElementGroup',                       url: `${BASE}/reference/queries/elementsbyelementgroup` },
  { section: 'Reference – Queries', title: 'elementsByElementGroupAtVersion',              url: `${BASE}/reference/queries/elementsbyelementgroupatversion` },
  { section: 'Reference – Queries', title: 'elementsByElementGroupParallel',               url: `${BASE}/reference/queries/elementsbyelementgroupparallel` },
  { section: 'Reference – Queries', title: 'elementsByElementGroupParallelCursors',        url: `${BASE}/reference/queries/elementsbyelementgroupparallelcursors` },
  { section: 'Reference – Queries', title: 'hub',                                          url: `${BASE}/reference/queries/hub` },
  { section: 'Reference – Queries', title: 'hubs',                                         url: `${BASE}/reference/queries/hubs` },
  { section: 'Reference – Queries', title: 'project',                                      url: `${BASE}/reference/queries/project` },
  { section: 'Reference – Queries', title: 'projects',                                     url: `${BASE}/reference/queries/projects` },
  { section: 'Reference – Queries', title: 'folder',                                       url: `${BASE}/reference/queries/folder` },
  { section: 'Reference – Queries', title: 'foldersByFolder',                              url: `${BASE}/reference/queries/foldersbyfolder` },
  { section: 'Reference – Queries', title: 'foldersByProject',                             url: `${BASE}/reference/queries/foldersbyproject` },
  { section: 'Reference – Queries', title: 'distinctPropertyValuesInElementGroupById',     url: `${BASE}/reference/queries/distinctpropertyvaluesinelementgroupbyid` },
  { section: 'Reference – Queries', title: 'distinctPropertyValuesInElementGroupByName',   url: `${BASE}/reference/queries/distinctpropertyvaluesinelementgroupbyname` },
  { section: 'Reference – Queries', title: 'propertyDefinitionCollection',                 url: `${BASE}/reference/queries/propertydefinitioncollection` },
  { section: 'Reference – Queries', title: 'propertyDefinitionCollectionsByHub',           url: `${BASE}/reference/queries/propertydefinitioncollectionsbyhub` },
  { section: 'Reference – Queries', title: 'propertyDefinitionsByElementGroup',            url: `${BASE}/reference/queries/propertydefinitionsbyelementgroup` },
  { section: 'Reference – Queries', title: 'propertyDefinitionSpecifications',             url: `${BASE}/reference/queries/propertydefinitionspecifications` },
  { section: 'Reference – Queries', title: 'geometryDataByElement',                        url: `${BASE}/reference/queries/geometrydatabyelement` },
  { section: 'Reference – Queries', title: 'geometryDataByElements',                       url: `${BASE}/reference/queries/geometrydatabyelements` },

  // ── Reference – Mutations ─────────────────────────────────────────────────
  { section: 'Reference – Mutations', title: 'Mutations (overview)',                          url: `${BASE}/reference/mutations` },
  { section: 'Reference – Mutations', title: 'addExtensionPropertiesToElements',              url: `${BASE}/reference/mutations/addextensionpropertiestoelements` },
  { section: 'Reference – Mutations', title: 'createExtensionElementGroup',                   url: `${BASE}/reference/mutations/createextensionelementgroup` },
  { section: 'Reference – Mutations', title: 'createPropertyDefinitionsInCollection',         url: `${BASE}/reference/mutations/createpropertydefinitionsincollection` },
  { section: 'Reference – Mutations', title: 'createPropertyDefinitionCollectionInHub',       url: `${BASE}/reference/mutations/createpropertydefinitioncollectioninhub` },
  { section: 'Reference – Mutations', title: 'removeExtensionPropertiesFromElements',         url: `${BASE}/reference/mutations/removeextensionpropertiesfromelements` },
  { section: 'Reference – Mutations', title: 'updateExtensionPropertiesOnElements',           url: `${BASE}/reference/mutations/updateextensionpropertiesonelements` },

  // ── Reference – Interfaces ────────────────────────────────────────────────
  { section: 'Reference – Interfaces', title: 'Interfaces (overview)', url: `${BASE}/reference/interfaces` },
  { section: 'Reference – Interfaces', title: 'Curve',                 url: `${BASE}/reference/interfaces/curve` },
  { section: 'Reference – Interfaces', title: 'ECSComponent',          url: `${BASE}/reference/interfaces/ecscomponent` },

  // ── Reference – Unions ────────────────────────────────────────────────────
  { section: 'Reference – Unions', title: 'Unions (overview)',       url: `${BASE}/reference/unions` },
  { section: 'Reference – Unions', title: 'BodyRepresentationData',  url: `${BASE}/reference/unions/bodyrepresentationdata` },
  { section: 'Reference – Unions', title: 'GeometryPieceData',       url: `${BASE}/reference/unions/geometrypiecedata` },
  { section: 'Reference – Unions', title: 'PrimitiveValue',          url: `${BASE}/reference/unions/primitivevalue` },

  // ── Reference – Objects ───────────────────────────────────────────────────
  { section: 'Reference – Objects', title: 'Objects (overview)',                                    url: `${BASE}/reference/objects` },
  { section: 'Reference – Objects', title: 'AddExtensionPropertiesPayload',                         url: `${BASE}/reference/objects/addextensionpropertiespayload` },
  { section: 'Reference – Objects', title: 'AuthoringClient',                                       url: `${BASE}/reference/objects/authoringclient` },
  { section: 'Reference – Objects', title: 'AxisRepresentationComponent',                           url: `${BASE}/reference/objects/axisrepresentationcomponent` },
  { section: 'Reference – Objects', title: 'BCurve',                                                url: `${BASE}/reference/objects/bcurve` },
  { section: 'Reference – Objects', title: 'BinaryData',                                            url: `${BASE}/reference/objects/binarydata` },
  { section: 'Reference – Objects', title: 'BodyRepresentationComponent',                           url: `${BASE}/reference/objects/bodyrepresentationcomponent` },
  { section: 'Reference – Objects', title: 'Circle',                                                url: `${BASE}/reference/objects/circle` },
  { section: 'Reference – Objects', title: 'Comparators',                                           url: `${BASE}/reference/objects/comparators` },
  { section: 'Reference – Objects', title: 'ComponentType',                                         url: `${BASE}/reference/objects/componenttype` },
  { section: 'Reference – Objects', title: 'CreatePropertyDefinitionCollectionInHubPayload',        url: `${BASE}/reference/objects/createpropertydefinitioncollectioninhubpayload` },
  { section: 'Reference – Objects', title: 'CreatePropertyDefinitionsInCollectionPayload',          url: `${BASE}/reference/objects/createpropertydefinitionsincollectionpayload` },
  { section: 'Reference – Objects', title: 'CurveType',                                             url: `${BASE}/reference/objects/curvetype` },
  { section: 'Reference – Objects', title: 'DistinctPropertyValue',                                 url: `${BASE}/reference/objects/distinctpropertyvalue` },
  { section: 'Reference – Objects', title: 'DistinctPropertyValues',                                url: `${BASE}/reference/objects/distinctpropertyvalues` },
  { section: 'Reference – Objects', title: 'DistinctPropertyValuesCollection',                      url: `${BASE}/reference/objects/distinctpropertyvaluescollection` },
  { section: 'Reference – Objects', title: 'ComponentDifferences',                                  url: `${BASE}/reference/objects/componentdifferences` },
  { section: 'Reference – Objects', title: 'DifferenceType',                                        url: `${BASE}/reference/objects/differencetype` },
  { section: 'Reference – Objects', title: 'DownloadInfo',                                          url: `${BASE}/reference/objects/downloadinfo` },
  { section: 'Reference – Objects', title: 'Element',                                               url: `${BASE}/reference/objects/element` },
  { section: 'Reference – Objects', title: 'ElementAlternativeIdentifiers',                         url: `${BASE}/reference/objects/elementalternativeidentifiers` },
  { section: 'Reference – Objects', title: 'ElementAlternativeIdentifiersComponent',                url: `${BASE}/reference/objects/elementalternativeidentifierscomponent` },
  { section: 'Reference – Objects', title: 'ElementDifference',                                     url: `${BASE}/reference/objects/elementdifference` },
  { section: 'Reference – Objects', title: 'ElementGroup',                                          url: `${BASE}/reference/objects/elementgroup` },
  { section: 'Reference – Objects', title: 'ElementGroupAlternativeIdentifiers',                    url: `${BASE}/reference/objects/elementgroupalternativeidentifiers` },
  { section: 'Reference – Objects', title: 'ElementGroupDifference',                                url: `${BASE}/reference/objects/elementgroupdifference` },
  { section: 'Reference – Objects', title: 'ElementGroupExtractionStatus',                          url: `${BASE}/reference/objects/elementgroupextractionstatus` },
  { section: 'Reference – Objects', title: 'ElementGroups',                                         url: `${BASE}/reference/objects/elementgroups` },
  { section: 'Reference – Objects', title: 'ElementGroupVersion',                                   url: `${BASE}/reference/objects/elementgroupversion` },
  { section: 'Reference – Objects', title: 'ElementGroupVersionHistory',                            url: `${BASE}/reference/objects/elementgroupversionhistory` },
  { section: 'Reference – Objects', title: 'ElementGroupVersions',                                  url: `${BASE}/reference/objects/elementgroupversions` },
  { section: 'Reference – Objects', title: 'Elements',                                              url: `${BASE}/reference/objects/elements` },
  { section: 'Reference – Objects', title: 'Ellipse',                                               url: `${BASE}/reference/objects/ellipse` },
  { section: 'Reference – Objects', title: 'ExtensionComponent',                                    url: `${BASE}/reference/objects/extensioncomponent` },
  { section: 'Reference – Objects', title: 'ExtractionStatus',                                      url: `${BASE}/reference/objects/extractionstatus` },
  { section: 'Reference – Objects', title: 'Folder',                                                url: `${BASE}/reference/objects/folder` },
  { section: 'Reference – Objects', title: 'Folders',                                               url: `${BASE}/reference/objects/folders` },
  { section: 'Reference – Objects', title: 'GeometryComponentType',                                 url: `${BASE}/reference/objects/geometrycomponenttype` },
  { section: 'Reference – Objects', title: 'GeometryDataOutput',                                    url: `${BASE}/reference/objects/geometrydataoutput` },
  { section: 'Reference – Objects', title: 'GeometryDataResponse',                                  url: `${BASE}/reference/objects/geometrydataresponse` },
  { section: 'Reference – Objects', title: 'GeometryInstance',                                      url: `${BASE}/reference/objects/geometryinstance` },
  { section: 'Reference – Objects', title: 'GeometryPiece',                                         url: `${BASE}/reference/objects/geometrypiece` },
  { section: 'Reference – Objects', title: 'GeometryPrimitive',                                     url: `${BASE}/reference/objects/geometryprimitive` },
  { section: 'Reference – Objects', title: 'GeometryRepresentationData',                            url: `${BASE}/reference/objects/geometryrepresentationdata` },
  { section: 'Reference – Objects', title: 'Hub',                                                   url: `${BASE}/reference/objects/hub` },
  { section: 'Reference – Objects', title: 'Hubs',                                                  url: `${BASE}/reference/objects/hubs` },
  { section: 'Reference – Objects', title: 'IdentityComponent',                                     url: `${BASE}/reference/objects/identitycomponent` },
  { section: 'Reference – Objects', title: 'Line',                                                  url: `${BASE}/reference/objects/line` },
  { section: 'Reference – Objects', title: 'OriginComponent',                                       url: `${BASE}/reference/objects/origincomponent` },
  { section: 'Reference – Objects', title: 'Pagination',                                            url: `${BASE}/reference/objects/pagination` },
  { section: 'Reference – Objects', title: 'ParamRange',                                            url: `${BASE}/reference/objects/paramrange` },
  { section: 'Reference – Objects', title: 'Point',                                                 url: `${BASE}/reference/objects/point` },
  { section: 'Reference – Objects', title: 'Polyline',                                              url: `${BASE}/reference/objects/polyline` },
  { section: 'Reference – Objects', title: 'PrimitiveType',                                         url: `${BASE}/reference/objects/primitivetype` },
  { section: 'Reference – Objects', title: 'Project',                                               url: `${BASE}/reference/objects/project` },
  { section: 'Reference – Objects', title: 'ProjectAlternativeIdentifiers',                         url: `${BASE}/reference/objects/projectalternativeidentifiers` },
  { section: 'Reference – Objects', title: 'Projects',                                              url: `${BASE}/reference/objects/projects` },
  { section: 'Reference – Objects', title: 'Properties',                                            url: `${BASE}/reference/objects/properties` },
  { section: 'Reference – Objects', title: 'PropertiesComponent',                                   url: `${BASE}/reference/objects/propertiescomponent` },
  { section: 'Reference – Objects', title: 'Property',                                              url: `${BASE}/reference/objects/property` },
  { section: 'Reference – Objects', title: 'PropertyDefinition',                                    url: `${BASE}/reference/objects/propertydefinition` },
  { section: 'Reference – Objects', title: 'propertyDefinitionCollection (object)',                 url: `${BASE}/reference/objects/propertydefinitioncollection` },
  { section: 'Reference – Objects', title: 'PropertyDefinitions',                                   url: `${BASE}/reference/objects/propertydefinitions` },
  { section: 'Reference – Objects', title: 'PropertyDifference',                                    url: `${BASE}/reference/objects/propertydifference` },
  { section: 'Reference – Objects', title: 'ReferenceProperties',                                   url: `${BASE}/reference/objects/referenceproperties` },
  { section: 'Reference – Objects', title: 'ReferenceProperty',                                     url: `${BASE}/reference/objects/referenceproperty` },
  { section: 'Reference – Objects', title: 'ReferencesComponent',                                   url: `${BASE}/reference/objects/referencescomponent` },
  { section: 'Reference – Objects', title: 'RemoveExtensionPropertiesPayload',                      url: `${BASE}/reference/objects/removeextensionpropertiespayload` },
  { section: 'Reference – Objects', title: 'RevisionComponent',                                     url: `${BASE}/reference/objects/revisioncomponent` },
  { section: 'Reference – Objects', title: 'Transform',                                             url: `${BASE}/reference/objects/transform` },
  { section: 'Reference – Objects', title: 'UpdateExtensionPropertiesPayload',                      url: `${BASE}/reference/objects/updateextensionpropertiespayload` },
  { section: 'Reference – Objects', title: 'User',                                                  url: `${BASE}/reference/objects/user` },
  { section: 'Reference – Objects', title: 'Vector',                                                url: `${BASE}/reference/objects/vector` },
  { section: 'Reference – Objects', title: 'VersionTypeEnum',                                       url: `${BASE}/reference/objects/versiontypeenum` },

  // ── Reference – Inputs ────────────────────────────────────────────────────
  { section: 'Reference – Inputs', title: 'Inputs (overview)',                               url: `${BASE}/reference/inputs` },
  { section: 'Reference – Inputs', title: 'AddExtensionPropertiesInput',                     url: `${BASE}/reference/inputs/addextensionpropertiesinput` },
  { section: 'Reference – Inputs', title: 'CategoryFilterInput',                             url: `${BASE}/reference/inputs/categoryfilterinput` },
  { section: 'Reference – Inputs', title: 'ComponentsFilterInput',                           url: `${BASE}/reference/inputs/componentsfilterinput` },
  { section: 'Reference – Inputs', title: 'CreatePropertyDefinitionCollectionInHubInput',    url: `${BASE}/reference/inputs/createpropertydefinitioncollectioninhubinput` },
  { section: 'Reference – Inputs', title: 'CreatePropertyDefinitionsInCollectionInput',      url: `${BASE}/reference/inputs/createpropertydefinitionsincollectioninput` },
  { section: 'Reference – Inputs', title: 'ElementFilterInput',                              url: `${BASE}/reference/inputs/elementfilterinput` },
  { section: 'Reference – Inputs', title: 'ElementGroupFilterInput',                         url: `${BASE}/reference/inputs/elementgroupfilterinput` },
  { section: 'Reference – Inputs', title: 'ElementGroupVersionFilterInput',                  url: `${BASE}/reference/inputs/elementgroupversionfilterinput` },
  { section: 'Reference – Inputs', title: 'ElementPropertyFilterInput',                      url: `${BASE}/reference/inputs/elementpropertyfilterinput` },
  { section: 'Reference – Inputs', title: 'ElementReferenceFilterInput',                     url: `${BASE}/reference/inputs/elementreferencefilterinput` },
  { section: 'Reference – Inputs', title: 'ExtensibilityFilterInput',                        url: `${BASE}/reference/inputs/extensibilityfilterinput` },
  { section: 'Reference – Inputs', title: 'ExtensionPropertyInput',                          url: `${BASE}/reference/inputs/extensionpropertyinput` },
  { section: 'Reference – Inputs', title: 'ExtensionPropertyTarget',                         url: `${BASE}/reference/inputs/extensionpropertytarget` },
  { section: 'Reference – Inputs', title: 'FolderFilterInput',                               url: `${BASE}/reference/inputs/folderfilterinput` },
  { section: 'Reference – Inputs', title: 'GeometryComponentsFilterInput',                   url: `${BASE}/reference/inputs/geometrycomponentsfilterinput` },
  { section: 'Reference – Inputs', title: 'HubFilterInput',                                  url: `${BASE}/reference/inputs/hubfilterinput` },
  { section: 'Reference – Inputs', title: 'OriginComponentFilterInput',                      url: `${BASE}/reference/inputs/origincomponentfilterinput` },
  { section: 'Reference – Inputs', title: 'OriginPoints',                                    url: `${BASE}/reference/inputs/originpoints` },
  { section: 'Reference – Inputs', title: 'OriginRange',                                     url: `${BASE}/reference/inputs/originrange` },
  { section: 'Reference – Inputs', title: 'PaginationInput',                                 url: `${BASE}/reference/inputs/paginationinput` },
  { section: 'Reference – Inputs', title: 'ProjectFilterInput',                              url: `${BASE}/reference/inputs/projectfilterinput` },
  { section: 'Reference – Inputs', title: 'PropertyDefinitionFilterInput',                   url: `${BASE}/reference/inputs/propertydefinitionfilterinput` },
  { section: 'Reference – Inputs', title: 'PropertyDefinitionInCollectionInput',             url: `${BASE}/reference/inputs/propertydefinitionincollectioninput` },
  { section: 'Reference – Inputs', title: 'PropertyFilterInput',                             url: `${BASE}/reference/inputs/propertyfilterinput` },
  { section: 'Reference – Inputs', title: 'ReferencePropertyFilterInput',                    url: `${BASE}/reference/inputs/referencepropertyfilterinput` },
  { section: 'Reference – Inputs', title: 'RemoveExtensionPropertiesInput',                  url: `${BASE}/reference/inputs/removeextensionpropertiesinput` },
  { section: 'Reference – Inputs', title: 'UpdateExtensionPropertiesInput',                  url: `${BASE}/reference/inputs/updateextensionpropertiesinput` },
  { section: 'Reference – Inputs', title: 'ValueComparatorInput',                            url: `${BASE}/reference/inputs/valuecomparatorinput` },
  { section: 'Reference – Inputs', title: 'VersionFilterInput',                              url: `${BASE}/reference/inputs/versionfilterinput` },

  // ── Reference – Scalars ───────────────────────────────────────────────────
  { section: 'Reference – Scalars', title: 'Scalars', url: `${BASE}/reference/scalars` },

  // ── Change History ────────────────────────────────────────────────────────
  { section: 'Change History', title: 'Changelog', url: `${BASE}/changelog/v1changelog` },
];

// ─── Turndown (HTML → Markdown) ───────────────────────────────────────────────

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract article content from a rendered APS doc page.
 * Removes nav/header/footer/sidebar, keeps only the article body.
 */
async function extractArticle(page) {
  return page.evaluate(() => {
    // Remove all navigation and chrome elements
    const remove = [
      'nav', 'header', 'footer',
      '.left-nav', '.sidebar', '.breadcrumb',
      '.feedback-section', '.cookie-banner',
      '[class*="nav"]', '[class*="header"]', '[class*="footer"]',
      '[class*="cookie"]', '[class*="sidebar"]',
      'script', 'style', 'noscript',
    ];
    remove.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });

    // Try known content containers, fallback to main/body
    const selectors = [
      'article',
      '[class*="doc-content"]',
      '[class*="article"]',
      'main .content',
      '.content-wrapper',
      'main',
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim().length > 200) {
        return el.innerHTML;
      }
    }
    return document.body.innerHTML;
  });
}

/** Load done titles from existing file for --resume */
function loadDoneTitles(file) {
  if (!fs.existsSync(file)) return new Set();
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/^### (.+)$/gm)];
  return new Set(matches.map(m => m[1].trim()));
}

/** Build section heading block */
function sectionHeading(section, title, url, isNewSection) {
  const parts = [];
  if (isNewSection) parts.push(`\n---\n\n## ${section}\n`);
  parts.push(`\n### ${title}\n`);
  parts.push(`_Source: [${url}](${url})_\n\n`);
  return parts.join('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const doneTitles = RESUME ? loadDoneTitles(OUTPUT_FILE) : new Set();
  const toFetch    = PAGES.filter(p => !doneTitles.has(p.title));

  if (RESUME) {
    console.log(`Resuming — ${doneTitles.size} already done, ${toFetch.length} remaining.\n`);
  } else {
    const header = [
      '# AEC Data Model API — Full Documentation\n',
      `> Auto-generated on ${new Date().toISOString().slice(0, 10)} by scripts/scrape-aecdm-puppeteer.js\n`,
      `> Source: ${BASE}/developers_guide/overview\n`,
      '---\n',
    ].join('\n');
    fs.writeFileSync(OUTPUT_FILE, header, 'utf8');
    console.log(`Fresh run — ${PAGES.length} pages → ${OUTPUT_FILE}\n`);
  }

  console.log('Launching headless Chrome…');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Dismiss cookie consent immediately on every navigation
  page.on('dialog', async dialog => { try { await dialog.dismiss(); } catch (_) {} });

  let successCount = 0;
  let failCount    = 0;
  let currentSection = RESUME ? '__resume__' : '';

  for (let i = 0; i < toFetch.length; i++) {
    const { section, title, url } = toFetch[i];
    const isNewSection = section !== currentSection;
    if (isNewSection) currentSection = section;

    const heading = sectionHeading(section, title, url, isNewSection);
    process.stdout.write(`[${i + 1}/${toFetch.length}] ${title} … `);

    let markdown;
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await delay(SETTLE_MS);

      // Dismiss cookie overlay if present
      try {
        await page.click('[data-action="accept-all"], .cookie-accept, #onetrust-accept-btn-handler', { timeout: 1000 });
      } catch (_) {}

      const html = await extractArticle(page);
      markdown = td.turndown(html).replace(/\n{3,}/g, '\n\n').trim();
      successCount++;
      console.log('OK');
    } catch (err) {
      markdown = `_(Failed to fetch: ${err.message.split('\n')[0]})_`;
      failCount++;
      console.log(`FAILED — ${err.message.split('\n')[0]}`);
    }

    fs.appendFileSync(OUTPUT_FILE, heading + markdown + '\n', 'utf8');
  }

  await browser.close();

  const sizekb = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
  console.log(`\nDone. ${successCount} succeeded, ${failCount} failed.`);
  console.log(`Output: ${OUTPUT_FILE}  (${sizekb} KB)`);
  console.log(`\nNext: node scripts/clean-docs.js --file "API Documentation/AEC-DataModel-API.md"`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
