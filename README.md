# 🧮 نظام المحاسبة الشامل | Comprehensive Accounting System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

نظام محاسبة متكامل مبني باستخدام Next.js و TypeScript مع دعم كامل للغة العربية والإنجليزية.

A comprehensive accounting system built with Next.js and TypeScript with full Arabic and English language support.

## ✨ الميزات الرئيسية | Key Features

### 🏢 إدارة شاملة | Complete Management
- **📊 لوحة التحكم**: نظرة عامة شاملة مع إحصائيات مباشرة
- **👥 العملاء**: إدارة قاعدة بيانات العملاء والمعلومات
- **📦 المنتجات**: كتالوج شامل مع الأسعار والتصنيفات
- **📋 المخزون**: تتبع المخزون مع تنبيهات النفاد
- **🧾 الفواتير**: إنشاء فواتير احترافية مع الضرائب
- **💰 المصروفات**: تسجيل وتصنيف المصروفات
- **📈 التقارير**: تقارير مالية مفصلة وإحصائيات

### 🌍 دعم متعدد اللغات | Multi-language Support
- **العربية**: دعم كامل مع اتجاه RTL
- **الإنجليزية**: واجهة كاملة مع اتجاه LTR
- **تبديل فوري**: تغيير اللغة بنقرة واحدة

### 📱 تصميم متجاوب | Responsive Design
- محسن للهواتف المحمولة والأجهزة اللوحية
- واجهة حديثة ومتكيفة مع جميع الشاشات
- تجربة مستخدم سلسة ومتقدمة

## 🚀 التقنيات المستخدمة | Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **PDF Generation**: jsPDF + html2canvas

## 🛠️ التثبيت والتشغيل | Installation & Setup

### 1. استنساخ المشروع | Clone Repository
```bash
git clone https://github.com/benthamer660-pixel/accounting-system.git
cd accounting-system
```

### 2. تثبيت التبعيات | Install Dependencies
```bash
npm install
# أو
yarn install
```

### 3. إعداد متغيرات البيئة | Environment Setup
```bash
cp .env.example .env.local
# تحرير الملف وإضافة القيم المطلوبة
```

### 4. تشغيل التطبيق | Run Application
```bash
npm run dev
# أو
yarn dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح لرؤية النتيجة.

## 🌐 النشر والاستضافة | Deployment & Hosting

### Vercel (موصى به)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build:static
# ارفع مجلد out/ إلى netlify.com
```

### Docker
```bash
docker build -t accounting-system .
docker run -p 3000:3000 accounting-system
```

## 📁 هيكل المشروع | Project Structure

```
accounting-system/
├── src/
│   ├── app/                    # صفحات Next.js App Router
│   ├── components/             # المكونات المعاد استخدامها
│   ├── contexts/               # إدارة الحالة
│   ├── hooks/                  # الخطافات المخصصة
│   └── lib/                    # المكتبات والأدوات المساعدة
├── public/                     # الملفات الثابتة
├── Dockerfile                  # تكوين Docker
├── vercel.json                 # تكوين Vercel
└── netlify.toml               # تكوين Netlify
```

## 📱 ميزات PWA | PWA Features

- 📲 قابل للتثبيت على الهاتف المحمول
- 🔄 يعمل بدون إنترنت (جزئياً)
- 🎨 أيقونات وشاشة بداية مخصصة
- ⚡ اختصارات سريعة للصفحات الرئيسية

## 📞 الدعم | Support

- 🐛 **تقارير الأخطاء**: [GitHub Issues](https://github.com/benthamer660-pixel/accounting-system/issues)
- 💬 **الأسئلة**: [GitHub Discussions](https://github.com/benthamer660-pixel/accounting-system/discussions)
- 📚 **التوثيق**: راجع ملفات `DEPLOYMENT.md` و `QUICK-DEPLOY.md`

## 📄 الترخيص | License

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**تم تطوير هذا النظام بـ ❤️ لخدمة الأعمال التجارية العربية**

**Built with ❤️ to serve Arabic businesses**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/benthamer660-pixel/accounting-system)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/benthamer660-pixel/accounting-system)

</div>
