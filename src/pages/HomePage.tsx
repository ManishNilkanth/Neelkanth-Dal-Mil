import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Leaf, Shield, Sparkles, Wheat } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { useOutletContext } from 'react-router-dom'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchFeaturedProducts } from '../services/productService'
import { fetchContentByKeys, getContentValue } from '../services/contentService'
import { mockContent, mockProducts } from '../services/mockData'
import { ProductGrid } from '../features/products/ProductGrid'
import { Button } from '../components/ui/Button'
import { AnimateOnScroll } from '../components/ui/AnimateOnScroll'
import { Alert, LoadingSpinner } from '../components/ui/Alert'
import type { ContentMap, Product } from '../types'
import type { PublicLayoutContext } from '../layouts/PublicLayout'

const contentKeys = [
  'hero_title',
  'hero_description',
  'hero_cta_text',
  'hero_supporting',
  'home_featured_intro',
  'home_why_choose',
  'about_intro',
] as const

const whyChooseIcons = [Shield, Leaf, Wheat, Award]

export function HomePage() {
  const { businessName } = useOutletContext<PublicLayoutContext>()
  const [content, setContent] = useState<ContentMap>({})
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageMeta({
    title: `${businessName} | Premium Pulses & Daal`,
    description: getContentValue(content, 'hero_description', 'content', 'Quality pulses and daal manufacturer.'),
  })

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      if (!isSupabaseConfigured) {
        setContent(mockContent)
        setProducts(mockProducts.filter((p) => p.is_available).slice(0, 4))
        setLoading(false)
        return
      }

      const [contentRes, productsRes] = await Promise.all([
        fetchContentByKeys([...contentKeys]),
        fetchFeaturedProducts(4),
      ])

      if (contentRes.error || productsRes.error) {
        setError(contentRes.error ?? productsRes.error)
      } else {
        setContent(contentRes.data)
        setProducts(productsRes.data)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner label="Loading homepage..." />

  const heroTitle = getContentValue(content, 'hero_title', 'content', 'Premium Pulses & Daal')
  const heroDescription = getContentValue(content, 'hero_description', 'content', '')
  const ctaText = getContentValue(content, 'hero_cta_text', 'content', 'View Our Products')
  const supporting = getContentValue(content, 'hero_supporting', 'content', '')
  const featuredTitle = getContentValue(content, 'home_featured_intro', 'title', 'Our Products')
  const featuredDesc = getContentValue(content, 'home_featured_intro', 'content', '')
  const whyChooseTitle = getContentValue(content, 'home_why_choose', 'title', 'Why Choose Us')
  const whyChooseContent = getContentValue(content, 'home_why_choose', 'content', '')

  const whyPoints = whyChooseContent
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <>
      {error && (
        <div className="container-page pt-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="hero-orb -left-20 top-20 h-72 w-72" />
        <div className="hero-orb -right-20 bottom-10 h-96 w-96" style={{ animationDelay: '2s' }} />

        <div className="container-page relative section-padding">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-default bg-surface/60 px-4 py-2 text-sm font-medium text-secondary backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              {supporting}
            </div>

            <h1
              className="animate-fade-up mb-6 font-serif text-4xl font-bold leading-tight text-primary sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '100ms' }}
            >
              <span className="text-gradient">{heroTitle}</span>
            </h1>

            <p
              className="animate-fade-up mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-secondary sm:text-xl"
              style={{ animationDelay: '200ms' }}
            >
              {heroDescription}
            </p>

            <div
              className="animate-fade-up flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ animationDelay: '300ms' }}
            >
              <Link to="/products">
                <Button size="lg" className="group">
                  {ctaText}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-400/30 to-transparent" />
      </section>

      {/* About preview */}
      <section className="section-padding bg-surface">
        <div className="container-page">
          <AnimateOnScroll className="mx-auto max-w-3xl text-center">
            <h2 className="section-title mb-4">About Our Business</h2>
            <p className="section-subtitle">
              {getContentValue(
                content,
                'about_intro',
                'content',
                'Learn more about our pulses manufacturing on the About page.',
              )}
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 font-medium text-brand-700 transition-all hover:gap-3 dark:text-brand-400"
            >
              Read our story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Featured products */}
      <section className="section-padding bg-page">
        <div className="container-page">
          <AnimateOnScroll className="mb-10 text-center">
            <h2 className="section-title mb-3">{featuredTitle}</h2>
            {featuredDesc && <p className="section-subtitle mx-auto max-w-2xl">{featuredDesc}</p>}
          </AnimateOnScroll>
          <ProductGrid products={products} />
          <AnimateOnScroll className="mt-10 text-center" delay={200}>
            <Link to="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-padding bg-surface">
        <div className="container-page">
          <AnimateOnScroll className="mb-12 text-center">
            <h2 className="section-title">{whyChooseTitle}</h2>
          </AnimateOnScroll>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyPoints.map((point, index) => {
              const Icon = whyChooseIcons[index % whyChooseIcons.length]
              const [title, ...rest] = point.includes(':') ? point.split(':') : [`Point ${index + 1}`, point]
              return (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div className="card-interactive group p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-200 to-brand-300 text-brand-800 transition-transform duration-300 group-hover:scale-110 dark:from-brand-800/40 dark:to-brand-700/40 dark:text-brand-300">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="mb-2 font-serif text-lg text-primary">{title.trim()}</h3>
                    <p className="text-sm text-secondary">{rest.join(':').trim() || point}</p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quality CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-earth-900 py-20 text-white dark:from-brand-950 dark:via-earth-950 dark:to-black">
        <div className="hero-orb left-1/4 top-0 h-64 w-64 bg-brand-500/20" />
        <div className="container-page relative text-center">
          <AnimateOnScroll>
            <h2 className="mb-4 font-serif text-3xl sm:text-4xl">Quality You Can Trust</h2>
            <p className="mx-auto mb-8 max-w-2xl text-brand-200">
              {getContentValue(content, 'quality_intro', 'content', 'Learn about our manufacturing and quality processes.')}
            </p>
            <Link to="/quality">
              <Button variant="secondary" size="lg" className="group">
                Our Quality Process
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-page">
        <div className="container-page">
          <AnimateOnScroll>
            <div className="relative overflow-hidden rounded-3xl border border-default bg-gradient-to-br from-brand-100 via-surface to-brand-50 p-8 text-center shadow-theme-lg dark:from-brand-950/50 dark:via-surface dark:to-brand-900/20 sm:p-14">
              <div className="hero-orb -right-10 -top-10 h-40 w-40" />
              <h2 className="section-title mb-4">Ready to Enquire?</h2>
              <p className="section-subtitle mx-auto mb-8 max-w-xl">
                Get in touch for product availability, pricing, and bulk orders.
              </p>
              <Link to="/contact">
                <Button size="lg">Contact Us Today</Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  )
}
