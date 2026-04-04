#!/bin/bash

# PharmaCare Deployment Script
# This script helps deploy the application to a production server

set -e

echo "🚀 PharmaCare Deployment Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}❌ Please do not run as root${NC}"
   exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ first"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command_exists pm2; then
    echo -e "${YELLOW}⚠️  PM2 is not installed. Installing...${NC}"
    sudo npm install -g pm2
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Ask for deployment type
echo "Select deployment type:"
echo "1) Fresh deployment (first time)"
echo "2) Update deployment (pull latest changes)"
read -p "Enter choice [1-2]: " deploy_type

if [ "$deploy_type" = "1" ]; then
    echo ""
    echo "🔧 Setting up fresh deployment..."
    
    # Backend setup
    echo ""
    echo "📦 Setting up backend..."
    cd server
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo -e "${YELLOW}⚠️  Please edit server/.env with your configuration${NC}"
            read -p "Press enter when ready to continue..."
        else
            echo -e "${RED}❌ .env.example not found${NC}"
            exit 1
        fi
    fi
    
    echo "Installing backend dependencies..."
    npm install --production
    
    echo "Running database migration..."
    npm run migrate
    
    cd ..
    
    # Frontend setup
    echo ""
    echo "🎨 Setting up frontend..."
    cd pharmacare
    
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}⚠️  .env.local file not found${NC}"
        echo "Please create pharmacare/.env.local with:"
        echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api"
        read -p "Press enter when ready to continue..."
    fi
    
    echo "Installing frontend dependencies..."
    npm install
    
    echo "Building frontend..."
    npm run build
    
    cd ..
    
    # Start with PM2
    echo ""
    echo "🚀 Starting applications with PM2..."
    
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
        pm2 save
    else
        echo -e "${YELLOW}⚠️  ecosystem.config.js not found. Starting manually...${NC}"
        cd server && pm2 start src/server.js --name pharmacare-backend
        cd ../pharmacare && pm2 start npm --name pharmacare-frontend -- start
        cd ..
        pm2 save
    fi
    
    echo ""
    echo -e "${GREEN}✅ Fresh deployment completed!${NC}"
    
elif [ "$deploy_type" = "2" ]; then
    echo ""
    echo "🔄 Updating deployment..."
    
    # Pull latest changes
    echo "Pulling latest changes from git..."
    git pull
    
    # Update backend
    echo ""
    echo "📦 Updating backend..."
    cd server
    npm install --production
    cd ..
    
    # Update frontend
    echo ""
    echo "🎨 Updating frontend..."
    cd pharmacare
    npm install
    npm run build
    cd ..
    
    # Restart applications
    echo ""
    echo "🔄 Restarting applications..."
    pm2 restart all
    
    echo ""
    echo -e "${GREEN}✅ Update deployment completed!${NC}"
else
    echo -e "${RED}❌ Invalid choice${NC}"
    exit 1
fi

# Show status
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
echo "📝 Useful commands:"
echo "  pm2 logs              - View all logs"
echo "  pm2 monit             - Monitor applications"
echo "  pm2 restart all       - Restart all applications"
echo "  pm2 stop all          - Stop all applications"
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
