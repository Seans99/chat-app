import React, { useState, useEffect } from 'react'
import { Button, Card, Container } from 'react-bootstrap';
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import "./MyChats.css"

function MyChats() {
  const [loggedUser, setLoggedUser] = useState();

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const data = await fetch(`/api/chat`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      }).then(data => {
        return data.json();
      });
      setChats(data);
      console.log(data);
    } catch (error) {
      return alert("Failed to load the chats!");
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [])



  return (
    <Container>
      <Card style={{ display: "flex", flexDirection: "column", padding: "3%", border: "1px solid darkgreen" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Card.Header style={{ background: "white", border: "none", fontSize: "150%", fontFamily: "Kalam", fontWeight: "bold" }}>My Chats</Card.Header>
          <Button variant="success">
            New group chat +
          </Button>
        </div>
        <Card.Body>
          {chats ? (
            <div>
              {chats.map((chat) => (
                <Container className="chats" onClick={() => { setSelectedChat(chat) }} style={{
                  cursor: "pointer",
                  background: "#E8E8E8",
                  marginBottom: "5%",
                  marginTop: "5%",
                  padding: "3%",
                  borderRadius:"10px"
                }} key={chat._id}>
                  <div>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </div>
                </Container>
              ))}
            </div>
          ) : (
            <ChatLoading />
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default MyChats