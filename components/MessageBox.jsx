'use client'

import { parseISO, format } from "date-fns";
import toast from "react-hot-toast";
import { React, useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@lib/pusher";
import EmojiPicker from "emoji-picker-react";

const MessageBox = ({ message,reaction, currentUser, chat }) => {
  const emojis = ['😀', '😂', '😍', '😢', '😡'];
  const [hoveredText, setHoveredText] = useState(false);
  const [showList, setShowList] = useState(false);
  const [reactions , setReactions] = useState(reaction);
  const [clickEmoji , setClickEmoji] = useState(false);
  const [emojiCount,setEmojiCount]=useState({});
  

  const router = useRouter();

  useEffect(()=>{
    let dic={}
    reactions.map((emoji, index) => (
      dic[emoji.reactionMessage] ? dic[emoji.reactionMessage]+=1 : dic[emoji.reactionMessage]=1
    ))
    // console.log(dic);
    
    setEmojiCount(dic);
  },[reactions]);



  useEffect(()=>{
    pusherClient.subscribe(message._id);

    const handleReac = async(data)=>{
      
      if(data.messageId == message._id){
        setReactions((prevRec) => {
          return [...prevRec , data.newReaction];
        });
      }
    }

    pusherClient.bind("new-reaction", handleReac);

    return () => {
      pusherClient.unsubscribe(message._id);
      pusherClient.unbind("new-reaction", handleReac);
    };



  },[message._id]);






  const handleEmojiClick = async (emoji) => {
    
    // console.log(emojiCount);
    setHoveredText(false);
    setClickEmoji(false);
    // console.log(emoji.emoji);
    // console.log(message);
    const dataReaction = {createdBy : currentUser._id , name: currentUser.username , message: message._id , reactionMessage: emoji.emoji , chatId: chat._id};
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
      }

      if (resDataRec.error) {
        toast.error("Something went wrong");
      }
    }catch(err){
      console.log(err);
    }
  };

  const handlePP = () => {
    console.log("Chl rha h");
    setShowList(true);
  }

  const handleMouseLeave=()=>{
    setHoveredText(false);
    setClickEmoji(false);
  }

  return message?.sender?._id !== currentUser._id ? (
    <div className="message-box">
      <img src={message?.sender?.profileImage || "/assets/person.jpg"} alt="profile photo" className="message-profilePhoto" />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160; {format(new Date(parseISO(message?.createdAt)), "p")}
        </p>

        {message?.text ? (
          <div>
            <div className="message-message" onMouseEnter={() => setHoveredText(true)} onMouseLeave={() => handleMouseLeave()}>
              {hoveredText && showList == false ? (
                  <div >
                  {clickEmoji ?  <EmojiPicker onEmojiClick={handleEmojiClick}></EmojiPicker> : 
                        <div>
                          <span className="message-text">{message?.text}</span>
                          <span className='emoji' onClick={()=> setClickEmoji(true)} >☻</span>
                        </div>
                  }
                </div>
                ) :
                  (
                    <div>
                      <p className="message-text">{message?.text}</p>
                    </div>
                  )}
            </div>
              {reactions.length > 0 && hoveredText == false && showList == false ? (
                <div className='lowemoji'  onClick={() => handlePP()} >
                  {Object.entries(emojiCount).map(entry => (
                      <span >{entry[0]} {entry[1]}</span>
                  ))}
                </div>
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
          <div>

            <div className="message-message"  onMouseEnter={() => setHoveredText(true)} onMouseLeave={() => handleMouseLeave()}>
              {hoveredText && showList == false ? (
                <div >
                    {clickEmoji ?  <EmojiPicker onEmojiClick={handleEmojiClick}></EmojiPicker> : 
                          <div>
                            <span className='emoji' onClick={()=> setClickEmoji(true)} >☻</span>
                            <span className="message-text-sender">{message?.text}</span>
                          </div>
                    }
                </div>
              ) :
                (
                  <div>
                    <p className="message-text-sender">{message?.text}</p>
                  </div>
                )}
            </div >
            <div>
              {reactions.length > 0 && hoveredText == false  && showList == false ? (
                <div className='lowemoji' onClick={() => handlePP()} >
                  {Object.entries(emojiCount).map(entry => (
                      <span >{entry[0]} {entry[1]}</span>
                  ))}
                </div>
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