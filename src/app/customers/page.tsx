'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin, FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { CustomerForm } from '@/components/forms/customer-form'
import { EditCustomerForm } from '@/components/forms/edit-customer-form'
import { CustomerInvoicesModal } from '@/components/modals/customer-invoices-modal'
import { DeleteConfirmation } from '@/components/ui/delete-confirmation'
import { useCustomers, Customer } from '@/contexts/app-context'

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, getCustomersWithEmail, getCustomersWithPhone, isLoading } = useCustomers()
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isInvoicesModalOpen, setIsInvoicesModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
  )

  const handleAddCustomer = (newCustomer: any) => {
    addCustomer(newCustomer)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditFormOpen(true)
  }

  const handleUpdateCustomer = (id: string, updatedData: Partial<Customer>) => {
    updateCustomer(id, updatedData)
    setIsEditFormOpen(false)
    setSelectedCustomer(null)
  }

  const handleViewInvoices = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsInvoicesModalOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id)
      setIsDeleteDialogOpen(false)
      setSelectedCustomer(null)
    }
  }

  const customersWithEmail = getCustomersWithEmail()
  const customersWithPhone = getCustomersWithPhone()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل العملاء...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">العملاء</h1>
          <p className="text-gray-600">إدارة قاعدة بيانات العملاء</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="h-4 w-4" />
          إضافة عميل جديد
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="البحث في العملاء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline">تصفية</Button>
            <Button variant="outline">تصدير</Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        عميل منذ {formatDate(customer.created_at)}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {customer.email && (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                      
                      {customer.phone && (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      
                      {customer.address && (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{customer.address}</span>
                        </div>
                      )}
                    </div>
                    
                    {customer.tax_number && (
                      <div className="text-sm">
                        <span className="text-gray-500">الرقم الضريبي: </span>
                        <span className="font-mono">{customer.tax_number}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewInvoices(customer)}
                    className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    title="عرض فواتير العميل"
                  >
                    <FileText className="h-4 w-4 ml-1 text-blue-600" />
                    عرض الفواتير
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCustomer(customer)}
                    className="hover:bg-blue-50 transition-colors"
                    title="تعديل العميل"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCustomer(customer)}
                    className="text-red-600 hover:bg-red-50 transition-colors"
                    title="حذف العميل"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا يوجد عملاء
            </h3>
            <p className="text-gray-600 mb-4">
              لم يتم العثور على عملاء يطابقون البحث
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة عميل جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {customers.length}
              </div>
              <div className="text-sm text-gray-600">إجمالي العملاء</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.email).length}
              </div>
              <div className="text-sm text-gray-600">لديهم بريد إلكتروني</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {customers.filter(c => c.phone).length}
              </div>
              <div className="text-sm text-gray-600">لديهم رقم هاتف</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {customers.filter(c => c.tax_number).length}
              </div>
              <div className="text-sm text-gray-600">لديهم رقم ضريبي</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نموذج إضافة عميل */}
      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddCustomer}
      />

      {/* نموذج تعديل عميل */}
      <EditCustomerForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleUpdateCustomer}
        customer={selectedCustomer}
      />

      {/* نافذة عرض فواتير العميل */}
      <CustomerInvoicesModal
        isOpen={isInvoicesModalOpen}
        onClose={() => setIsInvoicesModalOpen(false)}
        customer={selectedCustomer}
      />

      {/* نافذة تأكيد الحذف */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف العميل"
        message="هل أنت متأكد من أنك تريد حذف هذا العميل؟ سيتم حذف جميع البيانات المرتبطة به بما في ذلك الفواتير."
        itemName={selectedCustomer?.name}
      />
    </div>
  )
}
