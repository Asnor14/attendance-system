# Windows PowerShell script to setup backend
Write-Host "Setting up Attendance Admin Backend..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "Node.js version: $(node --version)" -ForegroundColor Green

# Navigate to backend directory
Set-Location backend

# Install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
npm run migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to run migrations" -ForegroundColor Red
    exit 1
}

Write-Host "Backend setup completed successfully!" -ForegroundColor Green
Write-Host "To start the backend server, run: npm start" -ForegroundColor Cyan

Set-Location ..

