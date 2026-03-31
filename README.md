# Secure Product Management System

A modern full-stack web application with JWT authentication, built with NestJS, Next.js, Prisma, and PostgreSQL.

## 🎯 Features

✅ **Authentication**
- User registration with password validation (uppercase, lowercase, number, special character)
- User login with JWT token generation
- Protected routes with JWT authentication
- Token expiration and refresh handling

✅ **Product Management (CRUD)**
- Create new products
- View all products with pagination
- Update existing products
- Delete products
- Search by name/description
- Filter by price range
- Sort by name, price, or creation date
- Dashboard with real-time statistics

✅ **Security**
- Bcrypt password hashing
- JWT-based authentication
- Role-based authorization (ADMIN/USER)
- CORS enabled
- Helmet security headers
- Request validation with class-validator

✅ **Frontend**
- Modern responsive UI with Tailwind CSS
- Dark mode theme
- Real-time product updates
- Elegant animations
- Mobile-friendly design

## 📋 Tech Stack

### Backend
- **Framework**: NestJS 10.4+
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: class-validator
- **Password Hashing**: bcrypt
- **Security**: Helmet

### Frontend
- **Framework**: Next.js 16.2+
- **UI Framework**: Tailwind CSS 4
- **Language**: TypeScript
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### Deployment
- **Frontend**: Vercel
- **Backend**: Can be deployed to any Node.js hosting (AWS, Azure, Heroku, Railway, etc.)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ & npm
- PostgreSQL 12+
- Git

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```env
   # Server
   PORT=3001
   
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/secure_product_db?schema=public"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="1h"
   ```

3. **Create PostgreSQL Database**
   ```bash
   # Using psql
   createdb secure_product_db
   ```

4. **Run Prisma migrations**
   ```bash
   npm run prisma:migrate
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```
   Backend will run on `http://localhost:3001`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment** (optional - defaults to localhost:3001)
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` if needed:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
   REACT_APP_API_URL="http://localhost:3001/api/v1"
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
Crud/
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── products/          # Products module
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   ├── products.module.ts
│   │   │   └── dto/
│   │   │       ├── create-product.dto.ts
│   │   │       ├── update-product.dto.ts
│   │   │       └── query-products.dto.ts
│   │   ├── users/             # Users module
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── common/            # Shared utilities
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── interfaces/
│   │   │   └── prisma/
│   │   ├── config/            # Configuration
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/
│   │   │   └── auth-shell.tsx
│   │   ├── dashboard/
│   │   │   └── product-list.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── modal.tsx
│   │       ├── skeleton.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   ├── auth.ts            # Auth utilities
│   │   ├── env.ts
│   │   ├── types.ts           # TypeScript types
│   │   └── theme.ts
│   └── package.json
│
├── docker-compose.yml         # PostgreSQL container setup
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login user | ❌ |

**Request Examples:**

Register:
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass123!"
}
```

Login:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2025-03-31T10:00:00Z",
    "updatedAt": "2025-03-31T10:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users/me` | Get current user profile | ✅ |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/products` | List all products | ✅ |
| GET | `/api/v1/products/summary` | Get products statistics | ✅ |
| GET | `/api/v1/products/:id` | Get product by ID | ✅ |
| POST | `/api/v1/products` | Create new product | ✅ |
| PATCH | `/api/v1/products/:id` | Update product | ✅ |
| DELETE | `/api/v1/products/:id` | Delete product | ✅ |

**Create Product:**
```json
{
  "name": "Premium Widget",
  "description": "High-quality widget for professionals",
  "price": 99.99
}
```

**Query Parameters (List Products):**
```
?page=1&limit=10&search=widget&sortBy=price&sortOrder=desc&minPrice=50&maxPrice=200
```

## 🔐 Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

Token is stored in localStorage as `spms_access_token`. The token expires after 1 hour (configurable via `JWT_EXPIRES_IN`).

## 🗄️ Database Schema

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  firstName String
  lastName  String
  role      Role      @default(USER)
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  isActive    Boolean  @default(true)
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([ownerId])
}

enum Role {
  ADMIN
  USER
}
```

## 🐳 Using Docker Compose

A PostgreSQL database can be started with Docker Compose:

```bash
docker-compose up -d
```

This will create a PostgreSQL container with:
- Database: `secure_product_db`
- Username: `postgres`
- Password: `postgres`
- Port: `5432`

To stop:
```bash
docker-compose down
```

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Select your GitHub repository
   - Deploy!

3. **Set Environment Variables**
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
   REACT_APP_API_URL=https://your-backend-url.com/api/v1
   ```

