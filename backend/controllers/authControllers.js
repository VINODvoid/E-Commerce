import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/index.js'; // Import your database connection

// Sign up user
export const signUpUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!['buyer', 'seller'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be "buyer" or "seller".' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, role]
        );
        const user = result.rows[0];
        res.status(201).json(user);
    } catch (err) {
        console.error('Error signing up user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
};
