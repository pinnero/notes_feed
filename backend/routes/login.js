import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = process.env.SECRET;

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username});

        const found = user; 
        if (!found) {
            return res.status(401).json({ error: 'incorrect username or password' });
        }

        const token = jwt.sign({ name: user.name, username: user.username }, SECRET, { expiresIn: '1h' });
        res.json({ token, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Error occured while trying to log in' });
    }
});