#!/bin/bash

echo "======================================"
echo "  Stopping PharmaCare Application"
echo "======================================"

# Kill tmux session
tmux kill-session -t pharmacare 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Application stopped successfully"
else
    echo "ℹ️  No running application found"
fi

echo ""
