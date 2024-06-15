import Reaction from "@models/Reaction";
import { connectToDB } from "@mongodb";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { createdBy , message, reactionMessage , name } = body;

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

    return new Response(JSON.stringify(newReaction), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new reaction", {
      status: 500,
    });
  }
};
