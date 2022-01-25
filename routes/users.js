import express from 'express'
import { register, login, getUsers } from '../controllers/users.js'
import auth from '../middleware/auth.js'

const router = express.Router()
router.post('/', register)
router.post('/login', login)
router.get('/', auth, getUsers)

export default router


