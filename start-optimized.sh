#!/bin/bash

echo "Starting PharmaCare with optimized settings..."

# Kill any existing node processes
pkill -f "next dev" 2>/dev/null
pkill -f "node src/server.js" 2>/dev/null

# Wait a moment
sleep 2

# Start backend with limited memory
echo "Starting backend..."
cd server
NODE_OPTIONS="--max-old-space-size=512" npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend with limited memory and without Turbopack
echo "Starting frontend..."
cd ../pharmacare
NODE_OPTIONS="--max-old-space-size=1024" npm run dev &
FRONTEND_PID=$!

echo ""
echo "✓ Backend started (PID: $BACKEND_PID) - http://localhost:5001"
echo "✓ Frontend started (PID: $FRONTEND_PID) - http://localhost:5173"
echo ""
echo "To stop both servers, run: kill $BACKEND_PID $FRONTEND_PID"
echo "Or press Ctrl+C and run: pkill -f 'next dev' && pkill -f 'node src/server.js'"
