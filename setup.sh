#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Secure Product Management System Setup${NC}\n"

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}\n"

# Backend setup
echo -e "${YELLOW}📦 Setting up Backend...${NC}"
cd backend || exit

if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
else
  echo "Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
  echo -e "${YELLOW}⚠️  Please update backend/.env with your database URL and JWT_SECRET${NC}"
fi

echo -e "${GREEN}✓ Backend setup complete${NC}\n"
cd ..

# Frontend setup
echo -e "${YELLOW}📦 Setting up Frontend...${NC}"
cd frontend || exit

if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
else
  echo "Frontend dependencies already installed"
fi

if [ ! -f ".env.local" ]; then
  echo "Creating .env.local file from .env.example..."
  cp .env.example .env.local
  echo -e "${YELLOW}⚠️  Frontend configuration already set for localhost${NC}"
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}\n"
cd ..

# Final instructions
echo -e "${GREEN}=${NC}${GREEN}═════════════════════════════════════════${NC}${GREEN}=${NC}"
echo -e "${GREEN}✓ Setup complete!${NC}\n"

echo -e "${YELLOW}🔧 Next steps:${NC}"
echo ""
echo "1. Start PostgreSQL:"
echo -e "   ${GREEN}docker-compose up -d${NC}"
echo ""
echo "2. Run database migrations:"
echo -e "   ${GREEN}cd backend && npm run prisma:migrate${NC}"
echo ""
echo "3. Start the backend (in new terminal):"
echo -e "   ${GREEN}cd backend && npm run start:dev${NC}"
echo ""
echo "4. Start the frontend (in new terminal):"
echo -e "   ${GREEN}cd frontend && npm run dev${NC}"
echo ""
echo "5. Open in browser:"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "- Backend API docs: See backend/README.md"
echo "- Full setup guide: See README.md"
echo "- Deployment guide: See DEPLOYMENT.md"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
