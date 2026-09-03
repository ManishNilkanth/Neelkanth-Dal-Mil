import { supabase } from '../lib/supabase'
import type { BusinessSettings, ContentMap, ContentSectionKey, SocialLinks, WebsiteContent } from '../types'

function mapContent(rows: WebsiteContent[]): ContentMap {
  return rows.reduce<ContentMap>((acc, row) => {
    acc[row.section_key as ContentSectionKey] = row
    return acc
  }, {})
}

export async function fetchAllContent(): Promise<{ data: ContentMap; error: string | null }> {
  const { data, error } = await supabase.from('website_content').select('*')

  if (error) return { data: {}, error: error.message }
  return { data: mapContent(data ?? []), error: null }
}

export async function fetchContentByKeys(
  keys: ContentSectionKey[],
): Promise<{ data: ContentMap; error: string | null }> {
  const { data, error } = await supabase.from('website_content').select('*').in('section_key', keys)

  if (error) return { data: {}, error: error.message }
  return { data: mapContent(data ?? []), error: null }
}

export async function upsertContent(
  sectionKey: ContentSectionKey,
  fields: { title?: string | null; content?: string | null; image_url?: string | null },
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('website_content').upsert(
    {
      section_key: sectionKey,
      title: fields.title ?? null,
      content: fields.content ?? null,
      image_url: fields.image_url ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' },
  )

  return { error: error?.message ?? null }
}

export async function fetchBusinessSettings(): Promise<{
  data: BusinessSettings | null
  error: string | null
}> {
  const { data, error } = await supabase.from('business_settings').select('*').limit(1).maybeSingle()

  if (error) return { data: null, error: error.message }

  if (!data) return { data: null, error: null }

  return {
    data: {
      ...data,
      social_links: (data.social_links as SocialLinks) ?? {},
    },
    error: null,
  }
}

export async function upsertBusinessSettings(
  settings: Omit<BusinessSettings, 'id' | 'updated_at'> & { id?: string },
): Promise<{ error: string | null }> {
  const payload = {
    ...settings,
    social_links: settings.social_links ?? {},
    updated_at: new Date().toISOString(),
  }

  if (settings.id) {
    const { error } = await supabase.from('business_settings').update(payload).eq('id', settings.id)
    return { error: error?.message ?? null }
  }

  const { error } = await supabase.from('business_settings').insert(payload)
  return { error: error?.message ?? null }
}

export function getContentValue(
  content: ContentMap,
  key: ContentSectionKey,
  field: 'title' | 'content' = 'content',
  fallback = '',
): string {
  const section = content[key]
  if (!section) return fallback
  return section[field] ?? fallback
}
