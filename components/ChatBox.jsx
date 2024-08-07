import { format } from "date-fns";
import { useRouter } from "next/navigation";

const ChatBox = ({ chat, currentUser, currentChatId }) => {
  const otherMembers = chat?.members?.filter(
    (member) => member._id !== currentUser._id
  );

  const lastMessage =
    chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];

  const seen = lastMessage?.seenBy?.find(
    (member) => member._id === currentUser._id
  );

  const router = useRouter();

  return (
    <div
      className={`chat-box ${chat._id === currentChatId ? "bg-slate-700" : ""}`}
      onClick={() => router.push(`/chats/${chat._id}`)}
    >
      <div className="chat-info">
        {chat ? (
          <img
            src={chat?.groupPhoto || "/assets/group.png"}
            alt="group-photo"
            className="profilePhoto"
          />
        ) : (
          <img
            src={otherMembers[0].profileImage || "/assets/person.jpg"}
            alt="profile-photo"
            className="profilePhoto"
          />
        )}

        <div className="flex flex-col gap-1">
          {chat ? (
            <p className="text-base-bold">{chat?.name}</p>
          ) : (
            <p className="text-base-bold">{otherMembers[0]?.username}</p>
          )}

          {!lastMessage && <p className="text-small-bold text-slate-500">Started a chat</p>}

          {lastMessage?.photo ? (
            lastMessage?.sender?._id === currentUser._id ? (
              <p className="text-small-medium text-white">You sent a photo</p>
            ) : (
              <p
                className={`${seen ? "text-small-medium text-white" : "text-small-bold text-slate-500"
                  }`}
              >
                Received a photo
              </p>
            )
          ) : (
            <p
              className={`last-message ${seen ? "text-small-medium text-slate-500" : "text-small-bold text-black"
                }`}
            >
              {lastMessage?.text}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-base-light text-white">
          {!lastMessage
            ? format(new Date(chat?.createdAt), "p")
            : format(new Date(chat?.lastMessageAt), "p")}
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
