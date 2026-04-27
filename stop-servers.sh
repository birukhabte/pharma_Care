#!/bin/bash

echo "🛑 Stopping PharmaCare servers..."

# Kill processes by PID if available
if [ -f ".server_pids" ]; then
    PIDS=$(cat .server_pids)
    echo "Killing PIDs: $PIDS"
    kill $PIDS 2>/dev/null || true
    rm .server_pids
fi

# Kill by port
echo "Cleaning up ports..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Kill by process name
pkill -f "npm.*dev" 2>/dev/null || true
pkill -f "next.*dev" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true

echo "✅ All servers stopped"