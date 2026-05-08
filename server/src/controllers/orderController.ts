import type { Response } from 'express'
import type { AuthRequest } from '../middleware/requireAuth'
import { Order } from '../models/Order'
import { Types } from 'mongoose'

interface OrderItemInput {
  productId: string
  name: string
  brand: string
  category?: string
  fitLabel?: string
  selectedSize: number
  quantity: number
  price: number
}

export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  const items = req.body.items as OrderItemInput[] | undefined

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Order måste innehålla minst en produkt' })
    return
  }

  try {
    const order = await Order.create({
      userId: new Types.ObjectId(req.userId),
      items: items.map((item) => ({
        productId: new Types.ObjectId(item.productId),
        name: item.name,
        brand: item.brand,
        category: item.category,
        fitLabel: item.fitLabel,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        price: item.price,
      })),
    })
    res.status(201).json(order)
  } catch {
    res.status(500).json({ error: 'Kunde inte skapa order' })
  }
}

export async function getMyOrders(req: AuthRequest, res: Response): Promise<void> {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch {
    res.status(500).json({ error: 'Kunde inte hämta ordrar' })
  }
}
