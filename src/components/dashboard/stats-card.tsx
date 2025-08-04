'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormatting } from '@/contexts/settings-context'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  isCurrency?: boolean
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  isCurrency = false
}: StatsCardProps) {
  const { formatCurrency } = useFormatting()

  const displayValue = isCurrency && typeof value === 'number'
    ? formatCurrency(value)
    : value

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span
              className={
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>{' '}
            من الشهر الماضي
          </p>
        )}
      </CardContent>
    </Card>
  )
}
