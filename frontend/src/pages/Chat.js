import React, { useEffect, useState } from 'react'
import { Card, Container, Row, Col } from 'react-bootstrap'
import { ChatState } from '../context/ChatProvider'
import SideSearchBar from '../components/SideSearchBar'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

function Chat() {

  const { user } = ChatState()

  return (
    <div style={{ width: "100%" }}>
      {user && <SideSearchBar />}
      <Container style={{ maxWidth: "100%", marginTop: "3%" }}>
        <div style={{ display: "flex" }}>
          <div style={{ width:"30%" }}>
            {user && <MyChats />}
          </div>
          <div style={{ width: "70%" }}>
            {user && <ChatBox />}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Chat