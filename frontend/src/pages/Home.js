import React from 'react'
import { Container, Card, Row, Col, Tab, Tabs } from "react-bootstrap"
import "./Home.css";
import Login from "../components/authentication/Login.js"
import Signup from '../components/authentication/Signup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats")
    }
  }, [navigate]);

  return (
    <Container style={{ maxWidth: "70%" }}>
      <Row>
        <Col>
          <Card className="d-flex align-items-center justify-content-center flex-direction-column" style={{
            backgroundColor: "white",
            margin: "80px 0 15px 0",
          }}>
            <Card.Body className="title"><span className="live">Live</span> chat</Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="d-flex align-items-center justify-content-center flex-direction-column" style={{
            backgroundColor: "white",
            margin: "0 0 50px 0",
            paddingBottom: "30px",
            paddingTop: "20px"
          }}>
            <Card.Body style={{ width: "60%" }}>
              <Tabs
                defaultActiveKey="login"
                id="homepage-tabs"
                className="mb-5"
                justify
                variant="pills"
              >
                <Tab eventKey="login" title="Login">
                  <Login />
                </Tab>
                <Tab eventKey="register" title="Register">
                  <Signup />
                </Tab>
              </Tabs>

            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  )
}

export default Home