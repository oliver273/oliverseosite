@echo off
echo ========================================
echo   OliverSEO Business App Installer
echo ========================================
echo.
echo This will install the desktop app on your computer.
echo.

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

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Building installer...
echo.

call npm run build

if %errorlevel% neq 0 (
    echo ERROR: Failed to build installer!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo The installer is in the 'dist' folder.
echo Run the .exe file to install the app on your computer.
echo.
pause



