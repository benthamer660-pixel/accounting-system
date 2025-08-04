import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { ar } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting
export function formatCurrency(amount: number, currency = "ر.س"): string {
  return `${amount.toLocaleString('ar-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`
}

// Date formatting
export function formatDate(date: string | Date, formatStr = "dd/MM/yyyy"): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: ar })
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ar })
}

// Number formatting
export function formatNumber(num: number): string {
  return num.toLocaleString('ar-SA')
}

// Percentage formatting
export function formatPercentage(num: number): string {
  return `${num.toFixed(2)}%`
}

// Generate invoice number
export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `INV-${year}${month}${day}-${random}`
}

// Calculate invoice totals
export function calculateInvoiceTotal(
  subtotal: number,
  taxRate: number = 15,
  discountAmount: number = 0
): {
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
} {
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount - discountAmount
  
  return {
    subtotal,
    taxAmount,
    discountAmount,
    total: Math.max(0, total)
  }
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Saudi format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+966|966|0)?[5][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Format phone number
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

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Get invoice status color
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

// Get invoice status text in Arabic
export function getInvoiceStatusText(status: string): string {
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
}

// Calculate days between dates
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Check if invoice is overdue
export function isInvoiceOverdue(dueDate: string): boolean {
  const due = parseISO(dueDate)
  const today = new Date()
  return due < today
}

// Generate random color for charts
export function generateRandomColor(): string {
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
    '#ff00ff', '#00ffff', '#ff0000', '#0000ff', '#ffff00'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Debounce function
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

// Local storage helpers
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

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
