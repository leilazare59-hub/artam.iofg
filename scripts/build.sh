#!/usr/bin/env bash
# ساخت سایت: فقط صفحهٔ اصلی (از سورس زیپ) + فایل بازی -> docs/ و ریشهٔ مخزن
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> [1/2] مونتاژ docs/ (صفحهٔ سایت + فایل بازی) ..."
rm -rf docs
mkdir -p docs
cp app/public/index.html docs/index.html
cp app-release.apk       docs/app-release.apk

echo "==> [2/2] رونوشت در ریشهٔ مخزن (برای GitHub Pages روی ریشه) ..."
cp docs/index.html ./index.html
# app-release.apk از قبل در ریشه هست (فایل بازی)

echo "==> تمام! سایت آماده است: docs/ و ریشهٔ مخزن"
echo "    پیش‌نمایش محلی: npm run preview"
