import ChatList from "@components/ChatList"

const Chats = () => {
  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
        <ChatList />
      </div>
    </div>
  )
}

export default Chats