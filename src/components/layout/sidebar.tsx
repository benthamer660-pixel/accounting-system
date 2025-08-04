'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Warehouse,
  Receipt,
  TrendingUp,
  Settings,
  LogOut,
  Building2
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { t, direction } = useTranslation()

  const navigation = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('products'),
      href: '/products',
      icon: Package,
    },
    {
      name: t('customers'),
      href: '/customers',
      icon: Users,
    },
    {
      name: t('invoices'),
      href: '/invoices',
      icon: FileText,
    },
    {
      name: t('inventory'),
      href: '/inventory',
      icon: Warehouse,
    },
    {
      name: t('expenses'),
      href: '/expenses',
      icon: Receipt,
    },
    {
      name: t('reports'),
      href: '/reports',
      icon: TrendingUp,
    },
    {
      name: t('settings'),
      href: '/settings',
      icon: Settings,
    },
  ]

  return (
    <div className={`flex h-full w-64 flex-col bg-white border-gray-200 ${direction === 'rtl' ? 'border-l' : 'border-r'}`}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <div className={`flex items-center space-x-2 ${direction === 'rtl' ? 'space-x-reverse' : ''}`}>
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-gray-900">
            {direction === 'rtl' ? 'نظام المحاسبة' : 'Accounting System'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  `${direction === 'rtl' ? 'ml-3' : 'mr-3'} h-5 w-5 flex-shrink-0`,
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {direction === 'rtl' ? 'م' : 'A'}
            </span>
          </div>
          <div className={direction === 'rtl' ? 'mr-3' : 'ml-3'}>
            <p className="text-sm font-medium text-gray-700">
              {direction === 'rtl' ? 'مدير النظام' : 'System Admin'}
            </p>
            <p className="text-xs text-gray-500">admin@company.com</p>
          </div>
        </div>
        <button className="mt-3 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <LogOut className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} h-4 w-4`} />
          {direction === 'rtl' ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>
    </div>
  )
}
