'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Package, DollarSign, Hash, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { Product } from '@/contexts/app-context'

interface EditProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string, product: Partial<Product>) => void
  product: Product | null
}

const categories = [
  'إلكترونيات',
  'ملابس',
  'طعام ومشروبات',
  'كتب وقرطاسية',
  'أخرى'
]

export function EditProductForm({ isOpen, onClose, onSubmit, product }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    sku: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // تحديث البيانات عند تغيير المنتج
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        quantity: product.quantity?.toString() || '',
        category: product.category || '',
        sku: product.sku || ''
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!product) return

    // التحقق من صحة البيانات
    if (!formData.name || !formData.price || !formData.quantity) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (parseFloat(formData.price) <= 0) {
      toast.error('يجب أن يكون السعر أكبر من صفر')
      return
    }

    if (parseInt(formData.quantity) < 0) {
      toast.error('يجب أن تكون الكمية صفر أو أكثر')
      return
    }

    setIsSubmitting(true)

    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category || 'أخرى',
        sku: formData.sku || product.sku
      }

      onSubmit(product.id, updatedData)
      toast.success('تم تحديث المنتج بنجاح!')
      
      onClose()
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث المنتج')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    // إعادة تعيين النموذج عند الإغلاق
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      sku: ''
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="تعديل المنتج"
      size="md"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* اسم المنتج */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Package className="h-4 w-4 ml-2 text-blue-500" />
              اسم المنتج *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسم المنتج"
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* الوصف */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Tag className="h-4 w-4 ml-2 text-green-500" />
              الوصف
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="وصف المنتج (اختياري)"
              className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
            />
          </div>

          {/* السعر والكمية */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <DollarSign className="h-4 w-4 ml-2 text-yellow-500" />
                السعر (ر.س) *
              </label>
              <div className="relative">
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  ر.س
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Hash className="h-4 w-4 ml-2 text-purple-500" />
                الكمية *
              </label>
              <Input
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* التصنيف */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              التصنيف
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">اختر التصنيف</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* رمز المنتج */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              رمز المنتج (SKU)
            </label>
            <Input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="رمز المنتج"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex space-x-3 space-x-reverse pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  جاري التحديث...
                </div>
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
