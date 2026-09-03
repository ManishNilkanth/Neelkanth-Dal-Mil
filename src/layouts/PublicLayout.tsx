import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { LoadingSpinner } from '../components/ui/Alert'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchBusinessSettings } from '../services/contentService'
import { mockBusinessSettings } from '../services/mockData'
import type { BusinessSettings } from '../types'

export function PublicLayout() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setSettings(mockBusinessSettings)
        setLoading(false)
        return
      }
      const { data } = await fetchBusinessSettings()
      setSettings(data ?? mockBusinessSettings)
      setLoading(false)
    }
    load()
  }, [])

  const businessName = settings?.business_name ?? 'Daal Mill'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Loading website..." />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header businessName={businessName} settings={settings} />
      <main className="flex-1">
        <Outlet context={{ settings, businessName }} />
      </main>
      <Footer businessName={businessName} settings={settings} />
    </div>
  )
}

export interface PublicLayoutContext {
  settings: BusinessSettings | null
  businessName: string
}
