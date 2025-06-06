# Demo Server Hono - Advanced Robot Management API

A modern, scalable REST API server built with Hono.js featuring advanced MongoDB-style query parsing, comprehensive data validation, and enterprise-grade features for robot management systems.

## 🚀 Features

### 🔐 Authentication & ## 📊 Available Scripts

```bash
# Development and Runtime
bun run dev              # Start development server with hot reload and Socket.IO
bun run start            # Start production server

# Database Operations
bun run seed             # Seed database with 50 sample robots
bun run seed:users       # Seed database with sample users (admin, operator, etc.)
bun run seed:all         # Seed both robots and users

# Authentication Migration
bun run migrate:auth     # Migrate from JWT to better-auth system
bun run inspect:auth     # Inspect authentication data and sessions
```

**Key Features:**

- Hot reload development environment with Bun and Socket.IO integration
- MongoDB Docker integration support
- Database seeding with realistic robot data using numeric charge values (0-100)
- User seeding with role-based access control
- Authentication system migration utilities
- Dual endpoint support: paginated (`/robots`) and unlimited (`/robots/all`) queries
- Real-time Socket.IO broadcasting on `/socket/v1`(Better-Auth)

Modern session-based authentication system with enterprise security:

- **Session-based authentication**: Secure cookie-based sessions (no JWT tokens)
- **Email/password registration & login**: Built-in user management
- **Role-based access control**: `admin`, `operator`, `user`, `viewer` roles
- **Protected routes**: Middleware for authentication requirements
- **Session management**: Automatic session validation and renewal
- **MongoDB integration**: Sessions stored in database for production
- **Security features**: CSRF protection, secure cookies, session rotation

### 🔌 Real-time Socket.IO Integration

Live data streaming with WebSocket support:

- **Real-time robot updates**: Automatic broadcasting every 2 seconds
- **Custom Socket.IO path**: Available at `/socket/v1`
- **CORS configured**: Multi-origin frontend support
- **Event-driven**: `get:all:robots` event with complete robot data
- **Connection management**: Client connect/disconnect logging
- **Error handling**: Robust error handling for real-time operations

### 📊 Advanced Query System

Our API supports MongoDB-style queries with enterprise-grade features:

- **MongoDB operators**: `gte`, `gt`, `lte`, `lt`, `ne`, `in`, `nin`, `regex`
- **Multiple value filtering**: OR operations with comma-separated values
- **Advanced sorting**: Multiple fields with direction control
- **Smart pagination**: Both `page` and `currentPage` support
- **Field selection**: Include/exclude specific fields in responses
- **Numeric data types**: Proper number handling for mathematical operations

### Modern Architecture

- **Functional controllers**: Individual exported functions for better testability
- **Type-safe operations**: Full TypeScript coverage throughout
- **Performance monitoring**: Built-in middleware for request tracking
- **Error handling**: Comprehensive validation and descriptive error messages
- **Data validation**: Built-in validation utilities for data integrity

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

- **Default behavior**: Returns 10 robots per page
- **Query support**: Full MongoDB-style filtering, sorting, field selection
- **Pagination**: Includes pagination metadata (totalPages, hasNext, etc.)
- **Use case**: UI applications, browsing large datasets

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

- **Complete dataset**: Returns ALL robots without limits
- **No pagination**: Bypasses query parser limitations
- **Fast and simple**: Direct database query
- **Use case**: Data exports, analytics, complete dataset access

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

- Node.js 18+ or Bun
- Docker (for MongoDB)
- Git

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

- Server: <http://localhost:5005>
- Test endpoints with tools like curl, Postman, or your browser

## 📁 Project Structure

