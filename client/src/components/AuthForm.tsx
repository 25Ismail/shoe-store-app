import { useState } from 'react'
import { register, login } from '../api/auth'

type Props = {
  onSuccess: (token: string, email: string) => void
  onClose: () => void
}

export function AuthForm({ onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const token = mode === 'login'
        ? await login(email, password)
        : await register(email, password)
      onSuccess(token, email)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="auth-overlay" onClick={onClose} />
      <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div className="auth-modal__header">
          <h2 id="auth-title">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
          <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="auth-modal__form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="auth-modal__error">{error}</p>}

          <button type="submit" className="auth-modal__submit" disabled={loading}>
            {loading ? 'Loading…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-modal__toggle">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </>
  )
}
