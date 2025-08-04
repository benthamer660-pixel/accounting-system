'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, Receipt, Calendar, DollarSign, Users, BarChart3 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/global-utils'
import { useFormatting } from '@/contexts/settings-context'
import { useTranslation } from '@/hooks/use-translation'
import { ExpenseForm } from '@/components/forms/expense-form'
import { EditExpenseForm } from '@/components/forms/edit-expense-form'
import { DeleteConfirmation } from '@/components/ui/delete-confirmation'
import { EmployeesManagementModal } from '@/components/modals/employees-management-modal'
import { ExpensesReportModal } from '@/components/modals/expenses-report-modal'
import toast from 'react-hot-toast'

// تعريف نوع المصروف
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

// Mock data
const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'إيجار المكتب',
    description: 'إيجار شهر يناير 2024',
    amount: 8000,
    category: 'إيجارات',
    date: '2024-01-01',
    receipt_url: null,
    created_at: '2024-01-01',
  },
  {
    id: '2',
    title: 'فاتورة الكهرباء',
    description: 'فاتورة كهرباء شهر ديسمبر 2023',
    amount: 450,
    category: 'مرافق',
    date: '2024-01-05',
    receipt_url: null,
    created_at: '2024-01-05',
  },
  {
    id: '3',
    title: 'راتب الموظف أحمد',
    description: 'راتب شهر يناير 2024',
    amount: 5000,
    category: 'رواتب',
    date: '2024-01-10',
    receipt_url: null,
    created_at: '2024-01-10',
  },
  {
    id: '4',
    title: 'شراء مواد مكتبية',
    description: 'أوراق وأقلام ومستلزمات مكتبية',
    amount: 320,
    category: 'مستلزمات',
    date: '2024-01-12',
    receipt_url: null,
    created_at: '2024-01-12',
  },
  {
    id: '5',
    title: 'صيانة الطابعة',
    description: 'صيانة دورية للطابعة الرئيسية',
    amount: 150,
    category: 'صيانة',
    date: '2024-01-15',
    receipt_url: null,
    created_at: '2024-01-15',
  },
  {
    id: '6',
    title: 'اشتراك الإنترنت',
    description: 'اشتراك شهري للإنترنت',
    amount: 200,
    category: 'مرافق',
    date: '2024-01-16',
    receipt_url: null,
    created_at: '2024-01-16',
  },
]

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

export default function ExpensesPage() {
  const { formatCurrency: globalFormatCurrency, formatDate: globalFormatDate } = useFormatting()
  const { t } = useTranslation()
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEmployeesModalOpen, setIsEmployeesModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const thisMonthExpenses = expenses
    .filter(expense => new Date(expense.date).getMonth() === new Date().getMonth())
    .reduce((sum, expense) => sum + expense.amount, 0)

  // Group expenses by category for summary
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  // وظائف التعامل مع الأحداث
  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev])
    toast.success('تم إضافة المصروف بنجاح!')
  }

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsEditFormOpen(true)
  }

  const handleUpdateExpense = (id: string, updatedData: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense =>
      expense.id === id ? { ...expense, ...updatedData } : expense
    ))
    setIsEditFormOpen(false)
    setSelectedExpense(null)
    toast.success('تم تحديث المصروف بنجاح!')
  }

  const handleDeleteExpense = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedExpense) {
      setExpenses(prev => prev.filter(expense => expense.id !== selectedExpense.id))
      setIsDeleteDialogOpen(false)
      setSelectedExpense(null)
      toast.success('تم حذف المصروف بنجاح!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('expenses')}</h1>
          <p className="text-gray-600">
            {t('currentLanguage') === 'ar' ? 'تتبع وإدارة مصروفات العمل' : 'Track and manage business expenses'}
          </p>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
            onClick={() => setIsReportModalOpen(true)}
          >
            <BarChart3 className="h-4 w-4" />
            {t('expensesReport')}
          </Button>
          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            onClick={() => setIsEmployeesModalOpen(true)}
          >
            <Users className="h-4 w-4" />
            {t('employeeManagement')}
          </Button>
          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {t('addExpense')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-2xl font-bold text-red-600">
                  {globalFormatCurrency(totalExpenses)}
                </div>
                <div className="text-sm text-gray-600">إجمالي المصروفات</div>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-2xl font-bold text-orange-600">
                  {globalFormatCurrency(thisMonthExpenses)}
                </div>
                <div className="text-sm text-gray-600">مصروفات هذا الشهر</div>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-2xl font-bold text-blue-600">
                  {expenses.length}
                </div>
                <div className="text-sm text-gray-600">عدد المصروفات</div>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="البحث في المصروفات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع الفئات</option>
              {expenseCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Button variant="outline">تصدير</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Expenses List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>قائمة المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{expense.title}</h3>
                        <p className="text-sm text-gray-600">{expense.description}</p>
                        <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500 mt-1">
                          <span>{globalFormatDate(expense.date)}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">{expense.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="text-left">
                        <div className="font-semibold text-red-600">
                          {globalFormatCurrency(expense.amount)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-50 transition-colors"
                        onClick={() => handleEditExpense(expense)}
                        title="تعديل المصروف"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDeleteExpense(expense)}
                        title="حذف المصروف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>ملخص حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(expensesByCategory)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{category}</div>
                        <div className="text-sm text-gray-500">
                          {expenses.filter(e => e.category === category).length} مصروف
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{globalFormatCurrency(amount)}</div>
                        <div className="text-xs text-gray-500">
                          {((amount / totalExpenses) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Empty State */}
      {filteredExpenses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد مصروفات
            </h3>
            <p className="text-gray-600 mb-4">
              لم يتم العثور على مصروفات تطابق البحث
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة مصروف جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* نموذج إضافة مصروف */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddExpense}
      />

      {/* نموذج تعديل مصروف */}
      <EditExpenseForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleUpdateExpense}
        expense={selectedExpense}
      />

      {/* نافذة تأكيد الحذف */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف المصروف"
        message="هل أنت متأكد من أنك تريد حذف هذا المصروف؟ لا يمكن التراجع عن هذا الإجراء."
        itemName={selectedExpense?.title}
      />

      {/* نافذة إدارة الموظفين والرواتب */}
      <EmployeesManagementModal
        isOpen={isEmployeesModalOpen}
        onClose={() => setIsEmployeesModalOpen(false)}
      />

      {/* نافذة تقرير المصروفات */}
      <ExpensesReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        expenses={expenses}
      />
    </div>
  )
}
