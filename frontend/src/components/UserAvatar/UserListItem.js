import React from 'react'
import { Card, Col, Row, Image } from 'react-bootstrap';
import "./UserListItem.css"

function UserListItem({ user, handleFunction }) {
  return (
    <Card className="userList" style={{ marginTop: "5%", marginBottom: "5%", width: "95%", cursor: "pointer", background: "#E8E8E8", border:"none" }} onClick={handleFunction}>
      <Row>
        <Col style={{display:"flex"}}>
          <Image style={{ margin: "3%", marginRight:"10%"}} src={user.picture} width={50} height={50} roundedCircle />
          <div style={{marginRight:"10%", marginTop:"2%"}}>
            <Card.Title>
              {user.name}
            </Card.Title>
            <Card.Text>
              {user.email}
            </Card.Text>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default UserListItem