# Demo Server Hono - Generic OpenAPI Generator

A modern, scalable REST API server built with Hono.js featuring a completely generic OpenAPI generator, advanced MongoDB-style query parsing, and enterprise-grade features.

## 🚀 Features

### Generic OpenAPI Generator

-   **Auto-discovery**: Automatically discovers models and routes across your application
-   **Dynamic schema extraction**: Generates OpenAPI schemas from Mongoose models
-   **Multi-entity support**: Works with unlimited entities and endpoints
-   **Configuration-driven**: Fully configurable via `openapi.config.json`
-   **Repository agnostic**: Easily portable to any project structure

### Advanced Query System

Our API supports MongoDB-style queries with enterprise-grade features:

#### MongoDB Operators

-   **Comparison**: `gte`, `gt`, `lte`, `lt`, `ne`
-   **Array**: `in`, `nin`
-   **Pattern**: `regex` with `/pattern/` syntax

```bash
# Greater than or equal
GET /api/robots?batteryLevel[gte]=80

# Not equal
GET /api/robots?status[ne]=inactive

# Array contains
GET /api/robots?type[in]=autonomous,hybrid

# Regex pattern matching
GET /api/robots?name[regex]=/^R-/
```

#### Multiple Value Filtering

```bash
# OR operation with comma-separated values
GET /api/robots?status=active,maintenance&type=autonomous,hybrid
```

#### Advanced Sorting

```bash
# Single field ascending
GET /api/robots?sort=name

# Single field descending
GET /api/robots?sort=-batteryLevel

# Multiple fields with mixed directions
GET /api/robots?sort=status,-batteryLevel,name
```

#### Smart Pagination

```bash
# Standard pagination
GET /api/robots?page=2&limit=10

# Alternative syntax
GET /api/robots?currentPage=2&limit=10

# Default: page=1, limit=10
```

#### Field Selection

```bash
# Select specific fields only
GET /api/robots?fields=name,status,batteryLevel

# Exclude fields (prefix with -)
GET /api/robots?fields=-description,-metadata
```

#### Complex Query Examples

```bash
# High-battery autonomous robots, sorted by battery level
GET /api/robots?type=autonomous&batteryLevel[gte]=80&sort=-batteryLevel&fields=name,batteryLevel

# Search robots with names starting with "R-" that are active or in maintenance
GET /api/robots?name[regex]=/^R-/&status[in]=active,maintenance&sort=name

# Paginated results with specific field selection
GET /api/robots?page=1&limit=5&fields=name,status&sort=-createdAt
```

## 🛠️ Setup

### Prerequisites

-   Node.js 18+ or Bun
-   Docker (for MongoDB)
-   Git

### Installation

1. **Clone and install dependencies:**

```bash
git clone <your-repo>
cd demo-server-hono
bun install
```

2. **Start MongoDB with Docker:**

```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

3. **Configure entities in `openapi.config.json`:**

```json
{
    "entities": [
        {
            "name": "Robot",
            "modelPath": "src/models/Robot.ts",
            "routePath": "src/routes/robotRoutes.ts",
            "identifier": "id"
        }
    ]
}
```

4. **Run the server:**

```bash
bun run dev
```

5. **Access the API:**

-   Server: http://localhost:5005
-   OpenAPI Documentation: http://localhost:5005/doc

## 📁 Project Structure

```
src/
├── controllers/          # Functional controllers with advanced query support
│   ├── RobotController.ts
│   └── UserController.ts
├── models/              # Mongoose models with validation
│   ├── Robot.ts
│   └── User.ts
├── routes/              # Route definitions
│   ├── robotRoutes.ts
│   ├── userRoutes.ts
│   └── index.ts
├── scripts/             # Generic OpenAPI generator
│   └── generateGenericOpenAPI.ts
├── utils/               # Utilities
│   ├── queryParser.ts   # Advanced MongoDB-style query parser
│   └── BadRequestError.ts
└── config/              # Configuration
    └── database.ts
```

## 🔧 Adding New Entities

1. **Create Mongoose model** in `src/models/YourEntity.ts`
2. **Create controller** in `src/controllers/YourEntityController.ts`
3. **Create routes** in `src/routes/yourEntityRoutes.ts`
4. **Update `openapi.config.json`** to include your new entity
5. **Regenerate OpenAPI spec:**

```bash
bun run generate:openapi
```

See `SETUP_GUIDE_NEW_REPO.md` for detailed instructions.

## 📊 Available Scripts

```bash
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run generate:openapi # Generate OpenAPI specification
bun run test            # Run tests (if configured)
```

## 🧪 Testing

The system has been tested with multiple entities (Robot, User) and supports:

-   ✅ CRUD operations for all entities
-   ✅ Advanced query parsing and filtering
-   ✅ Pagination and sorting
-   ✅ Field selection and projection
-   ✅ MongoDB operator support
-   ✅ Error handling and validation
-   ✅ OpenAPI spec generation

See `MULTI_ENTITY_TEST_RESULTS.md` for detailed test results.

## 🏗️ Architecture

### Functional Controllers

Controllers use functional architecture for better testability and modularity:

```typescript
// Individual exported functions instead of classes
export const getAllRobots = async (c: Context) => {
    /* ... */
};
export const getRobotById = async (c: Context) => {
    /* ... */
};
export const createRobot = async (c: Context) => {
    /* ... */
};
```

### Query Parser System

The advanced query parser (`src/utils/queryParser.ts`) provides:

-   Type-safe query parsing
-   Schema validation using Mongoose models
-   Automatic field type conversion
-   Error handling with descriptive messages
-   Performance optimization features

### Generic OpenAPI Generator

The generator (`src/scripts/generateGenericOpenAPI.ts`) automatically:

-   Discovers and processes all configured entities
-   Extracts schemas from Mongoose models
-   Generates comprehensive OpenAPI specifications
-   Supports custom validation patterns and examples

## 📚 Documentation

-   `IMPLEMENTATION_COMPLETE.md` - Complete implementation details
-   `SETUP_GUIDE_NEW_REPO.md` - New repository setup guide
-   `MULTI_ENTITY_TEST_RESULTS.md` - Multi-entity testing results

## 🔗 API Endpoints

### Robots

-   `GET /api/robots` - List robots with advanced filtering
-   `GET /api/robots/:id` - Get robot by ID
-   `POST /api/robots` - Create new robot
-   `PUT /api/robots/:id` - Update robot
-   `DELETE /api/robots/:id` - Delete robot

### Users

-   `GET /api/users` - List users with advanced filtering
-   `GET /api/users/:id` - Get user by ID
-   `POST /api/users` - Create new user
-   `PUT /api/users/:id` - Update user
-   `DELETE /api/users/:id` - Delete user

All endpoints support the advanced query features documented above.

## 🚀 Production Ready

This server includes enterprise-grade features:

-   MongoDB integration with Docker support
-   Comprehensive error handling
-   Type-safe operations throughout
-   Advanced query capabilities comparable to major APIs
-   Scalable, repository-agnostic architecture
-   Complete OpenAPI documentation generation

Perfect for rapid prototyping or production applications requiring sophisticated API functionality.
