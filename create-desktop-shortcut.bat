@echo off
echo ========================================
echo   Creating Desktop Shortcut
echo ========================================
echo.

set SCRIPT_DIR=%~dp0
set SHORTCUT_NAME=OliverSEO Business App
set TARGET_PATH=%SCRIPT_DIR%START_APP.bat
set ICON_PATH=%SCRIPT_DIR%icon.ico
set DESKTOP=%USERPROFILE%\Desktop

echo Creating shortcut on Desktop...
echo Target: %TARGET_PATH%
echo.

REM Create VBScript to make shortcut
set VBS=%TEMP%\create_shortcut.vbs
echo Set oWS = WScript.CreateObject("WScript.Shell") > %VBS%
echo sLinkFile = "%DESKTOP%\%SHORTCUT_NAME%.lnk" >> %VBS%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %VBS%
echo oLink.TargetPath = "%TARGET_PATH%" >> %VBS%
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> %VBS%
echo oLink.Description = "OliverSEO Business Dashboard and Reddit Outreach Tool" >> %VBS%
echo oLink.WindowStyle = 1 >> %VBS%
echo oLink.Save >> %VBS%

cscript //nologo %VBS%
del %VBS%

if exist "%DESKTOP%\%SHORTCUT_NAME%.lnk" (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Shortcut created on Desktop: "%SHORTCUT_NAME%"
    echo.
    echo You can now double-click it to launch the app!
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



