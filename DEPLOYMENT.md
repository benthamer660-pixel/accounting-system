# 🚀 دليل الاستضافة الشامل
## Comprehensive Deployment Guide

دليل شامل لاستضافة نظام المحاسبة على منصات مختلفة مع جميع التكوينات المطلوبة.

## 📋 متطلبات الاستضافة | Hosting Requirements

### الحد الأدنى | Minimum Requirements
- **Node.js**: 18.0.0+
- **RAM**: 512MB
- **Storage**: 1GB
- **Bandwidth**: 10GB/month

### الموصى به | Recommended
- **Node.js**: 20.0.0+
- **RAM**: 2GB
- **Storage**: 5GB
- **Bandwidth**: 100GB/month

## 🌐 خيارات الاستضافة | Hosting Options

### 1. 🔥 Vercel (الأسهل والأسرع | Easiest & Fastest)

#### التثبيت السريع | Quick Setup
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر التطبيق
vercel --prod
```

#### التكوين المتقدم | Advanced Configuration
```bash
# استخدام ملف vercel.json الموجود
vercel --prod --local-config vercel.json
```

#### المتغيرات البيئية | Environment Variables
```bash
# إضافة متغيرات البيئة
vercel env add NEXT_PUBLIC_APP_NAME
vercel env add NEXT_PUBLIC_DEFAULT_LANGUAGE
vercel env add NEXT_PUBLIC_DEFAULT_CURRENCY
```

### 2. 🌊 Netlify

#### التثبيت السريع | Quick Setup
```bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# تسجيل الدخول
netlify login

# بناء ونشر التطبيق
npm run build:static
netlify deploy --prod --dir=out
```

#### التكوين التلقائي | Automatic Configuration
```bash
# استخدام ملف netlify.toml الموجود
netlify deploy --prod
```

### 3. 🐳 Docker (للخوادم المخصصة | For Custom Servers)

#### بناء وتشغيل محلي | Local Build & Run
```bash
# بناء الصورة
docker build -t accounting-system .

# تشغيل الحاوية
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APP_NAME="نظام المحاسبة" \
  -e NEXT_PUBLIC_DEFAULT_LANGUAGE="ar" \
  accounting-system
```

#### استخدام Docker Compose
```bash
# تشغيل جميع الخدمات
docker-compose up -d

# مراقبة السجلات
docker-compose logs -f

# إيقاف الخدمات
docker-compose down
```

### 4. ☁️ AWS (Amazon Web Services)

#### EC2 Instance
```bash
# الاتصال بالخادم
ssh -i your-key.pem ubuntu@your-ec2-ip

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# استنساخ ونشر المشروع
git clone your-repo-url
cd accounting-system
npm install
npm run build
npm start
```

#### S3 + CloudFront (Static)
```bash
# بناء الملفات الثابتة
npm run build:static

# رفع إلى S3
aws s3 sync out/ s3://your-bucket-name --delete

# إنشاء CloudFront Distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### 5. 🔵 DigitalOcean

#### Droplet Setup
```bash
# إنشاء Droplet جديد
doctl compute droplet create accounting-system \
  --size s-1vcpu-1gb \
  --image ubuntu-22-04-x64 \
  --region nyc1

# تثبيت التطبيق
ssh root@your-droplet-ip
# ... نفس خطوات EC2
```

#### App Platform
```bash
# استخدام ملف .do/app.yaml
doctl apps create --spec .do/app.yaml
```

## ⚙️ إعداد متغيرات البيئة | Environment Variables Setup

### للإنتاج | For Production
```env
# إعدادات أساسية
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production

# معلومات التطبيق
NEXT_PUBLIC_APP_NAME="نظام المحاسبة"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# إعدادات افتراضية
NEXT_PUBLIC_DEFAULT_LANGUAGE="ar"
NEXT_PUBLIC_DEFAULT_CURRENCY="ريال"
NEXT_PUBLIC_DEFAULT_CURRENCY_SYMBOL="ر.س"
NEXT_PUBLIC_DEFAULT_TAX_RATE="15"

# أمان
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### للتطوير | For Development
```env
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG_MODE="true"
NEXT_PUBLIC_SHOW_LOGS="true"
```

## 🔒 إعدادات الأمان | Security Configuration

### SSL/TLS Certificate
```bash
# استخدام Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Nginx Configuration
```nginx
# استخدام ملف nginx.conf الموجود
sudo cp nginx.conf /etc/nginx/sites-available/accounting-system
sudo ln -s /etc/nginx/sites-available/accounting-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Firewall Setup
```bash
# UFW (Ubuntu)
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## 📊 مراقبة الأداء | Performance Monitoring

