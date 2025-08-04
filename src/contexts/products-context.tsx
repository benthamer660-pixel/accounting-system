'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// أنواع البيانات
interface Product {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  category_id?: string
  category?: string
  sku?: string
  image_url?: string
  created_at: string
  updated_at: string
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
  getLowStockProducts: (threshold?: number) => Product[]
  getTotalProductsValue: () => number
  isLoading: boolean
}

// البيانات التجريبية الأولية
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'لابتوب ديل XPS 13',
    description: 'لابتوب عالي الأداء للمحترفين',
    price: 4500,
    quantity: 15,
    sku: 'DELL-XPS-13',
    category: 'إلكترونيات',
    image_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'طابعة HP LaserJet',
    description: 'طابعة ليزر سريعة وموثوقة',
    price: 800,
    quantity: 8,
    sku: 'HP-LJ-P1102',
    category: 'إلكترونيات',
    image_url: null,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'كيبورد ميكانيكي',
    description: 'كيبورد ميكانيكي للألعاب',
    price: 250,
    quantity: 25,
    sku: 'KB-MECH-001',
    category: 'إلكترونيات',
    image_url: null,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'ماوس لاسلكي',
    description: 'ماوس لاسلكي مريح للاستخدام',
    price: 120,
    quantity: 30,
    sku: 'MOUSE-WL-001',
    category: 'إلكترونيات',
    image_url: null,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
]

// إنشاء Context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

// مزود البيانات
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    // محاولة تحميل البيانات من localStorage
    const savedProducts = localStorage.getItem('accounting-products')
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error)
        setProducts(initialProducts)
      }
    } else {
      setProducts(initialProducts)
    }
    setIsLoading(false)
  }, [])

  // حفظ البيانات في localStorage عند التغيير
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      localStorage.setItem('accounting-products', JSON.stringify(products))
    }
  }, [products, isLoading])

  // إضافة منتج جديد
  const addProduct = (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      sku: productData.sku || `PRD-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setProducts(prev => [...prev, newProduct])
  }

  // تحديث منتج
  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...productData, updated_at: new Date().toISOString() }
        : product
    ))
  }

  // حذف منتج
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  // الحصول على منتج بالمعرف
  const getProduct = (id: string) => {
    return products.find(product => product.id === id)
  }

  // الحصول على المنتجات حسب الفئة
  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category)
  }

  // الحصول على المنتجات ذات المخزون المنخفض
  const getLowStockProducts = (threshold: number = 10) => {
    return products.filter(product => product.quantity <= threshold)
  }

  // حساب إجمالي قيمة المنتجات
  const getTotalProductsValue = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0)
  }

  const value: ProductsContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductsByCategory,
    getLowStockProducts,
    getTotalProductsValue,
    isLoading,
  }

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

// Hook لاستخدام Context
export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}

export type { Product }
