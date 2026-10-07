#!/usr/bin/env bash
# ============================================================================
#  ShoeShop 3D Configurator — 1-TIME SETUP SCRIPT
#  Jalankan HANYA SEKALI setelah first clone.
#
#  Kegunaan:
#   1. Install PHP 8.2 + extensions + Composer (via apt, butuh sudo)
#   2. Install Node.js 20 LTS + npm (via apt + NodeSource PPA)
#   3. Install PHP dependencies (composer install)
#   4. Install JS dependencies (npm install → Vite + React + R3F)
#   5. Create storage symlink (Laravel public/storage)
#   6. Run database migrations + seed data product & customization options
# ============================================================================

set -euo pipefail
cd "$(dirname "$0")/.."
PROJECT_ROOT="$(pwd)"

BOLD=$'\e[1m'
GREEN=$'\e[32m'
YELLOW=$'\e[33m'
BLUE=$'\e[34m'
RED=$'\e[31m'
RESET=$'\e[0m'

banner() { echo -e "\n${BLUE}${BOLD}==> $1 ${RESET}" ; }
ok()     { echo -e "   ${GREEN}✔ $1${RESET}" ; }
warn()   { echo -e "   ${YELLOW}⚠ $1${RESET}" ; }
die()    { echo -e "\n${RED}✖ ERROR: $1${RESET}" >&2; exit 1; }

banner "Mengecek tools yang tersedia..."

need_cmd() { command -v "$1" >/dev/null 2>&1 ; }

# -------- 1. PHP + Composer --------
if need_cmd php && need_cmd composer; then
    ok "PHP & Composer sudah terinstall"
