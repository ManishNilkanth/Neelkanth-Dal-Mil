import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchContentByKeys, getContentValue } from '../services/contentService'
import { mockContent } from '../services/mockData'
import { AnimateOnScroll } from '../components/ui/AnimateOnScroll'
import { Alert, LoadingSpinner } from '../components/ui/Alert'
import type { ContentMap } from '../types'
import type { PublicLayoutContext } from '../layouts/PublicLayout'

const qualityKeys = [
  'quality_intro',
  'quality_raw_material',
  'quality_cleaning',
  'quality_processing',
  'quality_sorting',
  'quality_qc',
  'quality_packaging',
  'quality_other',
] as const

export function QualityPage() {
  const { businessName } = useOutletContext<PublicLayoutContext>()
  const [content, setContent] = useState<ContentMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageMeta({
    title: `Quality & Manufacturing | ${businessName}`,
    description: getContentValue(content, 'quality_intro', 'content', 'Our quality and manufacturing process.'),
  })

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setContent(mockContent)
        setLoading(false)
        return
      }
      const { data, error: err } = await fetchContentByKeys([...qualityKeys])
      if (err) setError(err)
      else setContent(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner label="Loading quality information..." />

  const sections = qualityKeys
    .filter((key) => key !== 'quality_intro')
    .map((key) => ({
      key,
      title: getContentValue(content, key, 'title', key.replace('quality_', '').replace(/_/g, ' ')),
      body: getContentValue(content, key, 'content', ''),
    }))
    .filter((s) => s.body)

  return (
    <div className="section-padding bg-page">
      <div className="container-page">
        {error && <Alert variant="error" className="mb-8">{error}</Alert>}

        <AnimateOnScroll className="mb-12 max-w-3xl">
          <h1 className="section-title mb-4 text-gradient">
            {getContentValue(content, 'quality_intro', 'title', 'Quality & Manufacturing')}
          </h1>
          <p className="section-subtitle">
            {getContentValue(content, 'quality_intro', 'content', '')}
          </p>
        </AnimateOnScroll>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map(({ key, title, body }, index) => (
            <AnimateOnScroll key={key} delay={index * 80}>
              <article className="card-interactive h-full p-6">
                <h2 className="mb-3 font-serif text-xl text-primary">{title}</h2>
                <p className="whitespace-pre-line leading-relaxed text-secondary">{body}</p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </div>
  )
}
