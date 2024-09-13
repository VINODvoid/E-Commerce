import pool from '../db/index.js';

// Search products
export const searchProducts = async (req, res) => {
    const { name, category } = req.query;

    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT * FROM products 
             WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%') 
               AND ($2::text IS NULL OR category ILIKE '%' || $2 || '%')`,
            [name, category]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error searching products:', err);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
};

// Add to cart
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Assuming you're using middleware to get the user ID

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'Product ID and quantity are required.' });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [userId, productId, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assuming you're using middleware to get the user ID

    const client = await pool.connect();
    try {
        const result = await client.query(
            'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Cart item not found or you are not authorized to delete it.' });
        }
        res.json({ message: 'Item removed from cart successfully.' });
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
};
