import jwt from 'jsonwebtoken'
import users from '../models/users.js'

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || ''
    if (token.length > 0) {
      const decoded = jwt.verify(token, process.env.SECRET)
      req.user = await users.findOne({ _id: decoded._id, token })
      req.token = token
      if (!req.user) {
        throw new Error()
      } else {
        next()
      }
    } else {
      throw new Error()
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}