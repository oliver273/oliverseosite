@echo off
echo ========================================
echo Starting OliverSEO Local Server (Node.js)
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Or use the Python server instead (START_SERVER.bat)
    echo.
    pause
    exit /b 1
)

echo Node.js found! Starting server...
echo.
echo Server will open at: http://localhost:8000
echo Dashboard: http://localhost:8000/dashboard-fixed.html
echo.
echo Press Ctrl+C to stop the server
echo.

node start_server.js

pause


