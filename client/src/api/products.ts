import type { Product } from '../types/shop'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`)
  if (!res.ok) throw new Error('Kunde inte hämta produkter')
  return res.json() as Promise<Product[]>
}
