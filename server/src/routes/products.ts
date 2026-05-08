import { Router } from 'express'
import { getAllProducts, getProductById, submitFitFeedback } from '../controllers/productController'
import { requireAuth } from '../middleware/requireAuth'

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/:id/feedback', requireAuth, submitFitFeedback)

export default router
