import { usePageMeta } from '../../hooks/usePageMeta'
import { Alert } from '../../components/ui/Alert'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function AdminMediaPage() {
  usePageMeta({ title: 'Media | Admin' })

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-earth-900">Media</h1>
        <p className="mt-1 text-earth-600">Manage images for your website</p>
      </header>

      <Alert variant="info" className="mb-6">
        Product images are managed when you add or edit a product. Go to the Products section to upload or change product photos.
      </Alert>

      <Link to="/admin/products">
        <Button>Go to Products</Button>
      </Link>
    </div>
  )
}
