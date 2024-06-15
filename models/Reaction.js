import mongoose from "mongoose"

const ReactionSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  name: {
    type: String,
    default: "",
  },
  message: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message',
  },
  reactionMessage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})

const Chat = mongoose.models.Reaction || mongoose.model('Reaction', ReactionSchema)

export default Chat