'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, DollarSign, Eye, Printer } from 'lucide-react'
import { Customer, useInvoices, Invoice } from '@/contexts/app-context'
import { formatCurrency, formatDate, getInvoiceStatusColor, getInvoiceStatusText } from '@/lib/utils'
import { InvoiceDetailsModal } from './invoice-details-modal'
import { InvoicePrint } from '@/components/print/invoice-print'

interface CustomerInvoicesModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
}

export function CustomerInvoicesModal({ isOpen, onClose, customer }: CustomerInvoicesModalProps) {
  const { getInvoicesByCustomer } = useInvoices()
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)

  if (!customer) return null

  const customerInvoices = getInvoicesByCustomer(customer.id)
  
  // حساب إحصائيات العميل
  const totalInvoices = customerInvoices.length
  const totalAmount = customerInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const paidAmount = customerInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0)
  const pendingAmount = customerInvoices
    .filter(invoice => invoice.status === 'sent')
    .reduce((sum, invoice) => sum + invoice.total, 0)
  const overdueAmount = customerInvoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.total, 0)

  // وظائف التعامل مع الأحداث
  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDetailsModalOpen(true)
  }

  const handlePrintInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsPrintModalOpen(true)

    // طباعة فورية
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`فواتير العميل: ${customer.name}`}
      size="xl"
    >
      <div className="p-6">
        {/* إحصائيات العميل */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">إجمالي الفواتير</p>
                <p className="text-2xl font-bold text-blue-900">{totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">المبلغ المدفوع</p>
                <p className="text-lg font-bold text-green-900">{formatCurrency(paidAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">المبلغ المعلق</p>
                <p className="text-lg font-bold text-yellow-900">{formatCurrency(pendingAmount)}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">المبلغ المتأخر</p>
                <p className="text-lg font-bold text-red-900">{formatCurrency(overdueAmount)}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* قائمة الفواتير */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 ml-2 text-blue-500" />
            قائمة الفواتير ({totalInvoices})
          </h3>

          {customerInvoices.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">لا توجد فواتير</h4>
              <p className="text-gray-600">لم يتم إنشاء أي فواتير لهذا العميل بعد</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        رقم الفاتورة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الاستحقاق
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المبلغ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customerInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-blue-500 ml-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {invoice.invoice_number}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="secondary" 
                            className={`${getInvoiceStatusColor(invoice.status)} text-white`}
                          >
                            {getInvoiceStatusText(invoice.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(invoice)}
                              className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                              title="عرض تفاصيل الفاتورة"
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintInvoice(invoice)}
                              className="hover:bg-green-50 hover:border-green-300 transition-colors"
                              title="طباعة الفاتورة"
                            >
                              <Printer className="h-4 w-4 text-green-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ملخص إجمالي */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">إجمالي المعاملات</h4>
              <p className="text-sm text-gray-600">جميع الفواتير لهذا العميل</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalAmount)}</p>
              <p className="text-sm text-gray-600">{totalInvoices} فاتورة</p>
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

      {/* نافذة تفاصيل الفاتورة */}
      <InvoiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        invoice={selectedInvoice}
        onPrint={() => handlePrintInvoice(selectedInvoice!)}
      />

      {/* نافذة الطباعة المخفية */}
      {isPrintModalOpen && selectedInvoice && (
        <div className="hidden">
          <InvoicePrint invoice={selectedInvoice} />
        </div>
      )}
    </Modal>
  )
}
