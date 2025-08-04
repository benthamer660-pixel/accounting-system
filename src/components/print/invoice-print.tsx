'use client'

import { Invoice, useCustomers } from '@/contexts/app-context'
import { formatCurrency, formatDate, getInvoiceStatusText } from '@/lib/utils'

interface InvoicePrintProps {
  invoice: Invoice
}

export function InvoicePrint({ invoice }: InvoicePrintProps) {
  const { getCustomer } = useCustomers()
  const customer = getCustomer(invoice.customer_id)

  return (
    <div className="print-invoice bg-white p-8 max-w-4xl mx-auto" dir="rtl">
      {/* رأس الشركة */}
      <div className="text-center mb-8 border-b-2 border-blue-500 pb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">شركة المحاسبة المتقدمة</h1>
        <p className="text-gray-600">نظام إدارة الفواتير والمحاسبة</p>
        <div className="flex justify-center space-x-4 space-x-reverse mt-2 text-sm text-gray-500">
          <span>📧 info@accounting.com</span>
          <span>📞 +966 11 123 4567</span>
          <span>📍 الرياض، المملكة العربية السعودية</span>
        </div>
      </div>

      {/* معلومات الفاتورة */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">معلومات الفاتورة</h2>
          <div className="space-y-2">
            <div className="flex">
              <span className="font-medium text-gray-600 w-32">رقم الفاتورة:</span>
              <span className="font-bold text-blue-600">{invoice.invoice_number}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-600 w-32">تاريخ الإصدار:</span>
              <span>{formatDate(invoice.date)}</span>
            </div>
            {invoice.due_date && (
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">تاريخ الاستحقاق:</span>
                <span>{formatDate(invoice.due_date)}</span>
              </div>
            )}
            <div className="flex">
              <span className="font-medium text-gray-600 w-32">حالة الفاتورة:</span>
              <span className="font-medium">{getInvoiceStatusText(invoice.status)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">معلومات العميل</h2>
          <div className="space-y-2">
            <div className="flex">
              <span className="font-medium text-gray-600 w-32">اسم العميل:</span>
              <span className="font-medium">{customer?.name || invoice.customer_name}</span>
            </div>
            {customer?.email && (
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">البريد الإلكتروني:</span>
                <span>{customer.email}</span>
              </div>
            )}
            {customer?.phone && (
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">رقم الهاتف:</span>
                <span>{customer.phone}</span>
              </div>
            )}
            {customer?.address && (
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">العنوان:</span>
                <span>{customer.address}</span>
              </div>
            )}
            {customer?.tax_number && (
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">الرقم الضريبي:</span>
                <span>{customer.tax_number}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* جدول العناصر */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">تفاصيل الفاتورة</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-right font-bold">المنتج</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold">الكمية</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold">سعر الوحدة</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">{item.product_name}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{formatCurrency(item.unit_price)}</td>
                <td className="border border-gray-300 px-4 py-3 text-center font-medium">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ملخص المبالغ */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص المبالغ</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الفرعي:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">الضريبة (15%):</span>
                <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
              </div>
              
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">الخصم:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(invoice.discount_amount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span className="text-blue-600">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ملاحظات */}
      {invoice.notes && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">ملاحظات:</h3>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-gray-700">{invoice.notes}</p>
          </div>
        </div>
      )}

      {/* تذييل الفاتورة */}
      <div className="border-t-2 border-gray-300 pt-6 mt-8">
        <div className="text-center text-gray-600">
          <p className="mb-2">شكراً لتعاملكم معنا</p>
          <p className="text-sm">تم إنشاء هذه الفاتورة بواسطة نظام المحاسبة المتقدم</p>
          <p className="text-xs mt-2">تاريخ الطباعة: {formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      {/* أنماط الطباعة */}
      <style jsx>{`
        @media print {
          .print-invoice {
            margin: 0;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
          }
          
          .print-invoice h1 {
            font-size: 24px;
          }
          
          .print-invoice h2 {
            font-size: 16px;
          }
          
          .print-invoice h3 {
            font-size: 14px;
          }
          
          .print-invoice table {
            font-size: 11px;
          }
          
          .print-invoice th,
          .print-invoice td {
            padding: 8px 4px;
          }
          
          /* إخفاء العناصر غير المطلوبة في الطباعة */
          .no-print {
            display: none !important;
          }
          
          /* ضمان الطباعة بالأبيض والأسود */
          .print-invoice * {
            color: black !important;
            background: white !important;
          }
          
          .print-invoice .bg-gray-100 {
            background: #f5f5f5 !important;
          }
          
          .print-invoice .bg-gray-50 {
            background: #fafafa !important;
          }
          
          .print-invoice .text-blue-600 {
            color: #000 !important;
            font-weight: bold;
          }
          
          .print-invoice .border-blue-500 {
            border-color: #000 !important;
          }
        }
      `}</style>
    </div>
  )
}
