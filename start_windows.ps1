# PowerShell script to start the Hospital AI Platform backend on Windows
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Starting Hospital AI Platform Backend (Windows PowerShell) " -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

if (Test-Path ".\win_venv\Scripts\Activate.ps1") {
    & ".\win_venv\Scripts\Activate.ps1"
} elseif (Test-Path ".\venv\Scripts\Activate.ps1") {
    & ".\venv\Scripts\Activate.ps1"
}

Write-Host "Starting FastAPI on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
python main.py
