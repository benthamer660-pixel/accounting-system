# 🧮 نظام المحاسبة الشامل | Comprehensive Accounting System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)

نظام محاسبة متكامل ومتقدم مبني باستخدام Next.js و TypeScript مع دعم كامل للغة العربية والإنجليزية، جاهز للاستضافة على جميع المنصات.

A comprehensive and advanced accounting system built with Next.js and TypeScript with full Arabic and English language support, ready for deployment on all platforms.

## 🌟 الميزات الرئيسية

### 📊 لوحة التحكم
- نظرة عامة شاملة على الأداء المالي
- إحصائيات مباشرة للإيرادات والمصروفات والأرباح
- تنبيهات للمخزون المنخفض والفواتير المتأخرة
- رسوم بيانية تفاعلية للأداء

### 📦 إدارة المنتجات
- إضافة وتعديل وحذف المنتجات
- تصنيف المنتجات حسب الفئات
- تتبع أكواد المنتجات (SKU)
- إدارة الأسعار والكميات
- تنبيهات المخزون المنخفض

### 👥 إدارة العملاء
- قاعدة بيانات شاملة للعملاء
- تتبع معلومات الاتصال والعناوين
- الأرقام الضريبية للشركات
- تاريخ المعاملات مع كل عميل

### 🧾 نظام الفواتير
- إنشاء فواتير احترافية
- حالات متعددة للفواتير (مسودة، مرسلة، مدفوعة، متأخرة)
- حساب تلقائي للضرائب والخصومات
- طباعة وتصدير الفواتير بصيغة PDF
- ترقيم تلقائي للفواتير

### 📋 إدارة المخزون
- تتبع مستويات المخزون في الوقت الفعلي
- تحديد الحد الأدنى والأقصى للمخزون
- تنبيهات نفاد المخزون
- تتبع حركات المخزون (دخول وخروج)
- تقييم قيمة المخزون

### 💰 إدارة المصروفات
- تسجيل وتصنيف المصروفات
- فئات متعددة للمصروفات (رواتب، إيجارات، مرافق، إلخ)
- رفع إيصالات المصروفات
- تقارير مفصلة للمصروفات

### 📈 التقارير المالية
- تقارير الأرباح والخسائر
- تقارير المبيعات والمشتريات
- تقارير الفواتير اليومية والشهرية
- إحصائيات متقدمة ومؤشرات الأداء
- تصدير التقارير بصيغة JSON

## 🚀 جاهز للاستضافة | Ready for Hosting

### 🌐 منصات الاستضافة المدعومة | Supported Hosting Platforms
- ✅ **Vercel** (موصى به | Recommended)
- ✅ **Netlify** (مجاني | Free)
- ✅ **Docker** (أي خادم | Any Server)
- ✅ **AWS/Azure/Google Cloud**
- ✅ **DigitalOcean/Linode**
- ✅ **GitHub Pages** (استضافة ثابتة | Static)

### ⚡ نشر سريع | Quick Deployment

#### Vercel (الأسرع | Fastest)
```bash
npm i -g vercel
vercel login
vercel --prod
```

#### Netlify (مجاني | Free)
```bash
npm i -g netlify-cli
netlify login
npm run build:static
netlify deploy --prod --dir=out
```

#### Docker (مرن | Flexible)
```bash
docker build -t accounting-system .
docker run -p 3000:3000 accounting-system
```
- تحليل الأداء الشهري والسنوي
- تقارير أفضل المنتجات والعملاء
- تصدير التقارير بصيغ متعددة

### ⚙️ الإعدادات
- إعدادات الشركة والمعلومات الأساسية
- إعدادات العملة ومعدل الضريبة
- تخصيص اللغة والمظهر
- إدارة النسخ الاحتياطية

## 🛠️ التقنيات المستخدمة | Tech Stack

### 🎯 Frontend
- **Next.js 15** with App Router
- **React 19** with latest features
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling

### 🎨 UI & UX
- **Lucide React** icons
- **Responsive Design** (mobile-first)
- **RTL/LTR Support** (Arabic/English)
- **PWA Support** (installable app)

### 📊 Data & Forms
- **React Context API** for state management
- **React Hook Form + Zod** validation
- **Recharts** for data visualization
- **jsPDF + html2canvas** for PDF generation
- **date-fns** for date handling

### 🔧 Development & Deployment
- **ESLint + TypeScript** for code quality
- **Docker** containerization ready
- **GitHub Actions** CI/CD pipeline
- **Vercel/Netlify** deployment ready
- **SEO** optimized with sitemap

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js 18+
- npm أو yarn أو pnpm

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd accounting-system
```

2. **تثبيت التبعيات**
```bash
npm install
# أو
yarn install
# أو
pnpm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.local.example .env.local
```

قم بتحديث الملف `.env.local` بالقيم الصحيحة:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_NAME="نظام المحاسبة"
NEXT_PUBLIC_COMPANY_NAME="شركتك"
NEXT_PUBLIC_CURRENCY="ريال"
NEXT_PUBLIC_CURRENCY_SYMBOL="ر.س"
```

