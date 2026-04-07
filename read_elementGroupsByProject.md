# AEC Data Model API Implementation Notes

## Critical API Quirks & Requirements

### Pagination Limits
**IMPORTANT**: The GraphQL API has strict pagination validation:
- Documentation states limits: Hubs/Projects (max 200), ElementGroups (max 100)
- **ACTUAL BEHAVIOR**: Setting `limit: 100` causes validation error: "PaginationInput.limit must be between 0 and 100"
- **SOLUTION**: Omit the `limit` parameter entirely - let API use defaults:
  - Hubs: 100 items/page (default)
  - Projects: 100 items/page (default)
  - ElementGroups: 50 items/page (default)
- Cursor-based pagination works correctly when limit is omitted

### Revit Version Compatibility
- **AEC Data Model ONLY indexes Revit 2024 or higher**
- Older Revit files (2022, 2023, etc.) will NOT appear in element groups
- This is documented at: https://aps.autodesk.com/en/docs/aecdatamodel/v1/developers_guide/overview/
- User may see fewer element groups than total Revit files in project folder

### Session Management
- **Critical**: `sessionId` must be included in GraphQL request body
- Backend proxy adds Bearer token using sessionId
- Store sessionId in localStorage for persistence
- Check sessionId exists before calling `graphqlRequest()`

### Cursor Pagination Pattern
**Correct implementation**:
```javascript
do {
    const variables = { projectId: project.id };
    // Only include cursor when it has a value
    if (cursor) {
        variables.cursor = cursor;
    }
    const data = await graphqlRequest(query, variables, region);
    results = results.concat(data.data?.results || []);
    cursor = data.data?.pagination?.cursor;
} while (cursor);
```

**WRONG**: Don't send `cursor: null` in variables - causes GraphQL error

### Multi-Region Hub Fetching
- Must query all 8 regions: US, EMEA, AUS, IND, GBR, DEU, CAN, JPN
- Use `Promise.all()` for parallel fetching
- Filter for ACC hubs: `hub.id.includes('adsk.ace:prod.scope')`
- Deduplicate hubs across regions by ID
- Filter out "Team Hub" entries

### GraphQL Query Structure
**Hubs Query** (working):
```graphql
query GetHubs($cursor: String) {
    hubs(pagination: { cursor: $cursor }) {  # No limit!
        pagination { cursor }
        results { id, name }
    }
}
```

**Projects Query** (working):
```graphql
query GetProjects($hubId: ID!, $cursor: String) {
    projects(hubId: $hubId, pagination: { cursor: $cursor }) {
        pagination { cursor }
        results { id, name }
    }
}
```

**ElementGroups Query** (working):
```graphql
query GetElementGroupsByProject($projectId: ID!, $cursor: String) {
    elementGroupsByProject(projectId: $projectId, pagination: { cursor: $cursor }) {
        pagination { cursor }
        results {
            name
            id
            alternativeIdentifiers {
                fileUrn
                fileVersionUrn
            }
        }
    }
}
```

## Common Pitfalls

1. ❌ **Don't** set `limit: 100` - causes validation error
2. ❌ **Don't** send `cursor: null` in GraphQL variables
3. ❌ **Don't** forget to check sessionId before GraphQL calls
4. ❌ **Don't** expect all Revit files to appear (only 2024+)
5. ✅ **Do** use conditional cursor inclusion: `if (cursor) { variables.cursor = cursor; }`
6. ✅ **Do** query all regions for hubs
7. ✅ **Do** implement pagination loops with `do...while(cursor)`

## Debugging Tips

- Enable console logging for all GraphQL requests/responses
- Log filter pipeline steps to see where data is lost
- Use `JSON.stringify(errors, null, 2)` to see full error details
- Check browser console for LaunchDarkly warnings (safe to ignore)
- Verify sessionId exists when functions are called

## API Documentation
- Main docs: https://aps.autodesk.com/en/docs/aecdatamodel/v1/
- Pagination: https://aps.autodesk.com/en/docs/aecdatamodel/v1/developers_guide/pagination/
- GraphQL endpoint: https://developer.api.autodesk.com/aec/graphql
