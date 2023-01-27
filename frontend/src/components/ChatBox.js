import React, {useState, useEffect} from 'react'
import { Container, Card } from "react-bootstrap"
import SingleChat from './SingleChat';
import { ChatState } from '../context/ChatProvider';

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat, setSelectedChat, chats } = ChatState();
  const [isGroupMember, setIsGroupMember] = useState(true);

  useEffect(() => {
    if (!isGroupMember) {
      setSelectedChat('');
    }
  }, [isGroupMember]);

  useEffect(() => {
    if (selectedChat) {
      setIsGroupMember(false);
      for (let chat of chats) {
        if (chat._id === selectedChat._id) {
          setIsGroupMember(true);
        }
      }
    }
  }, [chats]);
  
  return (
    <Container style={{maxWidth:"1680px"}}>
      <Card style={{
        marginBottom: "5%",
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3%",
        border: "1px solid darkgreen",
        maxHeight:"80vh"
      }}>
        <div style={{ width:"100%" }}>
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </Card>
    </Container>
  )
}

export default ChatBox