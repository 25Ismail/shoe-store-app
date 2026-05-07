import { Schema, model, Document } from 'mongoose'

type FitType = 'true-to-size' | 'runs-small' | 'runs-large' | 'narrow-fit' | 'wide-fit'
type ShoeCategory = 'running' | 'sneakers' | 'boots' | 'training'

// Aggregerad passformsfeedback per storlek, insamlad från köpare
interface FitFeedback {
  tooSmall: number
  trueToSize: number
  tooLarge: number
}

export interface IProduct extends Document {
  name: string
  brand: string
  category: ShoeCategory
  price: number
  imageUrl: string
  description: string
  availableSizes: number[]
  stockBySize: Map<string, number>
  fit: {
    type: FitType
    label: string
    advice: string
  }
  sizeGuide: {
    eu: number
    uk: number
    us: number
    footLengthCm: number
  }[]
  fitFeedback: Map<string, FitFeedback>
}

// Subsschema för fit – eget Schema krävs eftersom fältet heter "type"
const fitSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['true-to-size', 'runs-small', 'runs-large', 'narrow-fit', 'wide-fit'],
      required: true,
    },
    label: { type: String, required: true },
    advice: { type: String, required: true },
  },
  { _id: false },
)

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      enum: ['running', 'sneakers', 'boots', 'training'],
      required: true,
    },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    availableSizes: [{ type: Number }],
    stockBySize: { type: Map, of: Number },
    fit: { type: fitSchema, required: true },
    sizeGuide: [
      {
        _id: false,
        eu: Number,
        uk: Number,
        us: Number,
        footLengthCm: Number,
      },
    ],
    fitFeedback: {
      type: Map,
      of: new Schema(
        {
          tooSmall: { type: Number, default: 0 },
          trueToSize: { type: Number, default: 0 },
          tooLarge: { type: Number, default: 0 },
        },
        { _id: false },
      ),
      default: {},
    },
  },
  { timestamps: true },
)

productSchema.set('toJSON', {
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>
    r.id = (r._id as { toString(): string }).toString()
    delete r._id
    delete r.__v
  },
})

export const Product = model<IProduct>('Product', productSchema)
