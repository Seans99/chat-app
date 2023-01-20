import React from 'react'
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { ChatState } from '../context/ChatProvider'
import arrowBack from "../assets/images/back.png"
import { getSender, getSenderFull } from "../config/ChatLogics.js"
import ProfileModal from './Modals/ProfileModal';

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();

  return (
    <>
      {
        selectedChat ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Image
              src={arrowBack}
              alt="back-arrow-img"
              width={25}
              height={20}
              onClick={() => setSelectedChat("")}
              style={{ cursor: "pointer" }}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users).toUpperCase()}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <div>
                {selectedChat.chatName.toUpperCase()}
                {/* <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> */}
              </div>
            )}
          </div>

        ) : (
          <Container>
            <Row>
              <Col>
                <h1 style={{ fontFamily: "kalam", paddingTop: "50%", textAlign: "center" }}>Click on a user to start chatting</h1>
              </Col>
            </Row>
          </Container>
        )
      }

      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "3%",
        background: "#E8E8E8",
        width: "100%",
        height: "100%",
        minHeight:"70vh",
        borderRadius: "5px",
        overflow: "hidden",
        marginTop:"2%"
      }}>
        {/* Messages here */}
      </div>
    </>
  )
}

export default SingleChat