#!/bin/bash

# Tourism Management System - Startup Script
echo "🚀 Starting Tourism Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to start a service in background
start_service() {
    local service_name=$1
    local port=$2
    local directory=$3
    
    echo -e "${BLUE}Starting $service_name on port $port...${NC}"
    cd "$directory"
    mvn spring-boot:run > "../logs/${service_name}.log" 2>&1 &
    local pid=$!
    echo "$pid" > "../logs/${service_name}.pid"
    echo -e "${GREEN}✅ $service_name started (PID: $pid)${NC}"
    cd ..
}

# Create logs directory
mkdir -p logs

echo -e "${YELLOW}📋 Please ensure the following are running:${NC}"
echo "   - PostgreSQL (localhost:5432)"
echo "   - MongoDB (localhost:27017)"
echo ""

# Build the project first
echo -e "${BLUE}🔨 Building project...${NC}"
mvn clean compile -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please check for errors.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Start services in order
echo -e "${YELLOW}🎯 Starting services...${NC}"

# 1. Eureka Server (Service Discovery)
start_service "eureka-server" "8761" "eureka-server"
sleep 10

# 2. Tourism Core Service
start_service "tourism-core-service" "8080" "tourism-core-service"
sleep 5

# 3. Itinerary Service
start_service "itinerary-service" "8082" "itinerary-service"
sleep 5

# 4. API Gateway
start_service "api-gateway" "8080" "api-gateway"

echo ""
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo ""
echo -e "${YELLOW}📊 Service URLs:${NC}"
echo "   🔍 Eureka Dashboard: http://localhost:8761"
echo "   🌐 API Gateway: http://localhost:8080"
echo "   🏨 Core Service: http://localhost:8080"
echo "   📋 Itinerary Service: http://localhost:8082"
echo ""
echo -e "${YELLOW}📝 Logs are available in the logs/ directory${NC}"
echo ""
echo -e "${BLUE}To stop all services, run: ./stop-services.sh${NC}"
