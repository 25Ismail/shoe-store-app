export type FitType =
  | 'true-to-size'
  | 'runs-small'
  | 'runs-large'
  | 'narrow-fit'
  | 'wide-fit'

export type ShoeCategory = 'running' | 'sneakers' | 'boots' | 'training'

export type ShoeSize = number

export type FitInfo = {
  type: FitType
  label: string
  advice: string
}

export type SizeGuideRow = {
  eu: ShoeSize
  uk: number
  us: number
  footLengthCm: number
}

export type FitFeedbackEntry = {
  tooSmall: number
  trueToSize: number
  tooLarge: number
}

export type Product = {
  id: string
  name: string
  brand: string
  category: ShoeCategory
  price: number
  imageUrl: string
  description: string
  availableSizes: ShoeSize[]
  stockBySize?: Record<ShoeSize, number>
  fit: FitInfo
  sizeGuide: SizeGuideRow[]
  fitFeedback?: Record<string, FitFeedbackEntry>
}

export type CartItem = {
  id: string
  productId: Product['id']
  name: Product['name']
  brand: Product['brand']
  imageUrl: Product['imageUrl']
  category: Product['category']
  fitLabel: Product['fit']['label']
  selectedSize: ShoeSize
  quantity: number
  price: Product['price']
}
