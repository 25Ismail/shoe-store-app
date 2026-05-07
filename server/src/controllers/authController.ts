import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET ?? ''
const JWT_EXPIRES_IN = '7d'

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'E-post och lösenord krävs' })
    return
  }

  try {
    const existing = await User.findOne({ email })
    if (existing) {
      res.status(409).json({ error: 'E-postadressen används redan' })
      return
    }

    const user = new User({ email, passwordHash: password })
    await user.save()

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    res.status(201).json({ token })
  } catch {
    res.status(500).json({ error: 'Registrering misslyckades' })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'E-post och lösenord krävs' })
    return
  }

  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: 'Felaktig e-post eller lösenord' })
      return
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    res.json({ token })
  } catch {
    res.status(500).json({ error: 'Inloggning misslyckades' })
  }
}