else
    banner "Installing PHP 8.2 + extensions + Composer..."
    sudo apt-get update -y || die "apt-get update gagal (perlu password sudo?)"
    sudo apt-get install -y \
        software-properties-common curl ca-certificates lsb-release gnupg unzip \
        || die "install prerequisites gagal"

    # Use ondrej/php PPA for latest PHP on Debian/Ubuntu
    if ! grep -q "ondrej/php" /etc/apt/sources.list /etc/apt/sources.list.d/*.list 2>/dev/null; then
        sudo add-apt-repository -y ppa:ondrej/php || warn "PPA ondrej/php gagal ditambahkan, fallback ke default repo"
        sudo apt-get update -y
    fi

    # Detect available php version
    PHP_VERSIONS=(8.3 8.2 8.1)
    PHPV=""
    for v in "${PHP_VERSIONS[@]}"; do
        if apt-cache show "php${v}" >/dev/null 2>&1; then
            PHPV="${v}"; break
        fi
    done
    if [ -z "${PHPV}" ]; then
        sudo apt-get install -y php || die "tidak bisa install PHP"
        PHPV="default"
    else
        sudo apt-get install -y \
            php${PHPV}-cli php${PHPV}-curl php${PHPV}-mbstring php${PHPV}-xml php${PHPV}-zip \
            php${PHPV}-sqlite3 php${PHPV}-gd php${PHPV}-bcmath php${PHPV}-intl \
            || die "install php ${PHPV} + extensions gagal"
    fi

    # Composer
    if ! need_cmd composer; then
        banner "Install Composer..."
        EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
        php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
        ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"
        if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then
            >&2 warn 'Composer installer corrupt, retry dengan apt'
            rm composer-setup.php
            sudo apt-get install -y composer || die "composer install gagal"
        else
            php composer-setup.php --quiet || warn "installer gagal, fallback apt"
            rm composer-setup.php
            sudo mv composer.phar /usr/local/bin/composer 2>/dev/null || true
            if ! need_cmd composer; then sudo apt-get install -y composer; fi
        fi
    fi
    ok "PHP + Composer siap (PHP version: $(php -v | head -1))"
fi

# -------- 2. Node.js 20 LTS + npm --------
if need_cmd node && need_cmd npm; then
    NODE_V="$(node -v | sed 's/v//' | cut -d. -f1)"
    if [ "${NODE_V}" -ge 18 ] 2>/dev/null; then
        ok "Node.js $(node -v) + npm $(npm -v) sudah terinstall"
    else
        warn "Node.js versi < 18, akan install Node 20 LTS"
        DO_NODE_INSTALL=1
    fi
else
    banner "Install Node.js 20 LTS + npm via NodeSource..."
    DO_NODE_INSTALL=1
fi

if [ "${DO_NODE_INSTALL:-0}" = "1" ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource.sh || die "gagal download nodesource setup"
    sudo bash /tmp/nodesource.sh || die "nodesource setup gagal"
    sudo apt-get install -y nodejs || die "nodejs install gagal"
    sudo npm install -g npm@latest || warn "npm global update gagal, lanjut dengan builtin"
    ok "Node.js $(node -v) + npm $(npm -v) siap"
fi

# -------- 3. Composer install (Laravel vendor) --------
banner "Installing PHP dependencies (composer install)..."
if [ -f "${PROJECT_ROOT}/vendor/autoload.php" ]; then
    ok "vendor/ sudah ada — skip, jalankan 'composer install --optimize-autoloader' di root jika ingin refresh"
else
    cd "${PROJECT_ROOT}"
    composer install --optimize-autoloader --no-interaction \
        || die "composer install gagal. Coba cek koneksi internet / PHP extensions."
    ok "vendor/ ready"
fi

# -------- 4. npm install (Vite + React + R3F) --------
banner "Installing JavaScript dependencies (npm install)..."
if [ -d "${PROJECT_ROOT}/node_modules/.vite" ] || [ -f "${PROJECT_ROOT}/node_modules/vite/package.json" ]; then
    ok "node_modules/ (Vite) sudah terdeteksi — skip, untuk refresh: npm install"
else
    cd "${PROJECT_ROOT}"
    npm install --no-audit --no-fund || die "npm install gagal (coba: rm -rf node_modules package-lock.json && npm install)"
    ok "node_modules/ ready"
fi

# -------- 5. Laravel artisan key:generate (jika APP_KEY kosong) --------
banner "Finalisasi Laravel..."
cd "${PROJECT_ROOT}"
if grep -q '^APP_KEY=$' .env 2>/dev/null || [ -z "$(grep -E '^APP_KEY=.+' .env 2>/dev/null | head -1)" ]; then
    php artisan key:generate --force --no-interaction || die "php artisan key:generate gagal"
    ok "APP_KEY dibuat"
fi

# storage:link (public/storage -> storage/app/public)
if [ ! -L "public/storage" ] && [ ! -d "public/storage" ]; then
    php artisan storage:link --no-interaction 2>/dev/null || warn "storage:link gagal, bisa di-skip dulu"
    ok "storage:link dibuat"
fi

# -------- 6. Migrate + Seed SQLite database --------
banner "Migrate + seed database SQLite..."
php artisan migrate:fresh --force --no-interaction || die "migration gagal"
php artisan db:seed --force --class=ProductSeeder --no-interaction \
    || warn "ProductSeeder belum ada / gagal. Cek database/seeders/ProductSeeder.php"
ok "Database siap (SQLite file: database/database.sqlite)"

# -------- Done --------
echo ""
echo -e "   ${GREEN}${BOLD}========================================${RESET}"
echo -e "   ${GREEN}${BOLD}  SETUP BERHASIL! ✅${RESET}"
echo -e "   ${GREEN}${BOLD}========================================${RESET}"
echo ""
echo -e "   ${BOLD}Untuk menjalankan web dev server:${RESET}"
echo -e "     ${BLUE}${BOLD}./scripts/start-dev.sh${RESET}"
echo ""
echo -e "   ATAU jalankan 2 command di 2 terminal TERSEPARAT:"
echo -e "     Terminal 1 (PHP backend Laravel): ${YELLOW}php artisan serve${RESET}"
echo -e "     Terminal 2 (Vite HMR dev server): ${YELLOW}npm run dev${RESET}"
echo ""
echo -e "   Lalu buka browser ke:  ${BOLD}http://localhost:8000${RESET}"
echo ""
