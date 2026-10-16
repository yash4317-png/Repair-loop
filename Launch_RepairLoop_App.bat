@echo off
title Launching RepairLoop Judge Demo...
echo ========================================================
echo   RepairLoop: Circular Electronics Return Path Demo
echo   Track 06 | PS 25/35
echo ========================================================
echo.

:: Check if port 3000 is open
netstat -ano | findstr :3000 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo [OK] RepairLoop server is already active!
) else (
    echo [INFO] Starting RepairLoop server on http://127.0.0.1:3000...
    start /min cmd /c "cd /d C:\Users\Yashvardhan\.gemini\antigravity\scratch\repairloop && npm run dev -- --host 127.0.0.1 --port 3000"
    timeout /t 3 /nobreak >nul
)

echo [INFO] Opening Judge Demo in your default web browser...
start http://127.0.0.1:3000/
exit
