# Windows PowerShell script to setup frontend
Write-Host "Setting up Attendance Admin Frontend..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "Node.js version: $(node --version)" -ForegroundColor Green

# Navigate to frontend directory
Set-Location frontend

# Install dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "Frontend setup completed successfully!" -ForegroundColor Green
Write-Host "To start the frontend dev server, run: npm run dev" -ForegroundColor Cyan

Set-Location ..

