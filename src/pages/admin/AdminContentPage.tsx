import { FormEvent, useEffect, useState } from 'react'
import { usePageMeta } from '../../hooks/usePageMeta'
import { fetchAllContent, upsertContent } from '../../services/contentService'
import { isSupabaseConfigured } from '../../lib/supabase'
import { mockContent } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/FormField'
import { Alert, LoadingSpinner } from '../../components/ui/Alert'
import type { ContentMap, ContentSectionKey } from '../../types'

interface ContentField {
  key: ContentSectionKey
  label: string
  hasTitle?: boolean
  rows?: number
}

const homepageFields: ContentField[] = [
  { key: 'hero_title', label: 'Hero Title', rows: 2 },
  { key: 'hero_description', label: 'Hero Description', rows: 4 },
  { key: 'hero_cta_text', label: 'Call-to-Action Button Text' },
  { key: 'hero_supporting', label: 'Supporting Text (above title)' },
  { key: 'home_featured_intro', label: 'Featured Products Section', hasTitle: true, rows: 3 },
  { key: 'home_why_choose', label: 'Why Choose Us Section', hasTitle: true, rows: 6 },
]

const aboutFields: ContentField[] = [
  { key: 'about_title', label: 'Page Title', hasTitle: true },
  { key: 'about_intro', label: 'Introduction', hasTitle: true, rows: 5 },
  { key: 'about_history', label: 'History', hasTitle: true, rows: 5 },
  { key: 'about_experience', label: 'Experience', hasTitle: true, rows: 4 },
  { key: 'about_mission', label: 'Mission', hasTitle: true, rows: 4 },
  { key: 'about_vision', label: 'Vision', hasTitle: true, rows: 4 },
  { key: 'about_location', label: 'Location', hasTitle: true, rows: 4 },
]

const qualityFields: ContentField[] = [
  { key: 'quality_intro', label: 'Page Introduction', hasTitle: true, rows: 4 },
  { key: 'quality_raw_material', label: 'Raw Material Selection', hasTitle: true, rows: 4 },
  { key: 'quality_cleaning', label: 'Cleaning', hasTitle: true, rows: 4 },
  { key: 'quality_processing', label: 'Processing', hasTitle: true, rows: 4 },
  { key: 'quality_sorting', label: 'Sorting', hasTitle: true, rows: 4 },
  { key: 'quality_qc', label: 'Quality Control', hasTitle: true, rows: 4 },
  { key: 'quality_packaging', label: 'Packaging', hasTitle: true, rows: 4 },
  { key: 'quality_other', label: 'Additional Information', hasTitle: true, rows: 4 },
]

type Tab = 'homepage' | 'about' | 'quality'

export function AdminContentPage() {
  const [tab, setTab] = useState<Tab>('homepage')
  const [content, setContent] = useState<ContentMap>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  usePageMeta({ title: 'Website Content | Admin' })

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setContent(mockContent)
        setLoading(false)
        return
      }
      const { data, error: err } = await fetchAllContent()
      if (err) setError(err)
      else setContent(data)
      setLoading(false)
    }
    load()
  }, [])

  const getFields = (): ContentField[] => {
    if (tab === 'homepage') return homepageFields
    if (tab === 'about') return aboutFields
    return qualityFields
  }

  const updateField = (key: ContentSectionKey, field: 'title' | 'content', value: string) => {
    setContent((prev) => ({
      ...prev,
      [key]: {
        id: prev[key]?.id ?? '',
        section_key: key,
        title: field === 'title' ? value : (prev[key]?.title ?? null),
        content: field === 'content' ? value : (prev[key]?.content ?? null),
        image_url: prev[key]?.image_url ?? null,
        updated_at: prev[key]?.updated_at ?? new Date().toISOString(),
      },
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured.')
      return
    }

    setSubmitting(true)
    setError(null)

    const fields = getFields()
    const results = await Promise.all(
      fields.map((f) =>
        upsertContent(f.key, {
          title: content[f.key]?.title ?? null,
          content: content[f.key]?.content ?? null,
        }),
      ),
    )

    setSubmitting(false)
    const failed = results.find((r) => r.error)
    if (failed?.error) {
      setError(failed.error)
    } else {
      setSuccess('Content saved successfully.')
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'homepage', label: 'Homepage' },
    { id: 'about', label: 'About Page' },
    { id: 'quality', label: 'Quality Page' },
  ]

  if (loading) return <LoadingSpinner label="Loading content..." />

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-earth-900">Website Content</h1>
        <p className="mt-1 text-earth-600">Update text shown on your website</p>
      </header>

      {error && <Alert variant="error" className="mb-6">{error}</Alert>}
      {success && <Alert variant="success" className="mb-6">{success}</Alert>}

      <div className="mb-6 flex gap-2 border-b border-earth-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'border-b-2 border-brand-700 text-brand-800'
                : 'text-earth-600 hover:text-earth-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-earth-200 bg-white p-6">
        {getFields().map((field) => (
          <div key={field.key} className="space-y-4 border-b border-earth-100 pb-6 last:border-0">
            <h3 className="font-medium text-earth-900">{field.label}</h3>
            {field.hasTitle && (
              <Input
                label="Section Title"
                value={content[field.key]?.title ?? ''}
                onChange={(e) => updateField(field.key, 'title', e.target.value)}
              />
            )}
            <Textarea
              label="Content"
              value={content[field.key]?.content ?? ''}
              onChange={(e) => updateField(field.key, 'content', e.target.value)}
              rows={field.rows ?? 3}
              hint={field.key === 'home_why_choose' ? 'Use format: Title: Description (one per line)' : undefined}
            />
          </div>
        ))}

        <Button type="submit" loading={submitting} disabled={submitting || !isSupabaseConfigured}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}
