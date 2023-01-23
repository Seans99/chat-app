import React from 'react'
import { Container, Button, Dropdown, DropdownButton, Image, Navbar, Offcanvas, Form, Spinner } from 'react-bootstrap'
import { useState } from 'react'
import bellIcon from "../assets/images/bell.png";
import "./SideSearchBar.css"
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './Modals/ProfileModal';
import { useNavigate } from "react-router-dom";
import ChatLoading from './ChatLoading';
import UserListItem from './UserAvatar/UserListItem';

function SideSearchBar() {

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      return alert("Please enter something in the search bar!")
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const data = { userId };
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          if (!chats.find((c) => c._id === data._id)) {
            setChats([data, ...chats])
          }
          setSelectedChat(data);
          setLoadingChat(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          return alert("An error occured, please try again later.")
        });
      
    } catch (error) {
      return alert("Error fetching the chat!");
    }
  }

  return (
    <>
      <Container className="d-flex align-items-center" style={{
        justifyContent: "space-between",
        maxWidth: "100%",
        width: "100%",
        background: "white",
        padding: "1%",
        border: "5px solid darkgreen",
      }}>
        {[false].map((expand) => (
          <Navbar id="sideDrawer" key={expand} bg="success" expand={expand} className="mb-3" style={{ borderRadius: "5px", margin: "0 !important" }}>
            <Container fluid>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="start"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    Search users
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Form className="d-flex">
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2"
                      aria-label="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button variant="success" onClick={handleSearch}>Search</Button>
                  </Form>
                  {loading ? (
                    <ChatLoading />
                  ) : (
                    searchResult?.map(user => (
                      <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                    ))
                  )}
                  {loadingChat && <Spinner style={{margin:"0 auto !important"}} animation="border" varieant="success" ml="auto" d="flex" />}
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        ))}
        <h1 className="searchbarTitle" ><span className="live">Live</span> chat</h1>
        <div style={{ display: "flex" }}>
          <DropdownButton style={{ marginLeft: "-10%" }} id="dropdown-search-bar" title={<img className="bell-img" src={bellIcon} alt="bell-icon" />} variant="success">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>
          <span style={{ margin: "5%" }}></span>
          <DropdownButton id="dropdown-search-bar" title={
            <Image src={user.picture} width={"25"} height={"25"} />
          } variant="success">
            <ProfileModal user={user}>
              <Dropdown.Item>My Profile</Dropdown.Item>
            </ProfileModal>
            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
          </DropdownButton>
        </div>


      </Container>
    </>
  )
}

export default SideSearchBar