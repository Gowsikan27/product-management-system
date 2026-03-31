# Backend - NestJS API

A secure and scalable REST API built with NestJS, TypeScript, and PostgreSQL for managing products with user authentication.

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database ORM
- **JWT** - JSON Web Token authentication
- **Passport.js** - Authentication middleware
- **class-validator** - DTO validation
- **Jest** - Testing framework

## Features

- ✅ User authentication with JWT
- ✅ User registration and login
- ✅ Product CRUD operations with ownership checks
- ✅ User profile management
- ✅ Role-based access control (RBAC ready)
- ✅ Input validation with DTOs
- ✅ Comprehensive error handling
- ✅ Environment configuration
- ✅ Database migrations with Prisma

## Modules

### Auth Module (`src/auth/`)
- User registration
- User login
- JWT token generation and validation
- Password hashing

### Users Module (`src/users/`)
- User profile operations
- User data retrieval

### Products Module (`src/products/`)
- Product CRUD operations
- Product ownership checks
- Product filtering and pagination

### Common Module (`src/common/`)
- JWT authentication guard
- Custom decorators
- Shared interfaces
- Prisma service

## Project Structure

```
├── src/
│   ├── auth/              # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── common/            # Shared utilities
│   │   ├── decorators/
│   │   │   └── get-user.decorator.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interfaces/
│   │   │   └── jwt-payload.interface.ts
│   │   └── prisma/
│   │       ├── prisma.service.ts
│   │       └── prisma.module.ts
│   ├── config/            # Configuration
│   │   ├── configuration.ts
│   │   └── env.validation.ts
│   ├── products/          # Products module
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.module.ts
│   │   └── dto/
│   ├── users/             # Users module
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── prisma/                # Database
│   ├── schema.prisma
│   └── migrations/
├── test/                  # E2E tests
├── jest.config.ts         # Jest configuration
└── package.json
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crud_db"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION="7d"

# Server
PORT=3000
NODE_ENV=development
```

Copy from `.env.example`:

```bash
cp .env.example .env
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### Development

```bash
# Start development server with hot reload
npm run start:dev
```

The API runs on `http://localhost:3000`

### Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## Available Scripts

```bash
npm run start:dev       # Start development server with hot reload
npm run start:prod      # Start production server
npm run build          # Build for production
npm test              # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:cov      # Run tests with coverage
npm run lint          # Run ESLint
```

## API Endpoints

### Authentication

```
POST /api/auth/register
- Body: { email, password, name }
- Response: { user: { id, email, name }, token }

POST /api/auth/login
- Body: { email, password }
- Response: { user: { id, email, name }, token }
```

### Products (Protected - requires JWT)

```
GET /api/products
- Query params: skip, take (pagination)
- Response: { data: Product[], total: number }

POST /api/products
- Body: { name, price, description }
- Response: Product

GET /api/products/:id
- Response: Product

PATCH /api/products/:id
- Body: { name?, price?, description? }
- Response: Product

DELETE /api/products/:id
- Response: { message: "Product deleted" }
```

### Users (Protected - requires JWT)

```
GET /api/users/:id
- Response: User profile data
```

## Database Schema

The Prisma schema is located at `prisma/schema.prisma` and includes:

- **User** - User accounts with email and password
- **Product** - Products with owner reference
- **Authentication** - JWT tokens and sessions (if implemented)

## Authentication Flow

1. User registers or logs in
2. Server returns JWT token
3. Client stores token in localStorage
4. Client includes token in `Authorization: Bearer <token>` header
5. Server validates token using JWT strategy
6. Request proceeds with user context

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

## Database Management

```bash
# View database
npx prisma studio

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

## Error Handling

The API uses consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation with DTOs
- ✅ CORS configuration
- ✅ Exception filters for error handling
- ✅ Environment variable validation

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Commit with clear messages
5. Submit a pull request

## License

This project is part of the main CRUD Application and is licensed under the MIT License.
