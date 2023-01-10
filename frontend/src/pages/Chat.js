import React, { useEffect, useState } from 'react'

function Chat() {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const data = await (await fetch("/api/chat")).json();
    setChats(data);
  }

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>{chats.map(chat =>
      <div key={chat._id}>
        {chat.chatName}
      </div>
    )}</div>
  )
}

export default Chat