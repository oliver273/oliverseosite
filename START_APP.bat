@echo off
echo ========================================
echo   OliverSEO Business Desktop App
echo ========================================
echo.
echo Checking for Node.js...

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Checking for dependencies...

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Starting OliverSEO Business App...
echo.

npm start

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to start the app!
    echo.
    pause
)



