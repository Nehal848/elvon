@echo off
title ELVON - Platform Orchestrator
echo ============================================================
echo   ELVON - Hybrid Quantum Machine Learning Platform
echo   Launching Full-Stack Ecosystem (Backend + Frontend)
echo ============================================================

set ROOT=%~dp0
cd /d "%ROOT%"

echo [1/3] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "ELVON - Backend (FastAPI :8000)" cmd /k "cd /d "%ROOT%" && (if exist win_venv\Scripts\activate.bat (call win_venv\Scripts\activate.bat) else if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat)) && python main.py"

echo [2/3] Launching Next.js Frontend on http://localhost:3000 ...
start "ELVON - Frontend (Next.js :3000)" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo ============================================================
echo   Platform is running!
echo   Frontend : http://localhost:3000
echo   Backend  : http://127.0.0.1:8000
echo   API Docs : http://127.0.0.1:8000/docs
echo ============================================================
start http://localhost:3000
