import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import 'dotenv/config';

const MONGODB_URL = process.env.MONGODB_CONNECTION_URL;
const app = express();
const PORT = 3001;


app.use(express.json());
app.use(cors());
//Middleware to log requests 
app.use((req, res, next) => {
    const logData = `${new Date().toISOString()} | ${req.method} | ${req.url} | ${JSON.stringify(req.body)}\n`;
    fs.appendFile('log.txt', logData, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
    next();
});


mongoose.connect(MONGODB_URL)

.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((err) => console.error('Error connecting to MongoDB:', err));

const noteSchema = new mongoose.Schema({
    id: Number,
    title: String,
    author : {
        name: String,
        email: String
    },
    content: String
});

const Note = mongoose.model('Note', noteSchema);

const NOTES_PER_PAGE = 10;

app.get('/notes', async (req, res) => {
    const start_index = parseInt(req.query._start) || 0;
    const limit = NOTES_PER_PAGE;
    try {
        const notes = await Note.find().skip(start_index).limit(limit);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notes' });
    }
});

app.get('/notes/:id', async (req, res) => {
    try {
        const index = parseInt(req.params.index, 10);
        const note = await Note.find().skip(index).limit(1);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching note' });
    }
});

app.post('/notes', async (req, res) => {
    const note = new Note({
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    });
    
    note.save().then(() => {
        res.status(201);
        res.json(note);
    }).catch((error) => res.status(500).json({ error: 'Error fetching note' }))
});

app.put('/notes/:id', async (req, res) => {
    const noteData = {
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    };

    try {
        const index = parseInt(req.params.id, 10);
        const notes = await Note.find().skip(index).limit(1);
        if(notes.length === 0){
            return res.status(404).json({ message: 'Note not found' });
        }
        const note = notes[0];
        const updatedNote = await Note.findOneAndUpdate({ id: note.id }, noteData, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: 'Error updating note' });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        const index = parseInt(req.params.id, 10);
        const notes = await Note.find().skip(index).limit(1);
        if(notes.length === 0){
            return res.status(404).json({ message: 'Note not found' });
        }
        const note = notes[0];
        const result = await Note.deleteMany({ id: note.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting note' });
    }
});

app.get('/notesCount', async (req, res) => {
    try {
        const count = await Note.countDocuments();
        res.json({ totalNotes: count });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching total notes count' });
    }
});

