'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidEmail, isValidPhone, formatPhone } from '@/lib/utils'

interface CustomerFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (customer: any) => void
}

export function CustomerForm({ isOpen, onClose, onSubmit }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tax_number: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // إزالة الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'اسم العميل مطلوب'
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05 أو +966)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج')
      return
    }

    setIsSubmitting(true)

    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCustomer = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone ? formatPhone(formData.phone) : undefined,
        address: formData.address.trim() || undefined,
        tax_number: formData.tax_number.trim() || undefined,
        created_at: new Date().toISOString()
      }

      onSubmit(newCustomer)
      toast.success('تم إضافة العميل بنجاح!')
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        tax_number: ''
      })
      setErrors({})
      
      onClose()
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة العميل')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إضافة عميل جديد"
      size="md"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* اسم العميل */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <User className="h-4 w-4 ml-2 text-blue-500" />
              اسم العميل *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسم العميل أو الشركة"
              required
              className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                {errors.name}
              </p>
            )}
          </div>

          {/* البريد الإلكتروني */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Mail className="h-4 w-4 ml-2 text-green-500" />
              البريد الإلكتروني
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@company.com"
              className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* رقم الهاتف */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Phone className="h-4 w-4 ml-2 text-purple-500" />
              رقم الهاتف
            </label>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0501234567 أو +966501234567"
              className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                {errors.phone}
              </p>
            )}
          </div>

          {/* العنوان */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4 ml-2 text-orange-500" />
              العنوان
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="عنوان العميل (اختياري)"
              className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
            />
          </div>

          {/* الرقم الضريبي */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 ml-2 text-indigo-500" />
              الرقم الضريبي
            </label>
            <Input
              name="tax_number"
              value={formData.tax_number}
              onChange={handleChange}
              placeholder="الرقم الضريبي للشركة (اختياري)"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">
              للشركات المسجلة ضريبياً فقط
            </p>
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
                  جاري الإضافة...
                </div>
              ) : (
                'إضافة العميل'
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
