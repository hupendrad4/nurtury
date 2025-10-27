#!/bin/bash

# QuoriumAgro - Quick Start Script
# This script sets up and runs the application locally

set -e

echo "🌱 QuoriumAgro - Quick Start"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo "Install it with: npm install -g pnpm"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
pnpm install

echo ""
echo -e "${BLUE}Step 2: Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Starting Docker services...${NC}"
docker-compose up -d

echo ""
echo -e "${BLUE}Step 4: Waiting for services to be ready...${NC}"
sleep 10

echo ""
echo -e "${BLUE}Step 5: Running database migrations...${NC}"
cd apps/api && pnpm prisma generate && pnpm prisma migrate dev --name init && cd ../..

echo ""
echo -e "${BLUE}Step 6: Seeding database...${NC}"
cd apps/api && pnpm prisma db seed && cd ../..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "=============================="
echo -e "${GREEN}🎉 QuoriumAgro is ready!${NC}"
echo "=============================="
echo ""
echo "Starting development servers..."
echo ""
echo "Access points:"
echo -e "  ${BLUE}API:${NC}      http://localhost:3001"
echo -e "  ${BLUE}API Docs:${NC} http://localhost:3001/docs"
echo -e "  ${BLUE}Web:${NC}      http://localhost:3000"
echo -e "  ${BLUE}Mobile:${NC}   Scan QR code with Expo Go"
echo ""
echo "Test credentials:"
echo -e "  ${YELLOW}Admin:${NC}    admin@quoriumagro.com / Admin123!"
echo -e "  ${YELLOW}Customer:${NC} customer@example.com / Customer123!"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start development servers
pnpm dev
