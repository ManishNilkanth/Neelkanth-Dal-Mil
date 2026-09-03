import type { Product } from '../../types'
import { ProductCard } from './ProductCard'
import { EmptyState } from '../../components/ui/Alert'
import { AnimateOnScroll } from '../../components/ui/AnimateOnScroll'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title="No products available." description="Please check back later." />
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <AnimateOnScroll key={product.id} delay={index * 80}>
          <ProductCard product={product} index={index} />
        </AnimateOnScroll>
      ))}
    </div>
  )
}
