import { PRODUCT_IMAGES_BUCKET, supabase } from '../lib/supabase'

export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (uploadError) return { url: null, error: uploadError.message }

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(fileName)
  return { url: data.publicUrl, error: null }
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  const path = extractStoragePath(imageUrl)
  if (!path) return
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path])
}

function extractStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return url.slice(index + marker.length)
}
