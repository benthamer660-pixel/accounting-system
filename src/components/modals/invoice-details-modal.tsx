'use client'

import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Package,
  DollarSign,
  Hash,
  Printer
} from 'lucide-react'
import { Invoice, useCustomers, useProducts } from '@/contexts/app-context'
import { formatCurrency, formatDate, getInvoiceStatusColor, getInvoiceStatusText } from '@/lib/utils'

interface InvoiceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
  onPrint?: () => void
}

export function InvoiceDetailsModal({ isOpen, onClose, invoice, onPrint }: InvoiceDetailsModalProps) {
  const { getCustomer } = useCustomers()
  const { getProduct } = useProducts()
  
  if (!invoice) return null

  const customer = getCustomer(invoice.customer_id)

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      // طباعة افتراضية
      window.print()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تفاصيل الفاتورة: ${invoice.invoice_number}`}
      size="xl"
    >
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        {/* رأس الفاتورة */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500 ml-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{invoice.invoice_number}</h2>
                <p className="text-gray-600">فاتورة مبيعات</p>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant="secondary" 
                className={`${getInvoiceStatusColor(invoice.status)} text-white text-sm px-3 py-1`}
              >
                {getInvoiceStatusText(invoice.status)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 ml-2" />
              <div>
                <p className="text-sm text-gray-600">تاريخ الفاتورة</p>
                <p className="font-medium">{formatDate(invoice.date)}</p>
              </div>
            </div>
            
            {invoice.due_date && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-orange-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">تاريخ الاستحقاق</p>
                  <p className="font-medium">{formatDate(invoice.due_date)}</p>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 ml-2" />
              <div>
                <p className="text-sm text-gray-600">إجمالي المبلغ</p>
                <p className="font-bold text-lg text-green-600">{formatCurrency(invoice.total)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات العميل */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 ml-2 text-blue-500" />
            معلومات العميل
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">اسم العميل</p>
              <p className="font-medium text-gray-900">{customer?.name || invoice.customer_name}</p>
            </div>
            
            {customer?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-green-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                  <p className="font-medium text-gray-900">{customer.email}</p>
                </div>
              </div>
            )}
            
            {customer?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-purple-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">رقم الهاتف</p>
                  <p className="font-medium text-gray-900">{customer.phone}</p>
                </div>
              </div>
            )}
            
            {customer?.address && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-orange-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">العنوان</p>
                  <p className="font-medium text-gray-900">{customer.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* عناصر الفاتورة */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 ml-2 text-purple-500" />
            عناصر الفاتورة
          </h3>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الكمية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سعر الوحدة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجمالي
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-purple-500 ml-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {item.product_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 text-blue-500 ml-2" />
                        <span className="text-sm text-gray-900">{item.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ملخص المبالغ */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص المبالغ</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">المجموع الفرعي:</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">الضريبة (15%):</span>
              <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
            </div>
            
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">الخصم:</span>
                <span className="font-medium text-red-600">-{formatCurrency(invoice.discount_amount)}</span>
              </div>
            )}
            
            <div className="border-t border-green-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">الإجمالي:</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ملاحظات */}
        {invoice.notes && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">ملاحظات:</h4>
            <p className="text-sm text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex space-x-3 space-x-reverse pt-6 border-t border-gray-200">
          <Button
            onClick={handlePrint}
            className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            <Printer className="h-4 w-4 ml-2" />
            طباعة الفاتورة
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </Modal>
  )
}
