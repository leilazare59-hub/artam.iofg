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

echo "==> [3/3] تمام! سایت آماده‌ست در پوشه docs/"
echo "    پیش‌نمایش محلی:  npm run preview"
