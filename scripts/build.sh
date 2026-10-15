#!/usr/bin/env bash
# ساخت کامل سایت: صفحه بازی (Vite) + سایت شخصی -> پوشه docs/
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> [1/3] نصب وابستگی‌ها و بیلد صفحه بازی (Vite)..."
cd game-app
if [ ! -d node_modules ]; then
  npm ci --no-audit --no-fund
fi
npm run build
cd "$ROOT"

echo "==> [2/3] مونتاژ خروجی نهایی در docs/ ..."
rm -rf docs
mkdir -p docs/game
cp -r game-app/dist/. docs/game/
cp site/index.html   docs/index.html
cp site/profile.jpg  docs/profile.jpg

echo "==> [3/3] تمام! سایت آماده‌ست در پوشه docs/"
echo "    پیش‌نمایش محلی:  npm run preview"
echo "    انتشار:          پوشه docs روی GitHub Pages فعال است (شاخه جاری، مسیر /docs)"
