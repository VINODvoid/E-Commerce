import express from 'express';
import { searchProducts, addToCart, removeFromCart } from '../controllers/buyerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; // Middleware for authentication

const router = express.Router();

router.get('/products', searchProducts);
router.post('/cart', authenticateToken, addToCart);
router.delete('/cart/:id', authenticateToken, removeFromCart);

export default router;
