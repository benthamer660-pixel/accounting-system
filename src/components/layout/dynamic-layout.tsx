'use client'

import { useLanguageDirection } from '@/hooks/use-translation'
import { useEffect } from 'react'

interface DynamicLayoutProps {
  children: React.ReactNode
}

export function DynamicLayout({ children }: DynamicLayoutProps) {
  const { direction, currentLanguage } = useLanguageDirection()

  useEffect(() => {
    // تطبيق الاتجاه على HTML
    document.documentElement.dir = direction
    document.documentElement.lang = currentLanguage
    
    // تطبيق الاتجاه على body
    document.body.style.direction = direction
    
    // إضافة/إزالة classes حسب الاتجاه
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl')
      document.documentElement.classList.remove('ltr')
    } else {
      document.documentElement.classList.add('ltr')
      document.documentElement.classList.remove('rtl')
    }
  }, [direction, currentLanguage])

  return (
    <div className={`min-h-screen ${direction === 'rtl' ? 'rtl' : 'ltr'}`} dir={direction}>
      {children}
    </div>
  )
}
