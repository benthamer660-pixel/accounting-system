'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Plus, 
  Search, 
  DollarSign, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Briefcase,
  Edit,
  Trash2,
  IdCard
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EmployeeForm } from '@/components/forms/employee-form'
import { DeleteConfirmation } from '@/components/ui/delete-confirmation'
import toast from 'react-hot-toast'

interface Employee {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  department: string
  position: string
  salary: number
  hire_date: string
  employee_id: string
  status: 'active' | 'inactive'
  created_at: string
}

interface EmployeesManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

// بيانات تجريبية للموظفين
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    email: 'ahmed@company.com',
    phone: '0501234567',
    address: 'الرياض، المملكة العربية السعودية',
    department: 'المحاسبة',
    position: 'محاسب أول',
    salary: 8000,
    hire_date: '2023-01-15',
    employee_id: 'EMP-001',
    status: 'active',
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'فاطمة أحمد السالم',
    email: 'fatima@company.com',
    phone: '0507654321',
    address: 'جدة، المملكة العربية السعودية',
    department: 'المبيعات',
    position: 'مدير مبيعات',
    salary: 12000,
    hire_date: '2022-06-01',
    employee_id: 'EMP-002',
    status: 'active',
    created_at: '2022-06-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'محمد عبدالله الخالد',
    email: 'mohammed@company.com',
    phone: '0509876543',
    address: 'الدمام، المملكة العربية السعودية',
    department: 'تقنية المعلومات',
    position: 'مطور أول',
    salary: 10000,
    hire_date: '2023-03-10',
    employee_id: 'EMP-003',
    status: 'active',
    created_at: '2023-03-10T00:00:00Z'
  }
]

export function EmployeesManagementModal({ isOpen, onClose }: EmployeesManagementModalProps) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // تصفية الموظفين
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter
    
    return matchesSearch && matchesDepartment && employee.status === 'active'
  })

  // حساب الإحصائيات
  const totalEmployees = employees.filter(emp => emp.status === 'active').length
  const totalSalaries = employees
    .filter(emp => emp.status === 'active')
    .reduce((sum, emp) => sum + emp.salary, 0)
  const departments = [...new Set(employees.map(emp => emp.department))]

  // وظائف التعامل مع الأحداث
  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [newEmployee, ...prev])
    setIsEmployeeFormOpen(false)
    toast.success('تم إضافة الموظف بنجاح!')
  }

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmployee.id ? { ...emp, status: 'inactive' } : emp
      ))
      setIsDeleteDialogOpen(false)
      setSelectedEmployee(null)
      toast.success('تم حذف الموظف بنجاح!')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إدارة الموظفين والرواتب"
      size="xl"
    >
      <div className="p-6 max-h-[85vh] overflow-y-auto">
        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">إجمالي الموظفين</p>
                <p className="text-2xl font-bold text-blue-900">{totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">إجمالي الرواتب</p>
                <p className="text-lg font-bold text-green-900">{formatCurrency(totalSalaries)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">عدد الأقسام</p>
                <p className="text-2xl font-bold text-purple-900">{departments.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* شريط البحث والتصفية */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في الموظفين (الاسم، رقم الموظف، القسم، المنصب)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الأقسام</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <Button
            onClick={() => setIsEmployeeFormOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة موظف
          </Button>
        </div>

        {/* قائمة الموظفين */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 ml-2 text-blue-500" />
            قائمة الموظفين ({filteredEmployees.length})
          </h3>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">لا يوجد موظفين</h4>
              <p className="text-gray-600 mb-4">لم يتم العثور على موظفين مطابقين للبحث</p>
              <Button
                onClick={() => setIsEmployeeFormOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة موظف جديد
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <User className="h-5 w-5 text-blue-500 ml-2" />
                        <h4 className="text-lg font-semibold text-gray-900">{employee.name}</h4>
                        <Badge variant="secondary" className="mr-2 bg-blue-100 text-blue-800">
                          {employee.employee_id}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 text-purple-500 ml-2" />
                          <div>
                            <p className="text-gray-600">القسم</p>
                            <p className="font-medium">{employee.department}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-indigo-500 ml-2" />
                          <div>
                            <p className="text-gray-600">المنصب</p>
                            <p className="font-medium">{employee.position}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 ml-2" />
                          <div>
                            <p className="text-gray-600">الراتب الشهري</p>
                            <p className="font-bold text-green-600">{formatCurrency(employee.salary)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-orange-500 ml-2" />
                          <div>
                            <p className="text-gray-600">تاريخ التوظيف</p>
                            <p className="font-medium">{formatDate(employee.hire_date)}</p>
                          </div>
                        </div>
                      </div>
                      
                      {(employee.email || employee.phone) && (
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          {employee.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-green-500 ml-2" />
                              <span className="text-gray-600">{employee.email}</span>
                            </div>
                          )}
                          {employee.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-blue-500 ml-2" />
                              <span className="text-gray-600">{employee.phone}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-50 transition-colors"
                        title="تعديل الموظف"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEmployee(employee)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 transition-colors"
                        title="حذف الموظف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ملخص الرواتب */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">ملخص الرواتب الشهرية</h4>
              <p className="text-sm text-gray-600">إجمالي رواتب جميع الموظفين النشطين</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSalaries)}</p>
              <p className="text-sm text-gray-600">{totalEmployees} موظف</p>
            </div>
          </div>
        </div>

        {/* زر الإغلاق */}
        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            إغلاق
          </Button>
        </div>
      </div>

      {/* نموذج إضافة موظف */}
      <EmployeeForm
        isOpen={isEmployeeFormOpen}
        onClose={() => setIsEmployeeFormOpen(false)}
        onSubmit={handleAddEmployee}
      />

      {/* نافذة تأكيد الحذف */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف الموظف"
        message="هل أنت متأكد من أنك تريد حذف هذا الموظف؟ سيتم تعطيل حسابه وإخفاؤه من القائمة."
        itemName={selectedEmployee?.name}
      />
    </Modal>
  )
}
