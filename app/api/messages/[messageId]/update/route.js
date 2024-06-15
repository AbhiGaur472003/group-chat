import Message from "@models/Message";
import Chat from "@models/Chat";
import Reaction from "@models/Reaction"
import { connectToDB } from "@mongodb";
import { pusherServer } from "@lib/pusher";


export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const { messageId } = params;

    const body = await req.json();

    const { reaction , chat } = body;

    // console.log(reaction);
    const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
      {
        $push: { reactions: reaction },
      },
      { new: true }
    )
    .populate({
      path: "reactions",
      model: "Reaction",
    })
    .exec();


    return new Response(JSON.stringify(updatedMessage), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update user", { status: 500 })
  }
};
