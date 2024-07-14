
import express from 'express';
import Note from '../models/note.js';

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        console.log("hey");
        const count = await Note.countDocuments();
        res.json({ totalNotes: count });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching total notes count' });
    }
});

export default router; 