elementGroupAtTip
query

    Retrieves latest elementGroup data based on given ID.

    Template for Query:

    query GetElementGroupAtTip($elementGroupId: ID!) {
    elementGroupAtTip(elementGroupId: $elementGroupId) {
        # ElementGroupAtTip Fields
    }
    }
    Template for Query Variables:

    {
    "elementGroupId" : "<SOME-ID-TYPE-SCALAR-VALUE>"
    }


    Arguments
    elementGroupId*
    ID! non-null
    The ID of the elementGroup.
    * Required

    Possible Returns
    Value Type	Description
    ElementGroup	Represents a Revit model.

elementGroupByVersionNumber
query

    Retrieves elementGroup by version number and ID.

    Template for Query:

    query GetElementGroupByVersionNumber($elementGroupId: ID!, $versionNumber: Int!) {
    elementGroupByVersionNumber(elementGroupId: $elementGroupId, versionNumber: $versionNumber) {
        # ElementGroupByVersionNumber Fields
    }
    }
    Template for Query Variables:

    {
    "elementGroupId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "versionNumber" : "<SOME-INT-TYPE-SCALAR-VALUE>"
    }


    Arguments
    elementGroupId*
    ID! non-null
    The ID of the elementGroup.
    versionNumber*
    Int! non-null
    Version number to be retrieved.
    * Required

    Possible Returns
    Value Type	Description
    ElementGroup	Represents a Revit model.

elementGroupExtractionStatus
query

    Retrieves the extraction status of the given elementGroup.

    Template for Query:

    query GetElementGroupExtractionStatus($fileUrn: ID!, $versionNumber: Int) {
    elementGroupExtractionStatus(fileUrn: $fileUrn, versionNumber: $versionNumber) {
        # ElementGroupExtractionStatus Fields
    }
    }
    Template for Query Variables:

    {
    "fileUrn" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "versionNumber" : "<SOME-INT-TYPE-SCALAR-VALUE>"
    }


    Arguments
    fileUrn*
    ID! non-null
    File to retrieve elementGroup extraction status from.
    versionNumber
    Int
    File version to retrieve elementGroup extraction status from. Default value is 1.
    * Required

    Possible Returns
    Value Type	Description
    ElementGroupExtractionStatus	Information about elementGroup extraction status.

elementGroupExtractionStatusAtTip
query

    Retrieves the extraction status of the given elementGroup for the latest version.

    Template for Query:

    query GetElementGroupExtractionStatusAtTip($fileUrn: ID!, $accProjectId: ID!) {
    elementGroupExtractionStatusAtTip(fileUrn: $fileUrn, accProjectId: $accProjectId) {
        # ElementGroupExtractionStatusAtTip Fields
    }
    }
    Template for Query Variables:

    {
    "fileUrn" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "accProjectId" : "<SOME-ID-TYPE-SCALAR-VALUE>"
    }


    Arguments
    fileUrn*
    ID! non-null
    File to retrieve elementGroup extraction status from.
    accProjectId*
    ID! non-null
    Forma Project Id of the elementGroup.
    * Required

    Possible Returns
    Value Type	Description
    ElementGroupExtractionStatus	Information about elementGroup extraction status.

