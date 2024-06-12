import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    default: []
  },
  messages: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    default: []
  },
  name: {
    type: String,
    default: ''
  },
  groupPhoto: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
})

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema)

export default Chat