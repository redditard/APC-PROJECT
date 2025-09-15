#!/bin/bash

# Quick restart script for tourism-core-service
echo "🔄 Restarting tourism-core-service to apply Eureka configuration changes..."

# Kill existing process
if [ -f "logs/pids/tourism-core-service.pid" ]; then
    PID=$(cat logs/pids/tourism-core-service.pid)
    if kill -0 "$PID" 2>/dev/null; then
        echo "Stopping existing tourism-core-service (PID: $PID)..."
        kill "$PID"
        sleep 5
        # Force kill if still running
        if kill -0 "$PID" 2>/dev/null; then
            kill -9 "$PID" 2>/dev/null
        fi
    fi
    rm -f logs/pids/tourism-core-service.pid
fi

# Start the service
echo "Starting tourism-core-service..."
cd tourism-core-service
nohup java -jar target/tourism-core-service-1.0.0.jar > ../logs/tourism-core-service.log 2>&1 &
NEW_PID=$!
echo $NEW_PID > ../logs/pids/tourism-core-service.pid
cd ..

echo "✅ tourism-core-service restarted with PID: $NEW_PID"
echo "⏳ Waiting for service to register with Eureka..."
sleep 10
echo "🎉 Service should now be available. Try booking again!"
