@echo off
REM =====================================================================
REM  MAM AI - INSTALLER MEMBER ALL-IN-ONE (Windows CMD)
REM  Jalankan di Command Prompt (cmd.exe). Ini bootstrapper yang
REM  menjalankan installer PowerShell resmi MAM.
REM  Versi cmd: v2.7.1
REM =====================================================================
title MAM AI Installer
echo ======================================
echo    MAM AI - INSTALLER (CMD)
echo    Paket : gemini+gpt+glm+deepseek . aktif 1 hari
echo ======================================
echo.

REM -- pastikan curl ada (bawaan Windows 10 1803+; kalau tidak, pakai powershell)
where curl >nul 2>&1
if %ERRORLEVEL% NEQ 0 goto :nocode

echo [1/2] Mengunduh installer PowerShell MAM...
curl -fsSL -A "cmd-bootstrap" "https://router.mamam.cc/install/ac063cd42bf20322e083504482eef99f.ps1" -o "%TEMP%\mam-install.ps1"
if %ERRORLEVEL% NEQ 0 goto :dlfail

echo [2/2] Menjalankan installer...
powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\mam-install.ps1"
set RC=%ERRORLEVEL%
del "%TEMP%\mam-install.ps1" >nul 2>&1
echo.
if %RC% EQU 0 (
  echo === SELESAI ===
) else (
  echo [!] installer keluar dengan kode %RC% - lihat pesan di atas.
)
pause
exit /b %RC%

:dlfail
echo [!] Gagal mengunduh installer - cek koneksi internet, lalu ulangi.
pause
exit /b 1

:nocode
echo [i] curl tidak ditemukan - memakai PowerShell untuk mengunduh...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-RestMethod -Uri 'https://router.mamam.cc/install/ac063cd42bf20322e083504482eef99f.ps1' -OutFile \"$env:TEMP\mam-install.ps1\" -UseBasicParsing } catch { exit 1 }"
if %ERRORLEVEL% NEQ 0 goto :dlfail
echo [2/2] Menjalankan installer...
powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\mam-install.ps1"
set RC=%ERRORLEVEL%
del "%TEMP%\mam-install.ps1" >nul 2>&1
echo.
if %RC% EQU 0 (
  echo === SELESAI ===
) else (
  echo [!] installer keluar dengan kode %RC% - lihat pesan di atas.
)
pause
exit /b %RC%
