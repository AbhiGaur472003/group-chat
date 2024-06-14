import { format } from "date-fns"
import InputEmoji from "react-input-emoji"; 
import toast from "react-hot-toast";
import {React , useState} from "react";

let listEmoji=['😀']

const MessageBox = ({ message, currentUser }) => {
  const emojis = ['😀', '😂', '😍', '😢', '😡'];
  const [hoveredText, setHoveredText] = useState(false);
  const [hoveredEmoji, setHoveredEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);


  const handleEmojiClick =  (emoji) => {
    setSelectedEmoji(emoji);
    listEmoji.push(emoji);
    setHoveredText(false);
    console.log(emoji);
  };

  const handleMouseOver=()=>{

  };
  
  return message?.sender?._id !== currentUser._id ? (
    <div className="message-box">
      <img src={message?.sender?.profileImage || "/assets/person.jpg"} alt="profile photo" className="message-profilePhoto" />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160; {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <p className="message-text" hover={handleMouseOver}>{message?.text}</p>
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
            {hoveredText ? (
              <div >
                {emojis.map((emoji, index) => (
                  <span className='emoji' key={index} onClick={() => handleEmojiClick(emoji)} >
                    {emoji}
                  </span>
                ))}
              </div>
            ):
            (
              <div>
                <p>{message?.text}</p>
              </div>
            )}
            </div>
            {hoveredText ? (
              <p></p>
              ):(
                <div onMouseEnter={() => setHoveredEmoji(true)} onMouseLeave={() => setHoveredEmoji(false)}>
                  {hoveredEmoji ? (
                      <div>
                        {listEmoji.map((emoji, index) => (
                        <span className='emoji' key={index}>
                          {emoji}
                        </span>
                      ))}
                      </div>
                    ):(
                      <p>{emojis[0]}</p>
                    )
                  }
                </div>
              )
            }
          </div>
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
      </div>
    </div>
  )
}

export default MessageBox