@echo off
echo ========================================
echo Starting OliverSEO Local Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from https://www.python.org/
    echo Or use the Node.js server instead (START_SERVER_NODE.bat)
    echo.
    pause
    exit /b 1
)

echo Python found! Starting server...
echo.
echo Server will open at: http://localhost:8000
echo Dashboard: http://localhost:8000/dashboard-fixed.html
echo.
echo Press Ctrl+C to stop the server
echo.

python start_server.py

pause


