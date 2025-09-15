#!/bin/bash

# Tourism Management System - Microservices Testing Script
echo "🧪 Testing Tourism Management System Microservices..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URLs
GATEWAY_URL="http://localhost:8080"
EUREKA_URL="http://localhost:8761"
CORE_URL="http://localhost:8081"
ITINERARY_URL="http://localhost:8082"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local method=$2
    local description=$3
    local expected_status=$4
    local data=$5
    
    echo -e "${BLUE}Testing: $description${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$url")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    # Extract status code
    status_code=$(echo $response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS: $description (Status: $status_code)${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL: $description (Expected: $expected_status, Got: $status_code)${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
    sleep 1
}

# Function to test service health
test_health() {
    local url=$1
    local service_name=$2
    
    echo -e "${BLUE}Testing health: $service_name${NC}"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$url/actuator/health")
    status_code=$(echo $response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    body=$(echo $response | sed 's/HTTPSTATUS:[0-9]*$//')
    
    if [ "$status_code" = "200" ] && echo "$body" | grep -q '"status":"UP"'; then
        echo -e "${GREEN}✅ PASS: $service_name health check${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL: $service_name health check${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
    sleep 1
}

echo "🏥 Health Checks"
echo "================"

# Test Eureka Server
test_health "$EUREKA_URL" "Eureka Server"

# Test Core Service
test_health "$CORE_URL" "Tourism Core Service"

# Test Itinerary Service  
test_health "$ITINERARY_URL" "Itinerary Service"

# Test API Gateway
test_health "$GATEWAY_URL" "API Gateway"

echo "🌐 Gateway Routing Tests"
echo "======================="

# Test gateway routes through gateway
test_endpoint "$GATEWAY_URL/api/tours" "GET" "Tours via Gateway" "200"
test_endpoint "$GATEWAY_URL/api/packages" "GET" "Packages via Gateway" "200"

echo "🔐 Authentication Tests"
echo "======================"

# Test user registration
USER_DATA='{
    "username": "testuser_microservice",
    "password": "TestPass123!",
    "email": "testuser_ms@example.com",
    "fullName": "Test User Microservice",
    "phone": "+1234567890",
    "role": "TOURIST"
}'

test_endpoint "$GATEWAY_URL/api/auth/register" "POST" "User Registration via Gateway" "201" "$USER_DATA"

# Test user login
LOGIN_DATA='{
    "username": "testuser_microservice",
    "password": "TestPass123!"
}'

echo -e "${BLUE}Testing: User Login via Gateway${NC}"
login_response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$GATEWAY_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

login_status=$(echo $login_response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
login_body=$(echo $login_response | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$login_status" = "200" ]; then
    echo -e "${GREEN}✅ PASS: User Login via Gateway (Status: $login_status)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # Extract JWT token for authenticated requests
    JWT_TOKEN=$(echo $login_body | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$JWT_TOKEN" ]; then
        echo -e "${GREEN}📜 JWT Token extracted successfully${NC}"
    fi
else
    echo -e "${RED}❌ FAIL: User Login via Gateway (Expected: 200, Got: $login_status)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""

echo "🏛️ Core Service Tests"
echo "===================="

# Test tours endpoint directly
test_endpoint "$CORE_URL/api/tours" "GET" "Tours Direct" "200"

# Test packages endpoint directly
test_endpoint "$CORE_URL/api/packages" "GET" "Packages Direct" "200"

# Test admin endpoints (should fail without proper auth)
test_endpoint "$CORE_URL/api/admin/tours" "GET" "Admin Tours (No Auth)" "401"

echo "🗓️ Itinerary Service Tests"
echo "==========================="

# Test itinerary endpoints directly
test_endpoint "$ITINERARY_URL/api/itineraries/tour/1" "GET" "Itinerary for Tour 1 Direct" "200"

# Test itinerary stats
test_endpoint "$ITINERARY_URL/api/itineraries/tour/1/stats" "GET" "Itinerary Stats Direct" "200"

echo "🔗 Inter-Service Communication Tests"
echo "===================================="

# Test gateway routing to itinerary service
test_endpoint "$GATEWAY_URL/api/itineraries/tour/1" "GET" "Itinerary via Gateway" "200"

# Test itinerary stats via gateway
test_endpoint "$GATEWAY_URL/api/itineraries/tour/1/stats" "GET" "Itinerary Stats via Gateway" "200"

echo "📊 Service Discovery Tests"
echo "=========================="

# Test Eureka apps endpoint
test_endpoint "$EUREKA_URL/eureka/apps" "GET" "Eureka Apps Registry" "200"

# Test gateway routes endpoint
test_endpoint "$GATEWAY_URL/actuator/gateway/routes" "GET" "Gateway Routes" "200"

echo "⚙️ Actuator Endpoints Tests"
echo "==========================="

# Test various actuator endpoints
test_endpoint "$GATEWAY_URL/actuator/health" "GET" "Gateway Health" "200"
test_endpoint "$CORE_URL/actuator/health" "GET" "Core Service Health" "200"
test_endpoint "$ITINERARY_URL/actuator/health" "GET" "Itinerary Service Health" "200"

# Test metrics endpoints
test_endpoint "$GATEWAY_URL/actuator/metrics" "GET" "Gateway Metrics" "200"
test_endpoint "$CORE_URL/actuator/metrics" "GET" "Core Service Metrics" "200"

echo "🔄 Circuit Breaker Tests"
echo "======================="

# Test circuit breaker endpoints (if resilience4j actuator is enabled)
test_endpoint "$GATEWAY_URL/actuator/circuitbreakers" "GET" "Gateway Circuit Breakers" "200"

echo ""
echo "📋 Test Summary"
echo "==============="
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(echo "scale=2; $TESTS_PASSED * 100 / $TOTAL_TESTS" | bc -l 2>/dev/null || echo "0")
    echo -e "${BLUE}📊 Success Rate: ${SUCCESS_RATE}%${NC}"
fi

echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Microservices architecture is working correctly.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ Some tests failed. Please check the service logs for more details.${NC}"
    echo -e "${BLUE}💡 Logs can be found in the logs/ directory${NC}"
    exit 1
fi
