#!/bin/bash

# Tourism Management System - Complete Startup Script
# This script starts all microservices in the correct order with proper health checks

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGS_DIR="$PROJECT_DIR/logs"
PIDS_DIR="$PROJECT_DIR/logs/pids"

# Service configuration (name:port:directory:health_endpoint:startup_time)
declare -A SERVICES=(
    ["eureka-server"]="8761:eureka-server:/eureka/apps:30"
    ["tourism-core-service"]="8081:tourism-core-service:/actuator/health:75"
    ["itinerary-service"]="8082:itinerary-service:/actuator/health:45"
    ["api-gateway"]="8080:api-gateway:/actuator/health:30"
)

# Service startup order
SERVICE_ORDER=("eureka-server" "tourism-core-service" "itinerary-service" "api-gateway")

# Functions
print_banner() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              Tourism Management System Launcher              ║"
    echo "║                    Microservices Startup                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    fi
    return 0  # Port is free
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Java
    if ! command -v java &> /dev/null; then
        error "Java not found. Please install Java 17 or higher."
    fi
    
    # Check Java version
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | awk -F'.' '{print $1}')
    if [ "$JAVA_VERSION" -lt 17 ]; then
        error "Java 17 or higher required. Current version: $JAVA_VERSION"
    fi
    
    # Check Maven
    if ! command -v mvn &> /dev/null; then
        error "Maven not found. Please install Maven."
    fi
    
    # Check MongoDB
    if ! pgrep mongod >/dev/null; then
        warning "MongoDB is not running. Itinerary service may fail to start."
        echo "   To start MongoDB: mongod --dbpath ./mongodb-data"
    fi
    
    success "Prerequisites check passed"
}

# Setup directories
setup_directories() {
    log "Setting up directories..."
    mkdir -p "$LOGS_DIR" "$PIDS_DIR"
    success "Directories created"
}

# Build the project
build_project() {
    log "Building the project (this may take a few minutes)..."
    cd "$PROJECT_DIR"
    
    if mvn clean package -DskipTests -q; then
        success "Project built successfully"
    else
        error "Build failed. Please check for compilation errors."
    fi
}

# Wait for service to be healthy
wait_for_service() {
    local service_name=$1
    local port=$2
    local health_endpoint=$3
    local max_wait=$4
    
    local url="http://localhost:$port$health_endpoint"
    local attempt=1
    local wait_interval=3
    local max_attempts=$((max_wait / wait_interval))
    
    log "Waiting for $service_name to be ready (max ${max_wait}s)..."
    
    while [ $attempt -le $max_attempts ]; do
        # Check if port is responding by trying to connect
        if timeout 5 bash -c "</dev/tcp/localhost/$port" 2>/dev/null; then
            # Try health endpoint with proper status check
            local http_status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
            
            # Accept 200 (healthy), 401/403 (secured but responding), or any response indicating service is up
            if [[ "$http_status" =~ ^(200|401|403|404)$ ]]; then
                success "$service_name is ready! (HTTP $http_status)"
                return 0
            fi
        fi
        
        printf "${YELLOW}⏳ Attempt $attempt/$max_attempts: Waiting for $service_name...${NC}\r"
        sleep $wait_interval
        attempt=$((attempt + 1))
    done
    
    echo ""
    error "$service_name failed to start within ${max_wait} seconds"
}

