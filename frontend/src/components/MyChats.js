import React, { useState, useEffect } from 'react'
import { Button, Card, Container, Modal, Form } from 'react-bootstrap';
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import "./MyChats.css"
import UserListItem from './UserAvatar/UserListItem';
import UserBadgeItem from './UserAvatar/UserBadgeItem';

function MyChats({fetchAgain}) {
  const [loggedUser, setLoggedUser] = useState();

  // MODAL USESTATES
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false)

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const data = await fetch(`/api/chat`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`
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
  }, [fetchAgain])

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
          Authorization: `Bearer ${user.token}`
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupChatName || !selectedUsers) {
      alert("Please fill in all the fields!")
    }
    
    try {
      const data = { name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)) };
      await fetch('/api/chat/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          setChats([data, ...chats])
          setSelectedUsers([])
          setGroupChatName()
          setSearch("")
          setSearchResult([])
          handleClose();
        })
        .catch((error) => {
          console.error('Error:', error);
          return alert("An error occured, please try again later.")
        });
    } catch (error) {
      return alert("Error creating group");
    }
  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return alert("User has already been added!")
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id))
  }

  return (
    <Container>
      <Card style={{ display: "flex", flexDirection: "column", padding: "3%", border: "1px solid darkgreen" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Card.Header style={{ background: "white", border: "none", fontSize: "150%", fontFamily: "Kalam", fontWeight: "bold" }}>My Chats</Card.Header>


          <Button variant="success" onClick={handleShow}>
            New group chat +
          </Button>

          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={handleClose}
          >
            <Modal.Header closeButton style={{ border: "none" }}>
            </Modal.Header>
            <Modal.Body>
              <h1 style={{ fontSize: "200%", fontFamily: "kalam", margin: "0 auto", marginBottom: "1%", textAlign: "center" }}>Create group chat</h1>
              <hr style={{ width: "30%", margin: "0 auto", marginBottom: "5%" }} />
              <Form style={{ display: "flex", flexDirection: "column", width: "60%", margin: "0 auto" }}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control type="text" placeholder="Chat name" onChange={(e) => setGroupChatName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control type="search" placeholder="Add users" onChange={(e) => handleSearch(e.target.value)} />
                </Form.Group>
                <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                  {selectedUsers.map((user) => (
                    <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                  ))}
                </div>

                {loading ? <div>Loading...</div> : (
                  searchResult?.slice(0.4).map((user) => (
                    <div key={user._id} style={{ width: "80%", margin: "0 auto" }}>
                      <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                    </div>
                  ))
                )}
                <Button variant="success" style={{ marginBottom: "10%" }} onClick={handleSubmit}>
                  Create group
                </Button>
              </Form>
            </Modal.Body>
          </Modal>


        </div>
        <Card.Body>
          {chats ? (
            <div>
              {chats.map((chat) => (
                <Container className={selectedChat === chat ? "selected" : "chats"} onClick={() => { setSelectedChat(chat) }} style={{
                  cursor: "pointer",
                  background: "#E8E8E8",
                  marginBottom: "5%",
                  marginTop: "5%",
                  padding: "3%",
                  borderRadius: "10px"
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