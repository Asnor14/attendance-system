# Quick Start Guide

## 🚀 Fast Setup (Windows)

### Option 1: Using PowerShell Scripts (Recommended)

1. **Setup Backend:**
   ```powershell
   .\setup-backend.ps1
   ```

2. **Setup Frontend:**
   ```powershell
   .\setup-frontend.ps1
   ```

### Option 2: Manual Setup

1. **Backend Setup:**
   ```powershell
   cd backend
   npm install
   npm run migrate
   ```

2. **Frontend Setup:**
   ```powershell
   cd frontend
   npm install
   ```

## ▶️ Running the Application

### Terminal 1 - Backend:
```powershell
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

### Terminal 2 - Frontend:
```powershell
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

## 🔑 Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

## ✅ Verify Installation

1. Open browser: `http://localhost:3000`
2. Login with credentials above
3. You should see the Dashboard with statistics

## 📝 Next Steps

1. Add devices (Kiosk/ESP8266)
2. Create schedules
3. Add students manually or approve pending registrations
4. Configure ESP8266 to send RFID data
5. Test RFID viewer page

## 🆘 Troubleshooting

**Backend won't start:**
- Check if port 5000 is available
- Run `npm run migrate` again

**Frontend won't start:**
- Check if port 3000 is available
- Verify backend is running first

**Can't login:**
- Verify migrations ran successfully
- Check backend console for errors
- Default credentials: admin / admin123

