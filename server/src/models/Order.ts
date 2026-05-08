import { Schema, model, Document, Types } from 'mongoose'

type FitVote = 'tooSmall' | 'trueToSize' | 'tooLarge'

interface OrderItem {
  productId: Types.ObjectId
  name: string
  brand: string
  category?: string
  fitLabel?: string
  selectedSize: number
  quantity: number
  price: number
  fitVote?: FitVote
}

export interface IOrder extends Document {
  userId: Types.ObjectId
  items: OrderItem[]
  createdAt: Date
}

// { _id: false } means each item in the array won't get its own database ID
const orderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String },
    fitLabel: { type: String },
    selectedSize: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    fitVote: { type: String, enum: ['tooSmall', 'trueToSize', 'tooLarge'] },
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
