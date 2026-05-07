import { Schema, model, Document, Types } from 'mongoose'

interface OrderItem {
  productId: Types.ObjectId
  name: string
  brand: string
  selectedSize: number
  quantity: number
  price: number
}

export interface IOrder extends Document {
  userId: Types.ObjectId
  items: OrderItem[]
  createdAt: Date
}

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    selectedSize: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false },
)

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
  },
  { timestamps: true },
)

export const Order = model<IOrder>('Order', orderSchema)
