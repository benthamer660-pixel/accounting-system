# 🌐 نظام إدارة الحالة العالمي

## 🎯 الهدف
تم إنشاء نظام إدارة حالة عالمي باستخدام React Context لضمان مشاركة البيانات عبر النظام كاملاً.

## 🏗️ البنية التقنية

### 📦 المكونات الأساسية:

#### 1. **ProductsContext** (`/contexts/products-context.tsx`)
- إدارة جميع المنتجات في النظام
- حفظ البيانات في `localStorage`
- وظائف CRUD كاملة

#### 2. **CustomersContext** (`/contexts/customers-context.tsx`)
- إدارة جميع العملاء في النظام
- حفظ البيانات في `localStorage`
- وظائف CRUD كاملة

#### 3. **InvoicesContext** (`/contexts/invoices-context.tsx`)
- إدارة جميع الفواتير في النظام
- حفظ البيانات في `localStorage`
- وظائف CRUD كاملة

#### 4. **AppContextProvider** (`/contexts/app-context.tsx`)
- مزود عام يجمع جميع الـ Contexts
- نقطة دخول واحدة للبيانات

## 🔧 الوظائف المتاحة

### 📦 المنتجات:
```typescript
const {
  products,           // جميع المنتجات
  addProduct,         // إضافة منتج جديد
  updateProduct,      // تحديث منتج
  deleteProduct,      // حذف منتج
  getProduct,         // الحصول على منتج بالمعرف
  getProductsByCategory, // المنتجات حسب الفئة
  getLowStockProducts,   // المنتجات ذات المخزون المنخفض
  getTotalProductsValue, // إجمالي قيمة المنتجات
  isLoading          // حالة التحميل
} = useProducts()
```

### 👥 العملاء:
```typescript
const {
  customers,          // جميع العملاء
  addCustomer,        // إضافة عميل جديد
  updateCustomer,     // تحديث عميل
  deleteCustomer,     // حذف عميل
  getCustomer,        // الحصول على عميل بالمعرف
  getCustomersBySearch, // البحث في العملاء
  getTotalCustomers,    // إجمالي عدد العملاء
  getCustomersWithEmail, // العملاء الذين لديهم بريد
  getCustomersWithPhone, // العملاء الذين لديهم هاتف
  isLoading          // حالة التحميل
} = useCustomers()
```

### 🧾 الفواتير:
```typescript
const {
  invoices,           // جميع الفواتير
  addInvoice,         // إضافة فاتورة جديدة
  updateInvoice,      // تحديث فاتورة
  deleteInvoice,      // حذف فاتورة
  getInvoice,         // الحصول على فاتورة بالمعرف
  getInvoicesByCustomer, // فواتير عميل معين
  getInvoicesByStatus,   // الفواتير حسب الحالة
  getTotalRevenue,       // إجمالي الإيرادات
  getPaidAmount,         // المبلغ المدفوع
  getPendingAmount,      // المبلغ المعلق
  getOverdueAmount,      // المبلغ المتأخر
  getTotalInvoices,      // إجمالي عدد الفواتير
  isLoading          // حالة التحميل
} = useInvoices()
```

## 💾 حفظ البيانات

### 🔄 localStorage:
- **تلقائي**: البيانات تُحفظ تلقائياً عند أي تغيير
- **استمرارية**: البيانات تبقى حتى بعد إغلاق المتصفح
- **أمان**: البيانات محلية ولا تُرسل للخادم

### 📊 مفاتيح التخزين:
- `accounting-products`: المنتجات
- `accounting-customers`: العملاء
- `accounting-invoices`: الفواتير

## 🎯 الميزات الجديدة

### ✅ إضافة عالمية:
- **المنتج**: يظهر فوراً في جميع الصفحات
- **العميل**: متاح فوراً في نماذج الفواتير
- **الفاتورة**: تُحدث الإحصائيات فوراً

### 📈 إحصائيات حية:
- **لوحة التحكم**: تُحدث تلقائياً
- **التقارير**: بيانات حقيقية
- **المؤشرات**: دقيقة ومحدثة

### 🔄 تزامن البيانات:
- **فوري**: التغييرات تظهر فوراً
- **متسق**: نفس البيانات في كل مكان
- **موثوق**: لا فقدان للبيانات

## 🚀 كيفية الاستخدام

### 1. **إضافة منتج**:
```typescript
// في أي مكان في التطبيق
const { addProduct } = useProducts()

const newProduct = {
  name: 'منتج جديد',
  price: 100,
  quantity: 50,
  category: 'إلكترونيات'
}

addProduct(newProduct)
// المنتج سيظهر فوراً في جميع الصفحات
```

### 2. **إضافة عميل**:
```typescript
const { addCustomer } = useCustomers()

const newCustomer = {
  name: 'عميل جديد',
  email: 'customer@example.com',
  phone: '+966501234567'
}

addCustomer(newCustomer)
// العميل سيكون متاحاً فوراً في نماذج الفواتير
```

### 3. **إنشاء فاتورة**:
```typescript
const { addInvoice } = useInvoices()

const newInvoice = {
  customer_id: '1',
  customer_name: 'اسم العميل',
  items: [...],
  total: 1000,
  status: 'draft'
}

addInvoice(newInvoice)
// الفاتورة ستُحدث الإحصائيات فوراً
```

## 🎨 التكامل مع الواجهة

### 📱 النماذج:
- **ProductForm**: يستخدم `addProduct`
- **CustomerForm**: يستخدم `addCustomer`
- **InvoiceForm**: يستخدم `addInvoice` + بيانات العملاء والمنتجات

### 📊 الصفحات:
- **Dashboard**: إحصائيات حية من جميع الـ Contexts
- **Products**: قائمة المنتجات + إضافة جديد
- **Customers**: قائمة العملاء + إضافة جديد
- **Invoices**: قائمة الفواتير + إنشاء جديد

## 🔮 التطوير المستقبلي

### 🌐 قاعدة البيانات:
- استبدال `localStorage` بـ API حقيقي
- مزامنة مع الخادم
- نسخ احتياطية

### 🔐 الأمان:
- تشفير البيانات المحلية
- مصادقة المستخدمين
- صلاحيات الوصول

### ⚡ الأداء:
- تحسين الذاكرة
- تحميل تدريجي
- تخزين مؤقت ذكي

---

**النظام الآن يعمل بشكل متكامل ومتزامن! 🎉**
