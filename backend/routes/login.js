import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';



const router = express.Router();
const SECRET = process.env.SECRET;

router.post('/', async (req, res) => {
console.log(req.body);
const { userName, password } = req.body;
console.log(userName)
try {
    const user = await User.findOne({ userName })
    console.log(user);
    const passwordCorrect = user === null  ? false : await bcrypt.compare(password, user.passwordHash)
    console.log(passwordCorrect);

    
if (!(user && passwordCorrect)) {
return res.status(401).json({
    error: 'invalid username or password'
})
  }

        const token = jwt.sign({ name: user.name, userName: user.userName }, SECRET, { expiresIn: '1h' });
        res.json({ token, name: user.name, email: user.email });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Error occured while trying to log in' });
    }
});

export default router; 