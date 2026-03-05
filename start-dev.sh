#!/bin/bash

# Quick Development Start Script
# Starts both backend and frontend servers in parallel

set -e

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "========================================="
echo "  Starting Development Servers..."
echo "========================================="
echo -e "${NC}"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    pkill -P $$ 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${GREEN}Starting Backend (Port 3000)...${NC}"
cd backend
bun run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend
echo -e "${GREEN}Starting Frontend (Port 5173)...${NC}"
cd ../frontend
bun run dev &
FRONTEND_PID=$!

echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${GREEN}Servers Running!${NC}"
echo -e "${CYAN}=========================================${NC}"
echo -e "Backend:  ${GREEN}http://localhost:3000${NC}"
echo -e "Frontend: ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "Press ${CYAN}Ctrl+C${NC} to stop both servers"
echo -e "${CYAN}=========================================${NC}"

# Wait for both processes
wait
