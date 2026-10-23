@echo off
title ChocGlass - Launching Companion and Mobile App
echo ========================================================
echo   ChocGlass - Liquid Chocolate Deck Companion
echo ========================================================
echo.
echo [1/2] Demarrage du Serveur Desktop Companion (Port 8765)...
start "ChocGlass Desktop Server" cmd /k "cd /d %~dp0..\desktop && node src\main\server.js"

echo [2/2] Demarrage de l'App Mobile / Web (Port 5173)...
start "ChocGlass Mobile Web" cmd /k "cd /d %~dp0..\mobile && npm run dev"

echo.
echo Tout est lance !
echo   - App iPhone / Web : http://localhost:5173
echo   - Serveur PC : http://localhost:8765
echo.
pause
