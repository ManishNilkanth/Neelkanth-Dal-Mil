import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import type { BusinessSettings, SocialLinks } from '../../types'

interface FooterProps {
  businessName: string
  settings: BusinessSettings | null
}

function SocialIcon({ platform, url }: { platform: keyof SocialLinks; url: string }) {
  const icons = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    twitter: Mail,
  }
  const Icon = icons[platform] ?? Mail
  const labels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    twitter: 'Twitter',
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg p-2 text-muted transition-all duration-300 hover:scale-110 hover:bg-brand-800/30 hover:text-brand-300"
      aria-label={labels[platform]}
    >
      <Icon className="h-5 w-5" />
    </a>
  )
}

export function Footer({ businessName, settings }: FooterProps) {
  const social = settings?.social_links ?? {}
  const socialEntries = Object.entries(social).filter(([, url]) => url) as [keyof SocialLinks, string][]

  return (
    <footer className="border-t border-default bg-[#1a1612] text-earth-300 dark:bg-[#0d0b09]">
      <div className="container-page section-padding">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 font-serif text-xl text-white">{businessName}</h2>
            <p className="text-sm leading-relaxed text-earth-400">
              Quality pulses and daal processing with care and consistency.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-300">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/products', label: 'Products' },
                { to: '/quality', label: 'Quality' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-earth-400 transition-colors duration-200 hover:translate-x-1 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-300">Contact</h3>
            <ul className="space-y-3 text-sm">
              {settings?.address && (
                <li className="flex gap-2 text-earth-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-2 text-earth-400 transition-colors hover:text-white"
                  >
                    <Phone className="h-4 w-4 text-brand-400" aria-hidden="true" />
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2 text-earth-400 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-brand-400" aria-hidden="true" />
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-300">Hours</h3>
            <p className="text-sm text-earth-400">
              {settings?.business_hours ?? 'Update business hours in admin panel'}
            </p>
            {socialEntries.length > 0 && (
              <div className="mt-4 flex gap-1">
                {socialEntries.map(([platform, url]) => (
                  <SocialIcon key={platform} platform={platform} url={url} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-earth-800 pt-8 text-center text-sm text-earth-500">
          <p>
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
