#!/usr/bin/env bash
# پیش‌نمایش محلی سایت ساخته‌شده روی پورت 8080
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ ! -f docs/index.html ]; then
  bash scripts/build.sh
fi

PORT="${PORT:-8080}"
echo "==> پیش‌نمایش روی http://0.0.0.0:${PORT}"
exec python3 -m http.server "$PORT" --bind 0.0.0.0 --directory docs
