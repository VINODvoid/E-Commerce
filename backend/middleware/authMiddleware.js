import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT tokens
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token from 'Bearer <token>'

    if (token == null) return res.status(401).json({ error: 'No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });

        req.user = user; // Attach the user info to the request object
        next();
    });
};
