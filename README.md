# Demo Server Hono - Advanced Robot Management API

A modern, scalable REST API server built with Hono.js featuring advanced MongoDB-style query parsing, comprehensive data validation, and enterprise-grade features for robot management systems.

## 🚀 Features

### Advanced Query System

Our API supports MongoDB-style queries with enterprise-grade features:

-   **MongoDB operators**: `gte`, `gt`, `lte`, `lt`, `ne`, `in`, `nin`, `regex`
-   **Multiple value filtering**: OR operations with comma-separated values
-   **Advanced sorting**: Multiple fields with direction control
-   **Smart pagination**: Both `page` and `currentPage` support
-   **Field selection**: Include/exclude specific fields in responses
-   **Numeric data types**: Proper number handling for mathematical operations

### Modern Architecture

-   **Functional controllers**: Individual exported functions for better testability
-   **Type-safe operations**: Full TypeScript coverage throughout
-   **Performance monitoring**: Built-in middleware for request tracking
-   **Error handling**: Comprehensive validation and descriptive error messages
-   **Data validation**: Built-in validation utilities for data integrity

#### MongoDB Operators

**Comparison**: `gte`, `gt`, `lte`, `lt`, `ne`  
**Array**: `in`, `nin`  
**Pattern**: `regex` with `/pattern/` syntax

```bash
# Greater than or equal - works with numeric charge values (0-100)
GET /api/robots?charge[gte]=80

# Not equal to specific status
GET /api/robots?status[ne]=ERROR

# Array contains - multiple robot types
GET /api/robots?type[in]=TUGGER,FORKLIFT

# Regex pattern matching - serial numbers starting with "AR"
GET /api/robots?serialNumber[regex]=/^AR/

# Numeric comparisons for battery charge with status filtering
GET /api/robots?charge[lt]=20&status[in]=CHARGING,ERROR
```

#### Multiple Value Filtering

```bash
# OR operation with comma-separated values
GET /api/robots?status=ACTIVE,CHARGING,ERROR&type=TUGGER,FORKLIFT
```

#### Advanced Sorting

```bash
# Single field ascending
GET /api/robots?sort=serialNumber

# Single field descending
GET /api/robots?sort=-charge

# Multiple fields with mixed directions
GET /api/robots?sort=status,-charge,serialNumber
```

#### Smart Pagination

```bash
# Standard pagination
GET /api/robots?page=2&limit=10

# Alternative syntax
GET /api/robots?currentPage=2&limit=10

# Default: page=1, limit=10

# Get ALL robots without pagination (returns complete dataset)
GET /api/robots/all
```

#### Field Selection

```bash
# Select specific fields only
GET /api/robots?fields=serialNumber,charge,status

# Exclude fields (prefix with -)
GET /api/robots?fields=-createdAt,-updatedAt
```

#### Complex Query Examples

```bash
# High-charge robots (using numeric values), sorted by charge level
GET /api/robots?type=TUGGER&charge[gte]=80&sort=-charge&fields=serialNumber,charge,status

# Search robots with serial numbers starting with "AR" that are active, charging, or in error
GET /api/robots?serialNumber[regex]=/^AR/&status[in]=ACTIVE,CHARGING,ERROR&sort=serialNumber

# Paginated results with low battery robots (charge < 25%)
GET /api/robots?charge[lt]=25&page=1&limit=5&fields=serialNumber,charge,status&sort=charge

# Get complete dataset without any limitations (useful for data exports)
GET /api/robots/all
```

## 📊 Endpoint Options

### Paginated vs Unlimited Queries

The API provides two ways to retrieve robot data:

#### Paginated Endpoint: `GET /api/robots`

-   **Default behavior**: Returns 10 robots per page
-   **Query support**: Full MongoDB-style filtering, sorting, field selection
-   **Pagination**: Includes pagination metadata (totalPages, hasNext, etc.)
-   **Use case**: UI applications, browsing large datasets

**Example Response:**

```json
{
    "success": true,
    "data": [
        /* 10 robots */
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalCount": 50,
        "limit": 10,
        "hasNext": true,
        "hasPrev": false
    },
    "count": 10
}
```

#### Unlimited Endpoint: `GET /api/robots/all`

-   **Complete dataset**: Returns ALL robots without limits
-   **No pagination**: Bypasses query parser limitations
-   **Fast and simple**: Direct database query
-   **Use case**: Data exports, analytics, complete dataset access

**Example Response:**

