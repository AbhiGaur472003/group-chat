import { format } from "date-fns";
import toast from "react-hot-toast";
import { React, useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@lib/pusher";

const MessageBox = ({ message, currentUser, chat }) => {
  const emojis = ['😀', '😂', '😍', '😢', '😡'];
  const [hoveredText, setHoveredText] = useState(false);
  const [showList, setShowList] = useState(false);
  const [reactions , setReactions] = useState([]);
  const [mssg , setMssg]=useState();
  

  const router = useRouter();

  const getMssg = async()=>{
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setMssg(data);
      setReactions(data.reactions);
      // console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  };

  const Call =async(channel)=>{
    await channel.bind('new-reaction', function(data) {
      setMssg(prevMessages =>
        prevMessages.map(msg =>
          msg._id === data.messageId ? { ...msg, reactions: [...msg.reactions, data.emoji] } : msg
        )
      );
    });
  }


  useEffect(() => {
    if(message)getMssg();
  }, [message , mssg]);

  useEffect(()=>{
    const channel = pusherClient.subscribe(`chat-${chat._id}`);

    Call(channel);

    return () => {
      channel.unsubscribe(`chat-${chat._id}`);
      channel.unbind_all();
    };
  },[chat._id]);


  const handleEmojiClick = async (emoji) => {
    
    // console.log(msgData);
    setHoveredText(false);
    // console.log(message);
    const dataReaction = {createdBy : currentUser._id , name: currentUser.username , message: message._id , reactionMessage: emoji , chatId: chat._id};
    // console.log(dataReaction);

    try{

      const resRec = await fetch(`/api/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataReaction),
      });

      const resDataRec= await resRec.json();

      if (resRec.ok) {
        console.log("Huo");
        setRefresh(true);
      }

      if (resDataRec.error) {
        toast.error("Something went wrong");
      }
    }catch(err){
      console.log(err);
    }
  };

  const handleMouseOver = () => {

  };

  const handlePP = () => {
    console.log("Chl rha h");
    setShowList(true);
  }

  return message?.sender?._id !== currentUser._id ? (
    <div className="message-box">
      <img src={message?.sender?.profileImage || "/assets/person.jpg"} alt="profile photo" className="message-profilePhoto" />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160; {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <div>
            <p className="message-text" onMouseEnter={() => setHoveredText(true)} onMouseLeave={() => setHoveredText(false)}>
              {hoveredText && showList == false ? (
                  <div >
                    {emojis.map((emoji, index) => (
                      <span className='emoji' key={index} onClick={() => handleEmojiClick(emoji)} >
                        {emoji}
                      </span>
                    ))}
                  </div>
                ) :
                  (
                    <div>
                      <p>{message?.text}</p>
                    </div>
                  )}
            </p>
              {reactions.length > 0 && hoveredText == false && showList == false ? (
                <span className='lowemoji'  onClick={() => handlePP()} >
                  😀
                </span>
              ) : (
                <></>
              )}
              {showList? (
              <div className="back" onClick={() => setShowList(false)}>
                {reactions.map((emoji, index) => (
                    <div key={index}>
                      {emoji.name} {emoji.reactionMessage}
                    </div>
                  ))}
              </div>
            ) : <></>}
          </div>
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
      </div>
    </div>
  ) : (
    <div className="message-box justify-end">
      <div className="message-info items-end">
        <p className="text-small-bold">
          {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <div className="message-text-sender">

            <div onMouseEnter={() => setHoveredText(true)} onMouseLeave={() => setHoveredText(false)}>
              {hoveredText && showList == false ? (
                <div >
                  {emojis.map((emoji, index) => (
                    <span className='emoji' key={index} onClick={() => handleEmojiClick(emoji)} >
                      {emoji}
                    </span>
                  ))}
                </div>
              ) :
                (
                  <div>
                    <p>{message?.text}</p>
                  </div>
                )}
            </div >
            <div>
              {reactions.length > 0 && hoveredText == false && showList == false ? (
                <span className='lowemoji'  onClick={() => handlePP()} >
                  😀
                </span>
              ) : (
                <></>
              )}
            </div>
            {showList? (
              <div className="back" onClick={() => setShowList(false)}>
                {reactions.map((emoji, index) => (
                    <div key={index}>
                      {emoji.name} {emoji.reactionMessage}
                    </div>
                  ))}
              </div>
            ) : <></>}
          </div>
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
      </div>
    </div>
  )
}

export default MessageBox