elementGroupsByHub
query

    Retrieves elementGroups in the given hub, using additional RSQL filters if provided.

    Template for Query:

    query GetElementGroupsByHub($hubId: ID!, $filter: ElementGroupFilterInput, $pagination: PaginationInput) {
    elementGroupsByHub(hubId: $hubId, filter: $filter, pagination: $pagination) {
        # ElementGroupsByHub Fields
    }
    }
    Template for Query Variables:

    {
    "hubId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTGROUPFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    hubId*
    ID! non-null
    Hub to retrieve elementGroups from.
    filter
    ElementGroupFilterInput
    RSQL filter to use for searching elementGroups.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    ElementGroups! non-null	Contains a list of ElementGroups returned in response to a query.

elementGroupsByProject
query

    Retrieves elementGroups in the given project, using additional RSQL filters if provided.

    Template for Query:

    query GetElementGroupsByProject($projectId: ID!, $filter: ElementGroupFilterInput, $pagination: PaginationInput) {
    elementGroupsByProject(projectId: $projectId, filter: $filter, pagination: $pagination) {
        # ElementGroupsByProject Fields
    }
    }
    Template for Query Variables:

    {
    "projectId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTGROUPFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    projectId*
    ID! non-null
    Project to retrieve elementGroups from.
    filter
    ElementGroupFilterInput
    RSQL filter to use for searching elementGroups.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    ElementGroups! non-null	Contains a list of ElementGroups returned in response to a query.

    
    
elementGroupsByFolder
query

    Retrieves elementGroups in the given folder, using additional RSQL filters if provided.

    Template for Query:

    query GetElementGroupsByFolder($projectId: ID!, $folderId: ID!, $filter: ElementGroupFilterInput, $pagination: PaginationInput) {
    elementGroupsByFolder(projectId: $projectId, folderId: $folderId, filter: $filter, pagination: $pagination) {
        # ElementGroupsByFolder Fields
    }
    }
    Template for Query Variables:

    {
    "projectId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "folderId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTGROUPFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    projectId*
    ID! non-null
    Project to retrieve elementGroups from.
    folderId*
    ID! non-null
    Folder to retrieve elementGroups from.
    filter
    ElementGroupFilterInput
    RSQL filter to use for searching elementGroups.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    ElementGroups! non-null	Contains a list of ElementGroups returned in response to a query.

elementGroupsByFolderAndSubFolders
query

    Retrieves elementGroups in the given folder and it's sub-folders recursively, using additional RSQL filters if provided.

    Template for Query:

    query GetElementGroupsByFolderAndSubFolders($projectId: ID!, $folderId: ID!, $filter: ElementGroupFilterInput, $pagination: PaginationInput) {
    elementGroupsByFolderAndSubFolders(projectId: $projectId, folderId: $folderId, filter: $filter, pagination: $pagination) {
        # ElementGroupsByFolderAndSubFolders Fields
    }
    }
    Template for Query Variables:

    {
    "projectId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "folderId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTGROUPFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    projectId*
    ID! non-null
    Project to retrieve elementGroups from.
    folderId*
    ID! non-null
    Folder to recursively retrieve elementGroups from.
    filter
    ElementGroupFilterInput
    RSQL filter to use for searching elementGroups.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    ElementGroups! non-null	Contains a list of ElementGroups returned in response to a query.

elementAtTip
query

    Retrieves element using given ID.

    Template for Query:

    query GetElementAtTip($elementId: ID!) {
    elementAtTip(elementId: $elementId) {
        # ElementAtTip Fields
    }
    }
    Template for Query Variables:

    {
    "elementId" : "<SOME-ID-TYPE-SCALAR-VALUE>"
    }


    Arguments
    elementId*
    ID! non-null
    Element to retrieve.
    * Required

    Possible Returns
    Value Type	Description
    Element	Represents an element type.


    Examples
    Example 1
    Retrieves an element at tip by element ID along with its properties.

    Query:

    query GetElementAtTip($elementId: ID!, $propertiesPagination: PaginationInput) {
    elementAtTip(elementId: $elementId) {
        id
        name
        properties(pagination: $propertiesPagination) {
        results {
            name
            value
        }
        }
    }
    }

    Query Variables:

    {
    "elementId": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QV0hqdllJalM3NmNWbURQTXJFMXZRXzEwMDAwMA",
    "propertiesPagination": {
        "limit": 5
    }
    }

    Response:

    {
    "data": {
        "elementAtTip": {
        "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QV0hqdllJalM3NmNWbURQTXJFMXZRXzEwMDAwMA",
        "name": "2.5\" x 5\" rectangular (Orange)",
        "properties": {
            "pagination": {
            "pageSize": 5,
            "cursor": "Y3Vyc341fjU"
            },
            "results": [
            {
                "name": "Length",
                "value": 1.2192
            },
            {
                "name": "Design Option",
                "value": "Main Model"
            },
            {
                "name": "Area",
                "value": 0.24032209999999998
            },
            {
                "name": "Volume",
                "value": 0.0098322384
            },
            {
                "name": "Export to IFC",
                "value": "By Type"
            }
            ]
        }
        }
    }
    }

elementsByHub
query

    Retrieves elements from given hub, using additional RSQL filters if provided.

    Template for Query:

    query GetElementsByHub($hubId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    elementsByHub(hubId: $hubId, filter: $filter, pagination: $pagination) {
        # ElementsByHub Fields
    }
    }
    Template for Query Variables:

    {
    "hubId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    hubId*
    ID! non-null
    Hub to retrieve elements from.
    filter
    ElementFilterInput
    RSQL filter to use for searching elements.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    Elements	Contains a list of Elements returned in response to a query.


    Examples
    Example 1
    Retrieves elements of category ‘Windows’ across elementgroups under a hub by hub ID.

    Query:

    query GetElementsByHub($hubId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    elementsByHub(hubId: $hubId, filter: $filter, pagination: $pagination) {
        pagination {
        pageSize
        cursor
        }
        results {
        id
        name
        }
    }
    }

    Query Variables:

    {
    "hubId": "b.e4fbd315-2dc5-4026-8ca3-80f09d24ff42",
    "filter": {
        "query": "property.name.category==Windows and 'property.name.Element Context'==Instance"
    },
    "pagination": {
        "limit": 5
    }
    }

    Response:

    {
    "data": {
        "elementsByHub": {
        "pagination": {
            "pageSize": 5,
            "cursor": "YWRjdXJzfk5VTEx-QlE9PX41"
        },
        "results": [
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViN2M",
            "name": "32.10-sparing tbv installaties_1400x600"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViN2Q",
            "name": "32.10-sparing tbv installaties_1100x650"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViODY",
            "name": "32.10-sparing tbv installaties_500x300"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViOGE",
            "name": "32.10-sparing tbv installaties_625x150"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViOGM",
            "name": "32.10-sparing tbv installaties_400x150"
            }
        ]
        }
    }
    }

elementsByProject
query

    Retrieves elements from given project, using additional RSQL filters if provided.

    Template for Query:

    query GetElementsByProject($projectId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    elementsByProject(projectId: $projectId, filter: $filter, pagination: $pagination) {
        # ElementsByProject Fields
    }
    }
    Template for Query Variables:

    {
    "projectId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    projectId*
    ID! non-null
    Project to retrieve elements from.
    filter
    ElementFilterInput
    RSQL filter to use for searching elements.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    Elements	Contains a list of Elements returned in response to a query.


    Examples

    Example 1
    Retrieves elements of category ‘Windows’ across elementgroups under a project by project ID.

    Query:
    query GetElementsByProject($projectId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    elementsByProject(projectId: $projectId, filter: $filter, pagination: $pagination) {
        pagination {
        pageSize
        cursor
        }
        results {
        id
        name
        }
    }
    }

    Query Variables:

    {
    "projectId": "YWltcHJvan5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NQ",
    "filter": {
        "query": "property.name.category==Windows and 'property.name.Element Context'==Instance"
    },
    "pagination": {
        "limit": 5
    }
    }

    Response:

    {
    "data": {
        "elementsByProject": {
        "pagination": {
            "pageSize": 5,
            "cursor": "YWRjdXJzfk5VTEx-QlE9PX41"
        },
        "results": [
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViN2M",
            "name": "32.10-sparing tbv installaties_1400x600"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViN2Q",
            "name": "32.10-sparing tbv installaties_1100x650"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViODY",
            "name": "32.10-sparing tbv installaties_500x300"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViOGE",
            "name": "32.10-sparing tbv installaties_625x150"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViOGM",
            "name": "32.10-sparing tbv installaties_400x150"
            }
        ]
        }
    }
    }

elementsByFolder
query

    Retrieves elements from given folder, using additional RSQL filters if provided.

    Template for Query:

    query GetElementsByFolder($projectId: ID!, $folderId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    elementsByFolder(projectId: $projectId, folderId: $folderId, filter: $filter, pagination: $pagination) {
        # ElementsByFolder Fields
    }
    }
    Template for Query Variables:

    {
    "projectId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "folderId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    projectId*
    ID! non-null
    Project to retrieve elements from.
    folderId*
    ID! non-null
    Folder to retrieve elements from.
    filter
    ElementFilterInput
    RSQL filter to use for searching elements.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    Elements	Contains a list of Elements returned in response to a query.


    Examples
    Example 1
    Retrieves elements of category ‘Windows’ across elementgroups under a folder by folder ID.

    Query:

    query GetElementsByFolder($folderId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    elementsByFolder(folderId: $folderId, filter: $filter, pagination: $pagination) {
        pagination {
        pageSize
        cursor
        }
        results {
        id
        name
        }
    }
    }

    Query Variables:

    {
    "folderId": "Zm9sZH5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NX51cm46YWRzay53aXBzdGc6ZnMuZm9sZGVyOmNvLlhvSG9RY3pHUm9LczVZRm4yUDNpWlE",
    "filter": {
        "query": "property.name.category==Windows and 'property.name.Element Context'==Instance"
    },
    "pagination": {
        "limit": 5
    }
    }

    Response:

    {
    "data": {
        "elementsByFolder": {
        "pagination": {
            "pageSize": 5,
            "cursor": "YWRjdXJzfk5VTEx-QlE9PX41"
        },
        "results": [
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViN2M",
            "name": "32.10-sparing tbv installaties_1400x600"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViN2Q",
            "name": "32.10-sparing tbv installaties_1100x650"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViODY",
            "name": "32.10-sparing tbv installaties_500x300"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViOGE",
            "name": "32.10-sparing tbv installaties_625x150"
            },
            {
            "id": "YWVjZX5FMnRqOFJFOXRsSlRQNU9WVzBiaDZ4X0wyQ35QQllLNWlOb1NsQ283QVpEOVdUM0V3XzEyM2ViOGM",
            "name": "32.10-sparing tbv installaties_400x150"
            }
        ]
        }
    }
    }

elementsByElementGroup
query

    Retrieves elements from given elementGroup, using additional RSQL filters if provided.

    Template for Query:

    query GetElementsByElementGroup($elementGroupId: ID!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    elementsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
        # ElementsByElementGroup Fields
    }
    }
    Template for Query Variables:

    {
    "elementGroupId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    elementGroupId*
    ID! non-null
    ElementGroup to retrieve elements from.
    filter
    ElementFilterInput
    RSQL filter to use for searching elements.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    Elements	Contains a list of Elements returned in response to a query.

elementsByElementGroupAtVersion
query

    Retrieves elements from given elementGroup at given elementGroup version, using additional RSQL filters if provided.

    Template for Query:

    query GetElementsByElementGroupAtVersion($elementGroupId: ID!, $versionNumber: Int!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    elementsByElementGroupAtVersion(elementGroupId: $elementGroupId, versionNumber: $versionNumber, filter: $filter, pagination: $pagination) {
        # ElementsByElementGroupAtVersion Fields
    }
    }
    Template for Query Variables:

    {
    "elementGroupId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "versionNumber" : "<SOME-INT-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    elementGroupId*
    ID! non-null
    ElementGroup to retrieve elements from.
    versionNumber*
    Int! non-null
    ElementGroup version to retrieve elements from.
    filter
    ElementFilterInput
    RSQL filter to use for searching elements.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    Elements	Contains a list of Elements returned in response to a query.

hub
query

    Retrieves an object representing a hub.

    A Hub is a container of projects, shared resources, and users with a common context.

    Template for Query:

    query GetHub($hubId: ID!) {
    hub(hubId: $hubId) {
        # Hub Fields
    }
    }
    Template for Query Variables:

    {
    "hubId" : "<SOME-ID-TYPE-SCALAR-VALUE>"
    }


    Arguments
    hubId*
    ID! non-null
    The ID of the hub to return.
    * Required

    Possible Returns
    Value Type	Description
    Hub	Represents a hub. A hub is a container of projects, shared resources, and users with a common context.


    Examples
    Example 1
    Retrieves a hub by ID along with its projects.

    Query:

    query GetHub($hubId: ID!) {
    hub(hubId: $hubId) {
        id
        name
        projects {
        results {
            id
            name
        }
        }
    }
    }

    Query Variables:

    {
    "hubId": "b.e4fbd315-2dc5-4026-8ca3-80f09d24ff42"
    }

    Response:

    {
    "data": {
        "hub": {
        "id": "b.e4fbd315-2dc5-4026-8ca3-80f09d24ff42",
        "name": "Revit Nexus",
        "projects": {
            "results": [
            {
                "id": "YWltcHJvan5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NQ",
                "name": "AEC Design AIM STG"
            },
            {
                "id": "YWltcHJvan5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjgxY2U0YjkyLWIxNTYtNDE5ZS04MjM1LTNiNzY5M2FhMGY0MA",
                "name": "Extractor-AIM"
            }
            ]
        }
        }
    }
    }

hubs
query

    Retrieves all hubs that match the specified criteria.

    A Hub is a container of projects, shared resources, and users with a common context.

    Template for Query:

    query GetHubs($filter: HubFilterInput, $pagination: PaginationInput) {
    hubs(filter: $filter, pagination: $pagination) {
        # Hubs Fields
    }
    }
    Template for Query Variables:

    {
    "filter" : "<SOME-HUBFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    filter
    HubFilterInput
    Specifies how to filter a list of hubs. You can filter by name.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.

    Possible Returns
    Value Type	Description
    Hubs	Contains a list of hubs returned in response to a query. A hub is a container of projects, shared resources, and users with a common context.


    Examples
    Example 1
    Retrieves all hubs you have access to.

    Query:

    query GetHubs {
    hubs {
        results {
        id
        name
        }
    }
    }
    Query Variables:
    {
    }
    Response:
    {
    "data": {
        "hubs": {
        "results": [
            {
            "name": "Revit Nexus",
            "id": "b.e4fbd315-2dc5-4026-8ca3-80f09d24ff42"
            },
            {
            "name": "Golden Gate",
            "id": "b.5c07c84c-bbd9-476e-8712-547f74c5b76b"
            }
        ]
        }
    }
    }

project
query

    Retrieves an object representing a project from a specified hub.

    A project is a shared workspace for teams of people to store, organize, and manage all related design data.

    Template for Query:

    query GetProject($projectId: ID!) {
    project(projectId: $projectId) {
        # Project Fields
    }
    }
    Template for Query Variables:

    {
    "projectId" : "<SOME-ID-TYPE-SCALAR-VALUE>"
    }


    Arguments
    projectId*
    ID! non-null
    The ID of the project to retrieve.
    * Required

    Possible Returns
    Value Type	Description
    Project	Represents a project. A project is a shared workspace for teams of people working together on a project, to store, organize, and manage all related entity data.


    Examples
    Example 1
    Retrieves a project by ID along with its top folders.

    Query:
    query GetProject($projectId: ID!) {
    project (projectId: $projectId) {
        id
        name
        folders {
        results {
            id
            name
            objectCount
        }
        }
    }
    }

    Query Variables:

    {
    "projectId": "YWltcHJvan5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NQ"
    }
    Response:

    {
    "data": {
        "project": {
        "id": "YWltcHJvan5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NQ",
        "name": "AEC Design AIM STG  ",
        "folders": {
            "results": [
            {
                "id": "Zm9sZH5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NX51cm46YWRzay53aXBzdGc6ZnMuZm9sZGVyOmNvLlhvSG9RY3pHUm9LczVZRm4yUDNpWlE",
                "name": "Project Files",
                "objectCount": 8
            }
            ]
        }
        }
    }
    }

projects
query

    Retrieves all projects that match the specified filter criteria from a specified hub.

    Template for Query:

    query GetProjects($hubId: ID!, $filter: ProjectFilterInput, $pagination: PaginationInput) {
    projects(hubId: $hubId, filter: $filter, pagination: $pagination) {
        # Projects Fields
    }
    }
    Template for Query Variables:

    {
    "hubId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-PROJECTFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    hubId*
    ID! non-null
    The ID of the hub that contains the projects.
    filter
    ProjectFilterInput
    Specifies how to filter a list of projects. You can filter by name.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    Projects	Contains a list of projects returned in response to a query.


    Examples
    Example 1
    Retrieves all projects under a hub by hub ID.

    Query:

    query GetProjects($hubId: String!) {
    projects(hubId: $hubId) {
        results {
        name
        id
        hub {
            id
            name
        }
        }
    }
    }

    Query Variables:

    {
    "hubId": "b.5c07c84c-bbd9-476e-8712-547f74c5b76b"
    }
    Response:

    {
    "data": {
        "projects": {
        "results": [
            {
            "id": "YWltcHJvan5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NQ",
            "name": "AEC Design AIM STG",
            "hub": {
                "id": "b.e4fbd315-2dc5-4026-8ca3-80f09d24ff42",
                "name": "Revit Nexus"
            }
            },
            {
            "id": "YWltcHJvan5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjgxY2U0YjkyLWIxNTYtNDE5ZS04MjM1LTNiNzY5M2FhMGY0MA",
            "name": "Extractor-AIM",
            "hub": {
                "id": "b.e4fbd315-2dc5-4026-8ca3-80f09d24ff42",
                "name": "Revit Nexus"
            }
            }
        ]
        }
    }
    }

folder
query

    Retrieve folder specified by the provided Id

    Template for Query:

    query GetFolder($projectId: ID!, $folderId: ID!) {
    folder(projectId: $projectId, folderId: $folderId) {
        # Folder Fields
    }
    }
    Template for Query Variables:

    {
    "projectId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "folderId" : "<SOME-ID-TYPE-SCALAR-VALUE>"
    }


    Arguments
    projectId*
    ID! non-null
    The ID of the project that contains the item.
    folderId*
    ID! non-null
    The ID of the item to retrieve.
    * Required

    Possible Returns
    Value Type	Description
    Folder	Represents a folder. A folder is a location for storing files, data, and other folders (sub-folders).


    Examples
    Example 1
    Retrieves a folder by ID along with its sub folders.

    Query:
    query GetFolder($folderId: ID!) {
    folder (folderId: $folderId) {
        id
        name
        objectCount
        folders {
        results {
            id
            name
            objectCount
        }
        }
    }
    }
    Query Variables:

    {
    "folderId": "Zm9sZH5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NX51cm46YWRzay53aXBzdGc6ZnMuZm9sZGVyOmNvLlhvSG9RY3pHUm9LczVZRm4yUDNpWlE"
    }
    Response:

    {
    "data": {
        "folder": {
        "id": "Zm9sZH5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NX51cm46YWRzay53aXBzdGc6ZnMuZm9sZGVyOmNvLlhvSG9RY3pHUm9LczVZRm4yUDNpWlE",
        "name": "Project Files",
        "objectCount": 8,
        "folders": {
            "results": [
            {
                "id": "Zm9sZH5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NX51cm46YWRzay53aXBzdGc6ZnMuZm9sZGVyOmNvLnBRYjdZcVNlUjlXNTdldmVkZVdvQlE",
                "name": "Model",
                "objectCount": 22
            },
            {
                "id": "Zm9sZH5iLmU0ZmJkMzE1LTJkYzUtNDAyNi04Y2EzLTgwZjA5ZDI0ZmY0Mn5iLjdhZGJmOWZkLWRlYmItNDI5Yy1iZmU1LTMyYTNjMjJjMDY5NX51cm46YWRzay53aXBzdGc6ZnMuZm9sZGVyOmNvLkU1OENuck5pUTZDVW9PTG9Ja29QSUE",
                "name": "Small House",
                "objectCount": 1
            }
            ]
        }
        }
    }
    }

foldersByFolder
query

    Retrieves all subfolders within a specified folder that meet the filter criteria specified by the filter argument.

    Template for Query:

    query GetFoldersByFolder($projectId: ID!, $folderId: ID!, $filter: FolderFilterInput, $pagination: PaginationInput) {
    foldersByFolder(projectId: $projectId, folderId: $folderId, filter: $filter, pagination: $pagination) {
        # FoldersByFolder Fields
    }
    }
    Template for Query Variables:

    {
    "projectId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "folderId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-FOLDERFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    projectId*
    ID! non-null
    The ID of the project that contains the items.
    folderId*
    ID! non-null
    The ID of the folder that contains the subfolders.
    filter
    FolderFilterInput
    Specifies how to filter on folders. You can filter by name.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    Folders	A list of Folders returned in response to a query. A folder contains items, such as designs and sub-folders.



foldersByProject
query

    Retrieves all top level folders under a specified project that meet the filter criteria specified by the filter argument.

    Template for Query:

    query GetFoldersByProject($projectId: ID!, $filter: FolderFilterInput, $pagination: PaginationInput) {
    foldersByProject(projectId: $projectId, filter: $filter, pagination: $pagination) {
        # FoldersByProject Fields
    }
    }
    Template for Query Variables:

    {
    "projectId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-FOLDERFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    projectId*
    ID! non-null
    The ID of the project that contains the items.
    filter
    FolderFilterInput
    Specifies how to filter on folders. You can filter by name.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    Folders	A list of Folders returned in response to a query. A folder contains items, such as designs and sub-folders.

distinctPropertyValuesInElementGroupById
query

    Retrieves distinct values in an ElementGroup given a property definition ID.

    Template for Query:

    query GetDistinctPropertyValuesInElementGroupById($elementGroupId: ID!, $propertyDefinitionId: ID!, $filter: ElementFilterInput) {
    distinctPropertyValuesInElementGroupById(elementGroupId: $elementGroupId, propertyDefinitionId: $propertyDefinitionId, filter: $filter) {
        # DistinctPropertyValuesInElementGroupById Fields
    }
    }
    Template for Query Variables:

    {
    "elementGroupId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "propertyDefinitionId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTFILTER-INPUT-TYPE-VALUE>"
    }


    Arguments
    elementGroupId*
    ID! non-null
    ElementGroup to retrieve distinct values from.
    propertyDefinitionId*
    ID! non-null
    definition id of the property to retrieve the distinct values of.
    filter
    ElementFilterInput
    RSQL filter to use for searching elements.
    * Required

    Possible Returns
    Value Type	Description
    DistinctPropertyValues	Contains a list of DistinctPropertyValue returned in response to a query.


    Examples
    Example 1
    Retrieves all family of doors in an element group

    Query:
    query ($elementGroupId: ID!, $propertyDefinitionId: ID!, $filter: ElementFilterInput) {
    distinctPropertyValuesInElementGroupById(elementGroupId: $elementGroupId, propertyDefinitionId: $propertyDefinitionId, filter: $filter) {
        definition {
        id
        }
        values(limit: 200) {
        value,
        count
        }
    }
    }
    Query Variables:

    {
    "elementGroupId": "YWVjZH5JR0JWdWROM2QxdW1kTkJZRnR2ZlpBX0wyQ35GZGhKOWZxZFJSR2QxTXAwNU1RWkVR",
    "propertyDefinitionId": "autodesk.revit.parameter:parameter.elemFamilyName-2.0.0",
    "filter": {
        "query": "property.name.category==Doors"
    }
    }

    Response:

    {
    "data": {
        "distinctPropertyValuesInElementGroupById": {
        "definition": {
            "id": "autodesk.revit.parameter:parameter.elemFamilyName-2.0.0"
        },
        "values": [
            {
            "value": "Door-Passage-Single-Flush",
            "count": 105
            },
            {
            "value": "Door-Passage-Single-Two_Lite",
            "count": 13
            },
            {
            "value": "Door-Opening",
            "count": 9
            },
            {
            "value": "Door-Curtain-Wall-Double-Storefront",
            "count": 6
            },
            {
            "value": "36\" x 84\"",
            "count": 5
            }
        ]
        }
    }
    }

distinctPropertyValuesInElementGroupByName
query

    Retrieves distinct values in an ElementGroup given a property name.

    Template for Query:

    query GetDistinctPropertyValuesInElementGroupByName($elementGroupId: ID!, $name: String!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    distinctPropertyValuesInElementGroupByName(elementGroupId: $elementGroupId, name: $name, filter: $filter, pagination: $pagination) {
        # DistinctPropertyValuesInElementGroupByName Fields
    }
    }
    Template for Query Variables:

    {
    "elementGroupId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "name" : "<SOME-STRING-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-ELEMENTFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    elementGroupId*
    ID! non-null
    ElementGroup to retrieve distinct values from.
    name*
    String! non-null
    name of the property to retrieve the distinct values of.
    filter
    ElementFilterInput
    RSQL filter to use for searching elements.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    DistinctPropertyValuesCollection	A collection of distinct properties matching the name given.


    Examples
    Example 1
    Retrieves all distinct structural materials used in walls

    Query:

    query ($elementGroupId: ID!, $name: String!, $filter: ElementFilterInput, $pagination: PaginationInput) {
    distinctPropertyValuesInElementGroupByName(elementGroupId: $elementGroupId, name: $name, filter: $filter, pagination: $pagination) {
        results {
        definition {
            id
        }
        values(limit: 5) {
            value
            count
        }
        }
    }
    }
    Query Variables:

    {
    "elementGroupId": "YWVjZH5JR0JWdWROM2QxdW1kTkJZRnR2ZlpBX0wyQ35GZGhKOWZxZFJSR2QxTXAwNU1RWkVR",
    "name": "Structural Material",
    "filter": {
        "query": "property.name.category==Walls"
    }
    }
    Response:

    {
    "data": {
        "distinctPropertyValuesInElementGroupByName": {
        "results": [
            {
            "definition": {
                "id": "autodesk.revit.parameter:structuralMaterialParam-5.0.0"
            },
            "values": [
                {
                "value": "Concrete Masonry Units",
                "count": 4
                },
                {
                "value": "Metal Stud Layer",
                "count": 21
                },
                {
                "value": "Metal Furring",
                "count": 5
                },
                {
                "value": "Concrete, Cast-in-Place gray",
                "count": 5
                }
            ]
            }
        ]
        }
    },
    }

propertyDefinitionsByElementGroup
query

    Get all Property Definitions used in specified elementGroup

    Template for Query:

    query GetPropertyDefinitionsByElementGroup($elementGroupId: ID!, $filter: PropertyDefinitionFilterInput, $pagination: PaginationInput) {
    propertyDefinitionsByElementGroup(elementGroupId: $elementGroupId, filter: $filter, pagination: $pagination) {
        # PropertyDefinitionsByElementGroup Fields
    }
    }
    Template for Query Variables:

    {
    "elementGroupId" : "<SOME-ID-TYPE-SCALAR-VALUE>",
    "filter" : "<SOME-PROPERTYDEFINITIONFILTER-INPUT-TYPE-VALUE>",
    "pagination" : "<SOME-PAGINATION-INPUT-TYPE-VALUE>"
    }


    Arguments
    elementGroupId*
    ID! non-null
    ElementGroup to retrieve property definitions of.
    filter
    PropertyDefinitionFilterInput
    Specifies how to filter on property definitions.
    pagination
    PaginationInput
    Specifies how to split the response into multiple pages.
    * Required

    Possible Returns
    Value Type	Description
    PropertyDefinitions! non-null	List of property definitions.
