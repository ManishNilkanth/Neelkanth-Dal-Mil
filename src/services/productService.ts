import { supabase } from '../lib/supabase'
import { slugify } from '../lib/utils'
import type { Product, ProductFormData } from '../types'

function mapProduct(row: Product): Product {
  return {
    ...row,
    pack_sizes: row.pack_sizes ?? [],
    features: row.features ?? [],
    price: row.price !== null ? Number(row.price) : null,
  }
}

export async function fetchProducts(): Promise<{ data: Product[]; error: string | null }> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []).map(mapProduct), error: null }
}

export async function fetchAvailableProducts(): Promise<{ data: Product[]; error: string | null }> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []).map(mapProduct), error: null }
}

export async function fetchFeaturedProducts(limit = 4): Promise<{ data: Product[]; error: string | null }> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('display_order', { ascending: true })
    .limit(limit)

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []).map(mapProduct), error: null }
}

export async function fetchProductBySlug(slug: string): Promise<{ data: Product | null; error: string | null }> {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle()

  if (error) return { data: null, error: error.message }
  return { data: data ? mapProduct(data) : null, error: null }
}

export async function fetchProductById(id: string): Promise<{ data: Product | null; error: string | null }> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle()

  if (error) return { data: null, error: error.message }
  return { data: data ? mapProduct(data) : null, error: null }
}

export async function createProduct(form: ProductFormData): Promise<{ data: Product | null; error: string | null }> {
  const slug = slugify(form.name)
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: form.name,
      slug,
      short_description: form.short_description || null,
      description: form.description || null,
      price: form.price ? parseFloat(form.price) : null,
      unit: form.unit || 'kg',
      pack_sizes: form.pack_sizes,
      features: form.features,
      image_url: form.image_url,
      is_available: form.is_available,
      display_order: form.display_order,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: mapProduct(data), error: null }
}

export async function updateProduct(
  id: string,
  form: ProductFormData,
): Promise<{ data: Product | null; error: string | null }> {
  const slug = slugify(form.name)
  const { data, error } = await supabase
    .from('products')
    .update({
      name: form.name,
      slug,
      short_description: form.short_description || null,
      description: form.description || null,
      price: form.price ? parseFloat(form.price) : null,
      unit: form.unit || 'kg',
      pack_sizes: form.pack_sizes,
      features: form.features,
      image_url: form.image_url,
      is_available: form.is_available,
      display_order: form.display_order,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: mapProduct(data), error: null }
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  return { error: error?.message ?? null }
}

export async function fetchProductCount(): Promise<number> {
  const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true })
  if (error) return 0
  return count ?? 0
}
