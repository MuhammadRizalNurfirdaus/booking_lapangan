#!/bin/bash

# Development Setup Script
# Booking Lapangan Futsal
# Author: Muhammad Rizal Nurfirdaus

set -e

echo "========================================="
echo "  Booking Lapangan - Development Setup"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo -e "${RED}Error: Bun is not installed${NC}"
    echo "Please install Bun first: https://bun.sh"
    echo "  curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo -e "${GREEN}✓ Bun is installed${NC}"
echo ""

# 1. Setup Backend
echo "1. Setting up Backend..."
echo "------------------------"

cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ Creating .env file...${NC}"
    cat > .env << EOF
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
PORT=3000
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ PENTING: Edit backend/.env dan isi dengan credentials yang benar!${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo "Installing backend dependencies..."
bun install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Check if database is accessible
echo "Checking database connection..."
if bun run --silent <<EOF
import sql from "./src/db.js";
try {
  await sql\`SELECT 1\`;
  console.log("OK");
  process.exit(0);
} catch (e) {
  console.error("FAILED:", e.message);
  process.exit(1);
}
EOF
then
    echo -e "${GREEN}✓ Database connection successful${NC}"
else
    echo -e "${YELLOW}⚠ Database connection failed. Please check DATABASE_URL in .env${NC}"
fi

# Run migrations
echo "Running database migrations..."
if bun run migrate; then
    echo -e "${GREEN}✓ Migrations completed${NC}"
else
    echo -e "${YELLOW}⚠ Migrations may have already been run${NC}"
fi

# Seed database
echo "Seeding database..."
if bun run seed; then
    echo -e "${GREEN}✓ Database seeded${NC}"
else
    echo -e "${YELLOW}⚠ Seeding may have already been done${NC}"
fi

# Create upload directories
echo "Creating upload directories..."
mkdir -p src/uploads/{profil,galeri,bukti_pembayaran}
echo -e "${GREEN}✓ Upload directories created${NC}"

cd ..
echo ""

# 2. Setup Frontend
echo "2. Setting up Frontend..."
echo "------------------------"

cd frontend

echo "Installing frontend dependencies..."
bun install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..
echo ""

# 3. Final Instructions
echo "========================================="
echo "          Setup Complete! "
echo "========================================="
echo ""
echo -e "${GREEN}Backend:${NC}"
echo "  cd backend && bun run dev"
echo "  → http://localhost:3000"
echo ""
echo -e "${GREEN}Frontend:${NC}"
echo "  cd frontend && bun run dev"
echo "  → http://localhost:5173"
echo ""
echo -e "${GREEN}Admin Login:${NC}"
echo "  Email: admin123@gmail.com"
echo "  Password: admin12345"
echo ""
echo -e "${GREEN}Documentation:${NC}"
echo "  • README.md - Project overview"
echo "  • API.md - API documentation"
echo "  • TESTING.md - Testing guide"
echo "  • DEPLOYMENT.md - Deployment guide"
echo ""
echo -e "${YELLOW}Quick Test:${NC}"
echo "  ./test-api.sh"
echo ""
echo "========================================="
echo "  Happy Coding! 🚀"
echo "========================================="
