# ⚡ نشر سريع في 5 دقائق
## Quick Deploy in 5 Minutes

## 🎯 الطريقة الأسرع | Fastest Method

### 🔥 Vercel (موصى به | Recommended)

#### الخطوة 1: إنشاء حساب
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط "Sign Up"
3. اختر "Continue with GitHub"

#### الخطوة 2: رفع المشروع
1. **إنشاء Repository على GitHub**:
   - اذهب إلى [github.com](https://github.com)
   - اضغط "New Repository"
   - اسم Repository: `accounting-system`
   - اضغط "Create repository"

2. **رفع الكود**:
   ```bash
   # في مجلد المشروع
   git remote add origin https://github.com/YOUR_USERNAME/accounting-system.git
   git branch -M main
   git push -u origin main
   ```

#### الخطوة 3: النشر على Vercel
1. في Vercel، اضغط "New Project"
2. اختر repository: `accounting-system`
3. اضغط "Deploy"
4. **انتظر 2-3 دقائق** ✨

#### الخطوة 4: النتيجة
🎉 **تم! موقعك جاهز على رابط مثل**:
```
https://accounting-system-xyz.vercel.app
```

---

## 🌊 البديل: Netlify (مجاني)

#### الخطوة 1: بناء الملفات الثابتة
```bash
npm run build:static
```

#### الخطوة 2: رفع مجلد `out/`
1. اذهب إلى [netlify.com](https://netlify.com)
2. اسحب مجلد `out/` إلى الصفحة
3. **انتظر دقيقة واحدة** ✨

#### النتيجة
🎉 **تم! موقعك جاهز على رابط مثل**:
```
https://amazing-site-xyz.netlify.app
```

---

## 🐳 للخوادم المخصصة: Docker

```bash
# بناء الصورة
docker build -t accounting-system .

# تشغيل الحاوية
docker run -p 3000:3000 accounting-system
```

**النتيجة**: الموقع متاح على `http://localhost:3000`

---

## ⚙️ إعدادات اختيارية

### متغيرات البيئة (في Vercel/Netlify):
```
NEXT_PUBLIC_APP_NAME = نظام المحاسبة
NEXT_PUBLIC_DEFAULT_LANGUAGE = ar
NEXT_PUBLIC_DEFAULT_CURRENCY = ريال
NEXT_PUBLIC_BASE_URL = https://your-domain.com
```

### نطاق مخصص:
1. في إعدادات المشروع
2. اضغط "Domains"
3. أضف نطاقك المخصص

---

## 🚨 استكشاف الأخطاء

### خطأ في البناء:
```bash
# اختبر محلياً
npm run build
npm start
```

### خطأ في Git:
```bash
# تأكد من وجود remote
git remote -v

# إضافة remote إذا لم يكن موجود
git remote add origin https://github.com/YOUR_USERNAME/accounting-system.git
```

### خطأ في النشر:
- تأكد من أن جميع الملفات موجودة
- تحقق من `package.json` و `next.config.js`
- راجع سجلات البناء في منصة الاستضافة

---

## 🎊 تهانينا!

**🌍 نظام المحاسبة أصبح متاحاً للعالم!**

### ما حصلت عليه:
✅ موقع مباشر على الإنترنت
✅ SSL مجاني وأمان عالي
✅ أداء ممتاز مع CDN
✅ نشر تلقائي عند التحديث
✅ نظام محاسبة احترافي كامل

### شارك موقعك:
📱 **للهاتف**: يمكن تثبيته كتطبيق
💻 **للكمبيوتر**: يعمل على جميع المتصفحات
🌍 **للعالم**: شارك الرابط مع الآخرين

---

**🚀 استمتع بنظام المحاسبة الاحترافي!**

**📞 للدعم**: راجع ملف `DEPLOYMENT.md` للتفاصيل الكاملة
