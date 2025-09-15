#!/bin/bash

# Tourism Management System - Microservices Startup Script
echo "🚀 Starting Tourism Management System Microservices..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Port $1 is already in use${NC}"
        return 1
    fi
    return 0
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}Waiting for $service_name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s $url > /dev/null 2>&1; then
            echo -e "${GREEN}$service_name is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}Attempt $attempt/$max_attempts: $service_name not ready yet...${NC}"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}$service_name failed to start within timeout period${NC}"
    return 1
}

echo "📋 Checking prerequisites..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}Java is not installed. Please install Java 17 or higher.${NC}"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Maven is not installed. Please install Maven.${NC}"
    exit 1
fi

# Check if MongoDB is running (optional)
if ! pgrep mongod > /dev/null; then
    echo -e "${YELLOW}MongoDB is not running. Starting MongoDB...${NC}"
    # You can uncomment the next line if you have MongoDB installed locally
    # mongod --dbpath ./mongodb-data --fork --logpath ./mongodb.log
    echo -e "${YELLOW}Please ensure MongoDB is running on localhost:27017${NC}"
fi

echo "🏗️ Building the project..."
mvn clean package -DskipTests -q

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix compilation errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}Build successful!${NC}"

# Step 1: Start Eureka Server
echo "🔍 Starting Eureka Server (Service Discovery)..."
check_port 8761
if [ $? -eq 0 ]; then
    cd eureka-server
    java -jar target/eureka-server-1.0.0.jar > ../logs/eureka-server.log 2>&1 &
    EUREKA_PID=$!
    echo "Eureka Server PID: $EUREKA_PID"
    cd ..
    
    # Wait for Eureka to be ready
    if ! wait_for_service "http://localhost:8761/eureka/apps" "Eureka Server"; then
        echo -e "${RED}Failed to start Eureka Server${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Skipping Eureka Server (port 8761 in use)${NC}"
fi

# Step 2: Start Core Service
echo "🏛️ Starting Tourism Core Service..."
check_port 8081
if [ $? -eq 0 ]; then
    cd tourism-core-service
    java -jar target/tourism-core-service-1.0.0.jar > ../logs/core-service.log 2>&1 &
    CORE_PID=$!
    echo "Core Service PID: $CORE_PID"
    cd ..
    
    # Wait for Core Service to be ready
    if ! wait_for_service "http://localhost:8081/actuator/health" "Tourism Core Service"; then
        echo -e "${RED}Failed to start Tourism Core Service${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Skipping Core Service (port 8081 in use)${NC}"
fi

# Step 3: Start Itinerary Service
echo "🗓️ Starting Itinerary Service..."
check_port 8082
if [ $? -eq 0 ]; then
    cd itinerary-service
    java -jar target/itinerary-service-1.0.0.jar > ../logs/itinerary-service.log 2>&1 &
    ITINERARY_PID=$!
    echo "Itinerary Service PID: $ITINERARY_PID"
    cd ..
    
    # Wait for Itinerary Service to be ready
    if ! wait_for_service "http://localhost:8082/actuator/health" "Itinerary Service"; then
        echo -e "${RED}Failed to start Itinerary Service${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Skipping Itinerary Service (port 8082 in use)${NC}"
fi

# Step 4: Start API Gateway
echo "🌉 Starting API Gateway..."
check_port 8080
if [ $? -eq 0 ]; then
    cd api-gateway
    java -jar target/api-gateway-1.0.0.jar > ../logs/api-gateway.log 2>&1 &
    GATEWAY_PID=$!
    echo "API Gateway PID: $GATEWAY_PID"
    cd ..
    
    # Wait for API Gateway to be ready
    if ! wait_for_service "http://localhost:8080/actuator/health" "API Gateway"; then
        echo -e "${RED}Failed to start API Gateway${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Skipping API Gateway (port 8080 in use)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo ""
echo "📊 Service Status:"
echo "├── Eureka Server:        http://localhost:8761"
echo "├── API Gateway:          http://localhost:8080"
echo "├── Core Service:         http://localhost:8081"
echo "└── Itinerary Service:    http://localhost:8082"
echo ""
echo "📖 Documentation:"
echo "├── Core Service API:     http://localhost:8080/core-service/swagger-ui.html"
echo "├── Itinerary Service API: http://localhost:8080/itinerary-service/swagger-ui.html"
echo "└── Gateway Routes:       http://localhost:8080/actuator/gateway/routes"
echo ""
echo "📋 Sample API Endpoints (via Gateway):"
echo "├── Register:             POST http://localhost:8080/api/auth/register"
echo "├── Login:                POST http://localhost:8080/api/auth/login"
echo "├── Tours:                GET  http://localhost:8080/api/tours"
echo "├── Packages:             GET  http://localhost:8080/api/packages"
echo "├── Bookings:             GET  http://localhost:8080/api/bookings"
echo "└── Itineraries:          GET  http://localhost:8080/api/itineraries/tour/{tourId}"
echo ""

# Save PIDs for easy cleanup
cat > service-pids.txt << EOF
EUREKA_PID=${EUREKA_PID:-"N/A"}
CORE_PID=${CORE_PID:-"N/A"}
ITINERARY_PID=${ITINERARY_PID:-"N/A"}
GATEWAY_PID=${GATEWAY_PID:-"N/A"}
EOF

echo -e "${BLUE}💡 Tips:${NC}"
echo "• View logs: tail -f logs/{service-name}.log"
echo "• Stop all services: ./stop-services.sh"
echo "• Monitor services: watch 'curl -s http://localhost:8761/eureka/apps | grep -o \"<status>[^<]*\" | head -10'"
echo ""
echo -e "${GREEN}🏁 Tourism Management System is now running!${NC}"
