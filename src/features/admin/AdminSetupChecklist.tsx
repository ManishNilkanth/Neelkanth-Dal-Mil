import { Link } from 'react-router-dom'
import { CheckCircle2, Circle } from 'lucide-react'
import type { DashboardStats } from '../../services/dashboardService'

interface AdminSetupChecklistProps {
  stats: DashboardStats
}

const items = [
  {
    key: 'businessName' as const,
    label: 'Set your business name',
    link: '/admin/business',
  },
  {
    key: 'hasContact' as const,
    label: 'Add phone & WhatsApp',
    link: '/admin/business',
  },
  {
    key: 'hasProducts' as const,
    label: 'Add your first product',
    link: '/admin/products/new',
  },
  {
    key: 'hasAddress' as const,
    label: 'Add your business address',
    link: '/admin/business',
  },
]

export function AdminSetupChecklist({ stats }: AdminSetupChecklistProps) {
  const checks = {
    businessName: stats.hasBusinessName,
    hasContact: stats.hasContactInfo,
    hasProducts: stats.totalProducts > 0,
    hasAddress: stats.hasAddress,
  }

  const completed = Object.values(checks).filter(Boolean).length
  const total = items.length

  if (completed === total) return null

  return (
    <div className="card-interactive p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-lg text-primary">Getting Started</h2>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-secondary">
          {completed}/{total} complete
        </span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-leaf-600 transition-all duration-500"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>
      <ul className="space-y-3">
        {items.map((item) => {
          const done = checks[item.key]
          return (
            <li key={item.key}>
              <Link
                to={item.link}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  done ? 'text-muted' : 'hover:bg-muted text-secondary'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted" />
                )}
                <span className={done ? 'line-through' : ''}>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
