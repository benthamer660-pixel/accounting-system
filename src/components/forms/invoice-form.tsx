'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Plus, Trash2, Users, Calendar, FileText, Calculator } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateInvoiceNumber, calculateInvoiceTotal, formatCurrency } from '@/lib/utils'
import { useCustomers, useProducts } from '@/contexts/app-context'
import { useSettings } from '@/contexts/settings-context'

interface InvoiceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (invoice: any) => void
}

interface InvoiceItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total: number
}

export function InvoiceForm({ isOpen, onClose, onSubmit }: InvoiceFormProps) {
  const { customers } = useCustomers()
  const { products, updateProduct } = useProducts()
  const { companySettings } = useSettings()

  const [formData, setFormData] = useState({
    customer_id: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: ''
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    { product_id: '', product_name: '', quantity: 1, unit_price: 0, total: 0 }
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // إذا تم تغيير المنتج، تحديث الاسم والسعر
    if (field === 'product_id') {
      const product = products.find(p => p.id === value)
      if (product) {
        newItems[index].product_name = product.name
        newItems[index].unit_price = product.price
      }
    }

    // حساب الإجمالي للعنصر
    newItems[index].total = newItems[index].quantity * newItems[index].unit_price

    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { product_id: '', product_name: '', quantity: 1, unit_price: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    return calculateInvoiceTotal(subtotal, companySettings.tax_rate, 0) // معدل الضريبة من الإعدادات
  }

  // التحقق من توفر الكميات
  const checkProductAvailability = () => {
    const validItems = items.filter(item => item.product_id && item.quantity > 0)

    for (const item of validItems) {
      const product = products.find(p => p.id === item.product_id)
      if (!product) {
        toast.error(`المنتج ${item.product_name} غير موجود`)
        return false
      }

      if (product.quantity < item.quantity) {
        toast.error(`الكمية المطلوبة من ${product.name} (${item.quantity}) أكبر من المتوفر (${product.quantity})`)
        return false
      }
    }

    return true
  }

  // خصم الكميات من المنتجات
  const deductProductQuantities = () => {
    const validItems = items.filter(item => item.product_id && item.quantity > 0)

    validItems.forEach(item => {
      const product = products.find(p => p.id === item.product_id)
      if (product) {
        const newQuantity = product.quantity - item.quantity
        updateProduct(product.id, { quantity: newQuantity })
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // التحقق من صحة البيانات
    if (!formData.customer_id) {
      toast.error('يرجى اختيار العميل')
      return
    }

    const validItems = items.filter(item => item.product_id && item.quantity > 0)
    if (validItems.length === 0) {
      toast.error('يرجى إضافة منتج واحد على الأقل')
      return
    }

    // التحقق من توفر الكميات قبل المتابعة
    if (!checkProductAvailability()) {
      return
    }

    setIsSubmitting(true)

    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const totals = calculateTotals()
      const customer = customers.find(c => c.id === formData.customer_id)

      const newInvoice = {
        id: Date.now().toString(),
        invoice_number: generateInvoiceNumber(),
        customer_id: formData.customer_id,
        customer_name: customer?.name || 'عميل غير معروف',
        date: formData.date,
        due_date: formData.due_date || null,
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        discount_amount: totals.discountAmount,
        total: totals.total,
        status: 'draft' as const,
        notes: formData.notes,
        items: validItems,
        created_at: new Date().toISOString()
      }

      // خصم الكميات من المنتجات
      deductProductQuantities()

      onSubmit(newInvoice)
      toast.success('تم إنشاء الفاتورة بنجاح وتم خصم الكميات من المخزون!')

      // إعادة تعيين النموذج
      setFormData({
        customer_id: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        notes: ''
      })
      setItems([{ product_id: '', product_name: '', quantity: 1, unit_price: 0, total: 0 }])

      onClose()
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الفاتورة')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totals = calculateTotals()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إنشاء فاتورة جديدة"
      size="xl"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* معلومات الفاتورة الأساسية */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="h-5 w-5 ml-2 text-blue-500" />
              معلومات الفاتورة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Users className="h-4 w-4 ml-2 text-blue-500" />
                  العميل *
                </label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleFormChange}
                  className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">اختر العميل</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 ml-2 text-green-500" />
                  تاريخ الفاتورة *
                </label>
                <Input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  required
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 ml-2 text-orange-500" />
                  تاريخ الاستحقاق
                </label>
                <Input
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleFormChange}
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* عناصر الفاتورة */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Calculator className="h-5 w-5 ml-2 text-purple-500" />
                عناصر الفاتورة
              </h3>
              <Button
                type="button"
                onClick={addItem}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200"
              >
                <Plus className="h-4 w-4 ml-1" />
                إضافة عنصر
              </Button>
            </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        المنتج
                      </label>
                      <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      >
                        <option value="">اختر المنتج</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        الكمية
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max={item.product_id ? products.find(p => p.id === item.product_id)?.quantity || 0 : undefined}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className={`h-9 ${
                          item.product_id &&
                          item.quantity > (products.find(p => p.id === item.product_id)?.quantity || 0)
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                      />
                      {item.product_id && (
                        <p className={`text-xs mt-1 ${
                          item.quantity > (products.find(p => p.id === item.product_id)?.quantity || 0)
                            ? 'text-red-500 font-medium'
                            : 'text-gray-500'
                        }`}>
                          متوفر: {products.find(p => p.id === item.product_id)?.quantity || 0}
                          {item.quantity > (products.find(p => p.id === item.product_id)?.quantity || 0) &&
                            ' - الكمية المطلوبة أكبر من المتوفر!'
                          }
                        </p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        السعر
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="h-9"
                      />
                    </div>

                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        الإجمالي
                      </label>
                      <div className="h-9 px-2 py-1 bg-gray-50 rounded-md border text-sm flex items-center">
                        {formatCurrency(item.total)}
                      </div>
                    </div>

                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {/* ملخص الفاتورة */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calculator className="h-5 w-5 ml-2 text-green-500" />
              ملخص الفاتورة
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-gray-700">
                <span>المجموع الفرعي:</span>
                <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>الضريبة ({companySettings.tax_rate}%):</span>
                <span className="font-medium">{formatCurrency(totals.taxAmount)}</span>
              </div>
              <div className="border-t border-green-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">الإجمالي:</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ملاحظات */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 ml-2 text-gray-500" />
              ملاحظات
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              placeholder="ملاحظات إضافية (اختياري)"
              className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex space-x-3 space-x-reverse pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  جاري الإنشاء...
                </div>
              ) : (
                'إنشاء الفاتورة'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
