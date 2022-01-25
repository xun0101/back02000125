import chats from '../models/chats.js'
import mongoose from 'mongoose'

export const newMessage = async (req, res) => {
  try {
    let result = await chats.findOneAndUpdate({
      members: {
        $all: [req.user._id.toString(), req.params.id]
      }
      // $and: [
      //   { members: { $elemMatch: { $eq: req.user._id.toString() } } },
      //   { members: { $elemMatch: { $eq: req.params.id } }}
      // ]
    }, {
      $push: {
        messages: {
          sender: req.user._id,
          text: req.body.text
        }
      }
    }, { new: true, runValidators: true })
    if (!result) {
      result = await chats.create({
        members: [req.user._id.toString(), req.params.id],
        messages: [
          { sender: req.user._id, text: req.body.text }
        ]
      })
    }
    res.status(200).send({ success: true, message: '', result: result.messages.pop() })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getChat = async (req, res) => {
  try {
    if (req.query.gt) {
      const result = await chats.aggregate([
        {
          '$match': {
            'members': {
              '$all': [req.user._id, mongoose.Types.ObjectId(req.params.id)]
            }
          }
        }, {
          '$unwind': {
            'path': '$messages'
          }
        }, {
          '$match': {
            'messages.date': {
              '$gt': new Date(req.query.gt)
            }
          }
        }, {
          '$group': {
            '_id': '$_id', 
            'messages': {
              '$push': '$messages'
            }
          }
        }
      ])
      res.status(200).send({ success: true, message: '', result: result[0]?.messages || [] })
    } else if (req.query.lt) {
      const result = await chats.aggregate([
        {
          '$match': {
            'members': {
              '$all': [req.user._id, mongoose.Types.ObjectId(req.params.id)]
            }
          }
        }, {
          '$unwind': {
            'path': '$messages'
          }
        }, {
          '$match': {
            'messages.date': {
              '$lt': new Date(req.query.lt)
            }
          }
        }, {
          '$sort': {
            'messages.date': -1
          }
        }, {
          '$limit': 20
        }, {
          '$group': {
            '_id': '$_id', 
            'messages': {
              '$push': '$messages'
            }
          }
        }
      ])
      res.status(200).send({ success: true, message: '', result: result[0]?.messages || [] })
    } else {
      const result = await chats.findOne({
        members: {
          $all: [req.user._id.toString(), req.params.id]
        }
      }, { messages: { $slice: -20 }})
      res.status(200).send({ success: true, message: '', result: result?.messages || [] })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
