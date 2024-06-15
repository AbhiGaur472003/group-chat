import Message from "@models/Message"
import Chat from "@models/Chat"
import User from "@models/User"
import Reaction from "@models/Reaction"
import { connectToDB } from "@mongodb"

export const GET = async (req, {params}) => {
  try {
    await connectToDB();
    
    
    const { messageId } = params;

    const allUsers = await Message.findById(messageId)
    .populate({
      path: "chat",
      model: Chat,
    })
    .populate({
      path: "sender",
      model: User,
    })
    .populate({
      path: "reactions",
      model: Reaction,
    })
    .populate({
      path: "seenBy",
      model: User,
    })
    .exec();

    return new Response(JSON.stringify(allUsers), { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response("Failed to get all users", { status: 500 })
  }
}