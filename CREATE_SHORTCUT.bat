@echo off
echo ========================================
echo   Creating Desktop Shortcut
echo ========================================
echo.

cd /d "%~dp0"
echo Creating shortcut on Desktop...
echo.

cscript //nologo create_shortcut.vbs

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Shortcut created on Desktop!
    echo Name: "OliverSEO Business Dashboard"
    echo.
    echo You can now double-click it to launch the app!
    echo.
    echo If you don't see it, try:
    echo - Refresh your Desktop (press F5)
    echo - Check both Desktop folders (regular and OneDrive)
    echo.
) else (
    echo.
    echo ERROR: Could not create shortcut.
    echo.
    echo You can manually create a shortcut:
    echo 1. Right-click START_APP.bat
    echo 2. Select "Create shortcut"
    echo 3. Move the shortcut to Desktop
    echo.
)

pause

