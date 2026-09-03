import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Plus } from 'lucide-react'
import { usePageMeta } from '../../hooks/usePageMeta'
import { fetchProductCount } from '../../services/productService'
import { fetchBusinessSettings } from '../../services/contentService'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Alert, LoadingSpinner } from '../../components/ui/Alert'

export function AdminDashboardPage() {
  const [productCount, setProductCount] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(true)

  usePageMeta({ title: 'Dashboard | Admin' })

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }
      const [count, settings] = await Promise.all([fetchProductCount(), fetchBusinessSettings()])
      setProductCount(count)
      setBusinessName(settings.data?.business_name ?? '')
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner label="Loading dashboard..." />

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-earth-900">Dashboard</h1>
        <p className="mt-1 text-earth-600">Welcome back{businessName ? `, ${businessName}` : ''}!</p>
      </header>

      {!isSupabaseConfigured && (
        <Alert variant="info" className="mb-6">
          Supabase is not configured yet. Add your credentials to the <code>.env</code> file and run the database migration.
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-earth-200 bg-white p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
            <Package className="h-5 w-5" />
          </div>
          <p className="text-sm text-earth-600">Total Products</p>
          <p className="mt-1 text-3xl font-semibold text-earth-900">{productCount}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/admin/products/new">
          <Button>
            <Plus className="h-5 w-5" />
            Add New Product
          </Button>
        </Link>
        <Link to="/admin/content">
          <Button variant="outline">Edit Website Content</Button>
        </Link>
        <Link to="/admin/business">
          <Button variant="outline">Update Business Info</Button>
        </Link>
      </div>
    </div>
  )
}
