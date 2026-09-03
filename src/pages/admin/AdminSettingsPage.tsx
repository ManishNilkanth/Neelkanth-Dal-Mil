import { usePageMeta } from '../../hooks/usePageMeta'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Alert } from '../../components/ui/Alert'

export function AdminSettingsPage() {
  usePageMeta({ title: 'Settings | Admin' })

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-earth-900">Settings</h1>
        <p className="mt-1 text-earth-600">Account and website settings</p>
      </header>

      <div className="space-y-6">
        <section className="rounded-xl border border-earth-200 bg-white p-6">
          <h2 className="mb-4 font-serif text-lg text-earth-900">Connection Status</h2>
          <p className="text-sm text-earth-600">
            Supabase:{' '}
            <span className={isSupabaseConfigured ? 'text-green-700' : 'text-amber-700'}>
              {isSupabaseConfigured ? 'Connected' : 'Not configured'}
            </span>
          </p>
          {!isSupabaseConfigured && (
            <Alert variant="info" className="mt-4">
              Add your Supabase URL and anon key to the <code>.env</code> file to connect your website to the database.
            </Alert>
          )}
        </section>

        <section className="rounded-xl border border-earth-200 bg-white p-6">
          <h2 className="mb-4 font-serif text-lg text-earth-900">Password</h2>
          <p className="text-sm text-earth-600">
            To change your password, use the Supabase dashboard or contact your website administrator.
          </p>
        </section>
      </div>
    </div>
  )
}
