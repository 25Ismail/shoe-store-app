const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function register(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = (await res.json()) as { token?: string; error?: string }
  if (!res.ok) throw new Error(data.error ?? 'Registrering misslyckades')
  return data.token!
}

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = (await res.json()) as { token?: string; error?: string }
  if (!res.ok) throw new Error(data.error ?? 'Inloggning misslyckades')
  return data.token!
}
