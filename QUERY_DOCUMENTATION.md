# Robot API Query Documentation

## Advanced Query System

The Robot API now supports advanced querying capabilities that allow you to filter, sort, paginate, and select specific fields from the robot collection.

## Base URL

```
GET /api/robots
```

## Query Parameters

### Basic Filtering

Filter robots by exact field values:

```bash
# Get robots with specific status
GET /api/robots?status=ACTIVE

# Get robots with specific type
GET /api/robots?type=TUGGER

# Get robots with specific connectivity
GET /api/robots?connectivity=CONNECTED
```

### Multiple Values (OR Filtering)

Use comma-separated values to filter by multiple options:

```bash
# Get robots that are either ACTIVE or CHARGING
GET /api/robots?status=ACTIVE,CHARGING

# Get robots that are either TUGGER or FORKLIFT
GET /api/robots?type=TUGGER,FORKLIFT
```

### Advanced Filtering

Use MongoDB operators for more complex queries:

```bash
# Get robots created after a specific date
GET /api/robots?createdAt[gte]=2025-01-01

# Get robots with serial numbers matching a pattern
GET /api/robots?serialNumber[regex]=AR00[1-5]

# Get robots with charge less than 30%
GET /api/robots?charge[lt]=30%

# Get robots with charge between 20% and 80%
GET /api/robots?charge[gte]=20%&charge[lte]=80%
```

### Advanced MongoDB Operators

Use MongoDB-style operators for complex filtering:

#### Comparison Operators

```bash
# Get robots with charge greater than or equal to 50%
GET /api/robots?charge[gte]=50

# Get robots with charge less than 30%
GET /api/robots?charge[lt]=30

# Get robots with charge not equal to 85%
GET /api/robots?charge[ne]=85

# Combine operators (charge >= 20 AND charge <= 80)
GET /api/robots?charge[gte]=20&charge[lte]=80
```

#### Array Operators

```bash
# Get robots where type is in the specified array
GET /api/robots?type[in]=TUGGER,FORKLIFT

# Get robots where type is NOT in the specified array
GET /api/robots?type[nin]=CONVEYOR,SORTER
```

#### Regex Operators

```bash
# Case-insensitive regex search
GET /api/robots?location[regex]=waypoint

# More complex regex patterns
GET /api/robots?serialNumber[regex]=^AR0[1-5]$
```

### Regex Filtering

Use regex patterns for flexible text matching:

```bash
# Case-insensitive search for robots with "way" in location
GET /api/robots?location=/way/

# Find robots with serial numbers starting with "AR"
GET /api/robots?serialNumber=/^AR/
```

### Sorting

Sort results by one or more fields:

```bash
# Sort by creation date (newest first)
GET /api/robots?sort=-createdAt

# Sort by status ascending, then by type descending
GET /api/robots?sort=status,-type

# Sort by charge percentage (ascending)
GET /api/robots?sort=charge
```

### Pagination

Control the number of results and page navigation:

```bash
# Get first 5 robots
GET /api/robots?limit=5

# Get second page with 5 robots per page
GET /api/robots?page=2&limit=5

# Get robots 11-20
GET /api/robots?page=2&limit=10
```

### Field Selection

Select only specific fields to return:

```bash
# Get only serial number and status
GET /api/robots?fields=serialNumber,status

# Get all fields except internal MongoDB fields
GET /api/robots?fields=-__v,-_id
```

## Complex Query Examples

### Example 1: Active Tugger Robots with High Charge

```bash
GET /api/robots?status=ACTIVE&type=TUGGER&charge[gte]=70%&sort=-charge&limit=10
```

### Example 2: Recently Created Robots with Low Battery

```bash
GET /api/robots?charge[lt]=30%&createdAt[gte]=2025-05-01&sort=-createdAt&fields=serialNumber,type,charge,status
```

### Example 3: Search Robots by Location Pattern

```bash
GET /api/robots?location=/waypoint [1-5]/i&status=ACTIVE,CHARGING&sort=serialNumber
```

### Example 4: Paginated Results with Multiple Filters

```bash
GET /api/robots?type=TUGGER,FORKLIFT&connectivity=CONNECTED&page=1&limit=5&sort=-updatedAt
```

## Response Format

All responses include:

-   `success`: Boolean indicating request success
-   `data`: Array of robot objects
-   `count`: Number of robots in current response
-   `pagination`: Pagination information (when applicable)

### Sample Response

```json
{
    "success": true,
    "data": [
        {
            "_id": "...",
            "serialNumber": "AR001",
            "type": "TUGGER",
            "location": "Waypoint 1",
            "charge": "85%",
            "status": "ACTIVE",
            "connectivity": "CONNECTED",
            "createdAt": "2025-05-27T07:43:16.097Z",
            "updatedAt": "2025-05-27T07:43:16.097Z"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 3,
        "totalCount": 25,
        "limit": 10,
        "hasNext": true,
        "hasPrev": false
    },
    "count": 10
}
```

## Available Operators

| Operator | Description           | Example                    |
| -------- | --------------------- | -------------------------- |
| `eq`     | Equal to (default)    | `status=ACTIVE`            |
| `ne`     | Not equal to          | `status[ne]=INACTIVE`      |
| `gt`     | Greater than          | `createdAt[gt]=2025-01-01` |
| `gte`    | Greater than or equal | `charge[gte]=50%`          |
| `lt`     | Less than             | `charge[lt]=30%`           |
| `lte`    | Less than or equal    | `charge[lte]=80%`          |
| `in`     | In array              | `status=ACTIVE,CHARGING`   |
| `nin`    | Not in array          | `type[nin]=CONVEYOR`       |
| `regex`  | Regular expression    | `location[regex]=waypoint` |

## Error Handling

Invalid query parameters will return a 400 Bad Request with error details:

```json
{
    "success": false,
    "error": "Invalid query parameter: invalidField"
}
```
