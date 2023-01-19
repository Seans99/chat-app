import React from 'react'
import { Container } from 'react-bootstrap'

function UserBadgeItem({ user, handleFunction }) {
  return (
    <Container style={{
      padding: "2%",
      borderRadius: "3px",
      margin: "3%",
      background: "blue",
      cursor: "pointer",
    }}
      onClick={handleFunction}>
        {user.name}
    </Container>
  )
}

export default UserBadgeItem