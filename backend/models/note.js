import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    id: Number,
    title: String,
    author : {
        name: String,
        email: String
    } | null,
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
});

const Note = mongoose.model('Note', noteSchema);

export default Note;