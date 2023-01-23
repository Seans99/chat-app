import React from 'react'
import { Container, Card } from "react-bootstrap"
import { ChatState } from '../context/ChatProvider'
import SingleChat from './SingleChat';

function ChatBox({fetchAgain, setFetchAgain}) {

  const { selectedChat } = ChatState();

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