'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import toast from 'react-hot-toast'

// أنواع البيانات
interface CompanySettings {
  company_name: string
  company_address: string
  company_phone: string
  company_email: string
  tax_number: string
  currency: string
  currency_symbol: string
  tax_rate: number
  language: 'ar' | 'en'
}

interface UserSettings {
  notifications_email: boolean
  notifications_browser: boolean
  auto_backup: boolean
  theme: 'light' | 'dark' | 'auto'
}

interface InvoiceSettings {
  auto_numbering: boolean
  due_date_reminder: boolean
  auto_save_drafts: boolean
}

interface SettingsContextType {
  // الإعدادات
  companySettings: CompanySettings
  userSettings: UserSettings
  invoiceSettings: InvoiceSettings
  
  // وظائف التحديث
  updateCompanySettings: (settings: Partial<CompanySettings>) => void
  updateUserSettings: (settings: Partial<UserSettings>) => void
  updateInvoiceSettings: (settings: Partial<InvoiceSettings>) => void
  
  // وظائف مساعدة
  formatCurrency: (amount: number) => string
  formatDate: (date: string | Date) => string
  calculateTax: (amount: number) => number
  calculateTotal: (amount: number, includeTax?: boolean) => number
  
  // حالة النظام
  isLoading: boolean
  lastSaved: Date | null
  saveAllSettings: () => Promise<void>
}

// القيم الافتراضية
const defaultCompanySettings: CompanySettings = {
  company_name: 'شركتي',
  company_address: 'الرياض، المملكة العربية السعودية',
  company_phone: '+966501234567',
  company_email: 'info@mycompany.com',
  tax_number: '123456789',
  currency: 'ريال',
  currency_symbol: 'ر.س',
  tax_rate: 15,
  language: 'ar'
}

const defaultUserSettings: UserSettings = {
  notifications_email: true,
  notifications_browser: true,
  auto_backup: true,
  theme: 'light'
}

const defaultInvoiceSettings: InvoiceSettings = {
  auto_numbering: true,
  due_date_reminder: true,
  auto_save_drafts: true
}

// إنشاء Context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Provider Component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [companySettings, setCompanySettings] = useState<CompanySettings>(defaultCompanySettings)
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings)
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(defaultInvoiceSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // تحميل الإعدادات من localStorage عند بدء التشغيل
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedCompanySettings = localStorage.getItem('companySettings')
        const savedUserSettings = localStorage.getItem('userSettings')
        const savedInvoiceSettings = localStorage.getItem('invoiceSettings')
        const savedTime = localStorage.getItem('settingsLastSaved')

        if (savedCompanySettings) {
          setCompanySettings(JSON.parse(savedCompanySettings))
        }
        if (savedUserSettings) {
          setUserSettings(JSON.parse(savedUserSettings))
        }
        if (savedInvoiceSettings) {
          setInvoiceSettings(JSON.parse(savedInvoiceSettings))
        }
        if (savedTime) {
          setLastSaved(new Date(savedTime))
        }
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error)
        toast.error('خطأ في تحميل الإعدادات')
      }
    }

    loadSettings()
  }, [])

  // تحديث إعدادات الشركة
  const updateCompanySettings = (newSettings: Partial<CompanySettings>) => {
    setCompanySettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('companySettings', JSON.stringify(updated))
      return updated
    })
  }

  // تحديث إعدادات المستخدم
  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('userSettings', JSON.stringify(updated))
      return updated
    })
  }

  // تحديث إعدادات الفواتير
  const updateInvoiceSettings = (newSettings: Partial<InvoiceSettings>) => {
    setInvoiceSettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('invoiceSettings', JSON.stringify(updated))
      return updated
    })
  }

  // تنسيق العملة
  const formatCurrency = (amount: number): string => {
    const formattedAmount = new Intl.NumberFormat(
      companySettings.language === 'ar' ? 'ar-SA' : 'en-US',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ).format(amount)

    if (companySettings.language === 'ar') {
      return `${formattedAmount} ${companySettings.currency_symbol}`
    } else {
      return `${companySettings.currency_symbol} ${formattedAmount}`
    }
  }

  // تنسيق التاريخ
  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    return new Intl.DateTimeFormat(
      companySettings.language === 'ar' ? 'ar-SA' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        calendar: companySettings.language === 'ar' ? 'gregory' : 'gregory'
      }
    ).format(dateObj)
  }

  // حساب الضريبة
  const calculateTax = (amount: number): number => {
    return (amount * companySettings.tax_rate) / 100
  }

  // حساب المجموع مع أو بدون ضريبة
  const calculateTotal = (amount: number, includeTax: boolean = true): number => {
    if (includeTax) {
      return amount + calculateTax(amount)
    }
    return amount
  }

  // حفظ جميع الإعدادات
  const saveAllSettings = async (): Promise<void> => {
    setIsLoading(true)
    try {
      // محاكاة حفظ البيانات
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // حفظ في localStorage
      localStorage.setItem('companySettings', JSON.stringify(companySettings))
      localStorage.setItem('userSettings', JSON.stringify(userSettings))
      localStorage.setItem('invoiceSettings', JSON.stringify(invoiceSettings))
      
      const now = new Date()
      localStorage.setItem('settingsLastSaved', now.toISOString())
      setLastSaved(now)
      
      toast.success('تم حفظ الإعدادات بنجاح!')
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الإعدادات')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: SettingsContextType = {
    companySettings,
    userSettings,
    invoiceSettings,
    updateCompanySettings,
    updateUserSettings,
    updateInvoiceSettings,
    formatCurrency,
    formatDate,
    calculateTax,
    calculateTotal,
    isLoading,
    lastSaved,
    saveAllSettings
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

// Hook لاستخدام Context
export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

// Hook للحصول على إعدادات الشركة فقط
export function useCompanySettings() {
  const { companySettings, updateCompanySettings } = useSettings()
  return { companySettings, updateCompanySettings }
}

// Hook للحصول على وظائف التنسيق
export function useFormatting() {
  const { formatCurrency, formatDate, calculateTax, calculateTotal } = useSettings()
  return { formatCurrency, formatDate, calculateTax, calculateTotal }
}

// Hook للحصول على إعدادات اللغة
export function useLanguage() {
  const { companySettings } = useSettings()
  return {
    language: companySettings.language,
    isRTL: companySettings.language === 'ar',
    direction: companySettings.language === 'ar' ? 'rtl' : 'ltr'
  }
}
