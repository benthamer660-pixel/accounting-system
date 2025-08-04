# 🚀 دليل رفع المشروع على GitHub
## GitHub Repository Setup Guide

## 📋 الخطوات المطلوبة | Required Steps

### 🔧 الخطوة 1: إنشاء Repository على GitHub

1. **اذهب إلى GitHub**: [github.com](https://github.com)
2. **سجل الدخول** أو أنشئ حساب جديد
3. **اضغط على "New Repository"** أو الزر الأخضر "+"
4. **املأ المعلومات**:
   ```
   Repository name: accounting-system
   Description: 🧮 نظام محاسبة شامل | Comprehensive Accounting System
   ✅ Public (للاستضافة المجانية)
   ❌ Add a README file (لدينا README جاهز)
   ❌ Add .gitignore (لدينا .gitignore جاهز)
   ❌ Choose a license (لدينا LICENSE جاهز)
   ```
5. **اضغط "Create repository"**

### 🔗 الخطوة 2: ربط المشروع المحلي بـ GitHub

افتح Terminal/Command Prompt في مجلد المشروع وشغل:

```bash
# إضافة remote origin (استبدل YOUR_USERNAME باسم المستخدم)
git remote add origin https://github.com/YOUR_USERNAME/accounting-system.git

# تحديد الفرع الرئيسي
git branch -M main

# رفع الكود إلى GitHub
git push -u origin main
```

### 🎯 الخطوة 3: التحقق من الرفع

1. **اذهب إلى repository** على GitHub
2. **تأكد من وجود جميع الملفات**
3. **تحقق من README** - يجب أن يظهر بشكل جميل

## 🌐 الخطوة 4: النشر التلقائي (اختياري)

### 🔥 Vercel (الأسرع)
1. **اذهب إلى**: [vercel.com](https://vercel.com)
2. **سجل الدخول** باستخدام GitHub
3. **اضغط "New Project"**
4. **اختر repository**: `accounting-system`
5. **اضغط "Deploy"** - سيتم النشر تلقائياً!

### 🌊 Netlify (مجاني)
1. **اذهب إلى**: [netlify.com](https://netlify.com)
2. **سجل الدخول** باستخدام GitHub
3. **اضغط "New site from Git"**
4. **اختر GitHub** واختر repository
5. **إعدادات البناء**:
   ```
   Build command: npm run build:static
   Publish directory: out
   ```
6. **اضغط "Deploy site"**

## ⚙️ إعداد متغيرات البيئة للاستضافة

### في Vercel:
1. **اذهب إلى Project Settings**
2. **اضغط "Environment Variables"**
3. **أضف المتغيرات**:
   ```
   NEXT_PUBLIC_APP_NAME = نظام المحاسبة
   NEXT_PUBLIC_DEFAULT_LANGUAGE = ar
   NEXT_PUBLIC_DEFAULT_CURRENCY = ريال
   NEXT_PUBLIC_DEFAULT_CURRENCY_SYMBOL = ر.س
   NEXT_PUBLIC_DEFAULT_TAX_RATE = 15
   ```

### في Netlify:
1. **اذهب إلى Site Settings**
2. **اضغط "Environment variables"**
3. **أضف نفس المتغيرات** كما في Vercel

## 🔄 تحديث المشروع مستقبلاً

```bash
# إضافة التغييرات
git add .

# إنشاء commit
git commit -m "وصف التحديث"

# رفع التحديثات
git push origin main
```

**النشر سيتم تلقائياً** على Vercel/Netlify عند كل push!

## 🎊 النتيجة النهائية

بعد اتباع هذه الخطوات ستحصل على:

✅ **Repository على GitHub** مع جميع الملفات
✅ **موقع مباشر** على الإنترنت
✅ **رابط مشاركة** للعالم
✅ **نشر تلقائي** عند التحديث
✅ **SSL مجاني** وأمان عالي
✅ **أداء ممتاز** مع CDN عالمي

## 📞 في حالة المشاكل

### مشكلة في Git:
```bash
# إعادة تهيئة Git
rm -rf .git
git init
git add .
git commit -m "Initial commit"
```

### مشكلة في الرفع:
```bash
# فرض الرفع (احذر: يحذف التاريخ)
git push -f origin main
```

### مشكلة في البناء:
```bash
# اختبار البناء محلياً
npm run build
npm run build:static
```

## 🔗 روابط مفيدة

- **GitHub**: [github.com](https://github.com)
- **Vercel**: [vercel.com](https://vercel.com)
- **Netlify**: [netlify.com](https://netlify.com)
- **Git Documentation**: [git-scm.com](https://git-scm.com)

---

**🎉 مبروك! نظام المحاسبة سيكون متاحاً للعالم قريباً!**

**🌍 شارك الرابط مع الآخرين واستمتع بنظام محاسبة احترافي!**
