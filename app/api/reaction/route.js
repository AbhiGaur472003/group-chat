import Reaction from "@models/Reaction";
import Message from "@models/Message";
import Chat from "@models/Chat";
import User from "@models/User";
import { connectToDB } from "@mongodb";
import { pusherServer } from "@lib/pusher";


export const POST = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { createdBy , message, reactionMessage , name , chatId } = body;

    const messageId=message;

    const alreadyReacted = await Reaction.findOne({ createdBy , message });

    if (alreadyReacted) {
      return new Response("Reaction already exists", {
        status: 400,
      });
    }

    const newReaction = await Reaction.create({
      createdBy,
      name,
      message,
      reactionMessage,
    });

    await newReaction.save();

    await Message.findByIdAndUpdate(messageId, {
      $push: { reactions: newReaction._id },
    },{ new: true });

    const chat = await Chat.findById(chatId)
    .populate({
      path: "messages",
      model: Message,
      populate: { path: "sender seenBy", model: "User" },
      populate: {path: "reactions" , model: Reaction},
    })
    .populate({
      path: "members",
      model: User,
    })
    .exec();

    try{
      await pusherServer.trigger(`chat-${chatId}`, 'new-reaction', {
        messageId,
        emoji,
        createdBy,
      });
    }catch(err){
      console.log("Galt aara hn");
    }



    return new Response(JSON.stringify(newReaction), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new reaction", {
      status: 500,
    });
  }
};
