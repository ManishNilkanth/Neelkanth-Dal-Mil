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

const aboutKeys = [
  'about_title',
  'about_intro',
  'about_history',
  'about_experience',
  'about_mission',
  'about_vision',
  'about_location',
] as const

export function AboutPage() {
  const { businessName } = useOutletContext<PublicLayoutContext>()
  const [content, setContent] = useState<ContentMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageMeta({
    title: `About Us | ${businessName}`,
    description: getContentValue(content, 'about_intro', 'content', 'Learn about our daal mill business.'),
  })

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setContent(mockContent)
        setLoading(false)
        return
      }
      const { data, error: err } = await fetchContentByKeys([...aboutKeys])
      if (err) setError(err)
      else setContent(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner label="Loading about page..." />

  const sections = [
    { key: 'about_intro' as const, fallbackTitle: 'Introduction' },
    { key: 'about_history' as const, fallbackTitle: 'Our History' },
    { key: 'about_experience' as const, fallbackTitle: 'Experience' },
    { key: 'about_mission' as const, fallbackTitle: 'Our Mission' },
    { key: 'about_vision' as const, fallbackTitle: 'Our Vision' },
    { key: 'about_location' as const, fallbackTitle: 'Location' },
  ]

  return (
    <div className="section-padding bg-page">
      <div className="container-page">
        {error && <Alert variant="error" className="mb-8">{error}</Alert>}

        <AnimateOnScroll>
          <header className="mb-12 max-w-3xl">
            <h1 className="section-title text-gradient">
              {getContentValue(content, 'about_title', 'title', 'About Us')}
            </h1>
          </header>
        </AnimateOnScroll>

        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map(({ key, fallbackTitle }, index) => {
            const title = getContentValue(content, key, 'title', fallbackTitle)
            const body = getContentValue(content, key, 'content', '')
            if (!body) return null
            return (
              <AnimateOnScroll key={key} delay={index * 80}>
                <section className="card-interactive p-6 sm:p-8">
                  <h2 className="mb-4 font-serif text-2xl text-primary">{title}</h2>
                  <div className="whitespace-pre-line leading-relaxed text-secondary">{body}</div>
                </section>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </div>
  )
}
