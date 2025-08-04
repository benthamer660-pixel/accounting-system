'use client'

import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Package,
  Users,
  AlertTriangle
} from 'lucide-react'
import { useProducts, useCustomers, useInvoices } from '@/contexts/app-context'
import { useFormatting } from '@/contexts/settings-context'

export default function DashboardPage() {
  const { formatCurrency } = useFormatting()

  const {
    products,
    getLowStockProducts,
    getTotalProductsValue,
    isLoading: productsLoading
  } = useProducts()

  const {
    customers,
    getTotalCustomers,
    isLoading: customersLoading
  } = useCustomers()

  const {
    invoices,
    getTotalRevenue,
    getPaidAmount,
    getPendingAmount,
    getInvoicesByStatus,
    isLoading: invoicesLoading
  } = useInvoices()

  // حساب الإحصائيات من البيانات الحقيقية
  const stats = {
    totalRevenue: getTotalRevenue(),
    totalExpenses: 45000, // يمكن إضافة context للمصروفات لاحقاً
    totalProfit: getTotalRevenue() - 45000,
    totalInvoices: invoices.length,
    paidInvoices: getInvoicesByStatus('paid').length,
    pendingInvoices: getInvoicesByStatus('sent').length,
    totalProducts: products.length,
    lowStockProducts: getLowStockProducts(10).length,
    totalCustomers: getTotalCustomers()
  }

  // أحدث الفواتير (آخر 4 فواتير)
  const recentInvoices = invoices
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)
    .map(invoice => ({
      id: invoice.invoice_number,
      customer: invoice.customer_name,
      amount: invoice.total,
      status: invoice.status,
      date: invoice.date
    }))

  // المنتجات ذات المخزون المنخفض
  const lowStockProducts = getLowStockProducts(10).map(product => ({
    name: product.name,
    currentStock: product.quantity,
    minStock: 10
  }))

  const isLoading = productsLoading || customersLoading || invoicesLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600">نظرة عامة على أداء نشاطك التجاري</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي الإيرادات"
          value={stats.totalRevenue}
          icon={DollarSign}
          isCurrency
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="إجمالي المصروفات"
          value={stats.totalExpenses}
          icon={TrendingDown}
          isCurrency
          trend={{ value: 8.2, isPositive: false }}
        />
        <StatsCard
          title="صافي الربح"
          value={stats.totalProfit}
          icon={TrendingUp}
          isCurrency
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatsCard
          title="إجمالي الفواتير"
          value={stats.totalInvoices}
          icon={FileText}
          trend={{ value: 5.7, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Invoices */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>الفواتير الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{invoice.customer}</p>
                    <p className="text-sm text-gray-500">{invoice.id}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{invoice.amount.toLocaleString()} ر.س</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status === 'paid' ? 'مدفوعة' : 
                       invoice.status === 'pending' ? 'معلقة' : 'متأخرة'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="ml-2 h-5 w-5 text-orange-500" />
              تنبيه المخزون المنخفض
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      متوفر: {product.currentStock} | مطلوب: {product.minStock}
                    </p>
                  </div>
                  <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${(product.currentStock / product.minStock) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="إجمالي المنتجات"
          value={stats.totalProducts}
          icon={Package}
        />
        <StatsCard
          title="إجمالي العملاء"
          value={stats.totalCustomers}
          icon={Users}
        />
        <StatsCard
          title="الفواتير المعلقة"
          value={stats.pendingInvoices}
          icon={AlertTriangle}
        />
      </div>
    </div>
  )
}
