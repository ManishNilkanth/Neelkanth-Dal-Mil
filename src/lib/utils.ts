export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPrice(price: number | null, unit: string): string {
  if (price === null) return 'Price on request'
  return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}/${unit}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const number = formatWhatsAppNumber(phone)
  const base = `https://wa.me/${number}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export function parseListInput(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function listToText(items: string[]): string {
  return items.join('\n')
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_SIZE_MB = 5
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Please upload a JPEG, PNG, or WebP image.'
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`
  }
  return null
}

function buildEmbedFromQuery(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=15&output=embed`
}

function isEmbeddableMapUrl(url: string): boolean {
  return url.includes('/maps/embed') || (url.includes('maps.google.com/maps') && url.includes('output=embed'))
}

function isUnusableMapUrl(url: string): boolean {
  const normalized = url.toLowerCase().replace(/\/$/, '')
  return (
    normalized === 'https://www.google.com' ||
    normalized === 'http://www.google.com' ||
    normalized === 'www.google.com' ||
    normalized === 'https://google.com' ||
    normalized === 'http://google.com'
  )
}

/** Converts share/short map links to an iframe-safe embed URL, or uses address as fallback. */
export function getMapEmbedUrl(mapUrl: string | null | undefined, address?: string | null): string | null {
  const url = mapUrl?.trim() ?? ''

  if (url && isEmbeddableMapUrl(url)) {
    return url
  }

  if (url && !isUnusableMapUrl(url)) {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
      const query = parsed.searchParams.get('q') ?? parsed.searchParams.get('query')
      if (query) {
        return buildEmbedFromQuery(query)
      }

      const placeMatch = parsed.pathname.match(/\/maps\/place\/([^/]+)/)
      if (placeMatch?.[1]) {
        return buildEmbedFromQuery(decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')))
      }

      const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
      if (coordMatch) {
        return buildEmbedFromQuery(`${coordMatch[1]},${coordMatch[2]}`)
      }
    } catch {
      // Fall through to address-based embed.
    }
  }

  if (address?.trim()) {
    return buildEmbedFromQuery(address.trim())
  }

  return null
}

/** Link to open the location in Google Maps (for share/short URLs). */
export function getMapOpenUrl(mapUrl: string | null | undefined, address?: string | null): string | null {
  const url = mapUrl?.trim() ?? ''

  if (url && !isUnusableMapUrl(url)) {
    return url.startsWith('http') ? url : `https://${url}`
  }

  if (address?.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`
  }

  return null
}
