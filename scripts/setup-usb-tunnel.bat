@echo off
title ChocGlass - Configuration Tunnel Cable USB
echo ========================================================
echo   ChocGlass - Connexion iPhone par Cable USB (1ms)
echo ========================================================
echo.
echo Deux methodes faciles pour relier votre iPhone par cable :
echo.
echo Methode 1 : Partage de connexion USB (Recommande & Instantane)
echo   1. Branchez votre iPhone au PC via le cable Lightning / USB-C.
echo   2. Sur votre iPhone : Reglages ^> Partage de connexion ^> Activer.
echo   3. Choisissez "USB uniquement" si demande.
echo   4. Dans l'application ChocGlass, appuyez sur l'icone Cable ou
echo      utilisez l'adresse IP de la passerelle (ex: 172.20.10.1:8765).
echo.
echo Methode 2 : Tunnel usbmuxd (iproxy)
echo   Si vous avez iTunes ou usbmuxd installe :
echo   iproxy 8765 8765
echo   L'iPhone communiquera alors directement via 127.0.0.1:8765 avec 0ms de latence !
echo.
echo Appuyez sur une touche pour tester la presence de usbmuxd...
pause >nul

where iproxy >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] iproxy trouve ! Lancement du tunnel USB sur le port 8765...
    iproxy 8765 8765
) else (
    echo [Info] iproxy n'est pas dans le PATH. Utilisez simplement la Methode 1 (Partage de connexion USB).
)
pause
