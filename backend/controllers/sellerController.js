import pool from '../db/index.js';

// Add product
export const addProduct = async (req, res) => {
    const { name, category, description, price, discount } = req.body;
    const sellerId = req.user.id; // Assuming you're using middleware to get the user ID

    if (!name || !category || !price) {
        return res.status(400).json({ error: 'Name, category, and price are required.' });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO products (name, category, description, price, discount, seller_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, category, description, price, discount, sellerId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
};

// Edit product
export const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, discount } = req.body;

    const client = await pool.connect();
    try {
        const result = await client.query(
            `UPDATE products 
             SET name = COALESCE($1, name), 
                 category = COALESCE($2, category), 
                 description = COALESCE($3, description), 
                 price = COALESCE($4, price), 
                 discount = COALESCE($5, discount) 
             WHERE id = $6 AND seller_id = $7 
             RETURNING *`,
            [name, category, description, price, discount, id, req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found or you are not authorized to edit it.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error editing product:', err);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
        const result = await client.query(
            'DELETE FROM products WHERE id = $1 AND seller_id = $2 RETURNING *',
            [id, req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found or you are not authorized to delete it.' });
        }
        res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
};