```
demo-server-hono/
├── src/
│   ├── index.ts                 # Application entry point with Socket.IO integration
│   ├── config/
│   │   └── database.ts          # MongoDB connection configuration
│   ├── constants/
│   │   └── config.ts            # Application constants and configuration
│   ├── controllers/             # Functional controllers
│   │   ├── RobotController.ts   # Robot CRUD operations with numeric charge support
│   │   └── UserController.ts    # User CRUD operations
│   ├── lib/
│   │   └── auth.ts              # Better-auth configuration and setup
│   ├── middleware/              # Request middleware
│   │   ├── auth.ts              # Authentication and authorization middleware
│   │   ├── index.ts             # Middleware exports
│   │   └── performance.ts       # Performance monitoring
│   ├── models/                  # Mongoose models with validation
│   │   ├── auth-user.ts         # Better-auth user model integration
│   │   ├── Robot.ts             # Robot model (charge: 0-100 numeric)
│   │   └── User.ts              # User model with role-based access
│   ├── routes/                  # Route definitions
│   │   ├── authRoutes.ts        # Authentication endpoints (signup/login/logout)
│   │   ├── index.ts             # Route aggregation
│   │   ├── robotRoutes.ts       # Robot API endpoints
│   │   └── userRoutes.ts        # User API endpoints
│   ├── scripts/                 # Database utilities and migration scripts
│   │   ├── inspectAuthData.ts   # Auth data inspection utility
│   │   ├── migrateToBetterAuth.ts # Migration script to better-auth
│   │   ├── seedDatabase.ts      # Seed script with 50 sample robots
│   │   └── seedUsers.ts         # User seeding with different roles
│   ├── socket/                  # Socket.IO real-time functionality
│   │   └── index.ts             # Socket.IO server configuration and events
│   └── utils/                   # Utilities and helpers
│       ├── customSchemas.ts     # Custom Zod validation schemas
│       ├── documentation.ts     # API documentation utilities
│       ├── generateJWTtoken.ts  # Legacy JWT utilities (for migration)
│       ├── queryParser.ts       # Advanced MongoDB-style query parser
│       └── validation.ts        # Data validation helpers
├── public/
│   └── index.html               # Socket.IO test interface and API documentation
├── BETTER_AUTH_DOCUMENTATION.md # Complete better-auth implementation guide
├── QUERY_DOCUMENTATION.md       # Detailed query system documentation
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This comprehensive documentation
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

- Hot reload development environment with Bun
- MongoDB Docker integration support
- Database seeding with realistic robot data using numeric charge values (0-100)
- Dual endpoint support: paginated (`/robots`) and unlimited (`/robots/all`) queries

## 🧪 Testing

The system has been tested with multiple entities (Robot, User) and supports:

- ✅ CRUD operations for all entities
- ✅ Advanced query parsing and filtering
- ✅ Pagination and sorting
- ✅ Field selection and projection
- ✅ MongoDB operator support
- ✅ Error handling and validation
- ✅ Numeric charge field with mathematical operations

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

- Type-safe query parsing with schema validation
- Automatic field type conversion (strings to numbers where appropriate)
- MongoDB-style operator support
- Error handling with descriptive messages
- Performance optimization features

### Documentation & Validation

The system includes comprehensive utilities:

- **Documentation utilities** (`src/utils/documentation.ts`) for API documentation
- **Validation helpers** (`src/utils/validation.ts`) for data integrity
- **Performance middleware** (`src/middleware/performance.ts`) for request monitoring

## 📚 Documentation

- `CHARGE_FIELD_MIGRATION.md` - Robot charge field migration documentation
- `QUERY_DOCUMENTATION.md` - Advanced query system documentation
- `README.md` - Complete API documentation and setup guide

## 🔗 API Endpoints

### 🔐 Authentication Endpoints

- `POST /api/auth/signup` - User registration with role assignment
- `POST /api/auth/signin` - User login with session creation
- `POST /api/auth/signout` - Logout and session cleanup
- `GET /api/auth/session` - Get current session information
- `POST /api/auth/forget-password` - Password reset functionality
- `GET /api/auth/me` - Get current user profile (protected)

### 🤖 Robot Management Endpoints

- `GET /api/robots` - List robots with advanced filtering (paginated, default limit: 10)
- `GET /api/robots/all` - Get ALL robots without pagination or limits
- `GET /api/robots/:id` - Get robot by ID
- `GET /api/robots/type/:type` - Get robots by type with filtering
- `POST /api/robots` - Create new robot (requires authentication)
- `PUT /api/robots/:id` - Update robot (requires authentication)
- `DELETE /api/robots/:id` - Delete robot (requires admin role)

### 👥 User Management Endpoints

- `GET /api/users` - List users with advanced filtering (admin only)
- `GET /api/users/:id` - Get user by ID (admin or self)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin or self)
- `DELETE /api/users/:id` - Delete user (admin only)

### 🔌 Real-time WebSocket Endpoints

- **Socket.IO Connection**: `ws://localhost:5005/socket/v1`
- **Event**: `get:all:robots` - Broadcasts all robot data every 2 seconds
- **Client Connection**: Supports multiple clients with CORS configuration

All REST endpoints support the advanced query features documented above.

## 🚀 Production Ready

This server includes enterprise-grade features:

- MongoDB integration with Docker support
- Comprehensive error handling
- Type-safe operations throughout
- Advanced query capabilities comparable to major APIs
- Scalable architecture with modular design
- Numeric data handling for mathematical operations

Perfect for rapid prototyping or production applications requiring sophisticated API functionality.

## ✅ Project Status: COMPLETE & ENHANCED

**Last Updated**: June 6, 2025

All core features have been successfully implemented and tested, with major enhancements:

### ✅ Completed Features

1. **Advanced Query System** - MongoDB-style operators, sorting, pagination, field selection
2. **Multi-Entity Support** - Robot and User entities with full CRUD operations
3. **Functional Architecture** - Controllers use functional exports for better testability
4. **Numeric Data Types** - Robot charge field converted from string to number (0-100)
5. **Session-Based Authentication** - Better-auth integration with role-based access control
6. **Real-time Socket.IO** - Live robot data broadcasting every 2 seconds
7. **Comprehensive Documentation** - Complete API documentation and setup guides
8. **Production Setup** - Docker MongoDB integration, error handling, performance monitoring

### 🎯 Key Achievements

- **Enterprise-grade API**: Query capabilities comparable to major APIs
- **Modern Authentication**: Session-based auth with role management (admin, operator, user, viewer)
- **Real-time Data**: Socket.IO integration for live robot monitoring
- **Security Features**: CSRF protection, secure sessions, authentication middleware
- **Developer Experience**: Simple setup with Docker MongoDB integration and comprehensive tooling
- **Production Ready**: Complete with migration scripts, seeding utilities, and monitoring

### 🔧 Latest Enhancements

- **Better-Auth Integration**: Migrated from JWT to session-based authentication
- **Socket.IO Real-time**: Added live robot data broadcasting at `/socket/v1`
- **Role-Based Access**: Admin, operator, user, and viewer roles with proper permissions
- **Migration Tools**: Scripts for auth migration and data inspection
- **Enhanced Security**: Session management, CORS configuration, protected routes
- **Comprehensive Seeding**: Separate scripts for robots and users with realistic data

### 📚 Complete Documentation

- `BETTER_AUTH_DOCUMENTATION.md` - Complete better-auth implementation guide
- `QUERY_DOCUMENTATION.md` - Advanced query system documentation
- `README.md` - This comprehensive API documentation and setup guide

The system is **production-ready** with enterprise features and can be immediately deployed or used as a template for sophisticated applications requiring real-time data, authentication, and advanced querying capabilities.
