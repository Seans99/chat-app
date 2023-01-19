import React, { useState } from 'react'
import { Modal, Button, Form } from "react-bootstrap"
import { ChatState } from '../../context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

function GroupChatModal({ children }) {
  const [modalShow, setModalShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false)

  const { user, chats, setChats } = ChatState();

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

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return alert("User has already been added!")
    }
    setSearchResult([...selectedUsers, userToAdd]);
  }

  const handleDelete = () => {

  }

  function MyVerticallyCenteredModal(props) {

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton style={{ border: "none" }}>
        </Modal.Header>
        <Modal.Body>
          <h1 style={{ fontSize: "200%", fontFamily: "kalam", margin: "0 auto", marginBottom: "1%", textAlign:"center" }}>Create group chat</h1>
          <hr style={{ width: "30%", margin: "0 auto", marginBottom: "5%" }} />
          <Form preventDefault style={{ display: "flex", flexDirection: "column", width: "60%", margin: "0 auto" }}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="text" placeholder="Chat name" onChange={(e) => setGroupChatName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="search" placeholder="Add users" onChange={(e) => handleSearch(e.target.value)} />
            </Form.Group>
            {selectedUsers.map((user) => (
              <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
            ))}
            {loading ? <div>Loading...</div> : (
              searchResult?.slice(0.4).map((user) => (
                <div style={{width:"80%", margin:"0 auto"}}>
                  <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                </div>
              ))
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ margin: "0 auto", border: "none", paddingBottom: "5%" }}>
          <Button variant="success" style={{ marginBottom: "10%" }} onClick={handleSubmit}>
            Create group
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <span onClick={() => setModalShow(true)}>{children}</span>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}

export default GroupChatModal