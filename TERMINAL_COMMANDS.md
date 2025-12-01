# Terminal Commands Reference

## 📦 Installation Commands

### Backend Installation
```powershell
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Run database migrations (creates tables and default admin)
npm run migrate

# Start backend server
npm start

# Start backend with auto-reload (development)
npm run dev
```

### Frontend Installation
```powershell
# Navigate to frontend directory
cd frontend

# Install all dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗄️ Database Commands

### Run Migrations
```powershell
cd backend
npm run migrate
```

### Reset Database (Delete and Recreate)
```powershell
cd backend
# Delete the database file
Remove-Item attendance.db -ErrorAction SilentlyContinue
# Run migrations again
npm run migrate
```

## 🚀 Running Commands

### Start Both Servers (Two Terminals)

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Check Server Status

**Backend Health Check:**
```powershell
# Using PowerShell
Invoke-WebRequest -Uri http://localhost:5000/health

# Using curl (if installed)
curl http://localhost:5000/health
```

## 🔧 Development Commands

### Backend Development
```powershell
cd backend
# Watch mode with auto-reload
npm run dev

# Check Node.js version
node --version

# Check npm version
npm --version
```

### Frontend Development
```powershell
cd frontend
# Development server with hot reload
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

## 🧪 Testing Commands

### Test Backend API (using PowerShell)

**Login Test:**
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -Body $body -ContentType "application/json"
```

**Get Students (requires token):**
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri http://localhost:5000/api/students -Method Get -Headers $headers
```

**Get Dashboard Stats:**
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri http://localhost:5000/api/dashboard/stats -Method Get -Headers $headers
```

## 🐛 Debugging Commands

### Check Port Usage (Windows)
```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process on port 5000 (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### View Backend Logs
```powershell
# Backend logs appear in the terminal where npm start is running
cd backend
npm start
# Logs will show: Server running, database connections, API requests, errors
```

### View Frontend Logs
```powershell
# Frontend logs appear in browser console (F12)
# Also check terminal where npm run dev is running
cd frontend
npm run dev
```

## 📁 File Management Commands

### List Files
```powershell
# List all files in current directory
Get-ChildItem

# List files recursively
Get-ChildItem -Recurse

# List only directories
Get-ChildItem -Directory
```

### Create Directories
```powershell
# Create directory
New-Item -ItemType Directory -Name "new-folder"

# Create nested directories
New-Item -ItemType Directory -Path "folder1\folder2" -Force
```

## 🔄 Git Commands (Optional)

### Initialize Git Repository
```powershell
git init
git add .
git commit -m "Initial commit: Attendance Admin System"
```

### Create .gitignore
```powershell
# Already created in backend/.gitignore and frontend/.gitignore
# Includes: node_modules, .env, *.db files
```

## 🌐 Network Commands

### Find Your IP Address (for ESP8266/Raspberry Pi)
```powershell
# Get local IP address
ipconfig | findstr IPv4

# Or more detailed
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}
```

### Test API Endpoint
```powershell
# Test backend endpoint
Invoke-WebRequest -Uri http://localhost:5000/health

# Test with specific method
Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -Body '{"username":"admin","password":"admin123"}' -ContentType "application/json"
```

## 📊 Database Inspection (SQLite)

### Using SQLite Command Line
```powershell
# Install SQLite (if not installed)
# Download from: https://www.sqlite.org/download.html

# Open database
sqlite3 backend/attendance.db

# List tables
.tables

# View admins table
SELECT * FROM admins;

# View students table
SELECT * FROM students;

# View schedules table
SELECT * FROM schedules;

# View devices table
SELECT * FROM devices;

# View pending_registrations table
SELECT * FROM pending_registrations;

# Exit SQLite
.quit
```

## 🧹 Cleanup Commands

### Remove node_modules (Fresh Install)
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Clear npm cache
```powershell
npm cache clean --force
```

## 📝 Environment Variables

### View .env file
```powershell
# Backend
Get-Content backend\.env

# Edit .env file (using notepad)
notepad backend\.env
```

### Set Environment Variable (Temporary)
```powershell
# PowerShell
$env:PORT = "5000"
$env:JWT_SECRET = "your_secret"

# Verify
echo $env:PORT
```

## 🎯 Common Workflows

### Complete Fresh Setup
```powershell
# 1. Setup Backend
cd backend
npm install
npm run migrate

# 2. Setup Frontend
cd ..\frontend
npm install

# 3. Start Backend (Terminal 1)
cd ..\backend
npm start

# 4. Start Frontend (Terminal 2)
cd ..\frontend
npm run dev
```

### Reset Everything
```powershell
# Delete database
Remove-Item backend\attendance.db -ErrorAction SilentlyContinue

# Remove node_modules
Remove-Item -Recurse -Force backend\node_modules
Remove-Item -Recurse -Force frontend\node_modules

# Reinstall
cd backend
npm install
npm run migrate

cd ..\frontend
npm install
```

---

**Note:** All commands are for Windows PowerShell. For Command Prompt (cmd), some syntax may differ.

