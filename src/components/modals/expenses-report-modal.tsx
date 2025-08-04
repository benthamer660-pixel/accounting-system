'use client'

import { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  FileText,
  Download,
  Filter,
  Receipt
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

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

interface ExpensesReportModalProps {
  isOpen: boolean
  onClose: () => void
  expenses: Expense[]
}

export function ExpensesReportModal({ isOpen, onClose, expenses }: ExpensesReportModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))

  // حساب التقارير حسب الفترة المحددة
  const reportData = useMemo(() => {
    const now = new Date()
    const currentMonth = now.toISOString().slice(0, 7)
    const currentDate = now.toISOString().slice(0, 10)

    // تصفية المصروفات حسب الفترة
    let filteredExpenses = expenses

    if (selectedPeriod === 'daily') {
      filteredExpenses = expenses.filter(expense => 
        expense.date === selectedDate
      )
    } else if (selectedPeriod === 'weekly') {
      const weekStart = new Date(selectedDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= weekStart && expenseDate <= weekEnd
      })
    } else if (selectedPeriod === 'monthly') {
      filteredExpenses = expenses.filter(expense => 
        expense.date.startsWith(selectedMonth)
      )
    }

    // حساب الإحصائيات
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalCount = filteredExpenses.length
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0

    // تجميع حسب الفئة
    const byCategory = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    // تجميع حسب التاريخ (للرسم البياني)
    const byDate = filteredExpenses.reduce((acc, expense) => {
      const date = expense.date
      acc[date] = (acc[date] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    // مقارنة مع الفترة السابقة
    let previousPeriodExpenses = []
    if (selectedPeriod === 'daily') {
      const prevDate = new Date(selectedDate)
      prevDate.setDate(prevDate.getDate() - 1)
      previousPeriodExpenses = expenses.filter(expense => 
        expense.date === prevDate.toISOString().slice(0, 10)
      )
    } else if (selectedPeriod === 'monthly') {
      const prevMonth = new Date(selectedMonth + '-01')
      prevMonth.setMonth(prevMonth.getMonth() - 1)
      const prevMonthStr = prevMonth.toISOString().slice(0, 7)
      previousPeriodExpenses = expenses.filter(expense => 
        expense.date.startsWith(prevMonthStr)
      )
    }

    const previousTotal = previousPeriodExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const changePercent = previousTotal > 0 ? ((totalAmount - previousTotal) / previousTotal) * 100 : 0

    return {
      filteredExpenses,
      totalAmount,
      totalCount,
      averageAmount,
      byCategory,
      byDate,
      previousTotal,
      changePercent
    }
  }, [expenses, selectedPeriod, selectedMonth, selectedDate])

  const handleExportReport = () => {
    const reportContent = `
تقرير المصروفات - ${selectedPeriod === 'daily' ? 'يومي' : selectedPeriod === 'weekly' ? 'أسبوعي' : 'شهري'}
التاريخ: ${selectedPeriod === 'monthly' ? selectedMonth : selectedDate}

الإحصائيات العامة:
- إجمالي المصروفات: ${formatCurrency(reportData.totalAmount)}
- عدد المصروفات: ${reportData.totalCount}
- متوسط المصروف: ${formatCurrency(reportData.averageAmount)}

المصروفات حسب الفئة:
${Object.entries(reportData.byCategory)
  .sort(([,a], [,b]) => b - a)
  .map(([category, amount]) => `- ${category}: ${formatCurrency(amount)}`)
  .join('\n')}

تفاصيل المصروفات:
${reportData.filteredExpenses
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .map(expense => `${formatDate(expense.date)} - ${expense.title} - ${expense.category} - ${formatCurrency(expense.amount)}`)
  .join('\n')}
    `

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `تقرير_المصروفات_${selectedPeriod}_${selectedPeriod === 'monthly' ? selectedMonth : selectedDate}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تقرير المصروفات"
      size="xl"
    >
      <div className="p-6 max-h-[85vh] overflow-y-auto">
        {/* فلاتر التقرير */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-blue-500 ml-2" />
            <h3 className="text-lg font-semibold text-gray-900">فلاتر التقرير</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* نوع الفترة */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">نوع التقرير</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">تقرير يومي</option>
                <option value="weekly">تقرير أسبوعي</option>
                <option value="monthly">تقرير شهري</option>
              </select>
            </div>

            {/* اختيار التاريخ/الشهر */}
            {selectedPeriod === 'monthly' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">الشهر</label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">التاريخ</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* زر التصدير */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">تصدير التقرير</label>
              <Button
                onClick={handleExportReport}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <Download className="h-4 w-4 ml-2" />
                تصدير التقرير
              </Button>
            </div>
          </div>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(reportData.totalAmount)}
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
                  <div className="text-2xl font-bold text-blue-600">
                    {reportData.totalCount}
                  </div>
                  <div className="text-sm text-gray-600">عدد المصروفات</div>
                </div>
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(reportData.averageAmount)}
                  </div>
                  <div className="text-sm text-gray-600">متوسط المصروف</div>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className={`text-2xl font-bold ${reportData.changePercent >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {reportData.changePercent >= 0 ? '+' : ''}{reportData.changePercent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">مقارنة بالفترة السابقة</div>
                </div>
                {reportData.changePercent >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-red-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-green-600" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* المصروفات حسب الفئة */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 ml-2 text-purple-500" />
              المصروفات حسب الفئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reportData.byCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = (amount / reportData.totalAmount) * 100
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{category}</span>
                          <span className="text-sm text-gray-600">{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* قائمة المصروفات التفصيلية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 ml-2 text-blue-500" />
              تفاصيل المصروفات ({reportData.totalCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.filteredExpenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p>لا توجد مصروفات في الفترة المحددة</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportData.filteredExpenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{expense.title}</h4>
                          <span className="font-bold text-red-600">{formatCurrency(expense.amount)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 ml-1" />
                          <span>{formatDate(expense.date)}</span>
                          <span className="mx-2">•</span>
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs">{expense.category}</span>
                        </div>
                        {expense.description && (
                          <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

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
    </Modal>
  )
}
