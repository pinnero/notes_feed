import express from 'express';
import Note from '../models/note.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const NOTES_PER_PAGE = 10;
const SECRET = process.env.SECRET;

const verifyToken = (req, author) => {
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) {
        throw new Error('No token provided');
    }

    const token =tokenHeader.split(' ')[1]; // extract the token itself (remove the bearer word)
    try {
        const userDataFromToken = jwt.verify(token, SECRET); 
        if( author.name !== userDataFromToken.name){
            throw new Error('operations on the note permited only for its Author!');
        }
    
        return userDataFromToken;
    } catch (error) {
        console.log(error.message)
        throw new Error('Invalid token');
    }
};

router.get('/', async (req, res) => {
    const start_index = parseInt(req.query._start) || 0;
    const limit = NOTES_PER_PAGE;
    try {
        const notes = await Note.find().skip(start_index).limit(limit);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notes' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const index = parseInt(req.params.id, 10) - 1;
        const note = await Note.find().skip(index).limit(1);
        if (note.length === 0 || !note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching note' });
    }
});

router.post('/', async (req, res) => {
    try {
        
        const note = new Note({
            id: req.body.id,
            title: req.body.title,
            author: req.body.author,
            content: req.body.content
        });

        verifyToken(req, note.author);

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        if (error.message === 'No token provided') {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
        } else if (error.message === 'Invalid token') {
            res.status(403).json({ error: 'Forbidden: Invalid token' });
        } 
        else if(error.message === 'operations on note permited only for its Author!'){
            res.status(403).json({ error: 'Forbidden: user dont have the permissions to add note with different name' });
        }
        else {
            console.log(error.message)
            res.status(500).json({ error: 'Error saving note' });
        }
    }
});

router.put('/:id', async (req, res) => {
    try {
        const noteData = {
            id: req.body.id,
            title: req.body.title,
            author: req.body.author,
            content: req.body.content
        };

        const index = parseInt(req.params.id, 10) - 1;
        const notes = await Note.find().skip(index).limit(1);
        if (notes.length === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }
        const note = notes[0];
        verifyToken(req, note.author);
        const updatedNote = await Note.findOneAndUpdate({ id: note.id }, noteData, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: 'coulnt not update note in the DB' });
        }
        res.json(updatedNote);
    } catch (error) {
        if (error.message === 'No token provided') {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
        } else if (error.message === 'Invalid token') {
            res.status(403).json({ error: 'Forbidden: Invalid token' });
        }else if(error.message === 'operations on note permited only for its Author!'){
                res.status(403).json({ error: 'Forbidden: user dont have the permissions to edit note of different user' });
            }
         else {
            res.status(500).json({ error: 'Error updating note' });
        }
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const index = parseInt(req.params.id, 10) - 1;
        const notes = await Note.find().skip(index).limit(1);
        if (notes.length === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }
        const note = notes[0];
        verifyToken(req, note.author);
        const result = await Note.deleteMany({ id: note.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Error in deleting the note in the data base' });
        }
        res.status(204).send();
    } catch (error) {
        if (error.message === 'No token provided') {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
        } else if (error.message === 'Invalid token') {
            res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        else if(error.message === 'operations on note permited only for its Author!'){
            res.status(403).json({ error: 'Forbidden: user dont have the permissions to edit note of different user' });
        }
        else {
            res.status(500).json({ error: 'Error deleting note' });
        }
    }
});

export default router; 

