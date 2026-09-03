import type { LucideIcon } from 'lucide-react'

interface AdminStatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  variant?: 'default' | 'success' | 'warning'
}

const variantStyles = {
  default: 'from-brand-500/10 to-brand-600/5 text-brand-700 dark:text-brand-400',
  success: 'from-green-500/10 to-green-600/5 text-green-700 dark:text-green-400',
  warning: 'from-amber-500/10 to-amber-600/5 text-amber-700 dark:text-amber-400',
}

export function AdminStatCard({ label, value, icon: Icon, trend, variant = 'default' }: AdminStatCardProps) {
  return (
    <div className="card-interactive p-6">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${variantStyles[variant]}`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-primary">{value}</p>
      {trend && <p className="mt-2 text-xs text-muted">{trend}</p>}
    </div>
  )
}
