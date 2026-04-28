# SQUADIO — Landing Website

> **PLAY TOGETHER. WIN TOGETHER.**

موقع الإعلان الرسمي لتطبيق **SQUADIO** — منصة ربط اللاعبين العرب.

---

## الملفات

| الملف | الوصف |
|-------|-------|
| `index.html` | الصفحة الرئيسية (Hero · المميزات · كيف يعمل · صور · FAQ · Waitlist) |
| `styles.css` | كامل التصميم (Dark mode · Yellow accent · RTL · Responsive) |
| `script.js` | Mobile menu · Toast notifications · Waitlist form |
| `privacy.html` | سياسة الخصوصية |
| `terms.html` | الشروط والأحكام |
| `404.html` | صفحة "غير موجود" |
| `manifest.webmanifest` | إعدادات PWA |
| `robots.txt` | ملف Robots |
| `sitemap.xml` | خريطة الموقع |
| `assets/` | الأيقونات والصور |

---

## التشغيل المحلي

### الأسرع — فتح مباشر
```bash
# فتح الملف مباشرة في المتصفح
open index.html       # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

### بسيرفر محلي (موصى به)
```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```
ثم افتح: `http://localhost:8000`

---

## النشر على GitHub Pages

1. ادفع الكود إلى الـ `main` branch.
2. اذهب إلى **Settings → Pages**.
3. تحت **Source** اختر `Deploy from a branch` ← `main` ← `/ (root)`.
4. اضغط **Save** — الموقع سيُنشر على:  
   `https://<username>.github.io/<repo>/`
5. **مهم:** بعد معرفة الرابط الحقيقي، استبدل `https://example.com/` في:
   - `index.html` (canonical + OG + structured data)
   - `privacy.html` (canonical)
   - `terms.html` (canonical)
   - `sitemap.xml`
   - `robots.txt`

---

## ربط Google Sheets (قائمة الانتظار)

### الخطوة 1 — إنشاء Google Sheet
1. افتح [Google Sheets](https://sheets.google.com) وأنشئ ملفًا جديدًا.
2. أضف عمودين في الصف الأول: `Email` | `Timestamp`

### الخطوة 2 — Apps Script
1. من القائمة: **Extensions → Apps Script**.
2. احذف الكود الافتراضي وضع هذا بدله:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.email, data.timestamp || new Date().toISOString()]);
  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. اضغط **Deploy → New deployment**.
4. اختر **Web app** — Execute as: **Me** — Who has access: **Anyone**.
5. انسخ الـ **Web App URL**.

### الخطوة 3 — ربط الـ URL
افتح `script.js` وابحث عن:
```javascript
const WAITLIST_ENDPOINT = "";
```
استبدله بـ:
```javascript
const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/YOUR_ID/exec";
```

---

## استبدال الأصول (Assets)

| الملف | المطلوب |
|-------|---------|
| `assets/favicon.png` | أيقونة 32×32 بكسل (PNG) |
| `assets/icon-192.png` | أيقونة 192×192 بكسل (PNG) |
| `assets/icon-512.png` | أيقونة 512×512 بكسل (PNG) |
| `assets/logo.jpg` | صورة الشعار (JPG أو PNG) |

> **ملاحظة:** الملفات الحالية في `assets/` هي placeholder بسيطة (مربعات بلون اللوجو).  
> استبدلها بالأصول الحقيقية دون تغيير أسماء الملفات.

---

## إضافة Screenshots حقيقية

في `index.html`، ابحث عن قسم `<section ... id="screens">` وأضف صور التطبيق داخل عناصر `.shot` كالتالي:

```html
<div class="shot">
  <img src="./assets/screen-1.jpg" alt="شاشة البحث عن تيم" loading="lazy" />
</div>
```

---

## التواصل والدعم

- المالك: **Ossama Elghariani**
- المنطقة: مصر والعالم العربي
- آخر تحديث: 2026-04-28