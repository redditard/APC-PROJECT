#!/bin/bash

# Tourism Management System - Status Checker Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Service configuration
declare -A SERVICES=(
    ["Eureka Server"]="8761:/eureka/apps"
    ["Core Service"]="8081:/actuator/health"
    ["Itinerary Service"]="8082:/actuator/health"
    ["API Gateway"]="8080:/actuator/health"
)

print_banner() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              Tourism Management System Status                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_service_status() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    local url="http://localhost:$port$endpoint"
    
    # Check if port is listening
    if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "   ${RED}●${NC} $service_name (port $port) - ${RED}Not Running${NC}"
        return 1
    fi
    
    # Check if service responds to health check
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$http_status" = "200" ]; then
        echo -e "   ${GREEN}●${NC} $service_name (port $port) - ${GREEN}Healthy${NC}"
        return 0
    elif [[ "$http_status" =~ ^(401|403)$ ]]; then
        echo -e "   ${GREEN}●${NC} $service_name (port $port) - ${GREEN}Running (Secured)${NC}"
        return 0
    elif [ "$http_status" != "000" ]; then
        echo -e "   ${YELLOW}●${NC} $service_name (port $port) - ${YELLOW}Starting (HTTP $http_status)${NC}"
        return 1
    else
        echo -e "   ${YELLOW}●${NC} $service_name (port $port) - ${YELLOW}Starting/Unhealthy${NC}"
        return 1
    fi
}

get_service_info() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    
    if [ "$service_name" = "Eureka Server" ]; then
        local registered_services=$(curl -s "http://localhost:$port/eureka/apps" 2>/dev/null | grep -o '<name>[^<]*' | sed 's/<name>//' | wc -l)
        echo "     └─ Registered services: $registered_services"
    elif [ "$endpoint" = "/actuator/health" ]; then
        local health_status=$(curl -s "http://localhost:$port/actuator/health" 2>/dev/null | grep -o '"status":"[^"]*' | sed 's/"status":"//')
        if [ -n "$health_status" ]; then
            echo "     └─ Health status: $health_status"
        fi
    fi
}

show_detailed_status() {
    echo -e "${CYAN}📊 Detailed Service Status:${NC}"
    
    local all_healthy=true
    
    for service_info in "Eureka Server:8761:/eureka/apps" "Core Service:8081:/actuator/health" "Itinerary Service:8082:/actuator/health" "API Gateway:8080:/actuator/health"; do
        IFS=':' read -r service_name port endpoint <<< "$service_info"
        
        if ! check_service_status "$service_name" "$port" "$endpoint"; then
            all_healthy=false
        else
            get_service_info "$service_name" "$port" "$endpoint"
        fi
    done
    
    echo ""
    
    if [ "$all_healthy" = true ]; then
        echo -e "${GREEN}✅ All services are healthy!${NC}"
    elsea
        echo -e "${YELLOW}⚠️  Some services are not running or unhealthy${NC}"
    fi
}

show_quick_links() {
    echo ""
    echo -e "${CYAN}🔗 Quick Access Links:${NC}"
    echo "   🔍 Eureka Dashboard:      http://localhost:8761"
    echo "   🌐 API Gateway:           http://localhost:8080"
    echo "   📚 Core API Docs:         http://localhost:8081/swagger-ui.html"
    echo "   📚 Itinerary API Docs:    http://localhost:8082/swagger-ui.html"
    echo ""
    echo -e "${CYAN}🧪 Test Commands:${NC}"
    echo "   Health Check: curl http://localhost:8081/actuator/health"
    echo "   List Tours:   curl http://localhost:8081/api/tours"
    echo "   Gateway Info: curl http://localhost:8080/actuator/info"
}

show_system_resources() {
    echo ""
    echo -e "${CYAN}💻 System Resources:${NC}"
    
    # Memory usage of Java processes
    local java_memory=$(ps aux | grep java | grep -v grep | awk '{sum += $6} END {print sum/1024}' 2>/dev/null)
    if [ -n "$java_memory" ] && [ "$java_memory" != "0" ]; then
        echo "   📊 Java Memory Usage: ${java_memory} MB"
    fi
    
    # Check disk space
    local disk_usage=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
    echo "   💾 Disk Usage: ${disk_usage}%"
    
    # Active connections
    local connections=$(netstat -an 2>/dev/null | grep -E ':(8080|8081|8082|8761)' | grep LISTEN | wc -l)
    echo "   🔌 Active Service Ports: $connections/4"
}

watch_services() {
    echo -e "${BLUE}👀 Watching services (Press Ctrl+C to stop)...${NC}"
    echo ""
    
    while true; do
        clear
        print_banner
        show_detailed_status
        show_system_resources
        echo ""
        echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] Auto-refreshing every 5 seconds...${NC}"
        sleep 5
    done
}

# Main execution
case "${1:-status}" in
    "status"|"")
        print_banner
        show_detailed_status
        show_quick_links
        ;;
    "watch")
        watch_services
        ;;
    "links")
        show_quick_links
        ;;
    "resources")
        show_system_resources
        ;;
    *)
        echo "Usage: $0 [status|watch|links|resources]"
        echo ""
        echo "  status     - Show current service status (default)"
        echo "  watch      - Continuously monitor services"
        echo "  links      - Show quick access links"
        echo "  resources  - Show system resource usage"
        ;;
esac
