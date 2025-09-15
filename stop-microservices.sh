#!/bin/bash

# Tourism Management System - Microservices Shutdown Script
echo "🛑 Stopping Tourism Management System Microservices..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to stop service by PID
stop_service() {
    local pid=$1
    local service_name=$2
    
    if [ "$pid" != "N/A" ] && [ -n "$pid" ]; then
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${YELLOW}Stopping $service_name (PID: $pid)...${NC}"
            kill $pid
            
            # Wait a few seconds for graceful shutdown
            sleep 3
            
            # If still running, force kill
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${RED}Force killing $service_name...${NC}"
                kill -9 $pid
            fi
            
            echo -e "${GREEN}$service_name stopped${NC}"
        else
            echo -e "${YELLOW}$service_name (PID: $pid) is not running${NC}"
        fi
    else
        echo -e "${YELLOW}No PID found for $service_name${NC}"
    fi
}

# Function to stop by port
stop_by_port() {
    local port=$1
    local service_name=$2
    
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}Found $service_name running on port $port (PID: $pid)${NC}"
        kill $pid
        sleep 2
        
        # Check if still running
        if lsof -ti:$port > /dev/null 2>&1; then
            echo -e "${RED}Force killing process on port $port...${NC}"
            kill -9 $(lsof -ti:$port 2>/dev/null) 2>/dev/null
        fi
        echo -e "${GREEN}$service_name on port $port stopped${NC}"
    else
        echo -e "${BLUE}No process found on port $port for $service_name${NC}"
    fi
}

# Read PIDs from file if it exists
if [ -f "service-pids.txt" ]; then
    echo "📋 Reading service PIDs from file..."
    source service-pids.txt
    
    # Stop services in reverse order
    stop_service "$GATEWAY_PID" "API Gateway"
    stop_service "$ITINERARY_PID" "Itinerary Service"
    stop_service "$CORE_PID" "Tourism Core Service"
    stop_service "$EUREKA_PID" "Eureka Server"
    
    # Clean up PID file
    rm -f service-pids.txt
    echo -e "${GREEN}Cleaned up PID file${NC}"
else
    echo "⚠️ PID file not found. Attempting to stop by port..."
    
    # Stop by port as fallback
    stop_by_port 8080 "API Gateway"
    stop_by_port 8082 "Itinerary Service"
    stop_by_port 8081 "Tourism Core Service"
    stop_by_port 8761 "Eureka Server"
fi

# Clean up any remaining Java processes with our services
echo "🧹 Cleaning up any remaining service processes..."

# Kill any remaining tourism-related Java processes
pkill -f "tourism-core-service-1.0.0.jar" 2>/dev/null && echo -e "${GREEN}Stopped remaining Core Service processes${NC}"
pkill -f "itinerary-service-1.0.0.jar" 2>/dev/null && echo -e "${GREEN}Stopped remaining Itinerary Service processes${NC}"
pkill -f "api-gateway-1.0.0.jar" 2>/dev/null && echo -e "${GREEN}Stopped remaining API Gateway processes${NC}"
pkill -f "eureka-server-1.0.0.jar" 2>/dev/null && echo -e "${GREEN}Stopped remaining Eureka Server processes${NC}"

# Clean up log files if they exist
if [ -d "logs" ]; then
    echo "📝 Log files are preserved in the logs/ directory"
    echo "   Use 'rm -rf logs/' to delete them if needed"
fi

echo ""
echo -e "${GREEN}✅ All Tourism Management System services have been stopped${NC}"
echo ""
echo "📊 Port Status Check:"
echo "├── Port 8761 (Eureka):    $(lsof -ti:8761 >/dev/null 2>&1 && echo -e "${RED}OCCUPIED${NC}" || echo -e "${GREEN}FREE${NC}")"
echo "├── Port 8080 (Gateway):   $(lsof -ti:8080 >/dev/null 2>&1 && echo -e "${RED}OCCUPIED${NC}" || echo -e "${GREEN}FREE${NC}")"
echo "├── Port 8081 (Core):      $(lsof -ti:8081 >/dev/null 2>&1 && echo -e "${RED}OCCUPIED${NC}" || echo -e "${GREEN}FREE${NC}")"
echo "└── Port 8082 (Itinerary): $(lsof -ti:8082 >/dev/null 2>&1 && echo -e "${RED}OCCUPIED${NC}" || echo -e "${GREEN}FREE${NC}")"
echo ""
echo -e "${BLUE}💡 To restart the system, run: ./start-microservices.sh${NC}"
