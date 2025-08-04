'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { ProductForm } from '@/components/forms/product-form'
import { EditProductForm } from '@/components/forms/edit-product-form'
import { DeleteConfirmation } from '@/components/ui/delete-confirmation'
import { useProducts, Product } from '@/contexts/app-context'

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, getLowStockProducts, isLoading } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddProduct = (newProduct: any) => {
    addProduct(newProduct)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditFormOpen(true)
  }

  const handleUpdateProduct = (id: string, updatedData: Partial<Product>) => {
    updateProduct(id, updatedData)
    setIsEditFormOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id)
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    }
  }

  const lowStockProducts = getLowStockProducts(10)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المنتجات</h1>
          <p className="text-gray-600">إدارة منتجاتك ومخزونك</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="h-4 w-4" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline">تصفية</Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Package className="h-8 w-8 text-primary" />
                <div className="flex space-x-1 space-x-reverse">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-50 transition-colors"
                    onClick={() => handleEditProduct(product)}
                    title="تعديل المنتج"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => handleDeleteProduct(product)}
                    title="حذف المنتج"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">السعر:</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">الكمية:</span>
                  <span className={`font-semibold ${
                    product.quantity < 10 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {product.quantity}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">رمز المنتج:</span>
                  <span className="text-sm font-mono">{product.sku}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">التصنيف:</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="pt-2">
                {product.quantity < 10 ? (
                  <div className="flex items-center text-red-600 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full ml-2"></div>
                    مخزون منخفض
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full ml-2"></div>
                    متوفر
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد منتجات
            </h3>
            <p className="text-gray-600 mb-4">
              لم يتم العثور على منتجات تطابق البحث
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {products.length}
              </div>
              <div className="text-sm text-gray-600">إجمالي المنتجات</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.quantity >= 10).length}
              </div>
              <div className="text-sm text-gray-600">منتجات متوفرة</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => p.quantity < 10).length}
              </div>
              <div className="text-sm text-gray-600">مخزون منخفض</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نموذج إضافة منتج */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddProduct}
      />

      {/* نموذج تعديل منتج */}
      <EditProductForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleUpdateProduct}
        product={selectedProduct}
      />

      {/* نافذة تأكيد الحذف */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف المنتج"
        message="هل أنت متأكد من أنك تريد حذف هذا المنتج؟ سيتم حذف جميع البيانات المرتبطة به."
        itemName={selectedProduct?.name}
      />
    </div>
  )
}
