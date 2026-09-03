import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { formatPrice } from '../../lib/utils'
import { ArrowRight, Package } from 'lucide-react'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <article
      className="card-interactive group flex h-full flex-col overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/products/${product.slug}`} className="block overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-400 dark:text-brand-600">
              <Package className="h-16 w-16 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg text-primary transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
              {product.name}
            </h3>
          </Link>
          {!product.is_available && (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted">
              Unavailable
            </span>
          )}
        </div>
        {product.short_description && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm text-secondary">{product.short_description}</p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <p className="text-lg font-semibold text-brand-700 dark:text-brand-400">
            {formatPrice(product.price, product.unit)}
          </p>
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-leaf-600 transition-all duration-200 hover:gap-2 dark:text-leaf-500"
          >
            View
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
