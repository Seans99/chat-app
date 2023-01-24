import React, { useEffect, useState } from 'react'
import { Image, Modal, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { ChatState } from '../context/ChatProvider'
import arrowBack from "../assets/images/back.png"
import { getSender, getSenderFull } from "../config/ChatLogics.js"
import ProfileModal from './Modals/ProfileModal';
import viewIcon from "../assets/images/view.png"
import UserBadgeItem from './UserAvatar/UserBadgeItem';
import UserListItem from './UserAvatar/UserListItem';
import ScrollableChat from './ScrollableChat';
import { io } from "socket.io-client"

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("")

  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // MODAL USESTATE
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true)
      const data = await fetch(`/api/message/${selectedChat._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      }).then(data => {
        return data.json();
      });
      socket.emit("join chat", selectedChat._id)
      setMessages(data)
      setLoading(false)
    } catch (error) {
      return alert("Failed to load messages!")
    }
  }

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        setNewMessage("")
        const data = { content: newMessage, chatId: selectedChat._id };
        await fetch('/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            socket.emit("new message", data);
            setMessages([...messages, data]);
          })
          .catch((error) => {
            console.error('Error:', error);
            return alert("An error occured, please try again later.")
          });
      } catch (error) {
        return alert("Error sending message!");
      }
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }

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
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
          setFetchAgain(!fetchAgain);
          fetchMessages();
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
          Authorization: `Bearer ${user.token}`
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
      const data = { chatId: selectedChat._id, chatName: groupChatName };
      await fetch('/api/chat/rename', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
        })
        .catch((error) => {
          console.error('Error:', error);
          setGroupChatName("")
          return alert("An error occured, please try again later.")
        });
    } catch (error) {
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
              {messages &&
                !selectedChat.isGroupChat ? (
                <>
                  <div style={{ fontFamily: "kalam", fontWeight: "bold", fontSize: "110%" }}>
                    {getSender(user, selectedChat.users).toUpperCase()}
                  </div>
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  <div style={{ fontFamily: "kalam", fontWeight: "bold", fontSize: "110%" }}>
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

                        <Button id="sendMessageButton" variant="danger" onClick={() => handleRemove(user)}>Leave group</Button>
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
              marginTop: "2%",
              maxHeight: "70vh"
            }}>
              {loading ? (
                <Spinner animation="border" role="status" variant="success" style={{ margin: "auto", alignSelf: "center" }}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none"
                }}>
                    <ScrollableChat messages={messages} />
                    {isTyping ? <div>{getSender(user, selectedChat.users)} is typing...</div> : <></>}

                </div>
              )}


              <InputGroup className="mt-3">
                <Form.Control style={{ background: "#E0E0E0", border: "none" }}
                  type="text"
                  placeholder="Enter a message..."
                  onKeyDown={sendMessage}
                  onChange={typingHandler}
                  value={newMessage}
                />
              </InputGroup>
            </div>
          </div>

        ) : (
          <div>
            <h1 style={{ fontFamily: "kalam", textAlign: "center", marginTop: "30vh" }}>Click on a user to start chatting</h1>
          </div>
        )
      }


    </>
  )
}

export default SingleChat