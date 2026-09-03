import { Link, NavLink } from 'react-router-dom'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { buildWhatsAppUrl } from '../../lib/utils'
import { ThemeToggle } from '../ThemeToggle'
import type { BusinessSettings } from '../../types'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/quality', label: 'Quality' },
  { to: '/contact', label: 'Contact' },
]

interface HeaderProps {
  businessName: string
  settings: BusinessSettings | null
}

export function Header({ businessName, settings }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const whatsappUrl = settings?.whatsapp ? buildWhatsAppUrl(settings.whatsapp) : null

  return (
    <header
      className={`sticky top-0 z-40 border-b border-default glass-header transition-all duration-300 ${
        scrolled ? 'shadow-theme' : ''
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link
          to="/"
          className="font-serif text-xl font-semibold text-gradient transition-opacity hover:opacity-80 sm:text-2xl"
        >
          {businessName}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-200/80 text-brand-900 dark:bg-brand-800/40 dark:text-brand-200'
                    : 'text-secondary hover:bg-muted hover:text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:flex" />

          <div className="hidden items-center gap-2 md:flex">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-muted hover:text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-leaf-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-leaf-700 hover:shadow-lg hover:shadow-leaf-600/25"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-secondary transition-colors hover:bg-muted md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="animate-fade-in border-t border-default bg-surface px-4 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mb-4 flex items-center justify-between sm:hidden">
            <span className="text-sm text-muted">Theme</span>
            <ThemeToggle />
          </div>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-200/80 text-brand-900 dark:bg-brand-800/40 dark:text-brand-200'
                        : 'text-secondary hover:bg-muted'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {whatsappUrl && (
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-leaf-600 px-4 py-3 text-base font-medium text-white"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
