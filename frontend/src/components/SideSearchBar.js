import React from 'react'
import { Container, Tooltip, Button, OverlayTrigger, Dropdown, DropdownButton, Image } from 'react-bootstrap'
import { useState } from 'react'
import searchIcon from "../assets/images/search.png";
import bellIcon from "../assets/images/bell.png";
import profilePic from "../assets/images/profile-pic.png";
import "./SideSearchBar.css"
import { ChatState } from '../context/ChatProvider';


function SideSearchBar() {

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState();

  const { user } = ChatState();

  return (
    <>
      <Container className="d-flex align-items-center" style={{
        justifyContent: "space-between",
        maxWidth: "100%",
        width: "100%",
        background: "white",
        padding: "1%",
        border: "5px solid darkgreen"
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
          <DropdownButton id="dropdown-search-bar" title={<Image src={profilePic || user.image} width={"25"} height={"25"} />} variant="success">
            <Dropdown.Item href="#/action-1">My Profile</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
          </DropdownButton>
        </div>
        
        
      </Container>
    </>
  )
}

export default SideSearchBar