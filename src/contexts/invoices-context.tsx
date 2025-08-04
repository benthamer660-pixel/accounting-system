'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// أنواع البيانات
interface InvoiceItem {
  id: string
  invoice_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total: number
  created_at: string
}

interface Invoice {
  id: string
  invoice_number: string
  customer_id: string
  customer_name: string
  date: string
  due_date?: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  items: InvoiceItem[]
  created_at: string
  updated_at: string
}

interface InvoicesContextType {
  invoices: Invoice[]
  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  getInvoice: (id: string) => Invoice | undefined
  getInvoicesByCustomer: (customerId: string) => Invoice[]
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[]
  getTotalRevenue: () => number
  getPaidAmount: () => number
  getPendingAmount: () => number
  getOverdueAmount: () => number
  getTotalInvoices: () => number
  isLoading: boolean
}

// البيانات التجريبية الأولية
const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoice_number: 'INV-20240115-001',
    customer_id: '1',
    customer_name: 'شركة الأمل للتجارة',
    date: '2024-01-15',
    due_date: '2024-02-15',
    subtotal: 4782.61,
    tax_amount: 717.39,
    discount_amount: 0,
    total: 5500,
    status: 'paid',
    items: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    invoice_number: 'INV-20240114-002',
    customer_id: '2',
    customer_name: 'مؤسسة النجاح',
    date: '2024-01-14',
    due_date: '2024-02-14',
    subtotal: 2782.61,
    tax_amount: 417.39,
    discount_amount: 0,
    total: 3200,
    status: 'sent',
    items: [],
    created_at: '2024-01-14T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z',
  },
  {
    id: '3',
    invoice_number: 'INV-20240113-003',
    customer_id: '3',
    customer_name: 'شركة التقدم المحدودة',
    date: '2024-01-13',
    due_date: '2024-02-13',
    subtotal: 6782.61,
    tax_amount: 1017.39,
    discount_amount: 0,
    total: 7800,
    status: 'paid',
    items: [],
    created_at: '2024-01-13T00:00:00Z',
    updated_at: '2024-01-13T00:00:00Z',
  },
  {
    id: '4',
    invoice_number: 'INV-20240110-004',
    customer_id: '4',
    customer_name: 'مكتب الإبداع للاستشارات',
    date: '2024-01-10',
    due_date: '2024-01-25',
    subtotal: 1826.09,
    tax_amount: 273.91,
    discount_amount: 0,
    total: 2100,
    status: 'overdue',
    items: [],
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
]

// إنشاء Context
const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined)

// مزود البيانات
export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    // محاولة تحميل البيانات من localStorage
    const savedInvoices = localStorage.getItem('accounting-invoices')
    if (savedInvoices) {
      try {
        setInvoices(JSON.parse(savedInvoices))
      } catch (error) {
        console.error('خطأ في تحميل الفواتير:', error)
        setInvoices(initialInvoices)
      }
    } else {
      setInvoices(initialInvoices)
    }
    setIsLoading(false)
  }, [])

  // حفظ البيانات في localStorage عند التغيير
  useEffect(() => {
    if (!isLoading && invoices.length > 0) {
      localStorage.setItem('accounting-invoices', JSON.stringify(invoices))
    }
  }, [invoices, isLoading])

  // إضافة فاتورة جديدة
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setInvoices(prev => [...prev, newInvoice])
  }

  // تحديث فاتورة
  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id 
        ? { ...invoice, ...invoiceData, updated_at: new Date().toISOString() }
        : invoice
    ))
  }

  // حذف فاتورة
  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id))
  }

  // الحصول على فاتورة بالمعرف
  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id)
  }

  // الحصول على فواتير عميل معين
  const getInvoicesByCustomer = (customerId: string) => {
    return invoices.filter(invoice => invoice.customer_id === customerId)
  }

  // الحصول على الفواتير حسب الحالة
  const getInvoicesByStatus = (status: Invoice['status']) => {
    return invoices.filter(invoice => invoice.status === status)
  }

  // إجمالي الإيرادات
  const getTotalRevenue = () => {
    return invoices.reduce((total, invoice) => total + invoice.total, 0)
  }

  // المبلغ المدفوع
  const getPaidAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.total, 0)
  }

  // المبلغ المعلق
  const getPendingAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'sent')
      .reduce((total, invoice) => total + invoice.total, 0)
  }

  // المبلغ المتأخر
  const getOverdueAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'overdue')
      .reduce((total, invoice) => total + invoice.total, 0)
  }

  // إجمالي عدد الفواتير
  const getTotalInvoices = () => {
    return invoices.length
  }

  const value: InvoicesContextType = {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    getInvoicesByCustomer,
    getInvoicesByStatus,
    getTotalRevenue,
    getPaidAmount,
    getPendingAmount,
    getOverdueAmount,
    getTotalInvoices,
    isLoading,
  }

  return (
    <InvoicesContext.Provider value={value}>
      {children}
    </InvoicesContext.Provider>
  )
}

// Hook لاستخدام Context
export function useInvoices() {
  const context = useContext(InvoicesContext)
  if (context === undefined) {
    throw new Error('useInvoices must be used within a InvoicesProvider')
  }
  return context
}

export type { Invoice, InvoiceItem }
