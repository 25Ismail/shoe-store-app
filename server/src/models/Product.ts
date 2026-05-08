import { Schema, model, Document } from 'mongoose'

// How a shoe fits compared to standard sizing
type FitType = 'true-to-size' | 'runs-small' | 'runs-large' | 'narrow-fit' | 'wide-fit'
type ShoeCategory = 'running' | 'sneakers' | 'boots' | 'training'

// Fit feedback counts per size, collected from buyers
interface FitFeedback {
  tooSmall: number
  trueToSize: number
  tooLarge: number
}

// Describes what a product document looks like in the database
export interface IProduct extends Document {
  name: string
  brand: string
  category: ShoeCategory
  price: number
  imageUrl: string
  description: string
  // List of EU sizes this shoe comes in, e.g. [39, 40, 41, 42]
  availableSizes: number[]
  // How many pairs are in stock for each size. Key is the size as a string, e.g. "42"
  stockBySize: Map<string, number>
  fit: {
    type: FitType
    label: string   // Short display text, e.g. "Runs small"
    advice: string  // What to tell the buyer, e.g. "Go one size up"
  }
  // Conversion table between EU, UK, US sizes and foot length
  sizeGuide: {
    eu: number
    uk: number
    us: number
    footLengthCm: number
  }[]
  // Buyer votes per size — key is the size as a string, e.g. "42"
  fitFeedback: Map<string, FitFeedback>
}

// Mongoose treats a field literally named "type" as special, so we need a sub-schema here
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
  // _id: false means this nested object won't get its own database ID
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
    // Map lets us use size numbers as keys, e.g. { "42": 5, "43": 0 }
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
    // Map of size → vote counts. Starts empty and grows as buyers leave feedback.
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
  // timestamps: true adds createdAt and updatedAt fields automatically
  { timestamps: true },
)

// Clean up MongoDB internal fields before the object is sent to the client
productSchema.set('toJSON', {
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>
    // Rename _id to id so the frontend gets a clean "id" string
    r.id = (r._id as { toString(): string }).toString()
    delete r._id
    delete r.__v  // __v is a version key Mongoose adds internally — clients don't need it
  },
})

export const Product = model<IProduct>('Product', productSchema)
