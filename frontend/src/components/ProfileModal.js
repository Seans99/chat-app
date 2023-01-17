import React, { useState } from 'react'
import { Modal, Button } from "react-bootstrap"
import viewIcon from "../assets/images/view.png"

function ProfileModal({ user, children }) {
  const [modalShow, setModalShow] = useState(false);

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {user.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={user.image} />
          <p>{user.email}</p>
        </Modal.Body>
        <Modal.Footer>
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
        <img src={viewIcon}></img>)}

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default ProfileModal