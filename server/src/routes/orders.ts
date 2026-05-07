import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { createOrder, getMyOrders } from '../controllers/orderController'

const router = Router()

router.post('/', requireAuth, createOrder)
router.get('/me', requireAuth, getMyOrders)

export default router