```json
{
    "success": true,
    "data": [
        /* all 50 robots */
    ],
    "count": 50,
    "message": "All robots fetched successfully (no pagination)"
}
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

3. **Start the development server:**

```bash
bun run dev
```

4. **Seed the database (optional):**

```bash
bun run seed
```

5. **Access the API:**

-   Server: http://localhost:5005
-   Test endpoints with tools like curl, Postman, or your browser

## 📁 Project Structure

```
demo-server-hono/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── config/
│   │   └── database.ts          # MongoDB connection configuration
│   ├── controllers/             # Functional controllers
│   │   ├── RobotController.ts   # Robot CRUD operations with numeric charge support
│   │   └── UserController.ts    # User CRUD operations
│   ├── models/                  # Mongoose models with validation
│   │   ├── Robot.ts             # Robot model (charge: 0-100 numeric)
│   │   └── User.ts              # User model
│   ├── routes/                  # Route definitions
│   │   ├── index.ts             # Route aggregation
│   │   ├── robotRoutes.ts       # Robot API endpoints
│   │   └── userRoutes.ts        # User API endpoints
│   ├── middleware/              # Request middleware
│   │   ├── index.ts             # Middleware exports
│   │   └── performance.ts       # Performance monitoring
│   ├── scripts/                 # Database utilities
│   │   └── seedDatabase.ts      # Seed script with 50 sample robots
│   └── utils/                   # Utilities and helpers
│       ├── queryParser.ts       # Advanced MongoDB-style query parser
│       ├── documentation.ts     # API documentation utilities
│       └── validation.ts        # Data validation helpers
├── public/
│   └── index.html               # Static files
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── README.md                    # This documentation
├── CHARGE_FIELD_MIGRATION.md    # Charge field migration notes
└── QUERY_DOCUMENTATION.md       # Detailed query documentation
```

## 🔧 Adding New Entities

1. **Create Mongoose model** in `src/models/YourEntity.ts`
2. **Create controller** in `src/controllers/YourEntityController.ts`
3. **Create routes** in `src/routes/yourEntityRoutes.ts`
4. **Add routes** to `src/routes/index.ts`
5. **Update seed script** (optional) to include sample data

For detailed setup instructions, see the existing Robot and User implementations as templates.

## 📊 Available Scripts

```bash
bun run dev              # Start development server with hot reload
bun run start            # Start production server
bun run seed             # Seed database with 50 sample robots
```

**Key Features:**

-   Hot reload development environment with Bun
-   MongoDB Docker integration support
-   Database seeding with realistic robot data using numeric charge values (0-100)
-   Dual endpoint support: paginated (`/robots`) and unlimited (`/robots/all`) queries

## 🧪 Testing

The system has been tested with multiple entities (Robot, User) and supports:

-   ✅ CRUD operations for all entities
-   ✅ Advanced query parsing and filtering
-   ✅ Pagination and sorting
-   ✅ Field selection and projection
-   ✅ MongoDB operator support
-   ✅ Error handling and validation
-   ✅ Numeric charge field with mathematical operations

The API has been successfully tested with numeric charge filtering and all MongoDB-style query operations.

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

-   Type-safe query parsing with schema validation
-   Automatic field type conversion (strings to numbers where appropriate)
-   MongoDB-style operator support
-   Error handling with descriptive messages
-   Performance optimization features

### Documentation & Validation

The system includes comprehensive utilities:

-   **Documentation utilities** (`src/utils/documentation.ts`) for API documentation
-   **Validation helpers** (`src/utils/validation.ts`) for data integrity
-   **Performance middleware** (`src/middleware/performance.ts`) for request monitoring

## 📚 Documentation

-   `CHARGE_FIELD_MIGRATION.md` - Robot charge field migration documentation
-   `QUERY_DOCUMENTATION.md` - Advanced query system documentation
-   `README.md` - Complete API documentation and setup guide

## 🔗 API Endpoints

### Robots

-   `GET /api/robots` - List robots with advanced filtering (paginated, default limit: 10)
-   `GET /api/robots/all` - Get ALL robots without pagination or limits
-   `GET /api/robots/:id` - Get robot by ID
-   `GET /api/robots/type/:type` - Get robots by type with filtering
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
-   Scalable architecture with modular design
-   Numeric data handling for mathematical operations

Perfect for rapid prototyping or production applications requiring sophisticated API functionality.

## ✅ Project Status: COMPLETE

**Last Updated**: May 28, 2024

All core features have been successfully implemented and tested:

### ✅ Completed Tasks:

1. **Advanced Query System** - MongoDB-style operators, sorting, pagination, field selection
2. **Multi-Entity Support** - Robot and User entities with full CRUD operations
3. **Functional Architecture** - Controllers use functional exports for better testability
4. **Numeric Data Types** - Robot charge field converted from string to number (0-100)
5. **Comprehensive Documentation** - Complete API documentation and setup guides
6. **Production Setup** - Docker MongoDB integration, error handling, performance monitoring

### 🎯 Key Achievements:

-   **Enterprise-grade API**: Query capabilities comparable to major APIs
-   **Modern Codebase**: Functional controllers, TypeScript throughout, comprehensive error handling
-   **Developer Experience**: Simple setup with Docker MongoDB integration
-   **Improved Data Types**: Numeric charge field enables mathematical operations and better filtering

### 🔧 Recent Updates:

-   **Robot Schema**: `charge` field now uses `Number` type with validation (0-100)
-   **Seed Data**: 50 sample robots with realistic numeric charge values
-   **Unlimited Endpoint**: Added `/api/robots/all` for complete dataset access without pagination
-   **Query Examples**: Updated documentation with numeric charge filtering examples
-   **Type Safety**: Enhanced TypeScript interfaces for better development experience

The system is **production-ready** and can be immediately deployed or used as a template for new projects.
