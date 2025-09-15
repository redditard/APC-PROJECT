# 🔐 Tourism Management System - Sign-In Troubleshooting Guide

## 🚨 **ISSUE: Unable to Sign In**

### **Quick Fix Options:**

---

## ⚡ **OPTION 1: Use Mock Authentication (Immediate)**

The frontend has built-in mock authentication that works without backend services.

### **Available Mock Accounts:**
```
👑 Admin Account:
   Username: admin
   Password: admin123
   Role: ADMIN

🧳 Tourist Account:
   Username: tourist
   Password: password
   Role: TOURIST

🎯 Tour Operator Account:
   Username: operator
   Password: operator123
   Role: TOUR_OPERATOR
```

### **How to Login:**
1. Go to: http://localhost:3000/login
2. Enter any of the credentials above
3. Use **any password** (mock service accepts any password)
4. Click "Sign In"

---

## 🔧 **OPTION 2: Start Backend Services (Recommended)**

### **Quick Start:**
```bash
# Navigate to project directory
cd "/home/mayank/Documents/APC PROJECT V2 OPUS"

# Start all services automatically
./start-all-services.sh

# Check if services are running
./check-services.sh

# Access the application
# Frontend: http://localhost:3000
# Admin Panel: http://localhost:3000/admin (after admin login)
```

### **Manual Service Start:**
```bash
# Terminal 1: Start Eureka Server
cd eureka-server
mvn spring-boot:run

# Terminal 2: Start Core Service (wait for Eureka to start)
cd tourism-core-service  
mvn spring-boot:run

# Terminal 3: Start Itinerary Service
cd itinerary-service
mvn spring-boot:run

# Terminal 4: Start API Gateway
cd api-gateway
mvn spring-boot:run

# Terminal 5: Start Frontend
cd tourism-frontend
npm run dev
```

### **Default Backend Accounts:**
When backend starts, these accounts are automatically created:
```
👑 Admin: admin/admin123
🧳 Tourist: tourist/password  
🎯 Operator: operator/operator123
```

---

## 🔍 **DIAGNOSIS: What's Happening**

### **Current State:**
- ✅ Frontend is running (http://localhost:3000)
- ❌ Backend services are not running
- 🔄 Login falls back to mock authentication
- 📝 Mock service now has default users available

### **Services Status:**
```bash
# Check what's running on required ports:
lsof -i :8761  # Eureka Server
lsof -i :8080  # API Gateway  
lsof -i :8081  # Core Service
lsof -i :8082  # Itinerary Service
lsof -i :3000  # Frontend
```

---

## 📋 **Testing Authentication**

### **Test Mock Login:**
1. Open browser: http://localhost:3000/login
2. Try: `admin` / `admin123`
3. Should redirect to dashboard with admin features

### **Test Backend Login (if services running):**
```bash
# Test admin login via API
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Should return JWT token and user info
```

---

## 🛠️ **Troubleshooting Steps**

### **1. Check Frontend Status:**
```bash
cd tourism-frontend
npm run dev
# Should show: Local: http://localhost:3000
```

### **2. Check Backend Status:**
```bash
# Quick health check
curl -f http://localhost:8080/actuator/health 2>/dev/null && echo "✅ Backend UP" || echo "❌ Backend DOWN"

# Detailed service check
./check-services.sh
```

### **3. View Logs:**
```bash
# Backend logs
tail -f logs/tourism-core-service.log

# Frontend logs (check browser console)
# Press F12 → Console tab
```

### **4. Reset Mock Data:**
1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Clear localStorage for http://localhost:3000
4. Refresh page - default users will be recreated

---

## 🎯 **Recommended Solution**

### **For Development:**
1. **Start with Mock Authentication** (immediate access)
   - Use `admin`/`admin123` for admin features
   - No backend setup required

2. **Then Start Backend Services** (full functionality)
   - Run `./start-all-services.sh`
   - All features become available
   - Real database persistence

### **For Production:**
- Always use backend services
- Configure proper database
- Set up environment variables
- Use real authentication

---

## 🔐 **Security Notes**

- **Mock passwords are for development only**
- **Default backend passwords should be changed in production**
- **JWT tokens expire after 24 hours**
- **H2 database is in-memory (data resets on restart)**

---

## 📞 **Need Help?**

1. **Check service status:** `./check-services.sh`
2. **View logs:** `tail -f logs/*.log`
3. **Restart services:** `./stop-all-services.sh && ./start-all-services.sh`
4. **Reset everything:** Clear browser data + restart services

---

## ✅ **Success Indicators**

### **Mock Authentication Working:**
- Login with admin/admin123 succeeds
- Redirects to dashboard
- Shows "Welcome back!" message

### **Backend Authentication Working:**
- All services show UP in service status
- API calls return real data
- Database persistence works
- JWT tokens are issued

---

**🎉 You should now be able to sign in successfully!**
