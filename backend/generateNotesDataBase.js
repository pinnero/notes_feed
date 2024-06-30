import mongoose from "mongoose";

const url = "mongodb+srv://orpinner32:JX1nKKWMyFq1mLg2@hw2.hu3jcjt.mongodb.net/notesApp?retryWrites=true&w=majority&appName=hw2";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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

const postsGenerator = (postsNum) => {
    const posts = [];
    for (let i = 1; i <= postsNum; i++) {
        posts.push({
            id: i,
            title: `Note ${i}`,
            author: {
                name: `Author ${i}`,
                email: `mail_${i}@gmail.com`
            },
            content: `Content for note ${i}`
        });
    }
    return posts;
};

const postsNum = 87; 
const data = postsGenerator(postsNum);

async function clearNotes() {
    try {
        await Note.deleteMany({});
        console.log("All notes deleted");
    } catch (error) {
        console.error('Error deleting notes:', error);
    }
}

async function saveNotes() {
    for (let note of data) {
        try {
            const newNote = new Note({
                id: note.id,
                title: note.title,
                author: {
                    name: note.author.name,
                    email: note.author.email,
                },
                content: note.content,
            });
            const result = await newNote.save();
        } catch (error) {
            console.error('Error saving note:', error);
        }
    }
    console.log("all notes saved");

    mongoose.connection.close();
}


await clearNotes(); 
await saveNotes(); 

