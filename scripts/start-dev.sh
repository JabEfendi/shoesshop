#!/usr/bin/env bash
# ============================================================================
#  ShoeShop 3D Configurator — START DEV SERVERS (2 in 1 terminal)
#
#  - Menjalankan `php artisan serve` di :8000 (background)
#  - Menjalankan `npm run dev` (Vite HMR) di foreground (terminal tetap interaktif)
#  - Auto cleanup background php artisan kalau script di-Ctrl+C
#
#  PEMAKAIAN:
#      cd /path/to/shoesshop
#      chmod +x scripts/*.sh    (first time only)
#      ./scripts/start-dev.sh
#
#  Lalu buka http://localhost:8000
# ============================================================================

set -euo pipefail
cd "$(dirname "$0")/.."
PROJECT_ROOT="$(pwd)"

BOLD=$'\e[1m'
GREEN=$'\e[32m'
YELLOW=$'\e[33m'
BLUE=$'\e[34m'
CYAN=$'\e[36m'
RED=$'\e[31m'
RESET=$'\e[0m'

PHP_PID=""
VITE_PID=""
LOG_DIR="${PROJECT_ROOT}/storage/logs/dev"
mkdir -p "${LOG_DIR}"

cleanup() {
    echo -e "\n${YELLOW}${BOLD}🛑  Mematikan server dev...${RESET}"
    [ -n "${PHP_PID}" ]  && kill "${PHP_PID}"  2>/dev/null || true
    [ -n "${VITE_PID}" ] && kill "${VITE_PID}" 2>/dev/null || true
    # Also kill any php artisan / vite we started on these ports
    pkill -f "php artisan serve.*8000" 2>/dev/null || true
    sleep 0.5
    echo -e "   ${GREEN}✔ Semua server dimatikan. Sampai jumpa!${RESET}"
    exit 0
}
trap cleanup INT TERM EXIT

need_cmd() { command -v "$1" >/dev/null 2>&1 ; }

# --- Pre-flight checks ---
if ! need_cmd php; then
    echo -e "${RED}❌ PHP tidak ditemukan di PATH.${RESET}"
    echo -e "   Jalankan dulu: ${BOLD}./scripts/setup_once.sh${RESET}"
    exit 1
fi
if ! need_cmd npm; then
    echo -e "${RED}❌ npm tidak ditemukan di PATH.${RESET}"
    echo -e "   Jalankan dulu: ${BOLD}./scripts/setup_once.sh${RESET}"
    exit 1
fi
if [ ! -f "${PROJECT_ROOT}/vendor/autoload.php" ]; then
    echo -e "${YELLOW}⚠ vendor/autoload.php tidak ada. Jalankan composer install terlebih dahulu.${RESET}"
    echo -e "   Atau: ${BOLD}./scripts/setup_once.sh${RESET}"
    exit 1
fi
if [ ! -d "${PROJECT_ROOT}/node_modules" ] || [ ! -f "${PROJECT_ROOT}/node_modules/vite/package.json" ]; then
    echo -e "${YELLOW}⚠ node_modules (Vite) belum terinstall. Jalankan npm install dulu.${RESET}"
    echo -e "   Atau: ${BOLD}./scripts/setup_once.sh${RESET}"
    exit 1
fi

# --- 1. PHP artisan serve (background) ---
ARTISAN_LOG="${LOG_DIR}/php-artisan.log"
VITE_LOG="${LOG_DIR}/vite.log"
: > "${ARTISAN_LOG}"
: > "${VITE_LOG}"

echo -e "\n${BLUE}${BOLD}🚀 Starting PHP Laravel (artisan serve) on http://localhost:8000 ...${RESET}"
(
    cd "${PROJECT_ROOT}"
    exec php artisan serve --host=127.0.0.1 --port=8000 > "${ARTISAN_LOG}" 2>&1
) &
PHP_PID=$!
disown "${PHP_PID}" 2>/dev/null || true

# Wait until ready
for i in {1..15}; do
    if grep -q "Development Server" "${ARTISAN_LOG}" 2>/dev/null; then
        break
    fi
    if ! kill -0 "${PHP_PID}" 2>/dev/null; then
        echo -e "${RED}❌ php artisan serve gagal start. Log di: ${ARTISAN_LOG}${RESET}"
        tail -n 30 "${ARTISAN_LOG}" 2>/dev/null
        exit 1
    fi
    sleep 0.6
done
echo -e "   ${GREEN}✔ Laravel API/SSR siap (PID ${PHP_PID})${RESET}"
echo -e "   ${CYAN}📄 Log PHP:    ${ARTISAN_LOG}${RESET}"

# --- 2. Vite HMR dev server (foreground, user see output) ---
echo -e "\n${BLUE}${BOLD}⚡ Starting Vite (HMR) on http://localhost:5173 ...${RESET}"
echo -e "   ${CYAN}📄 Log Vite:   ${VITE_LOG}${RESET}"
echo -e "   ${BOLD}Tekan ${RED}Ctrl+C${BOLD} untuk menghentikan SEMUA server.${RESET}"
echo ""
echo -e "   ${YELLOW}${BOLD}🌐 BUKA BROWSER KE:  http://localhost:8000${RESET}"
echo ""

(
    cd "${PROJECT_ROOT}"
    exec npm run dev
) &
VITE_PID=$!
disown "${VITE_PID}" 2>/dev/null || true

# Give Vite a moment to boot, then show relevant log lines
sleep 2.5
if kill -0 "${VITE_PID}" 2>/dev/null; then
    echo -e "   ${GREEN}✔ Vite dev server berjalan (PID ${VITE_PID}).${RESET}"
    echo -e "   ──────────────────────────────────────────────────"
    # Show Vite output tail on user terminal, tail follow-style (background)
    tail -f -n 30 "${PROJECT_ROOT}/node_modules" 2>/dev/null || true
    wait "${VITE_PID}" 2>/dev/null || true
fi
