#!/bin/bash

# PharmaCare - Run Both Backend and Frontend

echo "======================================"
echo "  PharmaCare - Starting Application"
echo "======================================"
echo ""

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "❌ tmux is not installed. Installing..."
    sudo apt-get update && sudo apt-get install -y tmux
fi

# Kill existing tmux session if it exists
tmux kill-session -t pharmacare 2>/dev/null

# Create new tmux session
echo "✅ Creating tmux session..."
tmux new-session -d -s pharmacare

# Split window horizontally
tmux split-window -h -t pharmacare

# Run backend in left pane
echo "✅ Starting backend (left pane)..."
tmux send-keys -t pharmacare:0.0 'cd ~/pharma_care/server && echo "🚀 Starting Backend..." && npm run dev' C-m

# Run frontend in right pane
echo "✅ Starting frontend (right pane)..."
tmux send-keys -t pharmacare:0.1 'cd ~/pharma_care/pharmacare && echo "🚀 Starting Frontend..." && npm run dev' C-m

echo ""
echo "======================================"
echo "  ✅ Application Started!"
echo "======================================"
echo ""
echo "📍 Backend:  http://localhost:5000"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "To view the terminals:"
echo "  tmux attach -t pharmacare"
echo ""
echo "To detach from tmux:"
echo "  Press: Ctrl+B then D"
echo ""
echo "To stop the application:"
echo "  ./stop-app.sh"
echo ""
echo "To switch between panes in tmux:"
echo "  Press: Ctrl+B then Arrow Keys"
echo ""

# Attach to the session
sleep 2
tmux attach -t pharmacare
