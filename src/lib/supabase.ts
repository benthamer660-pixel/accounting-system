import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  category_id?: string
  sku?: string
  image_url?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  tax_number?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  customer_id: string
  date: string
  due_date?: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
  customer?: Customer
  invoice_items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id: string
  quantity: number
  unit_price: number
  total: number
  created_at: string
  product?: Product
}

export interface Expense {
  id: string
  title: string
  description?: string
  amount: number
  category: string
  date: string
  receipt_url?: string
  created_at: string
  updated_at: string
}

export interface Settings {
  id: string
  company_name: string
  company_address?: string
  company_phone?: string
  company_email?: string
  company_logo?: string
  currency: string
  currency_symbol: string
  tax_rate: number
  language: 'ar' | 'en'
  created_at: string
  updated_at: string
}
