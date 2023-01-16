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
      <Container>
        <Row>
          <Col>
            {user && <MyChats />}
          </Col>
          <Col>
            {user && <ChatBox />}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Chat