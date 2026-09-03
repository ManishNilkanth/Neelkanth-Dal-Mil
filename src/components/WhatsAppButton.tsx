import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '../lib/utils'

interface WhatsAppButtonProps {
  phone: string | null | undefined
  message?: string
  label?: string
  className?: string
}

export function WhatsAppButton({ phone, message, label = 'Enquire on WhatsApp', className = '' }: WhatsAppButtonProps) {
  if (!phone) return null

  const url = buildWhatsAppUrl(phone, message)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#1da851] min-h-11 ${className}`}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      {label}
    </a>
  )
}
