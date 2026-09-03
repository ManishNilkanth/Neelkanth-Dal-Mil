import { FormEvent, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePageMeta } from '../../hooks/usePageMeta'
import { Button } from '../../components/ui/Button'
import { ThemeToggle } from '../../components/ThemeToggle'
import { Input } from '../../components/ui/FormField'
import { Alert, LoadingSpinner } from '../../components/ui/Alert'

export function AdminLoginPage() {
  const { isAuthenticated, loading, signIn } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  usePageMeta({ title: 'Admin Login' })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-earth-100">
        <LoadingSpinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setSubmitting(true)
    const { error: signInError } = await signIn(email.trim(), password)
    setSubmitting(false)

    if (signInError) {
      setError('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-page px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-default bg-surface p-8 shadow-theme-lg">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-2xl text-gradient">Admin Login</h1>
          <p className="mt-2 text-sm text-secondary">Sign in to manage your website</p>
        </header>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button type="submit" className="w-full" loading={submitting} disabled={submitting}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}
