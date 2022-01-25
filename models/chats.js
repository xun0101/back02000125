import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  members: {
    type: [mongoose.ObjectId],
    ref: 'users',
    required: true
  },
  messages: {
    type: [
      {
        sender: {
          type: mongoose.ObjectId,
          ref: 'users',
          required: true
        },
        text: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          default: Date.now
        }
      }
    ]
  }
})

export default mongoose.model('chats', schema)
