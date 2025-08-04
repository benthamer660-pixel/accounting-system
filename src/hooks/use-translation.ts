'use client'

import { useSettings } from '@/contexts/settings-context'
import { getTranslation, getLanguageTranslations, TranslationKey, Language } from '@/lib/translations'

// Hook للترجمة
export function useTranslation() {
  const { companySettings } = useSettings()
  const currentLanguage = companySettings.language as Language

  // دالة الترجمة الرئيسية
  const t = (key: TranslationKey): string => {
    return getTranslation(key, currentLanguage)
  }

  // دالة الحصول على جميع الترجمات
  const getTranslations = () => {
    return getLanguageTranslations(currentLanguage)
  }

  // دالة التحقق من اللغة الحالية
  const isRTL = currentLanguage === 'ar'
  const isLTR = currentLanguage === 'en'
  const direction = isRTL ? 'rtl' : 'ltr'

  return {
    t,
    getTranslations,
    currentLanguage,
    isRTL,
    isLTR,
    direction
  }
}

// Hook مبسط للترجمة فقط
export function useT() {
  const { t } = useTranslation()
  return t
}

// Hook للاتجاه واللغة
export function useLanguageDirection() {
  const { isRTL, isLTR, direction, currentLanguage } = useTranslation()
  return { isRTL, isLTR, direction, currentLanguage }
}
