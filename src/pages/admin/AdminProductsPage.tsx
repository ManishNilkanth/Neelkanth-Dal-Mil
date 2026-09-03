import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Plus, Search, Trash2 } from 'lucide-react'
import { usePageMeta } from '../../hooks/usePageMeta'
import { fetchProducts, deleteProduct } from '../../services/productService'
import { isSupabaseConfigured } from '../../lib/supabase'
import { formatDate, formatPrice } from '../../lib/utils'
import { mockProducts } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/FormField'
import { Alert, EmptyState, LoadingSpinner } from '../../components/ui/Alert'
import { ConfirmDialog } from '../../components/ui/Modal'
import type { Product } from '../../types'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [availability, setAvailability] = useState<'all' | 'available' | 'unavailable'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  usePageMeta({ title: 'Products | Admin' })

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
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

  useEffect(() => {
    loadProducts()
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesAvailability =
        availability === 'all' ||
        (availability === 'available' && p.is_available) ||
        (availability === 'unavailable' && !p.is_available)
      return matchesSearch && matchesAvailability
    })
  }, [products, search, availability])

  const handleDelete = async () => {
    if (!deleteId || !isSupabaseConfigured) return
    setDeleting(true)
    const { error: err } = await deleteProduct(deleteId)
    setDeleting(false)
    if (err) {
      setError(err)
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== deleteId))
      setSuccess('Product deleted successfully.')
      setTimeout(() => setSuccess(null), 3000)
    }
    setDeleteId(null)
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-earth-900">Products</h1>
          <p className="mt-1 text-earth-600">Manage your product catalogue</p>
        </div>
        <Link to="/admin/products/new">
          <Button>
            <Plus className="h-5 w-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {success && <Alert variant="success" className="mb-6">{success}</Alert>}
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-earth-400" />
          <input
            type="search"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-earth-300 bg-white py-2.5 pl-10 pr-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            aria-label="Search products"
          />
        </div>
        <Select
          label="Availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value as typeof availability)}
          className="sm:w-48"
        >
          <option value="all">All Products</option>
          <option value="available">Available Only</option>
          <option value="unavailable">Unavailable Only</option>
        </Select>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading products..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products found"
          description={search ? 'Try a different search term.' : 'Add your first product to get started.'}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-earth-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-earth-200 bg-earth-50">
              <tr>
                <th className="px-4 py-3 font-medium text-earth-700">Product</th>
                <th className="px-4 py-3 font-medium text-earth-700">Price</th>
                <th className="px-4 py-3 font-medium text-earth-700">Status</th>
                <th className="px-4 py-3 font-medium text-earth-700">Updated</th>
                <th className="px-4 py-3 font-medium text-earth-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-earth-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 text-xs">
                          N/A
                        </div>
                      )}
                      <span className="font-medium text-earth-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-earth-700">
                    {formatPrice(product.price, product.unit)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-earth-200 text-earth-700'
                      }`}
                    >
                      {product.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-earth-600">{formatDate(product.updated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm" aria-label={`Edit ${product.name}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(product.id)}
                        aria-label={`Delete ${product.name}`}
                        disabled={!isSupabaseConfigured}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        loading={deleting}
      />
    </div>
  )
}
