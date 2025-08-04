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

// Form Types
export interface ProductFormData {
  name: string
  description?: string
  price: number
  quantity: number
  category_id?: string
  sku?: string
  image_url?: string
}

export interface CustomerFormData {
  name: string
  email?: string
  phone?: string
  address?: string
  tax_number?: string
}

export interface InvoiceFormData {
  customer_id: string
  date: string
  due_date?: string
  notes?: string
  items: InvoiceItemFormData[]
}

export interface InvoiceItemFormData {
  product_id: string
  quantity: number
  unit_price: number
}

export interface ExpenseFormData {
  title: string
  description?: string
  amount: number
  category: string
  date: string
  receipt_url?: string
}

// Dashboard Types
export interface DashboardStats {
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  totalInvoices: number
  paidInvoices: number
  pendingInvoices: number
  overdueInvoices: number
  totalProducts: number
  lowStockProducts: number
  totalCustomers: number
}

export interface ChartData {
  name: string
  value: number
  date?: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Navigation Types
export interface NavItem {
  title: string
  href: string
  icon: string
  description?: string
  children?: NavItem[]
}

// Table Types
export interface TableColumn<T> {
  key: keyof T
  title: string
  sortable?: boolean
  render?: (value: any, record: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
}

// Filter Types
export interface DateFilter {
  from?: Date
  to?: Date
}

export interface ProductFilter {
  category_id?: string
  search?: string
  low_stock?: boolean
}

export interface InvoiceFilter {
  status?: Invoice['status']
  customer_id?: string
  date_range?: DateFilter
  search?: string
}

export interface ExpenseFilter {
  category?: string
  date_range?: DateFilter
  search?: string
}
