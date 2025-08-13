@echo off
echo Arrêt du serveur Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo Attente de 2 secondes...
timeout /t 2 /nobreak >nul

echo Démarrage du serveur...
cd /d "%~dp0"
npm start