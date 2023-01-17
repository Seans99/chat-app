import React from 'react'
import { Container, Tooltip, Button, OverlayTrigger, Dropdown, DropdownButton, Image } from 'react-bootstrap'
import { useState } from 'react'
import searchIcon from "../assets/images/search.png";
import bellIcon from "../assets/images/bell.png";
import "./SideSearchBar.css"
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from "react-router-dom"


function SideSearchBar() {

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState();

  const { user } = ChatState();

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
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
        {['right'].map((placement) => (
          <OverlayTrigger
            key={placement}
            placement={placement}
            overlay={
              <Tooltip id={`tooltip-${placement}`}>
                Search user
              </Tooltip>
            }
          >
            <Button variant="success">
              <img className="search-img" src={searchIcon} alt="search-icon" />
            </Button>
          </OverlayTrigger>
        ))}
        <h1 className="searchbarTitle" ><span className="live">Live</span> chat</h1>
        <div style={{display: "flex"}}>
          <DropdownButton style={{ marginLeft: "-10%" }} id="dropdown-search-bar" title={<img className="bell-img" src={bellIcon} alt="bell-icon" />} variant="success">
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>
          <span style={{margin:"5%"}}></span>
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