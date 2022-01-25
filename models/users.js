import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  account: {
    type: String
  },
  password: {
    type: String
  },
  tokens: {
    type: [String]
  }
})

export default mongoose.model('users', schema)
