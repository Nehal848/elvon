@echo off
echo ============================================================
echo  Starting Hospital AI Platform (Windows)
echo ============================================================

REM Check if win_venv exists, activate if present
if exist win_venv\Scripts\activate.bat (
    call win_venv\Scripts\activate.bat
) else if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
python main.py
pause
