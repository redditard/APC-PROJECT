#!/bin/bash

# Tourism Management System - Stop Script
echo "🛑 Stopping Tourism Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to stop a service
stop_service() {
    local service_name=$1
    local pid_file="logs/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}Stopping $service_name (PID: $pid)...${NC}"
            kill "$pid"
            rm "$pid_file"
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${RED}❌ $service_name (PID: $pid) not running${NC}"
            rm "$pid_file"
        fi
    else
        echo -e "${YELLOW}⚠️  No PID file found for $service_name${NC}"
    fi
}

# Stop services
stop_service "api-gateway"
stop_service "itinerary-service"
stop_service "tourism-core-service"
stop_service "eureka-server"

echo ""
echo -e "${GREEN}🎉 All services stopped!${NC}"

# Clean up any remaining Java processes for this project
echo -e "${YELLOW}🧹 Cleaning up any remaining processes...${NC}"
pkill -f "tourism.*spring-boot:run" 2>/dev/null || true

echo -e "${GREEN}✅ Cleanup complete!${NC}"
