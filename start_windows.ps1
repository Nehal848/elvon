# PowerShell script to orchestrate Full-Stack ELVON (Backend + Frontend)
$host.UI.RawUI.WindowTitle = "ELVON - Full-Stack Orchestrator"
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   ELVON - Hybrid Quantum Machine Learning Platform         " -ForegroundColor Green
Write-Host "   Launching Full-Stack Ecosystem (Backend + Frontend)      " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Detect Python Executable in Virtualenv
$pyExe = "python"
if (Test-Path "$scriptDir\.venv\Scripts\python.exe") {
    $pyExe = "$scriptDir\.venv\Scripts\python.exe"
    Write-Host "[*] Found virtual environment: .venv" -ForegroundColor Green
} elseif (Test-Path "$scriptDir\venv\Scripts\python.exe") {
    $pyExe = "$scriptDir\venv\Scripts\python.exe"
    Write-Host "[*] Found virtual environment: venv" -ForegroundColor Green
} elseif (Test-Path "$scriptDir\win_venv\Scripts\python.exe") {
    $pyExe = "$scriptDir\win_venv\Scripts\python.exe"
    Write-Host "[*] Found virtual environment: win_venv" -ForegroundColor Green
} elseif (Test-Path "$scriptDir\env\Scripts\python.exe") {
    $pyExe = "$scriptDir\env\Scripts\python.exe"
    Write-Host "[*] Found virtual environment: env" -ForegroundColor Green
} else {
    Write-Host "[*] Using system Python" -ForegroundColor Yellow
}

# 1. Start FastAPI Backend in new window
Write-Host "[1/3] Launching FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
$backendCmd = "Set-Location '$scriptDir'; & '$pyExe' main.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# 2. Start Next.js Frontend in new window
Write-Host "[2/3] Launching Next.js Frontend on http://localhost:3000 ..." -ForegroundColor Yellow
$frontendCmd = "Set-Location '$scriptDir\frontend'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

# 3. Wait and open browser
Write-Host "[3/3] Waiting for servers to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host "============================================================" -ForegroundColor Green
Write-Host "   Platform is running!                                     " -ForegroundColor Green
Write-Host "   Frontend : http://localhost:3000                         " -ForegroundColor White
Write-Host "   Backend  : http://127.0.0.1:8000                         " -ForegroundColor White
Write-Host "   API Docs : http://127.0.0.1:8000/docs                    " -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green

Start-Process "http://localhost:3000"
