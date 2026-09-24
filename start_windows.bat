@echo off
title ELVON - Platform Orchestrator
echo ============================================================
echo   ELVON - Hybrid Quantum Machine Learning Platform
echo   Launching Full-Stack Ecosystem (Backend + Frontend)
echo ============================================================

set ROOT=%~dp0
cd /d "%ROOT%"

:: Auto-detect virtual environment across all common naming patterns
set "PY_EXE=python"
if exist "%ROOT%.venv\Scripts\python.exe" (
    set "PY_EXE=%ROOT%.venv\Scripts\python.exe"
    echo [*] Detected virtual environment: .venv
) else if exist "%ROOT%venv\Scripts\python.exe" (
    set "PY_EXE=%ROOT%venv\Scripts\python.exe"
    echo [*] Detected virtual environment: venv
) else if exist "%ROOT%win_venv\Scripts\python.exe" (
    set "PY_EXE=%ROOT%win_venv\Scripts\python.exe"
    echo [*] Detected virtual environment: win_venv
) else if exist "%ROOT%env\Scripts\python.exe" (
    set "PY_EXE=%ROOT%env\Scripts\python.exe"
    echo [*] Detected virtual environment: env
) else (
    echo [*] Using system python
)

echo [1/3] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "ELVON - Backend (FastAPI :8000)" cmd /k "cd /d "%ROOT%" && "%PY_EXE%" main.py"

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
