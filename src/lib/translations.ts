// ملف الترجمات الشامل للنظام
export const translations = {
  ar: {
    // Navigation & Layout
    dashboard: 'لوحة التحكم',
    customers: 'العملاء',
    products: 'المنتجات',
    inventory: 'المخزون',
    invoices: 'الفواتير',
    expenses: 'المصروفات',
    reports: 'التقارير',
    settings: 'الإعدادات',
    
    // Dashboard
    totalRevenue: 'إجمالي الإيرادات',
    totalExpenses: 'إجمالي المصروفات',
    totalProfit: 'إجمالي الربح',
    totalInvoices: 'إجمالي الفواتير',
    paidInvoices: 'الفواتير المدفوعة',
    pendingInvoices: 'الفواتير المعلقة',
    totalProducts: 'إجمالي المنتجات',
    lowStockProducts: 'منتجات قليلة المخزون',
    totalCustomers: 'إجمالي العملاء',
    
    // Common Actions
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    search: 'بحث',
    filter: 'تصفية',
    export: 'تصدير',
    import: 'استيراد',
    print: 'طباعة',
    view: 'عرض',
    close: 'إغلاق',
    
    // Forms
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    address: 'العنوان',
    description: 'الوصف',
    amount: 'المبلغ',
    quantity: 'الكمية',
    price: 'السعر',
    date: 'التاريخ',
    category: 'الفئة',
    status: 'الحالة',
    
    // Customer Management
    addCustomer: 'إضافة عميل جديد',
    editCustomer: 'تعديل العميل',
    customerName: 'اسم العميل',
    customerEmail: 'بريد العميل الإلكتروني',
    customerPhone: 'هاتف العميل',
    customerAddress: 'عنوان العميل',
    customerInvoices: 'فواتير العميل',
    
    // Product Management
    addProduct: 'إضافة منتج جديد',
    editProduct: 'تعديل المنتج',
    productName: 'اسم المنتج',
    productDescription: 'وصف المنتج',
    productPrice: 'سعر المنتج',
    productStock: 'مخزون المنتج',
    productCategory: 'فئة المنتج',
    
    // Invoice Management
    addInvoice: 'إضافة فاتورة جديدة',
    editInvoice: 'تعديل الفاتورة',
    invoiceNumber: 'رقم الفاتورة',
    invoiceDate: 'تاريخ الفاتورة',
    dueDate: 'تاريخ الاستحقاق',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة',
    total: 'المجموع الكلي',
    
    // Invoice Status
    draft: 'مسودة',
    sent: 'مرسلة',
    paid: 'مدفوعة',
    overdue: 'متأخرة',
    cancelled: 'ملغية',
    
    // Expense Management
    addExpense: 'إضافة مصروف جديد',
    editExpense: 'تعديل المصروف',
    expenseTitle: 'عنوان المصروف',
    expenseDescription: 'وصف المصروف',
    expenseAmount: 'مبلغ المصروف',
    expenseCategory: 'فئة المصروف',
    expenseDate: 'تاريخ المصروف',
    thisMonthExpenses: 'مصروفات هذا الشهر',
    
    // Employee Management
    employeeManagement: 'إدارة الموظفين والرواتب',
    addEmployee: 'إضافة موظف جديد',
    employeeName: 'اسم الموظف',
    employeeEmail: 'بريد الموظف',
    employeePhone: 'هاتف الموظف',
    employeeAddress: 'عنوان الموظف',
    employeeDepartment: 'قسم الموظف',
    employeePosition: 'منصب الموظف',
    employeeSalary: 'راتب الموظف',
    hireDate: 'تاريخ التوظيف',
    totalEmployees: 'إجمالي الموظفين',
    totalSalaries: 'إجمالي الرواتب',
    
    // Reports
    expensesReport: 'تقرير المصروفات',
    dailyReport: 'تقرير يومي',
    weeklyReport: 'تقرير أسبوعي',
    monthlyReport: 'تقرير شهري',
    exportReport: 'تصدير التقرير',
    
    // Settings
    companySettings: 'إعدادات الشركة',
    financialSettings: 'الإعدادات المالية',
    userPreferences: 'تفضيلات المستخدم',
    systemInformation: 'معلومات النظام',
    companyName: 'اسم الشركة',
    companyAddress: 'عنوان الشركة',
    companyPhone: 'هاتف الشركة',
    companyEmail: 'بريد الشركة',
    taxNumber: 'الرقم الضريبي',
    currency: 'العملة',
    currencySymbol: 'رمز العملة',
    taxRate: 'معدل الضريبة',
    language: 'اللغة',
    
    // Notifications
    notifications: 'الإشعارات',
    emailNotifications: 'إشعارات البريد الإلكتروني',
    browserNotifications: 'إشعارات المتصفح',
    
    // System
    theme: 'المظهر',
    lightTheme: 'فاتح',
    darkTheme: 'داكن',
    autoTheme: 'تلقائي',
    backup: 'النسخ الاحتياطي',
    autoBackup: 'نسخ احتياطي تلقائي',
    createBackup: 'إنشاء نسخة احتياطية',
    restoreBackup: 'استعادة نسخة احتياطية',
    systemUpdate: 'تحديث النظام',
    clearCache: 'تنظيف ذاكرة التخزين المؤقت',
    resetSystem: 'إعادة تعيين النظام',
    
    // Messages
    saveSuccess: 'تم الحفظ بنجاح!',
    deleteSuccess: 'تم الحذف بنجاح!',
    updateSuccess: 'تم التحديث بنجاح!',
    addSuccess: 'تم الإضافة بنجاح!',
    errorOccurred: 'حدث خطأ!',
    confirmDelete: 'هل أنت متأكد من الحذف؟',
    noDataFound: 'لا توجد بيانات',
    loading: 'جاري التحميل...',
    saving: 'جاري الحفظ...',
    
    // Time & Date
    today: 'اليوم',
    yesterday: 'أمس',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    
    // Departments
    management: 'الإدارة',
    accounting: 'المحاسبة',
    sales: 'المبيعات',
    marketing: 'التسويق',
    hr: 'الموارد البشرية',
    it: 'تقنية المعلومات',
    customerService: 'خدمة العملاء',
    other: 'أخرى',
    
    // Positions
    generalManager: 'مدير عام',
    departmentManager: 'مدير قسم',
    accountant: 'محاسب',
    salesEmployee: 'موظف مبيعات',
    marketingEmployee: 'موظف تسويق',
    hrEmployee: 'موظف موارد بشرية',
    developer: 'مطور',
    customerServiceEmployee: 'موظف خدمة عملاء',

    // Additional
    currentLanguage: 'ar',

    // User Preferences
    userPreferences: 'تفضيلات المستخدم',
    systemInformation: 'معلومات النظام',

    // Invoice Settings
    invoiceSettings: 'إعدادات الفواتير',
    autoNumbering: 'ترقيم تلقائي للفواتير',
    autoNumberingDesc: 'إنشاء أرقام فواتير تلقائية متسلسلة',
    dueDateReminder: 'إرسال تذكير للفواتير المستحقة',
    dueDateReminderDesc: 'تذكيرات قبل تاريخ استحقاق الفواتير',
    autoSaveDrafts: 'حفظ تلقائي للمسودات',
    autoSaveDraftsDesc: 'حفظ الفواتير تلقائياً أثناء التحرير',

    // Notifications
    emailNotifications: 'إشعارات البريد الإلكتروني',
    emailNotificationsDesc: 'تلقي إشعارات عبر البريد الإلكتروني',
    browserNotifications: 'إشعارات المتصفح',
    browserNotificationsDesc: 'عرض إشعارات في المتصفح',

    // System
    systemTheme: 'مظهر النظام',
    systemThemeDesc: 'اختيار مظهر النظام',
    lightTheme: 'فاتح',
    darkTheme: 'داكن',
    autoTheme: 'تلقائي',
    autoBackup: 'نسخ احتياطي تلقائي',
    autoBackupDesc: 'إنشاء نسخ احتياطية تلقائية للبيانات',
    createBackup: 'إنشاء نسخة احتياطية',
    restoreBackup: 'استعادة نسخة احتياطية',
    resetSystem: 'إعادة تعيين النظام',

    // System Info
    version: 'الإصدار',
    lastUpdate: 'آخر تحديث',
    database: 'قاعدة البيانات',
    storage: 'التخزين'
  },
  
  en: {
    // Navigation & Layout
    dashboard: 'Dashboard',
    customers: 'Customers',
    products: 'Products',
    inventory: 'Inventory',
    invoices: 'Invoices',
    expenses: 'Expenses',
    reports: 'Reports',
    settings: 'Settings',
    
    // Dashboard
    totalRevenue: 'Total Revenue',
    totalExpenses: 'Total Expenses',
    totalProfit: 'Total Profit',
    totalInvoices: 'Total Invoices',
    paidInvoices: 'Paid Invoices',
    pendingInvoices: 'Pending Invoices',
    totalProducts: 'Total Products',
    lowStockProducts: 'Low Stock Products',
    totalCustomers: 'Total Customers',
    
    // Common Actions
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    print: 'Print',
    view: 'View',
    close: 'Close',
    
    // Forms
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    description: 'Description',
    amount: 'Amount',
    quantity: 'Quantity',
    price: 'Price',
    date: 'Date',
    category: 'Category',
    status: 'Status',
    
    // Customer Management
    addCustomer: 'Add New Customer',
    editCustomer: 'Edit Customer',
    customerName: 'Customer Name',
    customerEmail: 'Customer Email',
    customerPhone: 'Customer Phone',
    customerAddress: 'Customer Address',
    customerInvoices: 'Customer Invoices',
    
    // Product Management
    addProduct: 'Add New Product',
    editProduct: 'Edit Product',
    productName: 'Product Name',
    productDescription: 'Product Description',
    productPrice: 'Product Price',
    productStock: 'Product Stock',
    productCategory: 'Product Category',
    
    // Invoice Management
    addInvoice: 'Add New Invoice',
    editInvoice: 'Edit Invoice',
    invoiceNumber: 'Invoice Number',
    invoiceDate: 'Invoice Date',
    dueDate: 'Due Date',
    subtotal: 'Subtotal',
    tax: 'Tax',
    total: 'Total',
    
    // Invoice Status
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
    
    // Expense Management
    addExpense: 'Add New Expense',
    editExpense: 'Edit Expense',
    expenseTitle: 'Expense Title',
    expenseDescription: 'Expense Description',
    expenseAmount: 'Expense Amount',
    expenseCategory: 'Expense Category',
    expenseDate: 'Expense Date',
    thisMonthExpenses: 'This Month Expenses',
    
    // Employee Management
    employeeManagement: 'Employee & Salary Management',
    addEmployee: 'Add New Employee',
    employeeName: 'Employee Name',
    employeeEmail: 'Employee Email',
    employeePhone: 'Employee Phone',
    employeeAddress: 'Employee Address',
    employeeDepartment: 'Employee Department',
    employeePosition: 'Employee Position',
    employeeSalary: 'Employee Salary',
    hireDate: 'Hire Date',
    totalEmployees: 'Total Employees',
    totalSalaries: 'Total Salaries',
    
    // Reports
    expensesReport: 'Expenses Report',
    dailyReport: 'Daily Report',
    weeklyReport: 'Weekly Report',
    monthlyReport: 'Monthly Report',
    exportReport: 'Export Report',
    
    // Settings
    companySettings: 'Company Settings',
    financialSettings: 'Financial Settings',
    userPreferences: 'User Preferences',
    systemInformation: 'System Information',
    companyName: 'Company Name',
    companyAddress: 'Company Address',
    companyPhone: 'Company Phone',
    companyEmail: 'Company Email',
    taxNumber: 'Tax Number',
    currency: 'Currency',
    currencySymbol: 'Currency Symbol',
    taxRate: 'Tax Rate',
    language: 'Language',
    
    // Notifications
    notifications: 'Notifications',
    emailNotifications: 'Email Notifications',
    browserNotifications: 'Browser Notifications',
    
    // System
    theme: 'Theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    autoTheme: 'Auto',
    backup: 'Backup',
    autoBackup: 'Auto Backup',
    createBackup: 'Create Backup',
    restoreBackup: 'Restore Backup',
    systemUpdate: 'System Update',
    clearCache: 'Clear Cache',
    resetSystem: 'Reset System',
    
    // Messages
    saveSuccess: 'Saved successfully!',
    deleteSuccess: 'Deleted successfully!',
    updateSuccess: 'Updated successfully!',
    addSuccess: 'Added successfully!',
    errorOccurred: 'An error occurred!',
    confirmDelete: 'Are you sure you want to delete?',
    noDataFound: 'No data found',
    loading: 'Loading...',
    saving: 'Saving...',
    
    // Time & Date
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    
    // Departments
    management: 'Management',
    accounting: 'Accounting',
    sales: 'Sales',
    marketing: 'Marketing',
    hr: 'Human Resources',
    it: 'Information Technology',
    customerService: 'Customer Service',
    other: 'Other',
    
    // Positions
    generalManager: 'General Manager',
    departmentManager: 'Department Manager',
    accountant: 'Accountant',
    salesEmployee: 'Sales Employee',
    marketingEmployee: 'Marketing Employee',
    hrEmployee: 'HR Employee',
    developer: 'Developer',
    customerServiceEmployee: 'Customer Service Employee',

    // Additional
    currentLanguage: 'en',

    // User Preferences
    userPreferences: 'User Preferences',
    systemInformation: 'System Information',

    // Invoice Settings
    invoiceSettings: 'Invoice Settings',
    autoNumbering: 'Auto Invoice Numbering',
    autoNumberingDesc: 'Generate automatic sequential invoice numbers',
    dueDateReminder: 'Due Date Reminders',
    dueDateReminderDesc: 'Send reminders before invoice due dates',
    autoSaveDrafts: 'Auto Save Drafts',
    autoSaveDraftsDesc: 'Automatically save invoices while editing',

    // Notifications
    emailNotifications: 'Email Notifications',
    emailNotificationsDesc: 'Receive notifications via email',
    browserNotifications: 'Browser Notifications',
    browserNotificationsDesc: 'Show notifications in browser',

    // System
    systemTheme: 'System Theme',
    systemThemeDesc: 'Choose system appearance',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    autoTheme: 'Auto',
    autoBackup: 'Auto Backup',
    autoBackupDesc: 'Create automatic data backups',
    createBackup: 'Create Backup',
    restoreBackup: 'Restore Backup',
    resetSystem: 'Reset System',

    // System Info
    version: 'Version',
    lastUpdate: 'Last Update',
    database: 'Database',
    storage: 'Storage'
  }
}

// نوع البيانات للترجمة
export type TranslationKey = keyof typeof translations.ar
export type Language = 'ar' | 'en'

// دالة الحصول على الترجمة
export function getTranslation(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations.ar[key] || key
}

// دالة الحصول على جميع ترجمات لغة معينة
export function getLanguageTranslations(language: Language) {
  return translations[language]
}
