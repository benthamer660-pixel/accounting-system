'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { User, DollarSign, Calendar, Phone, Mail, MapPin, Briefcase, IdCard } from 'lucide-react'
import toast from 'react-hot-toast'

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (employee: any) => void
}

const departments = [
  'الإدارة',
  'المحاسبة',
  'المبيعات',
  'التسويق',
  'الموارد البشرية',
  'تقنية المعلومات',
  'خدمة العملاء',
  'أخرى'
]

const positions = [
  'مدير عام',
  'مدير قسم',
  'محاسب',
  'موظف مبيعات',
  'موظف تسويق',
  'موظف موارد بشرية',
  'مطور',
  'موظف خدمة عملاء',
  'أخرى'
]

export function EmployeeForm({ isOpen, onClose, onSubmit }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    salary: '',
    hire_date: new Date().toISOString().split('T')[0],
    employee_id: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الموظف مطلوب'
    }

    if (!formData.salary || parseFloat(formData.salary) <= 0) {
      newErrors.salary = 'الراتب مطلوب ويجب أن يكون أكبر من صفر'
    }

    if (!formData.department) {
      newErrors.department = 'القسم مطلوب'
    }

    if (!formData.position) {
      newErrors.position = 'المنصب مطلوب'
    }

    if (!formData.hire_date) {
      newErrors.hire_date = 'تاريخ التوظيف مطلوب'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    if (formData.phone && !/^(05|5|\+9665)[0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newEmployee = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        department: formData.department,
        position: formData.position,
        salary: parseFloat(formData.salary),
        hire_date: formData.hire_date,
        employee_id: formData.employee_id.trim() || `EMP-${Date.now()}`,
        status: 'active',
        created_at: new Date().toISOString()
      }

      onSubmit(newEmployee)
      toast.success('تم إضافة الموظف بنجاح!')
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        department: '',
        position: '',
        salary: '',
        hire_date: new Date().toISOString().split('T')[0],
        employee_id: ''
      })
      
      onClose()
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الموظف')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      department: '',
      position: '',
      salary: '',
      hire_date: new Date().toISOString().split('T')[0],
      employee_id: ''
    })
    setErrors({})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="إضافة موظف جديد"
      size="lg"
    >
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات شخصية */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <User className="h-5 w-5 ml-2" />
              المعلومات الشخصية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* اسم الموظف */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 ml-2 text-blue-500" />
                  اسم الموظف *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="الاسم الكامل للموظف"
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

              {/* رقم الموظف */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <IdCard className="h-4 w-4 ml-2 text-purple-500" />
                  رقم الموظف
                </label>
                <Input
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  placeholder="سيتم إنشاؤه تلقائياً إذا ترك فارغاً"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  <Phone className="h-4 w-4 ml-2 text-orange-500" />
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
            </div>

            {/* العنوان */}
            <div className="space-y-2 mt-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 ml-2 text-red-500" />
                العنوان
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="عنوان الموظف (اختياري)"
                className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[80px] resize-none"
              />
            </div>
          </div>

          {/* معلومات الوظيفة */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 ml-2" />
              معلومات الوظيفة
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* القسم */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Briefcase className="h-4 w-4 ml-2 text-indigo-500" />
                  القسم *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className={`flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.department ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                >
                  <option value="">اختر القسم</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-xs flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                    {errors.department}
                  </p>
                )}
              </div>

              {/* المنصب */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 ml-2 text-purple-500" />
                  المنصب *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className={`flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.position ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                >
                  <option value="">اختر المنصب</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                {errors.position && (
                  <p className="text-red-500 text-xs flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                    {errors.position}
                  </p>
                )}
              </div>

              {/* الراتب */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <DollarSign className="h-4 w-4 ml-2 text-green-500" />
                  الراتب الشهري (ريال سعودي) *
                </label>
                <Input
                  name="salary"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.salary ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.salary && (
                  <p className="text-red-500 text-xs flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                    {errors.salary}
                  </p>
                )}
              </div>

              {/* تاريخ التوظيف */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 ml-2 text-orange-500" />
                  تاريخ التوظيف *
                </label>
                <Input
                  name="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  required
                  className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.hire_date ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.hire_date && (
                  <p className="text-red-500 text-xs flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full ml-1"></span>
                    {errors.hire_date}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex space-x-3 space-x-reverse pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  جاري الإضافة...
                </div>
              ) : (
                'إضافة الموظف'
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
