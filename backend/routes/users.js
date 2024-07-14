import express from 'express';
import User from '../models/user.js';

const router = express.Router();
const SECRET = process.env.SECRET;

router.post('/', async (req, res) => {
    const { username, name, email, password } = req.body;
    const user = new User({ username, name, email, password });

    try {
        const savedUser = await user.save(); // TODO : encrypt the password
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

export default router; 
