# Attendance Monitoring System - Admin Website

Complete admin website for managing an attendance monitoring system with React + Vite frontend and Node.js + Express + SQLite backend.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Testing Checklist](#testing-checklist)
- [ESP8266 Integration](#esp8266-integration)
- [Raspberry Pi Integration](#raspberry-pi-integration)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Backend
- ✅ JWT Authentication with bcrypt password hashing
- ✅ SQLite database with migrations
- ✅ RESTful API endpoints
- ✅ Auto-creation of default admin user
- ✅ Google Sheets API integration (optional)
- ✅ ESP8266 RFID endpoint
- ✅ Error handling middleware
- ✅ CORS enabled

### Frontend
- ✅ Modern React + Vite setup
- ✅ TailwindCSS with purple/violet theme
- ✅ Poppins font family
- ✅ Responsive design
- ✅ React Router navigation
- ✅ Protected routes with JWT
- ✅ Dashboard with analytics
- ✅ Device management (Kiosk & ESP8266)
- ✅ Schedule management
- ✅ Student management
- ✅ Pending registrations approval
- ✅ Live RFID viewer
- ✅ Settings page

## 🛠 Technology Stack

### Backend
- Node.js
- Express.js
- SQLite3
- JWT (jsonwebtoken)
- bcrypt
- googleapis (for Google Sheets)
- dotenv
- CORS

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- TailwindCSS
- React Icons
- Poppins Font

## 📁 Project Structure

```
admin-sys/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── devicesController.js
│   │   ├── pendingController.js
│   │   ├── rfidController.js
│   │   ├── schedulesController.js
│   │   └── studentsController.js
│   ├── database/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── migrations/
│   │   ├── 001_create_admins.js
│   │   ├── 002_create_students.js
│   │   ├── 003_create_schedules.js
│   │   ├── 004_create_devices.js
│   │   ├── 005_create_pending_registrations.js
│   │   └── runMigrations.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── devicesRoutes.js
│   │   ├── pendingRoutes.js
│   │   ├── rfidRoutes.js
│   │   ├── schedulesRoutes.js
│   │   └── studentsRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── devices.js
│   │   │   ├── pending.js
│   │   │   ├── rfid.js
│   │   │   ├── schedules.js
│   │   │   └── students.js
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Devices.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Pending.jsx
│   │   │   ├── RFIDViewer.jsx
│   │   │   ├── Schedules.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Students.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Windows OS (tested on Windows 10/11)

### Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

### Step 2: Configure Backend Environment

Copy `.env.example` to `.env` (already created) and update if needed:

```env
PORT=5000
JWT_SECRET=attendance_system_secret_key_2024_change_in_production
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
```

### Step 3: Run Database Migrations

```powershell
cd backend
npm run migrate
```

This will:
- Create all database tables
- Create default admin user (username: `admin`, password: `admin123`)

### Step 4: Install Frontend Dependencies

```powershell
cd frontend
npm install
```

### Step 5: Start Backend Server

```powershell
cd backend
npm start
```

Or for development with auto-reload:

```powershell
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 6: Start Frontend Development Server

Open a new terminal:

```powershell
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎯 Running the Application

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Login**: Use credentials `admin` / `admin123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token (protected)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

### Students
- `GET /api/students` - Get all students (protected)
- `GET /api/students/:id` - Get student by ID (protected)
- `POST /api/students` - Create student (protected)
- `PUT /api/students/:id` - Update student (protected)
- `DELETE /api/students/:id` - Delete student (protected)

### Schedules
- `GET /api/schedules` - Get all schedules (protected)
- `GET /api/schedules/:id` - Get schedule by ID (protected)
- `POST /api/schedules` - Create schedule (protected)
- `PUT /api/schedules/:id` - Update schedule (protected)
- `DELETE /api/schedules/:id` - Delete schedule (protected)

### Devices
- `GET /api/devices` - Get all devices (protected)
- `GET /api/devices/:id` - Get device by ID (protected)
- `POST /api/devices` - Create device (protected)
- `PUT /api/devices/:id` - Update device (protected)
- `DELETE /api/devices/:id` - Delete device (protected)

### Pending Registrations
- `GET /api/pending` - Get all pending registrations (protected)
- `GET /api/pending/:id` - Get pending by ID (protected)
- `POST /api/pending` - Create pending registration (protected)
- `POST /api/pending/:id/approve` - Approve registration (protected)
- `POST /api/pending/:id/reject` - Reject registration (protected)
- `GET /api/pending/fetch/google-sheets` - Fetch from Google Sheets (protected)

### RFID
- `POST /api/rfid/update` - Update RFID UID (public - for ESP8266)
- `GET /api/rfid/live` - Get live RFID UID (protected)
- `POST /api/rfid/clear` - Clear RFID UID (protected)

## 🗄️ Database Schema

### admins
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `password_hash` (TEXT)
- `role` (TEXT DEFAULT 'admin')
- `created_at` (DATETIME)

### students
- `id` (INTEGER PRIMARY KEY)
- `full_name` (TEXT)
- `student_id` (TEXT UNIQUE)
- `course` (TEXT)
- `rfid_uid` (TEXT UNIQUE)
- `face_image_url` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### schedules
- `id` (INTEGER PRIMARY KEY)
- `subject_code` (TEXT)
- `subject_name` (TEXT)
- `time_start` (TEXT)
- `time_end` (TEXT)
- `grace_period` (INTEGER DEFAULT 0)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### devices
- `id` (INTEGER PRIMARY KEY)
- `device_name` (TEXT)
- `device_type` (TEXT: 'kiosk' or 'esp')
- `status` (TEXT: 'online', 'offline', 'maintenance')
- `last_sync` (DATETIME)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### pending_registrations
- `id` (INTEGER PRIMARY KEY)
- `given_name` (TEXT)
- `middle_name` (TEXT)
- `surname` (TEXT)
- `student_id` (TEXT)
- `course` (TEXT)
- `date_enrolled` (TEXT)
- `cor_url` (TEXT)
- `rfid_uid` (TEXT)
- `status` (TEXT: 'pending', 'approved', 'rejected')
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## ✅ Testing Checklist

### Backend Testing

- [ ] **Database Migration**
  - [ ] Run `npm run migrate` successfully
  - [ ] Verify `attendance.db` file created
  - [ ] Verify default admin user created

- [ ] **Server Startup**
  - [ ] Server starts without errors
  - [ ] Health check endpoint works: `GET http://localhost:5000/health`

- [ ] **Authentication**
  - [ ] Login with `admin` / `admin123` returns token
  - [ ] Invalid credentials return 401
  - [ ] Protected routes require valid token
  - [ ] Token verification works

- [ ] **API Endpoints**
  - [ ] Create, read, update, delete students
  - [ ] Create, read, update, delete schedules
  - [ ] Create, read, update, delete devices
  - [ ] Get pending registrations
  - [ ] Approve pending registration (requires RFID UID)
  - [ ] Reject pending registration
  - [ ] Get dashboard stats
  - [ ] Update RFID UID (public endpoint)
  - [ ] Get live RFID UID

### Frontend Testing

- [ ] **Login Page**
  - [ ] Login form displays correctly
  - [ ] Login with valid credentials redirects to dashboard
  - [ ] Invalid credentials show error message
  - [ ] Poppins font loads correctly
  - [ ] Purple theme applied

- [ ] **Dashboard**
  - [ ] Statistics cards display correctly
  - [ ] Icons render properly
  - [ ] Data updates when backend changes

- [ ] **Devices Page**
  - [ ] List all devices
  - [ ] Add new device (kiosk/esp)
  - [ ] Edit existing device
  - [ ] Delete device
  - [ ] Device icons display correctly

- [ ] **Schedules Page**
  - [ ] List all schedules
  - [ ] Add new schedule with time pickers
  - [ ] Edit schedule
  - [ ] Delete schedule
  - [ ] Grace period field works

- [ ] **Students Page**
  - [ ] List all students
  - [ ] Add new student
  - [ ] Edit student
  - [ ] Delete student
  - [ ] RFID UID field accepts input

- [ ] **Pending Registrations Page**
  - [ ] List pending registrations
  - [ ] RFID UID input field works
  - [ ] Approve button requires RFID UID
  - [ ] Reject button works
  - [ ] Copy RFID UID button works

- [ ] **RFID Viewer Page**
  - [ ] Displays "No RFID detected" initially
  - [ ] Updates when ESP8266 sends data
  - [ ] Copy UID button works
  - [ ] Clear button works
  - [ ] Refresh button works

- [ ] **Settings Page**
  - [ ] Test Raspberry Pi connection button works
  - [ ] Auto-sync toggle works
  - [ ] System information displays

- [ ] **Navigation**
  - [ ] Sidebar navigation works
  - [ ] Active route highlighted
  - [ ] Logout button works
  - [ ] Topbar displays username

- [ ] **Responsive Design**
  - [ ] Works on desktop (1920x1080)
  - [ ] Works on tablet (768x1024)
  - [ ] Works on mobile (375x667)

## 🔌 ESP8266 Integration

### ESP8266 Endpoint

Your ESP8266 device should POST RFID UID to:

```
POST http://your-server-ip:5000/api/rfid/update
Content-Type: application/json

{
  "uid": "RFID_UID_HERE"
}
```

### Example ESP8266 Code (Arduino)

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <MFRC522.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_SERVER_IP:5000/api/rfid/update";

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  SPI.begin();
  mfrc522.PCD_Init();
}

void loop() {
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
      uid += String(mfrc522.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();
    
    sendRfidToServer(uid);
    delay(1000);
  }
}

void sendRfidToServer(String uid) {
  WiFiClient client;
  HTTPClient http;
  
  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  String json = "{\"uid\":\"" + uid + "\"}";
  int httpResponseCode = http.POST(json);
  
  if (httpResponseCode > 0) {
    Serial.println("RFID sent successfully");
  } else {
    Serial.println("Error sending RFID");
  }
  
  http.end();
}
```

## 🍓 Raspberry Pi Integration

### Syncing Data to Raspberry Pi

The Raspberry Pi kiosk should periodically fetch data from the admin API:

1. **Fetch Students**: `GET /api/students` (requires authentication)
2. **Fetch Schedules**: `GET /api/schedules` (requires authentication)
3. **Update Device Status**: `PUT /api/devices/:id` (requires authentication)

### Example Python Script for Raspberry Pi

```python
import requests
import json

API_BASE = "http://YOUR_SERVER_IP:5000/api"
TOKEN = "YOUR_JWT_TOKEN"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Fetch students
response = requests.get(f"{API_BASE}/students", headers=headers)
students = response.json()

# Fetch schedules
response = requests.get(f"{API_BASE}/schedules", headers=headers)
schedules = response.json()

# Update device status
device_id = 1
data = {
    "device_name": "Raspberry Pi Kiosk 1",
    "device_type": "kiosk",
    "status": "online",
    "last_sync": "2024-01-01T12:00:00Z"
}
response = requests.put(f"{API_BASE}/devices/{device_id}", headers=headers, json=data)
```

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Database not found
- **Solution**: Run `npm run migrate` to create database and tables

**Problem**: Port 5000 already in use
- **Solution**: Change `PORT` in `.env` file or kill process using port 5000

**Problem**: Migration fails
- **Solution**: Delete `attendance.db` and run migrations again

**Problem**: JWT token invalid
- **Solution**: Check `JWT_SECRET` in `.env` matches between restarts

### Frontend Issues

**Problem**: Cannot connect to backend
- **Solution**: Ensure backend is running on port 5000 and check `vite.config.js` proxy settings

**Problem**: TailwindCSS not working
- **Solution**: Run `npm install` in frontend folder and restart dev server

**Problem**: Icons not displaying
- **Solution**: Ensure `react-icons` is installed: `npm install react-icons`

**Problem**: Font not loading
- **Solution**: Check internet connection (Poppins loads from Google Fonts)

### ESP8266 Issues

**Problem**: RFID UID not appearing in viewer
- **Solution**: 
  1. Check ESP8266 WiFi connection
  2. Verify server IP address in ESP8266 code
  3. Check backend logs for incoming requests
  4. Ensure ESP8266 is POSTing to `/api/rfid/update`

**Problem**: CORS errors
- **Solution**: Backend already has CORS enabled, but verify ESP8266 is sending proper headers

## 📝 Notes

- Default admin credentials: `admin` / `admin123` (change in production!)
- Database file: `backend/attendance.db` (SQLite)
- JWT tokens expire after 24 hours
- RFID UID expires after 30 seconds of inactivity
- All protected routes require valid JWT token in Authorization header

## 🔒 Security Recommendations

1. **Change default admin password** in production
2. **Use strong JWT_SECRET** in production
3. **Enable HTTPS** for production deployment
4. **Restrict CORS** to specific origins in production
5. **Add rate limiting** for API endpoints
6. **Validate and sanitize** all user inputs
7. **Use environment variables** for sensitive data
8. **Regular database backups**

## 📄 License

This project is provided as-is for educational and development purposes.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs
3. Check browser console for frontend errors
4. Verify database integrity

---

**Built with ❤️ for Attendance Monitoring System**

