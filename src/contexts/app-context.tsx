'use client'

import React from 'react'
import { ProductsProvider } from './products-context'
import { CustomersProvider } from './customers-context'
import { InvoicesProvider } from './invoices-context'

interface AppContextProviderProps {
  children: React.ReactNode
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  return (
    <ProductsProvider>
      <CustomersProvider>
        <InvoicesProvider>
          {children}
        </InvoicesProvider>
      </CustomersProvider>
    </ProductsProvider>
  )
}

// تصدير جميع الـ hooks للاستخدام السهل
export { useProducts } from './products-context'
export { useCustomers } from './customers-context'
export { useInvoices } from './invoices-context'

// تصدير الأنواع
export type { Product } from './products-context'
export type { Customer } from './customers-context'
export type { Invoice, InvoiceItem } from './invoices-context'
