import React, { useState } from 'react'
import { Modal, Button, Image } from "react-bootstrap"
import viewIcon from "../../assets/images/view.png"

function ProfileModal({ user, children }) {
  const [modalShow, setModalShow] = useState(false);

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{textAlign:"center"}}
      >
        <Modal.Header closeButton style={{border:"none"}}>
        </Modal.Header>
        <Modal.Body>
          <h1 style={{ fontSize: "200%", fontFamily: "kalam", margin: "0 auto", marginBottom: "1%" }}>My profile</h1>
          <hr style={{ width: "30%", margin: "0 auto", marginBottom: "5%" }} />
          <Image src={user.picture} alt="profile-pic" width={300} height={300} style={{ marginBottom: "2%" }} />
          <p style={{ fontSize: "150%" }}>{user.name}</p>
          <hr style={{width:"30%", margin:"0 auto"}} />
          <p style={{fontSize:"150%", padding:"2%"}}>{user.email}</p>
        </Modal.Body>
        <Modal.Footer style={{margin:"0 auto", border:"none", paddingBottom:"5%"}}>
          <Button variant="success" onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      {children ? (
        <span onClick={() => setModalShow(true)}>{children}</span>
      ) : (
          <img style={{cursor:"pointer"}} src={viewIcon} alt="view-icon" onClick={() => setModalShow(true)}></img>)}

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default ProfileModal