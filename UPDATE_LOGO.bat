@echo off
echo ========================================
echo   Update Shortcut Logo
echo ========================================
echo.
echo This will convert your logo image to an icon
echo and update the desktop shortcut.
echo.
echo Please save your logo image in this folder as:
echo   - logo.png
echo   - logo.jpg
echo   - logo.jpeg
echo   - dashboard_logo.png
echo   - dashboard_logo.jpg
echo.
pause

cd /d "%~dp0"

echo.
echo Converting logo to icon...
python convert_logo_to_icon.py

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Updating desktop shortcut...
    cscript //nologo create_shortcut.vbs
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Logo updated! The shortcut now uses your logo.
    echo.
) else (
    echo.
    echo ERROR: Could not convert logo.
    echo Make sure you have a logo file in this folder.
    echo.
)

pause



