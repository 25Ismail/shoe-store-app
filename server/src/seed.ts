import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Product } from './models/Product'

dotenv.config()

const products = [
  {
    name: 'Air Runner',
    brand: 'Nike',
    category: 'running',
    price: 1299,
    imageUrl: '/images/air-runner.jpg',
    description: 'Lightweight running shoe for everyday training.',
    availableSizes: [39, 40, 41, 42, 43, 44],
    stockBySize: new Map([['39', 3], ['40', 6], ['41', 5], ['42', 0], ['43', 4], ['44', 2]]),
    fit: { type: 'runs-small', label: 'Runs small', advice: 'Choose one size larger than your usual size.' },
    fitFeedback: new Map([
      ['39', { tooSmall: 9, trueToSize: 2, tooLarge: 0 }],
      ['40', { tooSmall: 8, trueToSize: 3, tooLarge: 1 }],
      ['41', { tooSmall: 7, trueToSize: 4, tooLarge: 0 }],
      ['42', { tooSmall: 6, trueToSize: 2, tooLarge: 0 }],
      ['43', { tooSmall: 5, trueToSize: 3, tooLarge: 1 }],
      ['44', { tooSmall: 4, trueToSize: 2, tooLarge: 0 }],
    ]),
    sizeGuide: [
      { eu: 39, uk: 6, us: 7, footLengthCm: 24.5 },
      { eu: 40, uk: 6.5, us: 7.5, footLengthCm: 25 },
      { eu: 41, uk: 7, us: 8, footLengthCm: 25.5 },
      { eu: 42, uk: 8, us: 9, footLengthCm: 26.5 },
      { eu: 43, uk: 9, us: 10, footLengthCm: 27.5 },
      { eu: 44, uk: 9.5, us: 10.5, footLengthCm: 28 },
    ],
  },
  {
    name: 'Street Court',
    brand: 'Adidas',
    category: 'sneakers',
    price: 999,
    imageUrl: '/images/street-court.jpg',
    description: 'Everyday sneaker with a clean court-inspired design.',
    availableSizes: [38, 39, 40, 41, 42, 43, 44, 45],
    stockBySize: new Map([['38', 2], ['39', 3], ['40', 7], ['41', 8], ['42', 6], ['43', 3], ['44', 1], ['45', 0]]),
    fit: { type: 'true-to-size', label: 'True to size', advice: 'Choose your usual size.' },
    fitFeedback: new Map([
      ['38', { tooSmall: 1, trueToSize: 11, tooLarge: 2 }],
      ['39', { tooSmall: 2, trueToSize: 14, tooLarge: 1 }],
      ['40', { tooSmall: 1, trueToSize: 18, tooLarge: 2 }],
      ['41', { tooSmall: 0, trueToSize: 16, tooLarge: 1 }],
      ['42', { tooSmall: 1, trueToSize: 12, tooLarge: 2 }],
      ['43', { tooSmall: 2, trueToSize: 9, tooLarge: 1 }],
      ['44', { tooSmall: 0, trueToSize: 7, tooLarge: 1 }],
      ['45', { tooSmall: 1, trueToSize: 5, tooLarge: 0 }],
    ]),
    sizeGuide: [
      { eu: 38, uk: 5.5, us: 6.5, footLengthCm: 24 },
      { eu: 39, uk: 6, us: 7, footLengthCm: 24.5 },
      { eu: 40, uk: 6.5, us: 7.5, footLengthCm: 25 },
      { eu: 41, uk: 7, us: 8, footLengthCm: 25.5 },
      { eu: 42, uk: 8, us: 9, footLengthCm: 26.5 },
      { eu: 43, uk: 9, us: 10, footLengthCm: 27.5 },
      { eu: 44, uk: 9.5, us: 10.5, footLengthCm: 28 },
      { eu: 45, uk: 10.5, us: 11.5, footLengthCm: 29 },
    ],
  },
  {
    name: 'Trail Grip',
    brand: 'Salomon',
    category: 'running',
    price: 1499,
    imageUrl: '/images/trail-grip.jpg',
    description: 'Trail running shoe built for grip and uneven surfaces.',
    availableSizes: [40, 41, 42, 43, 44, 45, 46],
    stockBySize: new Map([['40', 1], ['41', 4], ['42', 4], ['43', 5], ['44', 3], ['45', 2], ['46', 0]]),
    fit: { type: 'narrow-fit', label: 'Narrow fit', advice: 'Best for narrow feet. Consider sizing up if you need more width.' },
    fitFeedback: new Map([
      ['40', { tooSmall: 6, trueToSize: 5, tooLarge: 1 }],
      ['41', { tooSmall: 5, trueToSize: 6, tooLarge: 0 }],
      ['42', { tooSmall: 7, trueToSize: 4, tooLarge: 1 }],
      ['43', { tooSmall: 5, trueToSize: 5, tooLarge: 2 }],
      ['44', { tooSmall: 4, trueToSize: 4, tooLarge: 0 }],
      ['45', { tooSmall: 3, trueToSize: 3, tooLarge: 1 }],
      ['46', { tooSmall: 2, trueToSize: 2, tooLarge: 0 }],
    ]),
    sizeGuide: [
      { eu: 40, uk: 6.5, us: 7.5, footLengthCm: 25 },
      { eu: 41, uk: 7, us: 8, footLengthCm: 25.5 },
      { eu: 42, uk: 8, us: 9, footLengthCm: 26.5 },
      { eu: 43, uk: 9, us: 10, footLengthCm: 27.5 },
      { eu: 44, uk: 9.5, us: 10.5, footLengthCm: 28 },
      { eu: 45, uk: 10.5, us: 11.5, footLengthCm: 29 },
      { eu: 46, uk: 11, us: 12, footLengthCm: 29.5 },
    ],
  },
  {
    name: 'City Boot',
    brand: 'Timberland',
    category: 'boots',
    price: 1799,
    imageUrl: '/images/city-boot.jpg',
    description: 'Durable boot for colder days and city use.',
    availableSizes: [39, 40, 41, 42, 43, 44, 45],
    stockBySize: new Map([['39', 1], ['40', 2], ['41', 3], ['42', 5], ['43', 3], ['44', 2], ['45', 1]]),
    fit: { type: 'runs-large', label: 'Runs large', advice: 'Consider choosing one size smaller than your usual size.' },
    fitFeedback: new Map([
      ['39', { tooSmall: 0, trueToSize: 2, tooLarge: 8 }],
      ['40', { tooSmall: 1, trueToSize: 3, tooLarge: 9 }],
      ['41', { tooSmall: 0, trueToSize: 4, tooLarge: 10 }],
      ['42', { tooSmall: 1, trueToSize: 3, tooLarge: 8 }],
      ['43', { tooSmall: 0, trueToSize: 2, tooLarge: 7 }],
      ['44', { tooSmall: 0, trueToSize: 2, tooLarge: 5 }],
      ['45', { tooSmall: 0, trueToSize: 1, tooLarge: 4 }],
    ]),
    sizeGuide: [
      { eu: 39, uk: 6, us: 7, footLengthCm: 24.5 },
      { eu: 40, uk: 6.5, us: 7.5, footLengthCm: 25 },
      { eu: 41, uk: 7, us: 8, footLengthCm: 25.5 },
      { eu: 42, uk: 8, us: 9, footLengthCm: 26.5 },
      { eu: 43, uk: 9, us: 10, footLengthCm: 27.5 },
      { eu: 44, uk: 9.5, us: 10.5, footLengthCm: 28 },
      { eu: 45, uk: 10.5, us: 11.5, footLengthCm: 29 },
    ],
  },
  {
    name: 'Flex Trainer',
    brand: 'Puma',
    category: 'training',
    price: 899,
    imageUrl: '/images/flex-trainer.jpg',
    description: 'Stable training shoe for gym workouts and short runs.',
    availableSizes: [38, 39, 40, 41, 42, 43],
    stockBySize: new Map([['38', 4], ['39', 5], ['40', 0], ['41', 6], ['42', 4], ['43', 2]]),
    fit: { type: 'wide-fit', label: 'Wide fit', advice: 'Good choice if you prefer extra room around the forefoot.' },
    fitFeedback: new Map([
      ['38', { tooSmall: 0, trueToSize: 10, tooLarge: 3 }],
      ['39', { tooSmall: 1, trueToSize: 12, tooLarge: 4 }],
      ['40', { tooSmall: 0, trueToSize: 9, tooLarge: 3 }],
      ['41', { tooSmall: 1, trueToSize: 11, tooLarge: 2 }],
      ['42', { tooSmall: 0, trueToSize: 8, tooLarge: 3 }],
      ['43', { tooSmall: 0, trueToSize: 6, tooLarge: 2 }],
    ]),
    sizeGuide: [
      { eu: 38, uk: 5.5, us: 6.5, footLengthCm: 24 },
      { eu: 39, uk: 6, us: 7, footLengthCm: 24.5 },
      { eu: 40, uk: 6.5, us: 7.5, footLengthCm: 25 },
      { eu: 41, uk: 7, us: 8, footLengthCm: 25.5 },
      { eu: 42, uk: 8, us: 9, footLengthCm: 26.5 },
      { eu: 43, uk: 9, us: 10, footLengthCm: 27.5 },
    ],
  },
  {
    name: 'Daily Walk',
    brand: 'New Balance',
    category: 'sneakers',
    price: 1199,
    imageUrl: '/images/daily-walk.jpg',
    description: 'Comfortable everyday shoe with soft cushioning.',
    availableSizes: [39, 40, 41, 42, 43, 44, 45],
    stockBySize: new Map([['39', 2], ['40', 4], ['41', 4], ['42', 7], ['43', 5], ['44', 2], ['45', 1]]),
    fit: { type: 'true-to-size', label: 'True to size', advice: 'Choose your usual size for the best fit.' },
    fitFeedback: new Map([
      ['39', { tooSmall: 1, trueToSize: 13, tooLarge: 2 }],
      ['40', { tooSmall: 2, trueToSize: 15, tooLarge: 1 }],
      ['41', { tooSmall: 1, trueToSize: 14, tooLarge: 2 }],
      ['42', { tooSmall: 0, trueToSize: 17, tooLarge: 1 }],
      ['43', { tooSmall: 1, trueToSize: 11, tooLarge: 2 }],
      ['44', { tooSmall: 0, trueToSize: 8, tooLarge: 1 }],
      ['45', { tooSmall: 1, trueToSize: 6, tooLarge: 0 }],
    ]),
    sizeGuide: [
      { eu: 39, uk: 6, us: 7, footLengthCm: 24.5 },
      { eu: 40, uk: 6.5, us: 7.5, footLengthCm: 25 },
      { eu: 41, uk: 7, us: 8, footLengthCm: 25.5 },
      { eu: 42, uk: 8, us: 9, footLengthCm: 26.5 },
      { eu: 43, uk: 9, us: 10, footLengthCm: 27.5 },
      { eu: 44, uk: 9.5, us: 10.5, footLengthCm: 28 },
      { eu: 45, uk: 10.5, us: 11.5, footLengthCm: 29 },
    ],
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI ?? '')
  await Product.deleteMany({})
  await Product.insertMany(products)
  console.log('Seedad 6 produkter')
  await mongoose.disconnect()
}

seed().catch((err: unknown) => {
  console.error('Seed misslyckades:', err)
  process.exit(1)
})
