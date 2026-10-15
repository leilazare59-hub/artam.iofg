# سایت شخصی آرتام حمیدی (artam.iofg)

سایت شخصی فارسی و راست‌چین + صفحهٔ دانلود و نصب بازی «جهان ماجراجویی» (فایل APK).

## آدرس سایت
- صفحهٔ اصلی: سایت شخصی (درباره من، نمونه‌کارها، مهارت‌ها، رمان‌ها، ارتباط، اخبار)
- صفحهٔ بازی: `game/` — دکمهٔ دانلود مستقیم فایل APK (قابل نصب به‌صورت PWA)

### لینک‌های در دسترس
| نوع | آدرس |
|---|---|
| لینک فوری عمومی (CDN) | https://cdn.jsdelivr.net/gh/leilazare59-hub/artam.iofg@arena/90cb42e2-artam-iofg/docs/index.html |
| صفحهٔ بازی (CDN) | https://cdn.jsdelivr.net/gh/leilazare59-hub/artam.iofg@arena/90cb42e2-artam-iofg/docs/game/index.html |
| آدرس رسمی (بعد از فعال‌سازی Pages) | https://leilazare59-hub.github.io/artam.iofg/ |

## ساختار مخزن
| پوشه | محتوا |
|---|---|
| `site/` | سورس صفحهٔ اصلی سایت شخصی (`index.html` + عکس پروفایل) |
| `game-app/` | سورس صفحهٔ دانلود بازی (React + Vite + Tailwind) |
| `docs/` | **خروجی ساخته‌شدهٔ سایت** — همین پوشه توسط GitHub Pages منتشر می‌شود (دستی ویرایش نکنید) |
| `uploads/` | فایل‌های اصلی آپلودشده (آرشیو، بدون تغییر) |
| `scripts/` | اسکریپت‌های بیلد و پیش‌نمایش |

## ساخت سایت
```bash
npm run build     # معادل: bash scripts/build.sh
npm run preview   # پیش‌نمایش محلی روی پورت 8080
```
اسکریپت بیلد: اول صفحهٔ بازی را با Vite بیلد می‌کند (`game-app/dist`)، سپس همراه صفحهٔ اصلی و عکس پروفایل داخل `docs/` مونتاژ می‌کند.

## انتشار
خروجی بیلد در پوشهٔ `docs/` است و همان پوشه منتشر می‌شود. بعد از هر تغییر:
```bash
npm run build
git add docs site game-app
git commit -m "به‌روزرسانی سایت"
git push
```

### فعال‌سازی GitHub Pages (یک بار، توسط صاحب مخزن)
توکن فعلی اتصال GitHub اجازهٔ فعال‌سازی Pages را ندارد؛ برای داشتن آدرس رسمی (`https://leilazare59-hub.github.io/artam.iofg/`) یکی از دو راه:
1. **ساده‌ترین راه:** در گیتهاب: `Settings → Pages → Build and deployment → Source: Deploy from a branch` سپس Branch را روی `main` (یا شاخهٔ جاری) و Folder را روی `/docs` بگذارید و Save کنید. از این به بعد با هر push، گیتهاب خودش `docs/` را منتشر می‌کند.
2. یا در ورک‌فلو `Deploy site to GitHub Pages` سورس دلخواه بماند؛ به محض فعال بودن Pages، ورک‌فلو با هر push روی `docs/` خودکار دیپلوی می‌کند.

## نکته‌ها
- اخبار صفحهٔ «اخبار و آپدیت‌ها» در `localStorage` مرورگر هر کاربر ذخیره می‌شود (برای انتشار عمومی خبرها باید ویرایش مستقیم `site/index.html` انجام شود).
- فایل بازی باید با نام `app-release.apk` در `game-app/public/` قرار گیرد تا در بیلد نهایی منتشر شود.
