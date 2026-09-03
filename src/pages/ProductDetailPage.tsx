import { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { Check, Package } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { isSupabaseConfigured } from '../lib/supabase'
import { formatPrice } from '../lib/utils'
import { fetchProductBySlug } from '../services/productService'
import { mockProducts } from '../services/mockData'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { Button } from '../components/ui/Button'
import { Alert, EmptyState, LoadingSpinner } from '../components/ui/Alert'
import type { Product } from '../types'
import type { PublicLayoutContext } from '../layouts/PublicLayout'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { settings, businessName } = useOutletContext<PublicLayoutContext>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  usePageMeta({
    title: product ? `${product.name} | ${businessName}` : `Product | ${businessName}`,
    description: product?.short_description ?? 'Product details',
    image: product?.image_url ?? undefined,
    type: 'product',
  })

  useEffect(() => {
    async function load() {
      if (!slug) return
      setLoading(true)
      setError(null)
      setNotFound(false)

      if (!isSupabaseConfigured) {
        const found = mockProducts.find((p) => p.slug === slug) ?? null
        setProduct(found)
        setNotFound(!found)
        setLoading(false)
        return
      }

      const { data, error: err } = await fetchProductBySlug(slug)
      if (err) setError(err)
      else if (!data) setNotFound(true)
      else setProduct(data)
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <LoadingSpinner label="Loading product..." />

  if (notFound) {
    return (
      <div className="section-padding bg-page">
        <div className="container-page">
          <EmptyState
            title="Product not found"
            description="The product you are looking for does not exist or has been removed."
          />
          <div className="mt-6 text-center">
            <Link to="/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="section-padding bg-page">
        <div className="container-page">
          <Alert variant="error">{error ?? 'Unable to load product.'}</Alert>
        </div>
      </div>
    )
  }

  const whatsappMessage = `Hello, I would like to enquire about ${product.name}.`

  return (
    <div className="section-padding bg-page">
      <div className="container-page">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link to="/products" className="hover:text-brand-600 dark:hover:text-brand-400">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-secondary">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card-interactive overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-muted text-brand-400 dark:text-brand-600">
                <Package className="h-24 w-24" aria-hidden="true" />
              </div>
            )}
          </div>

          <div>
            <div className="mb-4 flex items-start justify-between gap-4">
              <h1 className="font-serif text-3xl text-primary sm:text-4xl">{product.name}</h1>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
                  product.is_available
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                    : 'bg-muted text-muted'
                }`}
              >
                {product.is_available ? 'Available' : 'Currently Unavailable'}
              </span>
            </div>

            <p className="mb-6 text-2xl font-semibold text-brand-700 dark:text-brand-400">
              {formatPrice(product.price, product.unit)}
            </p>

            {product.short_description && (
              <p className="mb-6 text-lg text-secondary">{product.short_description}</p>
            )}

            {product.description && (
              <div className="mb-8 whitespace-pre-line leading-relaxed text-secondary">
                {product.description}
              </div>
            )}

            {product.pack_sizes.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-2 font-serif text-lg text-primary">Pack Sizes</h2>
                <div className="flex flex-wrap gap-2">
                  {product.pack_sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-lg border border-default bg-surface px-3 py-1 text-sm text-secondary"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.features.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 font-serif text-lg text-primary">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-secondary">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-leaf-600 dark:text-leaf-500" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton
                phone={settings?.whatsapp}
                message={whatsappMessage}
                className="flex-1"
              />
              <Link to="/contact" className="flex-1">
                <Button variant="outline" className="w-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
