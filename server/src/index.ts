import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import productRoutes from './routes/products'
import authRoutes from './routes/auth'
import orderRoutes from './routes/orders'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000
const MONGODB_URI = process.env.MONGODB_URI ?? ''

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Ansluten till MongoDB')
    app.listen(PORT, () => {
      console.log(`Server körs på port ${PORT}`)
    })
  })
  .catch((err: unknown) => {
    console.error('MongoDB-anslutning misslyckades:', err)
    process.exit(1)
  })
