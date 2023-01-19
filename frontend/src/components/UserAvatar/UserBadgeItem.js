import React from 'react'
import { Container, Image } from 'react-bootstrap'
import closeButton from "../../assets/images/close.png"

function UserBadgeItem({ user, handleFunction }) {
  return (
    <Container style={{
      padding: "2%",
      borderRadius: "15px",
      margin: "3%",
      background: "#198754",
      cursor: "pointer",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      maxWidth: "30%",
      fontSize:"80%"
    }}
      onClick={handleFunction}>
      {user.name}
      <Image src={closeButton} width={13} height={13} style={{marginTop:"2%"}} />
    </Container>
  )
}

export default UserBadgeItem