import type { Request, Response } from 'express'
import { Product } from '../models/Product'
import { Order } from '../models/Order'
import type { AuthRequest } from '../middleware/requireAuth'

export async function getAllProducts(_req: Request, res: Response): Promise<void> {
  try {
    const products = await Product.find()
    res.json(products)
  } catch {
    res.status(500).json({ error: 'Kunde inte hämta produkter' })
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404).json({ error: 'Produkt hittades inte' })
      return
    }
    res.json(product)
  } catch {
    res.status(500).json({ error: 'Kunde inte hämta produkt' })
  }
}

export async function submitFitFeedback(req: AuthRequest, res: Response): Promise<void> {
  const { size, vote, orderId } = req.body as {
    size?: number
    vote?: 'tooSmall' | 'trueToSize' | 'tooLarge'
    orderId?: string
  }

  if (!size || !vote) {
    res.status(400).json({ error: 'size och vote krävs' })
    return
  }

  const sizeKey = String(size)

  try {
    const result = await Product.updateOne(
      { _id: req.params.id },
      { $inc: { [`fitFeedback.${sizeKey}.${vote}`]: 1 } },
    )

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Produkt hittades inte' })
      return
    }

    if (orderId) {
      await Order.updateOne(
        { _id: orderId, userId: req.userId, 'items.productId': req.params.id, 'items.selectedSize': size },
        { $set: { 'items.$.fitVote': vote } },
      )
    }

    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Kunde inte spara feedback' })
  }
}
