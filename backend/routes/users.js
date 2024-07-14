import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

const router = express.Router();
const SECRET = process.env.SECRET;

router.post('/', async (req, res) => {
    const { name, email, userName, password } = req.body;
    console.log('Received data:', { name, email, userName, password });
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ userName, name, email, passwordHash });

    try {
        const savedUser = await user.save(); 
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

export default router; 
