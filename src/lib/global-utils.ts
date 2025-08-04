import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { ar, enUS } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// إعدادات افتراضية للنظام
const DEFAULT_SETTINGS = {
  currency: 'ريال',
  currency_symbol: 'ر.س',
  tax_rate: 15,
  language: 'ar' as 'ar' | 'en'
}

// الحصول على الإعدادات من localStorage
function getSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  
  try {
    const saved = localStorage.getItem('companySettings')
    if (saved) {
      const settings = JSON.parse(saved)
      return {
        currency: settings.currency || DEFAULT_SETTINGS.currency,
        currency_symbol: settings.currency_symbol || DEFAULT_SETTINGS.currency_symbol,
        tax_rate: settings.tax_rate || DEFAULT_SETTINGS.tax_rate,
        language: settings.language || DEFAULT_SETTINGS.language
      }
    }
  } catch (error) {
    console.error('خطأ في قراءة الإعدادات:', error)
  }
  
  return DEFAULT_SETTINGS
}

// تنسيق العملة باستخدام الإعدادات العالمية
export function formatCurrency(amount: number): string {
  const settings = getSettings()
  
  const formattedAmount = new Intl.NumberFormat(
    settings.language === 'ar' ? 'ar-SA' : 'en-US',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(amount)

  if (settings.language === 'ar') {
    return `${formattedAmount} ${settings.currency_symbol}`
  } else {
    return `${settings.currency_symbol} ${formattedAmount}`
  }
}

// تنسيق التاريخ باستخدام الإعدادات العالمية
export function formatDate(date: string | Date, formatStr = "dd/MM/yyyy"): string {
  const settings = getSettings()
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const locale = settings.language === 'ar' ? ar : enUS
  
  return format(dateObj, formatStr, { locale })
}

export function formatDateTime(date: string | Date): string {
  const settings = getSettings()
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const locale = settings.language === 'ar' ? ar : enUS
  
  return format(dateObj, "dd/MM/yyyy HH:mm", { locale })
}

// تنسيق الأرقام باستخدام الإعدادات العالمية
export function formatNumber(num: number): string {
  const settings = getSettings()
  return num.toLocaleString(settings.language === 'ar' ? 'ar-SA' : 'en-US')
}

// تنسيق النسبة المئوية
export function formatPercentage(num: number): string {
  return `${num.toFixed(2)}%`
}

// حساب الضريبة باستخدام الإعدادات العالمية
export function calculateTax(amount: number): number {
  const settings = getSettings()
  return (amount * settings.tax_rate) / 100
}

// حساب المجموع مع الضريبة
export function calculateTotal(amount: number, includeTax: boolean = true): number {
  if (includeTax) {
    return amount + calculateTax(amount)
  }
  return amount
}

// حساب إجماليات الفاتورة باستخدام الإعدادات العالمية
export function calculateInvoiceTotal(
  subtotal: number,
  discountAmount: number = 0
): {
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  taxRate: number
} {
  const settings = getSettings()
  const taxAmount = calculateTax(subtotal)
  const total = subtotal + taxAmount - discountAmount
  
  return {
    subtotal,
    taxAmount,
    discountAmount,
    total: Math.max(0, total),
    taxRate: settings.tax_rate
  }
}

// إنشاء رقم فاتورة
export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `INV-${year}${month}${day}-${random}`
}

// التحقق من صحة البريد الإلكتروني
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// التحقق من صحة رقم الهاتف السعودي
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+966|966|0)?[5][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// تنسيق رقم الهاتف
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('966')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `+966${cleaned.substring(1)}`
  } else if (cleaned.length === 9) {
    return `+966${cleaned}`
  }
  return phone
}

// اقتطاع النص
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// الحصول على لون حالة الفاتورة
export function getInvoiceStatusColor(status: string): string {
  switch (status) {
    case 'paid':
      return 'text-green-600 bg-green-100'
    case 'sent':
      return 'text-blue-600 bg-blue-100'
    case 'overdue':
      return 'text-red-600 bg-red-100'
    case 'draft':
      return 'text-gray-600 bg-gray-100'
    case 'cancelled':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

// الحصول على نص حالة الفاتورة
export function getInvoiceStatusText(status: string): string {
  const settings = getSettings()
  
  if (settings.language === 'ar') {
    switch (status) {
      case 'paid':
        return 'مدفوعة'
      case 'sent':
        return 'مرسلة'
      case 'overdue':
        return 'متأخرة'
      case 'draft':
        return 'مسودة'
      case 'cancelled':
        return 'ملغية'
      default:
        return status
    }
  } else {
    switch (status) {
      case 'paid':
        return 'Paid'
      case 'sent':
        return 'Sent'
      case 'overdue':
        return 'Overdue'
      case 'draft':
        return 'Draft'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }
}

// حساب الأيام بين تاريخين
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// التحقق من تأخر الفاتورة
export function isInvoiceOverdue(dueDate: string): boolean {
  const due = parseISO(dueDate)
  const today = new Date()
  return due < today
}

// إنشاء لون عشوائي للرسوم البيانية
export function generateRandomColor(): string {
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
    '#ff00ff', '#00ffff', '#ff0000', '#0000ff', '#ffff00'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// دالة التأخير
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// مساعدات localStorage
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
  }
}

// تنسيق حجم الملف
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// الحصول على اتجاه النص حسب اللغة
export function getTextDirection(): 'rtl' | 'ltr' {
  const settings = getSettings()
  return settings.language === 'ar' ? 'rtl' : 'ltr'
}

// الحصول على اللغة الحالية
export function getCurrentLanguage(): 'ar' | 'en' {
  const settings = getSettings()
  return settings.language
}

// الحصول على معلومات العملة
export function getCurrencyInfo() {
  const settings = getSettings()
  return {
    name: settings.currency,
    symbol: settings.currency_symbol,
    code: settings.language === 'ar' ? 'SAR' : 'USD'
  }
}

// الحصول على معدل الضريبة
export function getTaxRate(): number {
  const settings = getSettings()
  return settings.tax_rate
}
