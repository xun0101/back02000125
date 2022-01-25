import express from 'express'
import auth from '../middleware/auth.js'
import { getChat, newMessage } from '../controllers/chats.js'

const router = express.Router()
router.get('/members/:id', auth, getChat)
router.post('/members/:id/messages', auth, newMessage)

export default router
