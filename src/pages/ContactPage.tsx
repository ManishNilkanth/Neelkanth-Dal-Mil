import { useOutletContext } from 'react-router-dom'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { buildWhatsAppUrl, getMapEmbedUrl, getMapOpenUrl } from '../lib/utils'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { AnimateOnScroll } from '../components/ui/AnimateOnScroll'
import type { PublicLayoutContext } from '../layouts/PublicLayout'

export function ContactPage() {
  const { settings, businessName } = useOutletContext<PublicLayoutContext>()
  const mapEmbedUrl = getMapEmbedUrl(settings?.map_url, settings?.address)
  const mapOpenUrl = getMapOpenUrl(settings?.map_url, settings?.address)

  usePageMeta({
    title: `Contact Us | ${businessName}`,
    description: 'Get in touch for product enquiries, pricing, and orders.',
  })

  return (
    <div className="section-padding bg-page">
      <div className="container-page">
        <AnimateOnScroll className="mb-12 max-w-2xl">
          <h1 className="section-title mb-4 text-gradient">Contact Us</h1>
          <p className="section-subtitle">
            Reach out for product availability, pricing, and bulk orders.
          </p>
        </AnimateOnScroll>

        <div className="grid gap-10 lg:grid-cols-2">
          <AnimateOnScroll animation="slide-right" className="space-y-6">
            <div className="card-interactive p-6">
              <h2 className="mb-6 font-serif text-xl text-primary">Business Information</h2>
              <ul className="space-y-5">
                {settings?.phone && (
                  <li>
                    <a
                      href={`tel:${settings.phone}`}
                      className="flex items-start gap-4 text-secondary transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-muted">Phone</p>
                        <p className="text-lg text-primary">{settings.phone}</p>
                      </div>
                    </a>
                  </li>
                )}
                {settings?.whatsapp && (
                  <li>
                    <a
                      href={buildWhatsAppUrl(settings.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 text-secondary transition-colors hover:text-[#25D366]"
                    >
                      <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#25D366]" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-muted">WhatsApp</p>
                        <p className="text-lg text-primary">{settings.whatsapp}</p>
                      </div>
                    </a>
                  </li>
                )}
                {settings?.email && (
                  <li>
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-start gap-4 text-secondary transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-muted">Email</p>
                        <p className="text-lg text-primary">{settings.email}</p>
                      </div>
                    </a>
                  </li>
                )}
                {settings?.address && (
                  <li className="flex items-start gap-4">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-muted">Address</p>
                      <p className="text-lg text-secondary">{settings.address}</p>
                    </div>
                  </li>
                )}
                {settings?.business_hours && (
                  <li className="flex items-start gap-4">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-muted">Business Hours</p>
                      <p className="text-lg text-secondary">{settings.business_hours}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <WhatsAppButton
              phone={settings?.whatsapp}
              message="Hello, I would like to enquire about your products."
              label="Chat on WhatsApp"
              className="w-full"
            />
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-left" delay={150}>
            {mapEmbedUrl ? (
              <div className="card-interactive overflow-hidden">
                <iframe
                  title="Business location map"
                  src={mapEmbedUrl}
                  className="h-80 w-full lg:h-full lg:min-h-[400px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                {mapOpenUrl && (
                  <div className="border-t border-default bg-muted px-4 py-3 text-center">
                    <a
                      href={mapOpenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand-700 hover:text-brand-800 dark:text-brand-400"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                )}
              </div>
            ) : mapOpenUrl ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-default bg-surface p-12 text-center">
                <MapPin className="h-12 w-12 text-brand-600 dark:text-brand-400" />
                <p className="text-secondary">View our location on Google Maps</p>
                <a
                  href={mapOpenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-brand-700 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-800"
                >
                  Open Google Maps
                </a>
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-default bg-surface p-12 text-center">
                <p className="text-muted">
                  Map can be added from the admin panel under Business Information.
                </p>
              </div>
            )}
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  )
}
