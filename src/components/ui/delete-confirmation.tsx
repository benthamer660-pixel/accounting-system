'use client'

import { useState } from 'react'
import { Button } from './button'
import { Modal } from './modal'
import { AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName?: string
  isDeleting?: boolean
}

export function DeleteConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  itemName,
  isDeleting = false 
}: DeleteConfirmationProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    
    try {
      // محاكاة عملية الحذف
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onConfirm()
      toast.success('تم الحذف بنجاح!')
      onClose()
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 space-x-reverse mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-900 text-sm leading-relaxed">
              {message}
            </p>
            {itemName && (
              <p className="text-red-600 font-medium mt-2 text-sm">
                "{itemName}"
              </p>
            )}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
            <p className="text-red-700 text-xs font-medium">
              تحذير: هذا الإجراء لا يمكن التراجع عنه
            </p>
          </div>
        </div>

        <div className="flex space-x-3 space-x-reverse">
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || isDeleting}
            className="flex-1 h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
          >
            {isProcessing || isDeleting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                جاري الحذف...
              </div>
            ) : (
              'تأكيد الحذف'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing || isDeleting}
            className="px-6 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  )
}
