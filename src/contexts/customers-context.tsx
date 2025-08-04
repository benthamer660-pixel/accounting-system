'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// أنواع البيانات
interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  tax_number?: string
  created_at: string
  updated_at: string
}

interface CustomersContextType {
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  getCustomer: (id: string) => Customer | undefined
  getCustomersBySearch: (search: string) => Customer[]
  getTotalCustomers: () => number
  getCustomersWithEmail: () => Customer[]
  getCustomersWithPhone: () => Customer[]
  isLoading: boolean
}

// البيانات التجريبية الأولية
const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'شركة الأمل للتجارة',
    email: 'info@alamal.com',
    phone: '+966501234567',
    address: 'الرياض، حي الملك فهد',
    tax_number: '123456789',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'مؤسسة النجاح',
    email: 'contact@najah.com',
    phone: '+966507654321',
    address: 'جدة، حي الروضة',
    tax_number: '987654321',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'شركة التقدم المحدودة',
    email: 'info@taqadum.com',
    phone: '+966512345678',
    address: 'الدمام، حي الفيصلية',
    tax_number: '456789123',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
  },
  {
    id: '4',
    name: 'مكتب الإبداع للاستشارات',
    email: 'hello@ibdaa.com',
    phone: '+966598765432',
    address: 'الرياض، حي العليا',
    tax_number: '789123456',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
  },
]

// إنشاء Context
const CustomersContext = createContext<CustomersContextType | undefined>(undefined)

// مزود البيانات
export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    // محاولة تحميل البيانات من localStorage
    const savedCustomers = localStorage.getItem('accounting-customers')
    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers))
      } catch (error) {
        console.error('خطأ في تحميل العملاء:', error)
        setCustomers(initialCustomers)
      }
    } else {
      setCustomers(initialCustomers)
    }
    setIsLoading(false)
  }, [])

  // حفظ البيانات في localStorage عند التغيير
  useEffect(() => {
    if (!isLoading && customers.length > 0) {
      localStorage.setItem('accounting-customers', JSON.stringify(customers))
    }
  }, [customers, isLoading])

  // إضافة عميل جديد
  const addCustomer = (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setCustomers(prev => [...prev, newCustomer])
  }

  // تحديث عميل
  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id 
        ? { ...customer, ...customerData, updated_at: new Date().toISOString() }
        : customer
    ))
  }

  // حذف عميل
  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id))
  }

  // الحصول على عميل بالمعرف
  const getCustomer = (id: string) => {
    return customers.find(customer => customer.id === id)
  }

  // البحث في العملاء
  const getCustomersBySearch = (search: string) => {
    const searchLower = search.toLowerCase()
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(search) ||
      customer.tax_number?.includes(search)
    )
  }

  // إجمالي عدد العملاء
  const getTotalCustomers = () => {
    return customers.length
  }

  // العملاء الذين لديهم بريد إلكتروني
  const getCustomersWithEmail = () => {
    return customers.filter(customer => customer.email)
  }

  // العملاء الذين لديهم رقم هاتف
  const getCustomersWithPhone = () => {
    return customers.filter(customer => customer.phone)
  }

  const value: CustomersContextType = {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    getCustomersBySearch,
    getTotalCustomers,
    getCustomersWithEmail,
    getCustomersWithPhone,
    isLoading,
  }

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  )
}

// Hook لاستخدام Context
export function useCustomers() {
  const context = useContext(CustomersContext)
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomersProvider')
  }
  return context
}

export type { Customer }
