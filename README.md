# سایت شخصی آرتام حمیدی (artam.iofg)

سایت شخصی فارسی و راست‌چین با دکمهٔ دانلود مستقیم بازی «جهان ماجراجویی» (فایل APK) — نسخهٔ جدید (جایگزین سایت قبلی).

## آدرس سایت
| نوع | آدرس |
|---|---|
| پیش‌نمایش زندهٔ Arena | دکمهٔ LIVE PREVIEW (پورت 8080) |
| آدرس رسمی (بعد از فعال‌سازی Pages) | https://leilazare59-hub.github.io/artam.iofg/ |

> ⚠️ لینک‌های CDN مانند jsDelivr یا raw گیت‌هاب فایل HTML را به‌صورت متن ساده (text/plain) می‌فرستند و سایت با آن‌ها «اجرا» نمی‌شود؛ تنها راه داشتن لینک عمومی واقعی، فعال‌سازی GitHub Pages است (پایین همین صفحه).

## ساختار مخزن
| پوشه | محتوا |
|---|---|
| `app/` | سورس سایت (React + Vite + Tailwind) + `public/app-release.apk` فایل بازی |
| `docs/` | **خروجی ساخته‌شدهٔ سایت** — همین پوشه منتشر می‌شود (دستی ویرایش نکنید) |
| `uploads/` | فایل‌های اصلی آپلودشدهٔ اولیه (آرشیو) |
| `scripts/` | اسکریپت‌های بیلد و پیش‌نمایش |

## ساخت سایت
```bash
npm run build     # معادل: bash scripts/build.sh
npm run preview   # پیش‌نمایش محلی روی پورت 8080
```
اسکریپت بیلد، پروژهٔ `app/` را با Vite بیلد می‌کند و خروجی را در `docs/` می‌گذارد.

## تعویض فایل بازی
فایل APK جدید را با نام `app-release.apk` در `app/public/` جایگزین کنید، سپس `npm run build` و commit/push.

## انتشار
خروجی بیلد در `docs/` است و همان پوشه منتشر می‌شود:
```bash
npm run build
git add docs app
git commit -m "به‌روزرسانی سایت"
git push
```

### فعال‌سازی GitHub Pages (یک بار، توسط صاحب مخزن)
توکن اتصال GitHub اجازهٔ فعال‌سازی Pages را ندارد؛ برای آدرس رسمی یکی از دو راه:
1. `Settings → Pages → Build and deployment → Source: Deploy from a branch` سپس Branch (شاخهٔ جاری یا `main`) و Folder `/docs` → Save. از بعد هر push خودکار منتشر می‌شود.
2. یا سورس را **GitHub Actions** بگذارید؛ ورک‌فلو `Deploy site to GitHub Pages` با هر push روی `docs/` خودکار دیپلوی می‌کند.
