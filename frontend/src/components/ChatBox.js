import React from 'react'
import { Container, Card } from "react-bootstrap"
import { ChatState } from '../context/ChatProvider'
import SingleChat from './SingleChat';

function ChatBox({fetchAgain, setFetchAgain}) {

  const { selectedChat } = ChatState();

  return (
    <Container>
      <Card style={{ display: "flex", flexDirection: "column", alignItems:"center", padding: "3%", border: "1px solid darkgreen" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </Card>
    </Container>
  )
}

export default ChatBox