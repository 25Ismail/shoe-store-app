import type { CartItem } from '../types/shop'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function createOrder(items: CartItem[]): Promise<void> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`,
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        price: item.price,
      })),
    }),
  })
  if (!res.ok) {
    const data = (await res.json()) as { error?: string }
    throw new Error(data.error ?? 'Kunde inte slutföra köp')
  }
}
