import { FormEvent, useEffect, useState } from 'react'
import { usePageMeta } from '../../hooks/usePageMeta'
import { fetchBusinessSettings, upsertBusinessSettings } from '../../services/contentService'
import { isSupabaseConfigured } from '../../lib/supabase'
import { mockBusinessSettings } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/FormField'
import { Alert, LoadingSpinner } from '../../components/ui/Alert'
import type { BusinessSettings, SocialLinks } from '../../types'

export function AdminBusinessPage() {
  const [settings, setSettings] = useState<BusinessSettings>(mockBusinessSettings)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  usePageMeta({ title: 'Business Information | Admin' })

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }
      const { data } = await fetchBusinessSettings()
      if (data) setSettings(data)
      setLoading(false)
    }
    load()
  }, [])

  const updateSocial = (key: keyof SocialLinks, value: string) => {
    setSettings((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [key]: value },
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

    const { error: err } = await upsertBusinessSettings({
      id: settings.id,
      business_name: settings.business_name,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      business_hours: settings.business_hours,
      map_url: settings.map_url,
      social_links: settings.social_links,
    })

    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      setSuccess('Business information saved successfully.')
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  if (loading) return <LoadingSpinner label="Loading business information..." />

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-earth-900">Business Information</h1>
        <p className="mt-1 text-earth-600">Update contact details shown on your website</p>
      </header>

      {error && <Alert variant="error" className="mb-6">{error}</Alert>}
      {success && <Alert variant="success" className="mb-6">{success}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-earth-200 bg-white p-6">
        <Input
          label="Business Name"
          value={settings.business_name ?? ''}
          onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={settings.phone ?? ''}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
          hint="Include country code if needed"
        />

        <Input
          label="WhatsApp Number"
          type="tel"
          value={settings.whatsapp ?? ''}
          onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
          hint="Used for WhatsApp enquiry buttons"
        />

        <Input
          label="Email Address"
          type="email"
          value={settings.email ?? ''}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
        />

        <Textarea
          label="Address"
          value={settings.address ?? ''}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          rows={3}
        />

        <Input
          label="Business Hours"
          value={settings.business_hours ?? ''}
          onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
          placeholder="Mon–Sat: 9:00 AM – 6:00 PM"
        />

        <Input
          label="Google Maps Link (optional)"
          value={settings.map_url ?? ''}
          onChange={(e) => setSettings({ ...settings, map_url: e.target.value })}
          hint="Paste a Google Maps share link, or leave empty — the map will use your address above."
          placeholder="https://maps.app.goo.gl/... or embed URL"
        />

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium text-earth-800">Social Media Links</legend>
          <Input
            label="Facebook"
            type="url"
            value={settings.social_links.facebook ?? ''}
            onChange={(e) => updateSocial('facebook', e.target.value)}
            placeholder="https://facebook.com/..."
          />
          <Input
            label="Instagram"
            type="url"
            value={settings.social_links.instagram ?? ''}
            onChange={(e) => updateSocial('instagram', e.target.value)}
            placeholder="https://instagram.com/..."
          />
          <Input
            label="YouTube"
            type="url"
            value={settings.social_links.youtube ?? ''}
            onChange={(e) => updateSocial('youtube', e.target.value)}
            placeholder="https://youtube.com/..."
          />
        </fieldset>

        <Button type="submit" loading={submitting} disabled={submitting || !isSupabaseConfigured}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}