### Backend Deployment

You can deploy the backend to:
- **AWS EC2** with PM2
- **Railway.app** (recommended for free tier)
- **Render.com**
- **Fly.io**
- **Azure App Service**
- **Heroku**
- **DigitalOcean**

**Example: Railway.app**

1. Push to GitHub
2. Connect repository to Railway
3. Set environment variables
4. Deploy!

**Production Environment Variables:**
```env
PORT=3001
DATABASE_URL=postgresql://user:pass@host:port/dbname?schema=public
JWT_SECRET=use-a-strong-random-secret-key-from-env-variables
JWT_EXPIRES_IN=24h
NODE_ENV=production
```

## 📝 Environment Variables Reference

### Backend (.env)
```env
# Server
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/secure_product_db?schema=public

# JWT
JWT_SECRET=change-me-in-production-use-environment-variables
JWT_EXPIRES_IN=1h

# Node Environment
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
REACT_APP_API_URL=http://localhost:3001/api/v1
```

## 🧪 API Testing

Use Postman, Insomnia, or curl to test the API:

```bash
# Register
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "TestPass123!"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# List Products (replace TOKEN with actual token)
curl -X GET http://localhost:3001/api/v1/products \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

## 📊 Features Breakdown

### Authentication Module
- ✅ Registration with email uniqueness check
- ✅ Password validation (complexity requirements)
- ✅ Login with credentials
- ✅ JWT token generation and validation
- ✅ Token expiration handling
- ✅ Error handling and validation messages

### CRUD Module
- ✅ Create products (name, description, price)
- ✅ Read all products with pagination
- ✅ Read individual products
- ✅ Update products
- ✅ Delete products
- ✅ Search functionality
- ✅ Price filtering (min/max)
- ✅ Sorting (by name, price, date)
- ✅ Statistics/Summary API

### Frontend Features
- ✅ Responsive design
- ✅ Dark theme
- ✅ Product dashboard
- ✅ Create/Edit/Delete modals
- ✅ Search and filtering
- ✅ Pagination
- ✅ Real-time statistics
- ✅ User profile page
- ✅ Logout functionality
- ✅ Error handling
- ✅ Loading states

### Backend Features
- ✅ Modular architecture
- ✅ Validation pipes
- ✅ Guards and decorators
- ✅ Error handling middleware
- ✅ CORS enabled
- ✅ Security headers (Helmet)
- ✅ Rate limiting (ThrottlerModule)
- ✅ Database migrations

## 🐛 Troubleshooting

### Port already in use
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run start:dev
```

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify database exists: `createdb secure_product_db`
- Verify user has permissions

### JWT token issues
- Ensure JWT_SECRET is set in .env
- Check token hasn't expired
- Verify Authorization header format: `Bearer <token>`

### CORS errors
- Check backend CORS settings in `main.ts`
- Verify frontend URL is in CORS whitelist
- For production, update origin to your deployed frontend URL

## 📈 Performance Optimization

- Pagination limit: 100 items maximum
- Database indexes on `ownerId` and `email`
- JWT caching in localStorage
- Connection pooling with Prisma
- API request debouncing on frontend (320ms)

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT Introduction](https://jwt.io/introduction)

## ✨ Marking Scheme (100 Points Total)

- **Authentication (Register/Login/JWT)**: 20 points
- **CRUD API Implementation**: 15 points
- **Prisma + PostgreSQL Integration**: 15 points
- **Frontend Functionality (Next.js)**: 15 points
- **Frontend Deployment (Vercel/Netlify)**: 10 points
- **UI Design & Usability**: 10 points
- **Code Structure & Best Practices**: 10 points
- **Documentation (README, Setup)**: 5 points

---

**Created**: March 31, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (or your configured database)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the server
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3001`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Available Scripts

### Backend

```bash
npm run start:dev   # Development mode with hot reload
npm run start:prod  # Production mode
npm run build       # Build the application
npm test            # Run tests
npm run lint        # Run ESLint
```

### Frontend

```bash
npm run dev         # Development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

## API Documentation

The API follows RESTful conventions. Key endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (protected)
- `GET /api/products/:id` - Get product by ID
- `PATCH /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Users
- `GET /api/users/:id` - Get user profile (protected)

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Support

For support, please open an issue on the GitHub repository.
