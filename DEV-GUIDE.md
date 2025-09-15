# Development Guide - Tourism Management System

## 🚀 Quick Development Workflow

### Starting Development Session
```bash
# 1. Start all services
./start-all-services.sh

# 2. Verify everything is running
./check-services.sh

# 3. Open API documentation
# Core Service: http://localhost:8081/swagger-ui.html
# Itinerary Service: http://localhost:8082/swagger-ui.html
```

### During Development
```bash
# Monitor logs in real-time
tail -f logs/tourism-core-service.log

# Check service health
./check-services.sh

# Restart a specific service (if needed)
# Kill the service and restart manually:
cd tourism-core-service && mvn spring-boot:run
```

### Ending Development Session
```bash
# Stop all services cleanly
./stop-all-services.sh
```

## 🔧 Service Architecture

### Service Dependencies
```
Eureka Server (8761)
    ↓
Tourism Core Service (8081) ←→ Itinerary Service (8082)
    ↓
API Gateway (8080)
```

### Data Flow
- **Core Service**: Handles tours, packages, bookings (PostgreSQL/H2)
- **Itinerary Service**: Manages travel itineraries (MongoDB)
- **API Gateway**: Routes requests and provides load balancing
- **Eureka**: Service discovery and registration

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find what's using the port
lsof -i :8081

# Kill the process
kill -9 <PID>

# Or use the stop script
./stop-all-services.sh
```

#### Service Won't Start
```bash
# Check logs for errors
tail -n 50 logs/tourism-core-service.log

# Check if prerequisites are running
# PostgreSQL: service postgresql status
# MongoDB: pgrep mongod
```

#### Database Connection Issues
```bash
# For H2 Database (Core Service)
# Access H2 Console: http://localhost:8081/h2-console
# JDBC URL: jdbc:h2:mem:tourism_db
# User: sa, Password: (empty)

# For MongoDB (Itinerary Service)
# Check if MongoDB is running: pgrep mongod
# Start MongoDB: mongod --dbpath ./mongodb-data
```

#### Services Not Registering with Eureka
```bash
# Check Eureka is running first
curl http://localhost:8761/eureka/apps

# Check service logs for registration errors
grep -i eureka logs/*.log
```

### Quick Fixes

#### Clean Restart
```bash
./stop-all-services.sh
mvn clean compile -DskipTests
./start-all-services.sh
```

#### Reset Databases
```bash
# H2 database resets automatically on restart
# MongoDB data persists - clear if needed:
# mongo tourism_itinerary_db --eval "db.dropDatabase()"
```

#### Clear Logs
```bash
rm -f logs/*.log
rm -f logs/pids/*.pid
```

## 🧪 Testing

### API Testing Examples

#### Core Service APIs
```bash
# Health check
curl http://localhost:8081/actuator/health

# Get all tours (requires auth in production)
curl http://localhost:8081/api/tours

# Get tour packages
curl http://localhost:8081/api/packages
```

#### Itinerary Service APIs
```bash
# Health check
curl http://localhost:8082/actuator/health

# Get itinerary for tour (public endpoint)
curl http://localhost:8082/api/itineraries/tour/1
```

#### Via API Gateway
```bash
# Through gateway (when configured)
curl http://localhost:8080/api/tours
curl http://localhost:8080/api/itineraries/tour/1
```

### Load Testing
```bash
# Simple load test
for i in {1..10}; do
  curl -s http://localhost:8081/actuator/health &
done
wait
```

## 📊 Monitoring

### Service Health Dashboard
```bash
# Auto-refreshing status
./check-services.sh watch

# One-time status check
./check-services.sh status
```

### Log Monitoring
```bash
# All service logs
tail -f logs/*.log

# Specific service
tail -f logs/tourism-core-service.log

# Error filtering
grep -i error logs/*.log
```

### Resource Usage
```bash
# Memory usage of Java processes
ps aux | grep java | grep -v grep

# Port usage
netstat -tlnp | grep :80

# Disk usage
df -h .
```

## 🏗️ Development Tips

### Hot Reload
- Services use Maven Spring Boot plugin with automatic restart
- Changes to Java files trigger automatic recompilation
- No need to manually restart for code changes

### Database Schema
- H2 database schema recreates on each restart (development mode)
- Check current schema: http://localhost:8081/h2-console
- MongoDB collections are created automatically

### Security Testing
- Most endpoints require JWT authentication
- Use Swagger UI to test authenticated endpoints
- Default security is configured for development

### API Documentation
- Swagger UI automatically reflects code changes
- Add `@Operation` annotations for better documentation
- Example responses are generated from actual DTOs

## 📝 Code Patterns

### Adding New Endpoints
1. Create DTOs in `tourism-common` module
2. Add entity classes with JPA annotations
3. Create repository interface
4. Implement service class
5. Add controller with Swagger annotations
6. Update security configuration if needed

### Error Handling
- Use custom exceptions (TourNotFoundException, etc.)
- GlobalExceptionHandler provides consistent error responses
- All errors return standardized JSON format

### Service Communication
- Use OpenFeign clients for inter-service calls
- Circuit breaker patterns are configured
- Eureka service discovery handles load balancing
