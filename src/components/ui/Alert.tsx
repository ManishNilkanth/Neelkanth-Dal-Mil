import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react'

interface AlertProps {
  variant?: 'error' | 'success' | 'info'
  children: ReactNode
  className?: string
}

export function Alert({ variant = 'info', children, className = '' }: AlertProps) {
  const styles = {
    error: 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300',
    success: 'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300',
    info: 'border-brand-300 bg-brand-50 text-brand-900 dark:border-brand-700 dark:bg-brand-950/50 dark:text-brand-200',
  }

  const icons = {
    error: AlertCircle,
    success: CheckCircle2,
    info: Info,
  }

  const Icon = icons[variant]

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${styles[variant]} ${className}`}
      role="alert"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="text-sm">{children}</div>
    </div>
  )
}

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3" role="status">
      <Loader2 className="h-10 w-10 animate-spin text-brand-600 dark:text-brand-400" aria-hidden="true" />
      <p className="text-sm text-secondary">{label}</p>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-default bg-surface px-6 py-12 text-center">
      <h3 className="font-serif text-lg text-primary">{title}</h3>
      {description && <p className="mt-2 text-sm text-secondary">{description}</p>}
    </div>
  )
}
