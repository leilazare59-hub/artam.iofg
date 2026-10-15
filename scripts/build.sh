#!/usr/bin/env bash
# ساخت کامل سایت (پروژه Vite در app/) -> پوشه docs/
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> [1/3] نصب وابستگی‌ها و بیلد سایت (Vite)..."
cd app
if [ ! -d node_modules ]; then
  npm ci --no-audit --no-fund
fi
npm run build
cd "$ROOT"

echo "==> [2/3] مونتاژ خروجی نهایی در docs/ ..."
rm -rf docs
mkdir -p docs
cp -r app/dist/. docs/

# رونوشت در ریشهٔ مخزن: چون Pages روی «ریشهٔ شاخه» تنظیم شده،
# این فایل‌ها باعث می‌شوند خودِ ریشه هم سایت را سرو کند.
echo "==> [2.5/3] رونوشت فایل‌های سایت در ریشهٔ مخزن ..."
cp docs/index.html      ./index.html
cp docs/app-release.apk ./app-release.apk
cp docs/icon.svg        ./icon.svg
cp docs/manifest.json   ./manifest.json
cp docs/sw.js           ./sw.js

echo "==> [3/3] تمام! سایت آماده‌ست در پوشه docs/"
echo "    پیش‌نمایش محلی:  npm run preview"
