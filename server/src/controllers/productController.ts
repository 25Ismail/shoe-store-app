import type { Request, Response } from 'express'
import { Product } from '../models/Product'

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
