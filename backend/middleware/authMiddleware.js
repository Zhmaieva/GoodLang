import jwt from 'jsonwebtoken';
import {SECRET_KEY} from "../core/constants.js";

export function authMiddleware(req, res, next) {
    const token = req.header('Authorization'); // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // Verify token
        req.user = decoded;

        if (!req?.user?.id) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
