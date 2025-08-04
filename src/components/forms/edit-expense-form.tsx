'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Receipt, DollarSign, Calendar, Tag, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface Expense {
  id: string
  title: string
  description: string
  amount: number
  category: string
  date: string
  receipt_url?: string | null
  created_at: string
}

interface EditExpenseFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string, expense: Partial<Expense>) => void
  expense: Expense | null
}

const expenseCategories = [
  'إيجارات',
  'رواتب',
  'مرافق',
  'مستلزمات',
  'صيانة',
  'تسويق',
  'مواصلات',
  'أخرى'
]

export function EditExpenseForm({ isOpen, onClose, onSubmit, expense }: EditExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    date: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // تحديث البيانات عند تغيير المصروف
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        description: expense.description || '',
        amount: expense.amount.toString() || '',
        category: expense.category || '',
        date: expense.date || ''
      })
    }
  }, [expense])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان المصروف مطلوب'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'المبلغ مطلوب ويجب أن يكون أكبر من صفر'
    }

    if (!formData.category) {
      newErrors.category = 'فئة المصروف مطلوبة'
    }

    if (!formData.date) {
      newErrors.date = 'تاريخ المصروف مطلوب'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!expense) return

    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج')
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date
      }

      onSubmit(expense.id, updatedData)
      toast.success('تم تحديث المصروف بنجاح!')
      
      onClose()
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث المصروف')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      title: '',
      description: '',
      amount: '',
      category: '',
      date: ''
    })
    setErrors({})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="تعديل المصروف"
      size="md"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* عنوان المصروف */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Receipt className="h-4 w-4 ml-2 text-red-500" />
              عنوان المصروف *
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: إيجار المكتب، فاتورة الكهرباء"
              required
              className={`transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.title ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                {errors.title}
              </p>
            )}
          </div>

          {/* وصف المصروف */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 ml-2 text-blue-500" />
              وصف المصروف
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="تفاصيل إضافية عن المصروف (اختياري)"
              className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
            />
          </div>

          {/* المبلغ */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <DollarSign className="h-4 w-4 ml-2 text-green-500" />
              المبلغ (ريال سعودي) *
            </label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              className={`transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.amount ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                {errors.amount}
              </p>
            )}
          </div>

          {/* فئة المصروف */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Tag className="h-4 w-4 ml-2 text-purple-500" />
              فئة المصروف *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                errors.category ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            >
              <option value="">اختر فئة المصروف</option>
              {expenseCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                {errors.category}
              </p>
            )}
          </div>

          {/* تاريخ المصروف */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4 ml-2 text-orange-500" />
              تاريخ المصروف *
            </label>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={`transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.date ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-xs flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                {errors.date}
              </p>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex space-x-3 space-x-reverse pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
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