# Start a single service
start_service() {
    local service_name=$1
    local config=${SERVICES[$service_name]}
    IFS=':' read -r port directory health_endpoint startup_time <<< "$config"
    
    log "Starting $service_name..."
    
    # Check if port is available
    if ! check_port "$port"; then
        warning "$service_name port $port is already in use, skipping..."
        return 0
    fi
    
    # Change to service directory
    cd "$PROJECT_DIR/$directory"
    
    # Prefer running the built jar to avoid slow/fragile mvn spring-boot:run
    log "Launching $service_name on port $port..."
    JAR=$(ls target/*.jar 2>/dev/null | head -n1)
    if [ -f "$JAR" ]; then
        nohup java -jar "$JAR" > "$LOGS_DIR/${service_name}.log" 2>&1 &
    else
        # Fallback for services not built as jar yet
        mvn spring-boot:run > "$LOGS_DIR/${service_name}.log" 2>&1 &
    fi
    local pid=$!
    
    # Save PID
    echo $pid > "$PIDS_DIR/${service_name}.pid"
    
    # Wait for service to be ready
    wait_for_service "$service_name" "$port" "$health_endpoint" "$startup_time"
    
    success "$service_name started successfully (PID: $pid)"
    cd "$PROJECT_DIR"
}

# Check service status
check_service_status() {
    log "Checking service status..."
    
    for service_name in "${SERVICE_ORDER[@]}"; do
        local config=${SERVICES[$service_name]}
        IFS=':' read -r port directory health_endpoint startup_time <<< "$config"
        
        if check_port "$port"; then
            echo -e "   ${RED}○${NC} $service_name (port $port) - Not running"
        else
            echo -e "   ${GREEN}●${NC} $service_name (port $port) - Running"
        fi
    done
}

# Show service URLs and information
show_service_info() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                     🎉 Startup Complete!                     ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}📊 Service Dashboard:${NC}"
    echo "   🔍 Eureka Server:         http://localhost:8761"
    echo "   🌐 API Gateway:           http://localhost:8080"
    echo "   🏨 Core Service:          http://localhost:8081"
    echo "   📋 Itinerary Service:     http://localhost:8082"
    echo ""
    echo -e "${YELLOW}📖 API Documentation:${NC}"
    echo "   📚 Core Service Swagger:  http://localhost:8081/swagger-ui.html"
    echo "   📚 Itinerary Swagger:     http://localhost:8082/swagger-ui.html"
    echo ""
    echo -e "${YELLOW}🛡️ Sample API Calls:${NC}"
    echo "   Health Check: curl http://localhost:8081/actuator/health"
    echo "   Tours List:   curl http://localhost:8081/api/v1/tours"
    echo "   Packages:     curl http://localhost:8081/api/v1/packages"
    echo ""
    echo -e "${YELLOW}🔧 Management:${NC}"
    echo "   📋 View Logs:     tail -f logs/{service-name}.log"
    echo "   ⏹️  Stop Services: ./stop-all-services.sh"
    echo "   📊 Monitor:       watch 'curl -s http://localhost:8761/eureka/apps'"
    echo ""
    echo -e "${GREEN}🚀 Tourism Management System is ready!${NC}"
}

# Cleanup function
cleanup() {
    if [ -f "$PIDS_DIR/eureka-server.pid" ] || [ -f "$PIDS_DIR/tourism-core-service.pid" ] || 
       [ -f "$PIDS_DIR/itinerary-service.pid" ] || [ -f "$PIDS_DIR/api-gateway.pid" ]; then
        echo ""
        warning "Startup interrupted. Cleaning up..."
        ./stop-all-services.sh 2>/dev/null || true
    fi
    exit 1
}

# Main execution
main() {
    # Set up signal handling
    trap cleanup SIGINT SIGTERM
    
    print_banner
    check_prerequisites
    setup_directories
    build_project
    
    echo ""
    log "Starting microservices in sequence..."
    
    # Start services in order
    for service_name in "${SERVICE_ORDER[@]}"; do
        start_service "$service_name"
        # Small delay between services
        sleep 2
    done
    
    show_service_info
    
    # Keep script running
    echo ""
    log "All services are running. Press Ctrl+C to stop all services."
    
    # Create a simple status monitor
    while true; do
        sleep 30
        if ! check_port 8761 && ! check_port 8081; then
            # Core services are running, just wait
            continue
        else
            warning "Some services may have stopped. Check logs for details."
            break
        fi
    done
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
