import React, { useState } from 'react'
import { Container, Row, Col, Image, Modal, Button, Form, InputGroup, } from 'react-bootstrap';
import { ChatState } from '../context/ChatProvider'
import arrowBack from "../assets/images/back.png"
import { getSender, getSenderFull } from "../config/ChatLogics.js"
import ProfileModal from './Modals/ProfileModal';
import viewIcon from "../assets/images/view.png"
import UserBadgeItem from './UserAvatar/UserBadgeItem';
import UserListItem from './UserAvatar/UserListItem';

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  // MODAL USESTATES
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user.id) {
      return alert("Only an admin can remove users from the group")
    }

    try {
      setLoading(true)
      const data = { chatId: selectedChat._id, userId: user1._id };
      await fetch('/api/chat/groupremove', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
          setFetchAgain(!fetchAgain);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
          return alert("An error occured, please try again later.")
        });
    } catch (error) {
      setLoading(false);
      return alert("Error adding user to group");
    }
  }  

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      return alert("User is already in the group!")
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      return alert("Only an admin can add users to the group")
    }

    try {
      setLoading(true)
      const data = { chatId: selectedChat._id, userId: user1._id };
      await fetch('/api/chat/groupadd', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
          return alert("An error occured, please try again later.")
        });
    } catch (error) {
      setLoading(false);
      return alert("Error adding user to group");
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return

    try {
      setRenameLoading(true);
      const data = { chatId: selectedChat._id, chatName: groupChatName };
      await fetch('/api/chat/rename', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setRenameLoading(false);
          setGroupChatName("")
          return alert("An error occured, please try again later.")
        });
    } catch (error) {
      setRenameLoading(false);
      setGroupChatName("")
      return alert("Error renaming group");
    }
  }

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true)
      const data = await fetch(`/api/user?search=${search}`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      }).then(data => {
        return data.json();
      });
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      return alert("Failed to load search results!");
    }
  }

  

  return (
    <>
      {
        selectedChat ? (
          <div>
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
                  <div style={{ fontFamily: "kalam", fontWeight: "bold", fontSize: "110%" }}>
                    {getSender(user, selectedChat.users).toUpperCase()}
                  </div>
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                  <>
                    <div style={{fontFamily:"kalam", fontWeight:"bold", fontSize:"110%"}}>
                      {selectedChat.chatName.toUpperCase()}
                    </div>
                  <img style={{ cursor: "pointer" }} src={viewIcon} alt="view-icon" onClick={handleShow}></img>
                  <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    style={{ textAlign: "center" }}
                    show={show}
                    onHide={handleClose}
                  >
                    <Modal.Header closeButton style={{ border: "none" }}>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3%" }}>
                        {selectedChat.users.map((u) => (
                          <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                        ))}
                      </div>

                        <Form preventDefault style={{ display: "flex", flexDirection: "column", width: "60%", margin: "0 auto", paddingBottom: "10%" }}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <InputGroup>
                              <Form.Control type="text" placeholder="Chat name" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                              <Button variant="success" onClick={handleRename}>Update</Button>
                          </InputGroup>
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control type="search" placeholder="Add user to group" onChange={(e) => handleSearch(e.target.value)} />
                          </Form.Group>

                          {loading ? <div>Loading...</div> : (
                            searchResult?.map((user) => (
                              <div style={{ width: "80%", margin: "0 auto" }}>
                                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                              </div>
                            ))
                          )}

                          <Button variant="danger" onClick={() => handleRemove(user)}>Leave group</Button>
                      </Form>
                    </Modal.Body>
                  </Modal>
                </>
              )}
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "3%",
              background: "#E8E8E8",
              width: "100%",
              height: "100%",
              minHeight: "70vh",
              borderRadius: "5px",
              overflow: "hidden",
              marginTop: "2%"
            }}>
              {/* Messages here */}
            </div>
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


    </>
  )
}

export default SingleChat