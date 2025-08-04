'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Settings,
  Building2,
  Globe,
  DollarSign,
  Users,
  Shield,
  Bell,
  Palette,
  Save,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useSettings } from '@/contexts/settings-context'
import { useTranslation } from '@/hooks/use-translation'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const {
    companySettings,
    userSettings,
    invoiceSettings,
    updateCompanySettings,
    updateUserSettings,
    updateInvoiceSettings,
    isLoading,
    lastSaved,
    saveAllSettings
  } = useSettings()

  const { t, currentLanguage } = useTranslation()

  const handleCompanySettingsChange = (field: string, value: string | number) => {
    updateCompanySettings({ [field]: value })
  }

  const handleUserSettingsChange = (field: string, value: boolean | string) => {
    updateUserSettings({ [field]: value })
  }

  const handleInvoiceSettingsChange = (field: string, value: boolean) => {
    updateInvoiceSettings({ [field]: value })
  }

  // حفظ جميع الإعدادات
  const handleSaveSettings = async () => {
    try {
      await saveAllSettings()
    } catch (error) {
      // الخطأ يتم التعامل معه في Context
    }
  }

  // إنشاء نسخة احتياطية
  const handleCreateBackup = () => {
    const backupData = {
      companySettings,
      userSettings,
      invoiceSettings,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }

    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `backup_settings_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('تم إنشاء النسخة الاحتياطية بنجاح!')
  }

  // استعادة من نسخة احتياطية
  const handleRestoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string)

        if (backupData.companySettings) {
          setCompanySettings(backupData.companySettings)
        }
        if (backupData.userSettings) {
          setUserSettings(backupData.userSettings)
        }
        if (backupData.invoiceSettings) {
          setInvoiceSettings(backupData.invoiceSettings)
        }

        toast.success('تم استعادة الإعدادات من النسخة الاحتياطية!')
      } catch (error) {
        toast.error('ملف النسخة الاحتياطية غير صحيح')
      }
    }
    reader.readAsText(file)

    // إعادة تعيين input
    event.target.value = ''
  }

  // تحديث النظام
  const handleSystemUpdate = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('تم تحديث النظام بنجاح!')
    } catch (error) {
      toast.error('فشل في تحديث النظام')
    } finally {
      setIsLoading(false)
    }
  }

  // تنظيف ذاكرة التخزين المؤقت
  const handleClearCache = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // محاكاة تنظيف الذاكرة المؤقتة
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }
      toast.success('تم تنظيف ذاكرة التخزين المؤقت!')
    } catch (error) {
      toast.error('فشل في تنظيف ذاكرة التخزين المؤقت')
    } finally {
      setIsLoading(false)
    }
  }

  // إعادة تعيين النظام
  const handleSystemReset = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين النظام؟ سيتم حذف جميع البيانات!')) {
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      // إعادة تعيين الإعدادات للقيم الافتراضية
      setCompanySettings({
        company_name: 'شركتي',
        company_address: 'الرياض، المملكة العربية السعودية',
        company_phone: '+966501234567',
        company_email: 'info@mycompany.com',
        tax_number: '123456789',
        currency: 'ريال',
        currency_symbol: 'ر.س',
        tax_rate: 15,
        language: 'ar'
      })

      setUserSettings({
        notifications_email: true,
        notifications_browser: true,
        auto_backup: true,
        theme: 'light'
      })

      setInvoiceSettings({
        auto_numbering: true,
        due_date_reminder: true,
        auto_save_drafts: true
      })

      // حذف البيانات من localStorage
      localStorage.removeItem('companySettings')
      localStorage.removeItem('userSettings')
      localStorage.removeItem('invoiceSettings')
      localStorage.removeItem('settingsLastSaved')

      setLastSaved(null)

      toast.success('تم إعادة تعيين النظام بنجاح!')
    } catch (error) {
      toast.error('فشل في إعادة تعيين النظام')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('settings')}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <p>{currentLanguage === 'ar' ? 'إدارة إعدادات النظام والشركة' : 'Manage system and company settings'}</p>
            {lastSaved && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 ml-1" />
                آخر حفظ: {lastSaved.toLocaleString('ar-SA')}
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isLoading ? (currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (currentLanguage === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {t('companySettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('companyName')}
              </label>
              <Input
                value={companySettings.company_name}
                onChange={(e) => handleCompanySettingsChange('company_name', e.target.value)}
                placeholder={t('companyName')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('companyAddress')}
              </label>
              <Input
                value={companySettings.company_address}
                onChange={(e) => handleCompanySettingsChange('company_address', e.target.value)}
                placeholder={t('companyAddress')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('companyPhone')}
                </label>
                <Input
                  value={companySettings.company_phone}
                  onChange={(e) => handleCompanySettingsChange('company_phone', e.target.value)}
                  placeholder={t('companyPhone')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('companyEmail')}
                </label>
                <Input
                  type="email"
                  value={companySettings.company_email}
                  onChange={(e) => handleCompanySettingsChange('company_email', e.target.value)}
                  placeholder={t('companyEmail')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('taxNumber')}
              </label>
              <Input
                value={companySettings.tax_number}
                onChange={(e) => handleCompanySettingsChange('tax_number', e.target.value)}
                placeholder={t('taxNumber')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('financialSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('currency')}
                </label>
                <Input
                  value={companySettings.currency}
                  onChange={(e) => handleCompanySettingsChange('currency', e.target.value)}
                  placeholder={t('currency')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('currencySymbol')}
                </label>
                <Input
                  value={companySettings.currency_symbol}
                  onChange={(e) => handleCompanySettingsChange('currency_symbol', e.target.value)}
                  placeholder={t('currencySymbol')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('taxRate')} (%)
              </label>
              <Input
                type="number"
                value={companySettings.tax_rate}
                onChange={(e) => handleCompanySettingsChange('tax_rate', parseFloat(e.target.value))}
                placeholder={t('taxRate')}
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('language')}
              </label>
              <select
                value={companySettings.language}
                onChange={(e) => handleCompanySettingsChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-3">{t('invoiceSettings')}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{t('autoNumbering')}</span>
                    <p className="text-xs text-gray-600">{t('autoNumberingDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={invoiceSettings.auto_numbering}
                    onChange={(e) => handleInvoiceSettingsChange('auto_numbering', e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{t('dueDateReminder')}</span>
                    <p className="text-xs text-gray-600">{t('dueDateReminderDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={invoiceSettings.due_date_reminder}
                    onChange={(e) => handleInvoiceSettingsChange('due_date_reminder', e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{t('autoSaveDrafts')}</span>
                    <p className="text-xs text-gray-600">{t('autoSaveDraftsDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={invoiceSettings.auto_save_drafts}
                    onChange={(e) => handleInvoiceSettingsChange('auto_save_drafts', e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('userPreferences')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {t('notifications')}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{t('emailNotifications')}</span>
                    <p className="text-xs text-gray-600">{t('emailNotificationsDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userSettings.notifications_email}
                    onChange={(e) => handleUserSettingsChange('notifications_email', e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{t('browserNotifications')}</span>
                    <p className="text-xs text-gray-600">{t('browserNotificationsDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userSettings.notifications_browser}
                    onChange={(e) => handleUserSettingsChange('notifications_browser', e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {t('theme')}
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{t('systemTheme')}</span>
                  <p className="text-xs text-gray-600">{t('systemThemeDesc')}</p>
                </div>
                <select
                  value={userSettings.theme}
                  onChange={(e) => handleUserSettingsChange('theme', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">{t('lightTheme')}</option>
                  <option value="dark">{t('darkTheme')}</option>
                  <option value="auto">{t('autoTheme')}</option>
                </select>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('backup')}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{t('autoBackup')}</span>
                    <p className="text-xs text-gray-600">{t('autoBackupDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userSettings.auto_backup}
                    onChange={(e) => handleUserSettingsChange('auto_backup', e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateBackup}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {t('createBackup')}
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreBackup}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4" />
                      {t('restoreBackup')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('systemInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">{t('version')}:</span>
                <div className="font-medium">1.0.0</div>
              </div>
              <div>
                <span className="text-gray-500">{t('lastUpdate')}:</span>
                <div className="font-medium">{currentLanguage === 'ar' ? '15 يناير 2024' : 'January 15, 2024'}</div>
              </div>
              <div>
                <span className="text-gray-500">{t('database')}:</span>
                <div className="font-medium">PostgreSQL</div>
              </div>
              <div>
                <span className="text-gray-500">{currentLanguage === 'ar' ? 'حالة النظام' : 'System Status'}:</span>
                <div className="font-medium text-green-600">{currentLanguage === 'ar' ? 'متصل' : 'Connected'}</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-3">إجراءات النظام</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={handleSystemUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  تحديث النظام
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={handleClearCache}
                  disabled={isLoading}
                >
                  <Shield className="h-4 w-4" />
                  تنظيف ذاكرة التخزين المؤقت
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
                  onClick={handleSystemReset}
                  disabled={isLoading}
                >
                  <AlertTriangle className="h-4 w-4" />
                  إعادة تعيين النظام
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {lastSaved ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              آخر حفظ: {lastSaved.toLocaleString('ar-SA')}
            </div>
          ) : (
            'لم يتم حفظ التغييرات بعد'
          )}
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isLoading ? (currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (currentLanguage === 'ar' ? 'حفظ جميع التغييرات' : 'Save All Changes')}
        </Button>
      </div>

    </div>
  )
}
