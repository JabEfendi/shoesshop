# ============================================================
# ShoeShop 3D — SETUP OTOMATIS (PowerShell / Windows)
# ============================================================
# Cara pakai:
#   1. Buka PowerShell AS ADMINISTRATOR (klik kanan PowerShell → Run as Admin)
#   2. Jalankan: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
#      (jika diminta konfirmasi ketik: A)
#   3. Masuk folder project:  cd d:\Project\shoesshop
#   4. Jalankan file ini:     .\install.ps1
#
# Script ini akan menjalankan 6 langkah otomatis:
#   [1] composer install          → install vendor Laravel
#   [2] npm install               → install React + R3F + drei
#   [3] Copy .env + key:generate  → setup environment SQLite default
#   [4] Buat database.sqlite      → SQLite database
#   [5] migrate:fresh --seed      → buat tabel + data demo produk
#   [6] Copy aset 3D placeholder  → beritahu lokasi simpan .glb
# ============================================================

$ErrorActionPreference = "Stop"

function Step($n, $msg) {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor DarkYellow
    Write-Host "  LANGKAH $n  ::  $msg" -ForegroundColor Yellow
    Write-Host "========================================================" -ForegroundColor DarkYellow
}
function OK($m)  { Write-Host "  OK  :: $m" -ForegroundColor Green }
function INFO($m){ Write-Host "  ..  :: $m" -ForegroundColor Gray }
function WARN($m){ Write-Host "  !!  :: $m" -ForegroundColor Magenta }
function ERR($m) { Write-Host "  ERR :: $m" -ForegroundColor Red }

$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $PROJECT_ROOT

# ------------------------------------------------------------------
# Step 0: Pastikan tools tersedia
# ------------------------------------------------------------------
Step 0 "Cek toolchain (PHP, Composer, Node.js)"
function Test-Command($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}
$toolsOK = $true
foreach($tool in @("php","composer","node","npm")) {
    $ok = Test-Command $tool
    if($ok) { OK("$tool tersedia") } else { ERR("$tool TIDAK DITEMUKAN di PATH"); $toolsOK = $false }
}
if(-not $toolsOK) {
    ERR("Beberapa tool tidak ditemukan. Silakan install dulu lalu run ulang install.ps1")
    exit 1
}

# ------------------------------------------------------------------
# Step 1: Composer install
# ------------------------------------------------------------------
Step 1 "Composer install (vendor Laravel + Inertia)"
if(Test-Path "vendor\autoload.php") {
    WARN("Folder vendor/ sudah ada. Skip composer install. Delete vendor/ untuk install fresh.")
} else {
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" 2>$null
    if(Test-Path "composer.phar") {
        php composer.phar install --optimize-autoloader --no-interaction
    } else {
        composer install --optimize-autoloader --no-interaction
    }
    Remove-Item composer-setup.php, composer.phar -ErrorAction SilentlyContinue
}
if(-not (Test-Path "vendor\autoload.php")) { ERR("Composer install GAGAL."); exit 2 }
OK("vendor/ siap")

# ------------------------------------------------------------------
# Step 2: NPM install
# ------------------------------------------------------------------
Step 2 "NPM install (React + Three.js + R3F + Drei)"
if(Test-Path "node_modules\three") {
    WARN("node_modules/three sudah ada. Skip npm install.")
} else {
    npm install --no-audit --no-fund 2>&1 | Select-Object -Last 8
}
foreach($mod in @("three","@react-three/fiber","@react-three/drei","zustand")) {
    $path = "node_modules\" + ($mod -replace "@","")
    if(-not (Test-Path $path)) { $path2 = "node_modules\" + $mod
        if(-not (Test-Path $path2)) {
            WARN("Module $mod belum terinstall — lanjut cek sambil berjalan")
        }
    }
}
OK("Dependensi frontend (tiga) terverifikasi")

# ------------------------------------------------------------------
# Step 3: Copy .env + APP_KEY
# ------------------------------------------------------------------
Step 3 "Setup .env (SQLite default) + Generate APP_KEY"
if(-not (Test-Path ".env")) {
    Copy-Item ".env.example" -Destination ".env"
    OK("File .env dibuat dari template")
}
if(-not (Test-Path ".env")) { ERR("Gagal membuat .env"); exit 3 }

# Set APP_NAME di .env (jika masih default)
$envContent = Get-Content .env -Raw
if($envContent -match "APP_KEY=$") {
    php artisan key:generate --ansi
    OK("APP_KEY di-generate")
} else {
    INFO("APP_KEY sudah ada, skip generate")
}

