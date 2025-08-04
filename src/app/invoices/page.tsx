'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, FileText, Download, Eye } from 'lucide-react'
import { getInvoiceStatusColor, getInvoiceStatusText } from '@/lib/global-utils'
import { InvoiceForm } from '@/components/forms/invoice-form'
import { InvoiceDetails } from '@/components/invoices/invoice-details'
import { useInvoices, useCustomers } from '@/contexts/app-context'
import { useFormatting, useSettings } from '@/contexts/settings-context'

export default function InvoicesPage() {
  const { formatCurrency, formatDate } = useFormatting()
  const { companySettings } = useSettings()

  const {
    invoices,
    addInvoice,
    getTotalRevenue,
    getPaidAmount,
    getPendingAmount,
    getOverdueAmount,
    isLoading
  } = useInvoices()
  const { customers } = useCustomers()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // حساب الإحصائيات من Context
  const totalRevenue = getTotalRevenue()
  const paidAmount = getPaidAmount()
  const pendingAmount = getPendingAmount()
  const overdueAmount = getOverdueAmount()

  const handleAddInvoice = (newInvoice: any) => {
    addInvoice(newInvoice)
  }

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsDetailsOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الفواتير...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الفواتير</h1>
          <p className="text-gray-600">إدارة فواتير البيع والشراء</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="h-4 w-4" />
          إنشاء فاتورة جديدة
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-sm text-gray-600">إجمالي الفواتير</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(paidAmount)}
              </div>
              <div className="text-sm text-gray-600">المبلغ المدفوع</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(pendingAmount)}
              </div>
              <div className="text-sm text-gray-600">المبلغ المعلق</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(overdueAmount)}
              </div>
              <div className="text-sm text-gray-600">المبلغ المتأخر</div>
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
                placeholder="البحث في الفواتير..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="sent">مرسلة</option>
              <option value="paid">مدفوعة</option>
              <option value="overdue">متأخرة</option>
            </select>
            <Button variant="outline">تصدير</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الفواتير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4 font-medium text-gray-900">رقم الفاتورة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">العميل</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">التاريخ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">تاريخ الاستحقاق</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">المبلغ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm">{invoice.invoice_number}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{invoice.customer_name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{formatDate(invoice.date)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">{formatCurrency(invoice.total)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                        {getInvoiceStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-1 space-x-reverse">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewInvoice(invoice)}
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد فواتير
            </h3>
            <p className="text-gray-600 mb-4">
              لم يتم العثور على فواتير تطابق البحث
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء فاتورة جديدة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* نموذج إنشاء فاتورة */}
      <InvoiceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddInvoice}
      />

      {/* تفاصيل الفاتورة */}
      <InvoiceDetails
        invoice={selectedInvoice}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  )
}
