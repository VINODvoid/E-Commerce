import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Import the cors middleware
import fetch from 'node-fetch';  // If not available, install using `npm install node-fetch`
import authRoutes from './routes/authRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import pool from './db/index.js'; // Import your database connection

dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
}));

app.use(express.json());

// Function to create tables and establish relationships
const createTables = async () => {
    const client = await pool.connect();
    try {
        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) CHECK (role IN ('buyer', 'seller')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create products table
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                category VARCHAR(50) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                discount DECIMAL(5, 2),
                seller_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create cart table
        await client.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                quantity INTEGER NOT NULL CHECK (quantity > 0),
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Tables created or already exist.');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        client.release();
    }
};

// Call the function to ensure the tables are created
createTables();

app.get('/api/products', async (req, res) => {
    const client = await pool.connect();
    try {
        // Fetch all products from the 'products' table
        const result = await client.query('SELECT * FROM products');
        res.status(200).json(result.rows);  // Send the products as a JSON response
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    } finally {
        client.release();
    }
});
// Route to fetch products from FakeStore API and store them in the database
app.post('/api/store-products', async (req, res) => {
    const client = await pool.connect();
    try {
        // Fetch products from FakeStore API
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();

        // Insert products into the products table
        for (const product of products) {
            const { title, price, description, category } = product;
            await client.query(`
                INSERT INTO products (name, category, description, price)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT DO NOTHING
            `, [title, category, description, price]);
        }

        res.status(200).json({ message: 'Products saved successfully!' });
    } catch (error) {
        console.error('Error storing products:', error);
        res.status(500).json({ message: 'Error storing products' });
    } finally {
        client.release();
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/buyer', buyerRoutes);

const PORT = process.env.PORT || 8000; // Ensure this matches your backend port

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
