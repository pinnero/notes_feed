import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String, 
  username: String,
  passwordHash: String,
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

export default User;