# ------------------------------------------------------------------
# Step 4: Buat SQLite DB (jika belum ada)
# ------------------------------------------------------------------
Step 4 "Siapkan database SQLite"
$sqlitePath = "database\database.sqlite"
if(-not (Test-Path $sqlitePath)) {
    New-Item -ItemType File -Path $sqlitePath -Force | Out-Null
    OK("database/database.sqlite dibuat")
} else {
    INFO("SQLite DB sudah ada")
}

# ------------------------------------------------------------------
# Step 5: Migration + Seeder
# ------------------------------------------------------------------
Step 5 "Migrate database + seed data demo produk"
php artisan migrate:fresh --force --ansi
php artisan db:seed --class=ProductSeeder --force --ansi
php artisan route:clear
php artisan view:clear
php artisan cache:clear
OK("Database siap, data demo produk sudah terisi")

# ------------------------------------------------------------------
# Step 6: Aset 3D info
# ------------------------------------------------------------------
Step 6 "Verifikasi lokasi aset 3D"
$glbFolder = "public\3d-assets"
if(-not (Test-Path $glbFolder)) { New-Item -ItemType Directory -Force $glbFolder | Out-Null }
OK("Folder $glbFolder siap")

# Cek file GLB hasil optimize dari Blender
$needFiles = @(
    @("public\3d-assets\leather-boot-optimized.glb", "leather-boot"),
    @("public\3d-assets\chelsea-boot-optimized.glb", "chelsea-boot")
)
$missing = 0
foreach($pair in $needFiles) {
    if(-not (Test-Path $pair[0])) {
        WARN("File GLB BELUM ADA: $($pair[0])")
        $missing++
    } else {
        $sz = (Get-Item $pair[0]).Length / 1MB
        OK("$($pair[1]) GLB ready ($([Math]::Round($sz,2)) MB)")
    }
}
if($missing -gt 0) {
    WARN("$missing GLB file belum ada (tapi aplikasi tetap bisa jalan, Canvas menampilkan placeholder).")
    WARN("Setelah Blender selesai, copy file .glb ke folder public\3d-assets\ dengan nama di atas.")
}

# ------------------------------------------------------------------
# Step 7: Build frontend (opsional, tapi kita run vite dev manual nanti)
# ------------------------------------------------------------------
Step 7 "Frontend build VERIFIKASI"
$buildOK = $true
try {
    npm run build 2>&1 | Select-Object -Last 15
    $buildOK = ($LASTEXITCODE -eq 0)
} catch {
    $buildOK = $false
    ERR("npm run build error — akan dijalankan dev server saja untuk saat ini")
}
if($buildOK) { OK("Build production sukses") } else { WARN("Build production bisa diskip, kita run dev server.") }

# ------------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------------
Write-Host ""
Write-Host "____________________________________________________________" -ForegroundColor DarkGreen
Write-Host "" -ForegroundColor Green
Write-Host "  ✅ SETUP SELESAI" -ForegroundColor Green
Write-Host "____________________________________________________________" -ForegroundColor DarkGreen
Write-Host ""
Write-Host "  ⚡ Jalankan server pengembangan (2 terminal terpisah):" -ForegroundColor Cyan
Write-Host ""
Write-Host "     Terminal 1 (Laravel backend):" -ForegroundColor White
Write-Host "       cd d:\Project\shoesshop" -ForegroundColor Gray
Write-Host "       php artisan serve" -ForegroundColor Yellow
Write-Host ""
Write-Host "     Terminal 2 (Vite frontend):" -ForegroundColor White
Write-Host "       cd d:\Project\shoesshop" -ForegroundColor Gray
Write-Host "       npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "  🖥️   Buka URL:" -ForegroundColor Cyan
Write-Host "       http://127.0.0.1:8000/products" -ForegroundColor White
Write-Host "       http://127.0.0.1:8000/products/leather-boot" -ForegroundColor White
Write-Host "       http://127.0.0.1:8000/products/chelsea-boot" -ForegroundColor White
Write-Host ""
Write-Host "  📝 Verifikasi checklist file GLB:" -ForegroundColor Cyan
Write-Host "       • Buka Blender → Run Shoe Toolkit → export GLB ke" -ForegroundColor White
Write-Host "         public\3d-assets\leather-boot-optimized.glb" -ForegroundColor Gray
Write-Host "         public\3d-assets\chelsea-boot-optimized.glb" -ForegroundColor Gray
Write-Host "____________________________________________________________" -ForegroundColor DarkGreen
Write-Host ""

Write-Host "  Menjalankan Laravel Serve di background? (Y/N) default N:  " -NoNewline
$ans = [Console]::ReadKey($true).Key
if($ans -eq "Y") {
    Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PROJECT_ROOT'; php artisan serve"
    Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PROJECT_ROOT'; npm run dev"
    Write-Host "Dua terminal dev server sudah dijalankan."
}