4. **إعداد قاعدة البيانات**
- أنشئ مشروع جديد في [Supabase](https://supabase.com)
- نفذ السكريبت الموجود في `database/schema.sql` في محرر SQL في Supabase

5. **تشغيل المشروع**
```bash
npm run dev
# أو
yarn dev
# أو
pnpm dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح لرؤية النتيجة.

## 🌐 الاستضافة والنشر | Hosting & Deployment

### 🚀 نشر سريع | Quick Deploy

#### 1. Vercel (موصى به | Recommended)
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول والنشر
vercel login
vercel --prod
```

#### 2. Netlify (مجاني | Free)
```bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# بناء ونشر
netlify login
npm run build:static
netlify deploy --prod --dir=out
```

#### 3. Docker (أي خادم | Any Server)
```bash
# بناء الصورة
docker build -t accounting-system .

# تشغيل الحاوية
docker run -p 3000:3000 accounting-system

# أو استخدام Docker Compose
docker-compose up -d
```

### 📱 ميزات PWA | PWA Features
- 📲 قابل للتثبيت على الهاتف المحمول
- 🔄 يعمل بدون إنترنت (جزئياً)
- 🎨 أيقونات وشاشة بداية مخصصة
- ⚡ اختصارات سريعة للصفحات الرئيسية

## 📁 هيكل المشروع

```
accounting-system/
├── src/
│   ├── app/                    # صفحات Next.js App Router
│   │   ├── dashboard/          # لوحة التحكم
│   │   ├── products/           # إدارة المنتجات
│   │   ├── customers/          # إدارة العملاء
│   │   ├── invoices/           # إدارة الفواتير
│   │   ├── inventory/          # إدارة المخزون
│   │   ├── expenses/           # إدارة المصروفات
│   │   ├── reports/            # التقارير المالية
│   │   └── settings/           # الإعدادات
│   ├── components/             # المكونات المشتركة
│   │   ├── ui/                 # مكونات واجهة المستخدم
│   │   ├── layout/             # مكونات التخطيط
│   │   └── dashboard/          # مكونات لوحة التحكم
│   ├── lib/                    # المكتبات والأدوات المساعدة
│   │   ├── supabase.ts         # إعداد Supabase
│   │   └── utils.ts            # دوال مساعدة
│   └── types/                  # تعريفات TypeScript
├── database/                   # سكريبتات قاعدة البيانات
│   └── schema.sql              # هيكل قاعدة البيانات
├── public/                     # الملفات العامة
└── docs/                       # الوثائق
```

## 🔧 التطوير

### إضافة ميزة جديدة
1. أنشئ المكونات المطلوبة في `src/components/`
2. أضف الصفحات في `src/app/`
3. حدث أنواع البيانات في `src/types/`
4. اختبر الميزة محلياً

### قواعد الكود
- استخدم TypeScript لجميع الملفات
- اتبع معايير ESLint المحددة
- استخدم Tailwind CSS للتنسيق
- اكتب تعليقات باللغة العربية للوضوح

## 📚 الوثائق

- [دليل المستخدم](docs/user-guide.md)
- [دليل المطور](docs/developer-guide.md)
- [API Reference](docs/api-reference.md)

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) قبل البدء.

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم والمساعدة | Support & Help

### 🆘 الحصول على المساعدة | Getting Help
- 🐛 **تقارير الأخطاء**: [GitHub Issues](https://github.com/your-username/accounting-system/issues)
- 💬 **الأسئلة والمناقشات**: [GitHub Discussions](https://github.com/your-username/accounting-system/discussions)
- 📚 **التوثيق**: راجع ملفات `DEPLOYMENT.md` و `HOSTING-READY.md`
- 📧 **البريد الإلكتروني**: support@accounting-system.com

### 📚 موارد إضافية | Additional Resources
- 🎥 **فيديوهات تعليمية**: قريباً
- 📖 **دليل المستخدم**: قريباً
- 🔧 **API Documentation**: قريباً

## 🚀 الحالة والإحصائيات | Status & Stats

![GitHub stars](https://img.shields.io/github/stars/your-username/accounting-system?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/accounting-system?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/accounting-system)
![GitHub license](https://img.shields.io/github/license/your-username/accounting-system)

### 🎯 إحصائيات المشروع | Project Stats
- ✅ **100%** جاهز للاستضافة
- ✅ **8** صفحات رئيسية مكتملة
- ✅ **50+** مكون React
- ✅ **2** لغات مدعومة (عربي/إنجليزي)
- ✅ **4** منصات استضافة مدعومة

## 🔄 خارطة الطريق | Roadmap

### الإصدار v1.1.0 (قريباً)
- [ ] 🔐 نظام المصادقة والتسجيل
- [ ] 💾 تكامل قاعدة البيانات
- [ ] 📊 تقارير متقدمة مع الرسوم البيانية
- [ ] 🔔 نظام الإشعارات

### الإصدار v1.2.0 (المستقبل)
- [ ] 📱 تطبيق الهاتف المحمول
- [ ] 🏦 تكامل مع البنوك
- [ ] 🤖 تقارير ذكية مع AI
- [ ] 🌐 تكامل مع منصات التجارة الإلكترونية

## 🏆 الشكر والتقدير | Acknowledgments

شكر خاص لجميع المساهمين والمطورين الذين ساعدوا في تطوير هذا النظام.

Special thanks to all contributors and developers who helped build this system.

---

## 🎉 جاهز للاستخدام | Ready to Use

**🚀 النظام جاهز للاستضافة والاستخدام فوراً!**

**🌍 ابدأ النشر الآن واجعل نظام المحاسبة متاحاً للعالم!**

---

<div align="center">

**تم تطوير هذا النظام بـ ❤️ لخدمة الأعمال التجارية العربية**

**Built with ❤️ to serve Arabic businesses**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/accounting-system)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/accounting-system)

</div>
