import type { CartItem } from '../types/shop'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type FitVote = 'tooSmall' | 'trueToSize' | 'tooLarge'

export type MyOrder = {
  _id: string
  items: Array<{
    productId: string
    name: string
    brand: string
    selectedSize: number
    quantity: number
    price: number
    fitVote?: FitVote
  }>
  createdAt: string
}

export async function getMyOrders(): Promise<MyOrder[]> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}/api/orders/me`, {
    headers: { Authorization: `Bearer ${token ?? ''}` },
  })
  if (!res.ok) return []
  return res.json() as Promise<MyOrder[]>
}

export async function submitFitFeedback(
  productId: string,
  size: number,
  vote: FitVote,
  orderId: string,
): Promise<void> {
  const token = localStorage.getItem('token')
  await fetch(`${API_URL}/api/products/${productId}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`,
    },
    body: JSON.stringify({ size, vote, orderId }),
  })
}

export async function createOrder(items: CartItem[]): Promise<{ _id: string }> {
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
  return res.json() as Promise<{ _id: string }>
}
