'use client'

import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFormatting, useSettings } from '@/contexts/settings-context'
import { getInvoiceStatusColor, getInvoiceStatusText } from '@/lib/global-utils'
import { Calendar, User, FileText, DollarSign, Calculator, Receipt } from 'lucide-react'

interface Invoice {
  id: string
  invoice_number: string
  customer_id: string
  customer_name: string
  date: string
  due_date: string | null
  subtotal: number
  tax_amount: number
  discount_amount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string | null
  items: Array<{
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
    total: number
  }>
  created_at: string
}

interface InvoiceDetailsProps {
  invoice: Invoice | null
  isOpen: boolean
  onClose: () => void
}

export function InvoiceDetails({ invoice, isOpen, onClose }: InvoiceDetailsProps) {
  const { formatCurrency, formatDate } = useFormatting()
  const { companySettings } = useSettings()

  if (!invoice) return null

  // إعادة حساب الضريبة بناءً على معدل الضريبة الحالي
  const recalculatedTax = (invoice.subtotal * companySettings.tax_rate) / 100
  const recalculatedTotal = invoice.subtotal + recalculatedTax - invoice.discount_amount

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تفاصيل الفاتورة ${invoice.invoice_number}`}
      size="lg"
    >
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        {/* معلومات الفاتورة الأساسية */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 ml-2" />
              <div>
                <p className="text-sm text-gray-600">رقم الفاتورة</p>
                <p className="font-semibold">{invoice.invoice_number}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <User className="h-5 w-5 text-green-500 ml-2" />
              <div>
                <p className="text-sm text-gray-600">العميل</p>
                <p className="font-semibold">{invoice.customer_name}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-orange-500 ml-2" />
              <div>
                <p className="text-sm text-gray-600">تاريخ الفاتورة</p>
                <p className="font-semibold">{formatDate(invoice.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-red-500 ml-2" />
              <div>
                <p className="text-sm text-gray-600">تاريخ الاستحقاق</p>
                <p className="font-semibold">
                  {invoice.due_date ? formatDate(invoice.due_date) : 'غير محدد'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <Receipt className="h-5 w-5 text-purple-500 ml-2" />
              <span className="text-sm text-gray-600">الحالة:</span>
            </div>
            <Badge className={getInvoiceStatusColor(invoice.status)}>
              {getInvoiceStatusText(invoice.status)}
            </Badge>
          </div>
        </div>

        {/* عناصر الفاتورة */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">عناصر الفاتورة</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">المنتج</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الكمية</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">سعر الوحدة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.product_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(item.unit_price)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ملخص المبالغ */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="h-5 w-5 ml-2 text-green-500" />
            ملخص المبالغ
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-gray-700">
              <span>المجموع الفرعي:</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            
            {/* عرض الضريبة الأصلية والمحدثة */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-gray-700">
                <span>الضريبة الأصلية:</span>
                <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
              </div>
              
              {Math.abs(recalculatedTax - invoice.tax_amount) > 0.01 && (
                <div className="flex justify-between items-center text-blue-700 bg-blue-100 px-3 py-2 rounded">
                  <span>الضريبة المحدثة ({companySettings.tax_rate}%):</span>
                  <span className="font-bold">{formatCurrency(recalculatedTax)}</span>
                </div>
              )}
            </div>
            
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between items-center text-gray-700">
                <span>الخصم:</span>
                <span className="font-medium text-red-600">-{formatCurrency(invoice.discount_amount)}</span>
              </div>
            )}
            
            <div className="border-t border-green-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">الإجمالي الأصلي:</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(invoice.total)}</span>
              </div>
              
              {Math.abs(recalculatedTotal - invoice.total) > 0.01 && (
                <div className="flex justify-between items-center mt-2 bg-blue-100 px-3 py-2 rounded">
                  <span className="text-lg font-bold text-blue-900">الإجمالي المحدث:</span>
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(recalculatedTotal)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* الملاحظات */}
        {invoice.notes && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">الملاحظات</h3>
            <p className="text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {/* تنبيه تغيير معدل الضريبة */}
        {Math.abs(recalculatedTax - invoice.tax_amount) > 0.01 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <div className="flex items-start">
              <DollarSign className="h-5 w-5 text-blue-500 ml-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">تحديث معدل الضريبة</h4>
                <p className="text-sm text-blue-700 mt-1">
                  تم تغيير معدل الضريبة في الإعدادات إلى {companySettings.tax_rate}%. 
                  الحسابات المعروضة أعلاه تعكس المعدل الجديد.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            إغلاق
          </Button>
          <Button
            className="px-6 h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200"
          >
            طباعة الفاتورة
          </Button>
        </div>
      </div>
    </Modal>
  )
}
