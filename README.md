# Tourism Management System

A microservices-based tourism management system built with Spring Boot, featuring tour packages, bookings, JWT authentication, and MongoDB integration.

## 🏗️ Project Structure

```
tourism-parent/
├── tourism-common/           # Shared DTOs, utilities, JWT components
├── tourism-core-service/     # Main service (tours, packages, bookings)
├── itinerary-service/        # Microservice for itinerary management
├── api-gateway/             # Gateway for routing and load balancing
└── eureka-server/           # Service discovery server
```

## 🚀 Current Development Status

### ✅ Completed (Days 1-3)
- [x] **Day 1**: Multi-module Maven project setup with all dependencies
- [x] **Day 2**: Database design and entity creation (SQL + MongoDB)
- [x] **Day 3**: Repository layer implementation with custom queries

### 🔧 Current Phase: Phase 2 - Core Business Logic (Days 4-6)

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.1.5
- **Database**: PostgreSQL + MongoDB
- **Security**: Spring Security + JWT
- **Microservices**: Spring Cloud (Eureka, Gateway, OpenFeign)
- **Build Tool**: Maven
- **Java Version**: 17

## 📋 Prerequisites

- Java 17
- Maven 3.6+
- PostgreSQL 13+
- MongoDB 4.4+

## 🗄️ Database Setup

### PostgreSQL Setup
```sql
-- Create database and user
CREATE DATABASE tourism_db;
CREATE USER tourism_user WITH PASSWORD 'tourism_pass';
GRANT ALL PRIVILEGES ON DATABASE tourism_db TO tourism_user;
```

### MongoDB Setup
```bash
# Start MongoDB service
mongod --dbpath /path/to/data

# Connect to MongoDB
mongosh
use tourism_db
```

## 🚀 Running the Application

### 🎯 Quick Start (Recommended)
Use the automated startup script to launch all services:

```bash
# Start all services in the correct order
./start-all-services.sh

# Check service status
./check-services.sh

# Stop all services
./stop-all-services.sh
```

### 📊 Service Management Scripts

- **`./start-all-services.sh`** - Starts all microservices with health checks
- **`./stop-all-services.sh`** - Gracefully stops all services
- **`./check-services.sh`** - Shows service status and health
- **`./check-services.sh watch`** - Continuously monitor services

### 🔧 Manual Service Startup

If you prefer to start services individually:

### 1. Start Eureka Server (Service Discovery)
```bash
cd eureka-server
mvn spring-boot:run
```
Access at: http://localhost:8761

### 2. Start Tourism Core Service
```bash
cd tourism-core-service
mvn spring-boot:run
```
Runs on: http://localhost:8081

### 3. Start Itinerary Service
```bash
cd itinerary-service
mvn spring-boot:run
```
Runs on: http://localhost:8082

### 4. Start API Gateway
```bash
cd api-gateway
mvn spring-boot:run
```
Gateway at: http://localhost:8080

## 📊 Database Schema

### SQL Entities (PostgreSQL)
- **Tour**: Tour information with destinations and dates
- **Package**: Tour packages with pricing and inclusions
- **User**: Tourist and admin user management
- **Booking**: Booking records with status tracking

### MongoDB Documents
- **BookingHistory**: Complete booking history with timeline tracking

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (TOURIST, ADMIN)
- Password encryption
- Token validation and refresh

## 📈 Next Steps (Following Timeline)

### Day 4: Tour & Package Services
- Implement TourService with CRUD operations
- Create PackageService with versioning support
- Add Hibernate lifecycle hooks

### Day 5: Booking Management
- Build BookingService with dual database support
- Implement BookingHistoryService for MongoDB
- Add availability checking logic

### Day 6: DTO Layer & Validation
- Create request/response DTOs
- Add Bean Validation annotations
- Configure MapStruct for entity-DTO mapping

## 🧪 Testing

```bash
# Run all tests
mvn test

# Build entire project
mvn clean install

# Skip tests during build
mvn clean install -DskipTests
```

## 📝 API Documentation

Once running, Swagger UI will be available at:
- Core Service: http://localhost:8080/swagger-ui.html
- Itinerary Service: http://localhost:8082/swagger-ui.html

## 🔧 Development Commands

### 🏗️ Build & Test
```bash
# Build all modules
mvn clean install -DskipTests

# Run tests
mvn test

# Build specific service
cd [service-name] && mvn clean package
```

### 🚀 Service Management
```bash
# Start all services
./start-all-services.sh

# Check service health
./check-services.sh

# Monitor services continuously  
./check-services.sh watch

# Stop all services
./stop-all-services.sh

# View specific service logs
tail -f logs/tourism-core-service.log
```

### 🔍 Debugging & Monitoring
```bash
# Check what's running on service ports
lsof -i :8080,8081,8082,8761

# Monitor Eureka registrations
watch 'curl -s http://localhost:8761/eureka/apps'

# View all logs
tail -f logs/*.log

# Test API endpoints
curl http://localhost:8081/actuator/health
curl http://localhost:8081/api/tours
```

## 📞 Support

This project follows the detailed timeline in `tourism_timeline_no_docker.md`. Each phase builds upon the previous one, ensuring a complete microservices tourism management system.

---

**Current Status**: Phase 1 Complete ✅ | Phase 2 In Progress 🔄
