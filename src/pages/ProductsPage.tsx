import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchProducts } from '../services/productService'
import { mockProducts } from '../services/mockData'
import { ProductGrid } from '../features/products/ProductGrid'
import { AnimateOnScroll } from '../components/ui/AnimateOnScroll'
import { Alert, LoadingSpinner } from '../components/ui/Alert'
import type { Product } from '../types'
import type { PublicLayoutContext } from '../layouts/PublicLayout'

export function ProductsPage() {
  const { businessName } = useOutletContext<PublicLayoutContext>()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageMeta({
    title: `Products | ${businessName}`,
    description: 'Browse our range of quality pulses and daal products.',
  })

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setProducts(mockProducts)
        setLoading(false)
        return
      }
      const { data, error: err } = await fetchProducts()
      if (err) setError(err)
      else setProducts(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="section-padding bg-page">
      <div className="container-page">
        <AnimateOnScroll className="mb-10">
          <h1 className="section-title mb-3 text-gradient">Our Products</h1>
          <p className="section-subtitle max-w-2xl">
            Explore our complete range of pulses and daal products.
          </p>
        </AnimateOnScroll>

        {error && <Alert variant="error" className="mb-8">{error}</Alert>}
        {loading ? <LoadingSpinner label="Loading products..." /> : <ProductGrid products={products} />}
      </div>
    </div>
  )
}
