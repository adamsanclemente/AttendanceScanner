#!/bin/bash

# Pull the latest changes from the repository
cd /home/attendance/Public/AttendanceScanner
git pull

# Wait 2 seconds
sleep 2

# Navigate to backend
cd /home/attendance/Public/AttendanceScanner/backend

# Begin the tmux session
tmux new-session -d -s attendance

# Run Python Script in the tmux session
tmux send-keys -t attendance "python3 main.py" C-m

# Attach to the tmux session
tmux attach -t attendance
