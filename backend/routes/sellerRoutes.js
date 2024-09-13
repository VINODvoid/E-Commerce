import express from 'express';
import { addProduct, editProduct, deleteProduct } from '../controllers/sellerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; // Middleware for authentication

const router = express.Router();

router.post('/product', authenticateToken, addProduct);
router.put('/product/:id', authenticateToken, editProduct);
router.delete('/product/:id', authenticateToken, deleteProduct);

export default router;
