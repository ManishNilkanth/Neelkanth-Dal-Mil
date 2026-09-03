import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { usePageMeta } from '../../hooks/usePageMeta'
import {
  createProduct,
  fetchProductById,
  updateProduct,
} from '../../services/productService'
import { uploadProductImage } from '../../services/storageService'
import { isSupabaseConfigured } from '../../lib/supabase'
import { listToText, parseListInput, validateImageFile } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Input, Textarea, Checkbox } from '../../components/ui/FormField'
import { Alert, LoadingSpinner } from '../../components/ui/Alert'
import { ImageUpload } from '../../features/admin/ImageUpload'
import type { ProductFormData } from '../../types'

const emptyForm: ProductFormData = {
  name: '',
  short_description: '',
  description: '',
  price: '',
  unit: 'kg',
  pack_sizes: [],
  features: [],
  image_url: null,
  is_available: true,
  display_order: 0,
}

interface FormErrors {
  name?: string
  price?: string
  image?: string
}

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState<ProductFormData>(emptyForm)
  const [packSizesText, setPackSizesText] = useState('')
  const [featuresText, setFeaturesText] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  usePageMeta({ title: isEdit ? 'Edit Product | Admin' : 'Add Product | Admin' })

  useEffect(() => {
    if (!id) return
    async function load() {
      const { data, error: err } = await fetchProductById(id!)
      if (err || !data) {
        setError(err ?? 'Product not found')
      } else {
        setForm({
          name: data.name,
          short_description: data.short_description ?? '',
          description: data.description ?? '',
          price: data.price !== null ? String(data.price) : '',
          unit: data.unit,
          pack_sizes: data.pack_sizes,
          features: data.features,
          image_url: data.image_url,
          is_available: data.is_available,
          display_order: data.display_order,
        })
        setPackSizesText(listToText(data.pack_sizes))
        setFeaturesText(listToText(data.features))
      }
      setLoading(false)
    }
    load()
  }, [id])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Product name is required.'
    if (form.price && isNaN(parseFloat(form.price))) newErrors.price = 'Please enter a valid price.'
    if (imageFile) {
      const imageError = validateImageFile(imageFile)
      if (imageError) newErrors.image = imageError
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate() || submitting) return
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Please set up your environment variables.')
      return
    }

    setSubmitting(true)
    setError(null)

    let imageUrl = form.image_url
    if (imageFile) {
      const { url, error: uploadError } = await uploadProductImage(imageFile)
      if (uploadError) {
        setError(uploadError)
        setSubmitting(false)
        return
      }
      imageUrl = url
    }

    const payload: ProductFormData = {
      ...form,
      pack_sizes: parseListInput(packSizesText),
      features: parseListInput(featuresText),
      image_url: imageUrl,
    }

    const result = isEdit
      ? await updateProduct(id!, payload)
      : await createProduct(payload)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(isEdit ? 'Product updated successfully.' : 'Product created successfully.')
      setTimeout(() => navigate('/admin/products'), 1500)
    }
  }

  if (loading) return <LoadingSpinner label="Loading product..." />

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-earth-600 hover:text-brand-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <header className="mb-8">
        <h1 className="font-serif text-3xl text-earth-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </header>

      {error && <Alert variant="error" className="mb-6">{error}</Alert>}
      {success && <Alert variant="success" className="mb-6">{success}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-earth-200 bg-white p-6">
        <Input
          label="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
        />

        <Input
          label="Short Description"
          value={form.short_description}
          onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          hint="Brief description shown on product cards"
        />

        <Textarea
          label="Full Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Price (₹)"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            error={errors.price}
            hint="Leave empty for 'Price on request'"
          />
          <Input
            label="Unit"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="kg"
            required
          />
        </div>

        <Textarea
          label="Pack Sizes"
          value={packSizesText}
          onChange={(e) => setPackSizesText(e.target.value)}
          hint="One size per line (e.g. 500g, 1kg, 5kg)"
          rows={3}
        />

        <Textarea
          label="Features"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          hint="One feature per line"
          rows={4}
        />

        <ImageUpload
          currentUrl={form.image_url}
          onFileSelect={(file) => {
            setImageFile(file)
            if (!file) setForm({ ...form, image_url: null })
          }}
          error={errors.image}
        />

        <Input
          label="Display Order"
          type="number"
          min="0"
          value={form.display_order}
          onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
          hint="Lower numbers appear first"
        />

        <Checkbox
          label="Product is available"
          checked={form.is_available}
          onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" loading={submitting} disabled={submitting}>
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
          <Link to="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
