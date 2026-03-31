# CRUD Application

A full-stack web application built with NestJS (backend) and Next.js (frontend), featuring user authentication, product management, and a modern UI.

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - ORM for database management
- **JWT** - JSON Web Token authentication
- **Jest** - Testing framework

### Frontend
- **Next.js** - React framework with SSR/SSG
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **TailwindCSS** - Utility-first CSS framework

## Project Structure

```
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── common/   # Shared utilities, guards, decorators
│   │   ├── config/   # Configuration management
│   │   ├── products/ # Products module
│   │   ├── users/    # Users module
│   │   └── main.ts   # Entry point
│   └── prisma/       # Database schema and migrations
├── frontend/         # Next.js web application
│   ├── app/          # App directory with routes
│   ├── components/   # React components
│   ├── lib/          # Utilities and API client
│   └── public/       # Static assets
└── README.md         # Project documentation
```

## Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Product Management (CRUD operations)
- ✅ User Profiles
- ✅ Dashboard
- ✅ Responsive UI
- ✅ Type-Safe API Communication

## Getting Started

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
