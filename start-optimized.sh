#!/bin/bash

echo "🚀 Starting PharmaCare in ultra-lightweight mode..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Port $1 is in use. Killing existing process...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Clean up ports
echo "Cleaning up ports..."
check_port 5001
check_port 5173

# Start backend with minimal resources
echo -e "${GREEN}Starting backend server (minimal resources)...${NC}"
cd server
NODE_OPTIONS="--max-old-space-size=256 --optimize-for-size" nohup npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${YELLOW}⚠️ Backend may still be starting...${NC}"
fi

# Start frontend with ultra-minimal resources
echo -e "${GREEN}Starting frontend server (ultra-minimal)...${NC}"
cd ../pharmacare
NODE_OPTIONS="--max-old-space-size=256 --optimize-for-size --gc-interval=100" nohup npm run dev:ultra > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo -e "${GREEN}✅ Servers started in ultra-lightweight mode!${NC}"
echo ""
echo "📊 Access points:"
echo "  Test Page:  http://localhost:5173/test.html"
echo "  Frontend:   http://localhost:5173"
echo "  Backend:    http://localhost:5001/api/health"
echo ""
echo "📝 Logs:"
echo "  Backend:    tail -f backend.log"
echo "  Frontend:   tail -f frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${YELLOW}💡 If browser still freezes, try:${NC}"
echo "  1. Open http://localhost:5173/test.html first"
echo "  2. Use Chrome with --disable-web-security flag"
echo "  3. Clear browser cache"

# Save PIDs for easy cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .server_pids

# Keep script running
wait