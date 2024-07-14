import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import 'dotenv/config';
import notesRouter from './routes/notes.js';
import usersRouter from './routes/users.js';
import loginRouter from './routes/login.js';


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

app.use('/notes', notesRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);



