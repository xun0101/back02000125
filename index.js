import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import usersRoute from './routes/users.js'
import chatsRoute from './routes/chats.js'

mongoose.connect(process.env.DB_URL)

const app = express()
app.use(cors({
  origin (origin, callback) {
    callback(null, true)
  } 
}))

app.use(express.json())

app.use('/users', usersRoute)
app.use('/chats', chatsRoute)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server Start')
})
