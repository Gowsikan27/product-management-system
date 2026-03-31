# Frontend - Next.js Application

A modern, responsive web application built with Next.js, React, and TypeScript for managing products and user authentication.

## Tech Stack

- **Next.js** - React framework with SSR/SSG capabilities
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **ESLint** - Code quality tool

## Features

- 🔐 User Authentication (Login/Register)
- 📊 Dashboard with product overview
- 🛍️ Product listing and management
- 👤 User profile management
- 🎨 Dark mode support
- 📱 Fully responsive design
- ♿ Accessible components

## Project Structure

```
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   ├── globals.css   # Global styles
│   ├── dashboard/    # Dashboard page
│   ├── login/        # Login page
│   ├── profile/      # Profile page
│   └── register/     # Register page
├── components/       # React components
│   ├── auth/         # Authentication components
│   ├── dashboard/    # Dashboard components
│   └── ui/           # Reusable UI components
├── lib/              # Utilities and helpers
│   ├── api.ts        # API client
│   ├── auth.ts       # Auth utilities
│   ├── env.ts        # Environment variables
│   ├── theme.ts      # Theme utilities
│   └── types.ts      # TypeScript types
└── public/           # Static assets
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3001` to see the application.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

For Vercel production deployments, set the same variable in the Vercel dashboard.

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## API Integration

The frontend communicates with the backend API via the API client in `lib/api.ts`.

### Key Endpoints:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /products` - Get all products
- `POST /products` - Create product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## Authentication

- Uses JWT tokens stored in localStorage
- Protected routes require valid authentication
- Automatic token attachment to API calls

## Styling

The project uses TailwindCSS for styling with:
- Dark mode support
- Responsive breakpoints
- Custom theme configuration

## Testing

```bash
npm test
```

## Performance

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Server-side rendering for better SEO
- Standalone build output optimized for Vercel deployment

## Error Handling

- Runtime page crashes handled by `app/error.tsx` with user-friendly fallback
- API errors return safe generic messages for server errors in production

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the main CRUD Application and is licensed under the MIT License.
