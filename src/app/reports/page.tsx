'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { useInvoices } from '@/contexts/app-context'
import { useFormatting } from '@/contexts/settings-context'
import { useTranslation } from '@/hooks/use-translation'

export default function ReportsPage() {
  const { invoices } = useInvoices()
  const { formatCurrency, formatDate } = useFormatting()
  const { t, currentLanguage } = useTranslation()
  
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // حساب التقارير
  const reports = useMemo(() => {
    const selectedDateObj = new Date(selectedDate)
    let filteredInvoices = invoices

    if (selectedPeriod === 'daily') {
      filteredInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date)
        return invoiceDate.toDateString() === selectedDateObj.toDateString()
      })
    } else if (selectedPeriod === 'weekly') {
      const startOfWeek = new Date(selectedDateObj)
      startOfWeek.setDate(selectedDateObj.getDate() - selectedDateObj.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      filteredInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date)
        return invoiceDate >= startOfWeek && invoiceDate <= endOfWeek
      })
    } else if (selectedPeriod === 'monthly') {
      filteredInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date)
        return invoiceDate.getMonth() === selectedDateObj.getMonth() && 
               invoiceDate.getFullYear() === selectedDateObj.getFullYear()
      })
    }

    const totalInvoices = filteredInvoices.length
    const totalRevenue = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const totalTax = filteredInvoices.reduce((sum, invoice) => sum + invoice.tax_amount, 0)
    const paidInvoices = filteredInvoices.filter(invoice => invoice.status === 'paid')
    const pendingInvoices = filteredInvoices.filter(invoice => invoice.status === 'sent')
    const overdueInvoices = filteredInvoices.filter(invoice => invoice.status === 'overdue')
    
    const paidAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const overdueAmount = overdueInvoices.reduce((sum, invoice) => sum + invoice.total, 0)

    return {
      totalInvoices,
      totalRevenue,
      totalTax,
      paidInvoices: paidInvoices.length,
      pendingInvoices: pendingInvoices.length,
      overdueInvoices: overdueInvoices.length,
      paidAmount,
      pendingAmount,
      overdueAmount,
      filteredInvoices
    }
  }, [invoices, selectedPeriod, selectedDate])

  const exportReport = () => {
    const reportData = {
      period: selectedPeriod,
      date: selectedDate,
      summary: {
        totalInvoices: reports.totalInvoices,
        totalRevenue: reports.totalRevenue,
        totalTax: reports.totalTax,
        paidAmount: reports.paidAmount,
        pendingAmount: reports.pendingAmount,
        overdueAmount: reports.overdueAmount
      },
      invoices: reports.filteredInvoices
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `invoice_report_${selectedPeriod}_${selectedDate}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getPeriodText = () => {
    if (currentLanguage === 'ar') {
      switch (selectedPeriod) {
        case 'daily': return 'يومي'
        case 'weekly': return 'أسبوعي'
        case 'monthly': return 'شهري'
        default: return 'يومي'
      }
    } else {
      switch (selectedPeriod) {
        case 'daily': return 'Daily'
        case 'weekly': return 'Weekly'
        case 'monthly': return 'Monthly'
        default: return 'Daily'
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentLanguage === 'ar' ? 'تقارير الفواتير' : 'Invoice Reports'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'ar' ? 'تقارير مفصلة للفواتير اليومية والشهرية' : 'Detailed daily and monthly invoice reports'}
          </p>
        </div>
        <Button
          onClick={exportReport}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Download className="h-4 w-4" />
          {currentLanguage === 'ar' ? 'تصدير التقرير' : 'Export Report'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {currentLanguage === 'ar' ? 'فترة التقرير' : 'Report Period'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === 'ar' ? 'نوع التقرير' : 'Report Type'}
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">{currentLanguage === 'ar' ? 'يومي' : 'Daily'}</option>
                <option value="weekly">{currentLanguage === 'ar' ? 'أسبوعي' : 'Weekly'}</option>
                <option value="monthly">{currentLanguage === 'ar' ? 'شهري' : 'Monthly'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === 'ar' ? 'التاريخ' : 'Date'}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">
                  {currentLanguage === 'ar' ? 'التقرير الحالي' : 'Current Report'}
                </p>
                <p className="text-lg font-bold text-blue-800">
                  {getPeriodText()} - {formatDate(selectedDate)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">
                  {currentLanguage === 'ar' ? 'إجمالي الفواتير' : 'Total Invoices'}
                </p>
                <p className="text-2xl font-bold">{reports.totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">
                  {currentLanguage === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(reports.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">
                  {currentLanguage === 'ar' ? 'إجمالي الضرائب' : 'Total Tax'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(reports.totalTax)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">
                  {currentLanguage === 'ar' ? 'الفواتير المدفوعة' : 'Paid Invoices'}
                </p>
                <p className="text-2xl font-bold">{reports.paidInvoices}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {currentLanguage === 'ar' ? 'تفصيل حالة الفواتير' : 'Invoice Status Breakdown'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-800">
                  {currentLanguage === 'ar' ? 'مدفوعة' : 'Paid'}
                </p>
                <p className="text-sm text-green-600">
                  {reports.paidInvoices} {currentLanguage === 'ar' ? 'فاتورة' : 'invoices'}
                </p>
              </div>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(reports.paidAmount)}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="font-medium text-yellow-800">
                  {currentLanguage === 'ar' ? 'معلقة' : 'Pending'}
                </p>
                <p className="text-sm text-yellow-600">
                  {reports.pendingInvoices} {currentLanguage === 'ar' ? 'فاتورة' : 'invoices'}
                </p>
              </div>
              <p className="text-lg font-bold text-yellow-700">
                {formatCurrency(reports.pendingAmount)}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="font-medium text-red-800">
                  {currentLanguage === 'ar' ? 'متأخرة' : 'Overdue'}
                </p>
                <p className="text-sm text-red-600">
                  {reports.overdueInvoices} {currentLanguage === 'ar' ? 'فاتورة' : 'invoices'}
                </p>
              </div>
              <p className="text-lg font-bold text-red-700">
                {formatCurrency(reports.overdueAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {currentLanguage === 'ar' ? 'إحصائيات سريعة' : 'Quick Statistics'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-2xl font-bold text-blue-600">
                  {reports.totalInvoices > 0 ? Math.round((reports.paidInvoices / reports.totalInvoices) * 100) : 0}%
                </p>
                <p className="text-sm text-blue-700">
                  {currentLanguage === 'ar' ? 'معدل الدفع' : 'Payment Rate'}
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(reports.totalInvoices > 0 ? reports.totalRevenue / reports.totalInvoices : 0)}
                </p>
                <p className="text-sm text-green-700">
                  {currentLanguage === 'ar' ? 'متوسط الفاتورة' : 'Average Invoice'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {currentLanguage === 'ar' ? 'نسبة الضريبة من الإيرادات' : 'Tax Percentage of Revenue'}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {reports.totalRevenue > 0 ? Math.round((reports.totalTax / reports.totalRevenue) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${reports.totalRevenue > 0 ? (reports.totalTax / reports.totalRevenue) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      {reports.filteredInvoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {currentLanguage === 'ar' ? 'قائمة الفواتير' : 'Invoice List'}
              <span className="text-sm font-normal text-gray-500">
                ({reports.filteredInvoices.length} {currentLanguage === 'ar' ? 'فاتورة' : 'invoices'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      {currentLanguage === 'ar' ? 'رقم الفاتورة' : 'Invoice #'}
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      {currentLanguage === 'ar' ? 'العميل' : 'Customer'}
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      {currentLanguage === 'ar' ? 'التاريخ' : 'Date'}
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      {currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      {currentLanguage === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {invoice.invoice_number}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {invoice.customer_name}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm font-medium">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {currentLanguage === 'ar' ?
                            (invoice.status === 'paid' ? 'مدفوعة' :
                             invoice.status === 'sent' ? 'مرسلة' :
                             invoice.status === 'overdue' ? 'متأخرة' : 'مسودة') :
                            (invoice.status === 'paid' ? 'Paid' :
                             invoice.status === 'sent' ? 'Sent' :
                             invoice.status === 'overdue' ? 'Overdue' : 'Draft')
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {reports.filteredInvoices.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'ar' ? 'لا توجد فواتير' : 'No Invoices Found'}
            </h3>
            <p className="text-gray-600">
              {currentLanguage === 'ar' ?
                'لا توجد فواتير في الفترة المحددة' :
                'No invoices found for the selected period'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
