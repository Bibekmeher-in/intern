@echo off
echo ========================================
echo  TechBridge Server - Excel Database
echo ========================================
echo.
echo Checking for running Node processes...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo Starting server on port 5000...
echo Database: server/database/applications.xlsx
echo.
npm start
