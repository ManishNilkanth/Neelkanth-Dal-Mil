import { NavLink } from 'react-router-dom'
import {
  Building2,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  X,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/content', label: 'Website Content', icon: FileText },
  { to: '/admin/business', label: 'Business Information', icon: Building2 },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
  onSignOut: () => Promise<{ error: Error | null }>
}

export function AdminSidebar({ open, onClose, onSignOut }: AdminSidebarProps) {
  const handleSignOut = async () => {
    await onSignOut()
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-earth-200 px-6">
        <span className="font-serif text-lg text-earth-900">Admin Panel</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-earth-100 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4" aria-label="Admin navigation">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-100 text-brand-900'
                  : 'text-earth-700 hover:bg-earth-100 hover:text-earth-900'
              }`
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-earth-200 p-4">
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-earth-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-earth-900/50 lg:hidden"
            onClick={onClose}
            aria-label="Close menu overlay"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-earth-200 bg-white lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
