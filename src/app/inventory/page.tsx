'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Minus, Edit, Eye } from 'lucide-react'
import { useProducts } from '@/contexts/app-context'
import { useFormatting } from '@/contexts/settings-context'
import { useTranslation } from '@/hooks/use-translation'

export default function InventoryPage() {
  const { products, updateProduct } = useProducts()
  const { formatCurrency, formatDate } = useFormatting()
  const { t, currentLanguage } = useTranslation()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  // تحويل المنتجات إلى عناصر مخزون
  const inventoryItems = useMemo(() => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku || `SKU-${product.id}`,
      category: product.category,
      current_stock: product.stock,
      min_stock: 5, // حد أدنى افتراضي
      max_stock: 100, // حد أقصى افتراضي
      unit_cost: product.price * 0.8, // تكلفة افتراضية (80% من سعر البيع)
      unit_price: product.price,
      total_value: product.stock * product.price,
      last_updated: new Date().toISOString().split('T')[0],
      description: product.description
    }))
  }, [products])

  // تصفية المنتجات
  const filteredInventory = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesFilter = true
      if (filterType === 'low_stock') {
        matchesFilter = item.current_stock <= item.min_stock
      } else if (filterType === 'out_of_stock') {
        matchesFilter = item.current_stock === 0
      } else if (filterType === 'in_stock') {
        matchesFilter = item.current_stock > 0
      }
      
      return matchesSearch && matchesFilter
    })
  }, [inventoryItems, searchTerm, filterType])

  // حساب الإحصائيات
  const stats = useMemo(() => {
    const totalItems = inventoryItems.length
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.total_value, 0)
    const lowStockItems = inventoryItems.filter(item => item.current_stock <= item.min_stock).length
    const outOfStockItems = inventoryItems.filter(item => item.current_stock === 0).length
    
    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems
    }
  }, [inventoryItems])

  // دالة تحديث المخزون
  const updateStock = (productId: string, newStock: number) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      updateProduct(productId, { ...product, stock: Math.max(0, newStock) })
    }
  }

  // الحصول على لون حالة المخزون
  const getStockStatus = (item: any) => {
    if (item.current_stock === 0) {
      return { color: 'text-red-600 bg-red-50', text: currentLanguage === 'ar' ? 'نفد المخزون' : 'Out of Stock' }
    } else if (item.current_stock <= item.min_stock) {
      return { color: 'text-yellow-600 bg-yellow-50', text: currentLanguage === 'ar' ? 'مخزون منخفض' : 'Low Stock' }
    } else {
      return { color: 'text-green-600 bg-green-50', text: currentLanguage === 'ar' ? 'متوفر' : 'In Stock' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentLanguage === 'ar' ? 'إدارة المخزون' : 'Inventory Management'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'ar' ? 'تتبع وإدارة مخزون المنتجات' : 'Track and manage product inventory'}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">
                  {currentLanguage === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
                </p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">
                  {currentLanguage === 'ar' ? 'قيمة المخزون' : 'Inventory Value'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">
                  {currentLanguage === 'ar' ? 'مخزون منخفض' : 'Low Stock'}
                </p>
                <p className="text-2xl font-bold">{stats.lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">
                  {currentLanguage === 'ar' ? 'نفد المخزون' : 'Out of Stock'}
                </p>
                <p className="text-2xl font-bold">{stats.outOfStockItems}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentLanguage === 'ar' ? 'البحث والتصفية' : 'Search & Filter'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={currentLanguage === 'ar' ? 'البحث في المنتجات...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{currentLanguage === 'ar' ? 'جميع المنتجات' : 'All Products'}</option>
              <option value="in_stock">{currentLanguage === 'ar' ? 'متوفر' : 'In Stock'}</option>
              <option value="low_stock">{currentLanguage === 'ar' ? 'مخزون منخفض' : 'Low Stock'}</option>
              <option value="out_of_stock">{currentLanguage === 'ar' ? 'نفد المخزون' : 'Out of Stock'}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {currentLanguage === 'ar' ? 'قائمة المخزون' : 'Inventory List'}
              <span className="text-sm font-normal text-gray-500 mr-2">
                ({filteredInventory.length} {currentLanguage === 'ar' ? 'منتج' : 'products'})
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'المنتج' : 'Product'}
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'رمز المنتج' : 'SKU'}
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'الفئة' : 'Category'}
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'المخزون الحالي' : 'Current Stock'}
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'سعر الوحدة' : 'Unit Price'}
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'القيمة الإجمالية' : 'Total Value'}
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item)
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-500">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                        {item.sku}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                        {item.category}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStock(item.id, item.current_stock - 1)}
                            disabled={item.current_stock === 0}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium min-w-[2rem] text-center">
                            {item.current_stock}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStock(item.id, item.current_stock + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm font-medium">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm font-medium">
                        {formatCurrency(item.total_value)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentLanguage === 'ar' ? 'لا توجد منتجات' : 'No Products Found'}
              </h3>
              <p className="text-gray-600">
                {currentLanguage === 'ar' ? 
                  'لا توجد منتجات تطابق معايير البحث' : 
                  'No products match the search criteria'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
