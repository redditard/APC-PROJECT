#!/bin/bash

# Tourism Management System - Stop All Services Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGS_DIR="$PROJECT_DIR/logs"
PIDS_DIR="$PROJECT_DIR/logs/pids"

# Service names in reverse order for shutdown
SERVICES=("api-gateway" "itinerary-service" "tourism-core-service" "eureka-server")

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_banner() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              Tourism Management System Stopper               ║"
    echo "║                   Stopping All Services                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Stop a service by PID
stop_service() {
    local service_name=$1
    local pid_file="$PIDS_DIR/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            log "Stopping $service_name (PID: $pid)..."
            kill "$pid"
            
            # Wait for graceful shutdown
            local count=0
            while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                warning "Force killing $service_name..."
                kill -9 "$pid" 2>/dev/null
            fi
            
            success "$service_name stopped"
        else
            warning "$service_name PID $pid not running"
        fi
        rm -f "$pid_file"
    else
        warning "No PID file found for $service_name"
    fi
}

# Stop services by port (fallback method)
stop_by_port() {
    local ports=("8080" "8081" "8082" "8761")
    
    log "Stopping any remaining services by port..."
    
    for port in "${ports[@]}"; do
        local pid=$(lsof -ti:$port 2>/dev/null)
        if [ -n "$pid" ]; then
            log "Stopping service on port $port (PID: $pid)..."
            kill "$pid" 2>/dev/null
            sleep 1
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                kill -9 "$pid" 2>/dev/null
            fi
            success "Service on port $port stopped"
        fi
    done
}

# Stop all Maven processes (mvn spring-boot:run)
stop_maven_processes() {
    log "Stopping Maven Spring Boot processes..."
    
    # Find and kill mvn spring-boot:run processes
    local maven_pids=$(pgrep -f "mvn spring-boot:run" 2>/dev/null)
    
    if [ -n "$maven_pids" ]; then
        echo "$maven_pids" | while read -r pid; do
            if [ -n "$pid" ]; then
                log "Stopping Maven process (PID: $pid)..."
                kill "$pid" 2>/dev/null
                sleep 2
                # Force kill if still running
                if kill -0 "$pid" 2>/dev/null; then
                    kill -9 "$pid" 2>/dev/null
                fi
            fi
        done
        success "Maven processes stopped"
    else
        log "No Maven processes found"
    fi
}

# Clean up temporary files
cleanup_files() {
    log "Cleaning up temporary files..."
    
    # Remove PID files
    rm -f "$PIDS_DIR"/*.pid 2>/dev/null
    
    # Clean up any lock files
    find "$PROJECT_DIR" -name "*.lock" -type f -delete 2>/dev/null
    
    success "Cleanup completed"
}

# Main execution
main() {
    print_banner
    
    # Stop services using PID files first
    for service in "${SERVICES[@]}"; do
        stop_service "$service"
    done
    
    # Stop any remaining Maven processes
    stop_maven_processes
    
    # Fallback: stop by port
    stop_by_port
    
    # Cleanup
    cleanup_files
    
    echo ""
    log "Verifying all services are stopped..."
    
    # Check if any services are still running
    local still_running=false
    for port in 8761 8080 8081 8082; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            warning "Service still running on port $port"
            still_running=true
        fi
    done
    
    if [ "$still_running" = false ]; then
        echo ""
        echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                🛑 All Services Stopped Successfully!          ║${NC}"
        echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        success "Tourism Management System has been shut down"
    else
        echo ""
        warning "Some services may still be running. You may need to stop them manually."
        echo ""
        echo -e "${YELLOW}Manual cleanup commands:${NC}"
        echo "   Kill by port: sudo lsof -ti:8080 | xargs kill -9"
        echo "   Kill Maven:   pkill -f 'mvn spring-boot:run'"
    fi
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
