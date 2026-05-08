import { Schema, model, Document, Types } from 'mongoose'

// What the buyer thought about the fit after receiving the shoe
type FitVote = 'tooSmall' | 'trueToSize' | 'tooLarge'

// One shoe in an order — we copy name/brand/price at purchase time so the order
// stays accurate even if the product is later edited or removed
interface OrderItem {
  productId: Types.ObjectId
  name: string
  brand: string
  category?: string
  fitLabel?: string   // e.g. "Runs small" — copied from the product at purchase time
  selectedSize: number
  quantity: number
  price: number
  fitVote?: FitVote   // Filled in later when the buyer leaves feedback
}

// Describes what an order document looks like in the database
export interface IOrder extends Document {
  userId: Types.ObjectId  // The user who placed the order
  items: OrderItem[]
  createdAt: Date
}

// { _id: false } means each item in the array won't get its own database ID
const orderItemSchema = new Schema<OrderItem>(
  {
    // ref: 'Product' lets Mongoose join the product data if needed
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
  // timestamps: true adds createdAt and updatedAt automatically
  { timestamps: true },
)

export const Order = model<IOrder>('Order', orderSchema)