### PM2 (للخوادم المخصصة)
```bash
# تثبيت PM2
npm install -g pm2

# تشغيل التطبيق
pm2 start npm --name "accounting-system" -- start

# حفظ التكوين
pm2 save
pm2 startup
```

### Health Checks
```bash
# إنشاء endpoint للفحص
curl -f http://localhost:3000/api/health || exit 1
```

## 🔄 التحديث والصيانة | Updates & Maintenance

### تحديث التطبيق | Application Updates
```bash
# سحب التحديثات
git pull origin main

# تثبيت التبعيات الجديدة
npm install

# بناء التطبيق
npm run build

# إعادة تشغيل الخدمة
pm2 restart accounting-system
```

### النسخ الاحتياطي | Backup
```bash
# نسخ احتياطي للبيانات
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# رفع للتخزين السحابي
aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/
```

## 🌍 إعداد النطاق | Domain Configuration

### DNS Settings
```
# A Record
@ -> your-server-ip
www -> your-server-ip

# CNAME (للـ CDN)
cdn -> your-cdn-domain.com
```

### Subdomain Setup
```
# للبيئات المختلفة
staging.your-domain.com -> staging-server-ip
api.your-domain.com -> api-server-ip
```

## 📱 PWA Configuration

### Service Worker
```javascript
// تمكين PWA
// الملف موجود في public/sw.js
```

### Manifest
```json
// ملف public/manifest.json
{
  "name": "نظام المحاسبة",
  "short_name": "محاسبة",
  "start_url": "/",
  "display": "standalone"
}
```

## 🧪 اختبار الاستضافة | Deployment Testing

### اختبارات محلية | Local Tests
```bash
# بناء الإنتاج محلياً
npm run build
npm start

# اختبار الأداء
npm run analyze
```

### اختبارات الإنتاج | Production Tests
```bash
# فحص SSL
curl -I https://your-domain.com

# فحص الأداء
lighthouse https://your-domain.com

# فحص الأمان
nmap -sV your-domain.com
```

## 🚨 استكشاف الأخطاء | Troubleshooting

### مشاكل شائعة | Common Issues

#### خطأ 404
```bash
# تحقق من تكوين الخادم
nginx -t
systemctl status nginx
```

#### بطء التحميل
```bash
# تحقق من ضغط الملفات
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
```

#### مشاكل SSL
```bash
# تجديد الشهادة
certbot renew --dry-run
```

### سجلات النظام | System Logs
```bash
# سجلات Nginx
tail -f /var/log/nginx/error.log

# سجلات التطبيق
pm2 logs accounting-system

# سجلات النظام
journalctl -u nginx -f
```

## 📞 الدعم | Support

### قنوات الدعم | Support Channels
- 📧 **البريد الإلكتروني**: support@accounting-system.com
- 💬 **الدردشة**: https://chat.accounting-system.com
- 📚 **التوثيق**: https://docs.accounting-system.com
- 🐛 **تقارير الأخطاء**: https://github.com/your-repo/issues

### موارد إضافية | Additional Resources
- 🎥 **فيديوهات تعليمية**: https://youtube.com/accounting-system
- 📖 **دليل المستخدم**: https://guide.accounting-system.com
- 🔧 **أدوات المطور**: https://tools.accounting-system.com

---

**🎉 تم إعداد دليل الاستضافة الشامل بنجاح!**

**🚀 اختر المنصة المناسبة لك وابدأ النشر!**

**🔒 لا تنس تطبيق إعدادات الأمان!**

**📊 راقب الأداء بانتظام!**
