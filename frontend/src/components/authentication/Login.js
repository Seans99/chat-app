import React, { useState } from 'react'
import { Form, Button, InputGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false)

  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Please fill in all the fields!");
    }

    try {
      const data = { email, password };
      await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          localStorage.setItem("userInfo", JSON.stringify(data));
          navigate("/chats");
        })
        .catch((error) => {
          console.error('Error:', error);
          return alert("An error occured, please try again later.")
        });
      console.log(data);
    } catch (error) {
      return alert("An error occured, please try again later.")
    }
  };

  return (
    <div>
      <Form>
        <Form.Group className="mb-4" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} required />
        </Form.Group>

        <Form.Group className="mb-5" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control type={show ? "text" : "password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
            <Button variant="dark" onClick={handleClick}>{show ? "Hide" : "Show"}</Button>
          </InputGroup>
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="success" type="submit" onClick={submitHandler}>
            Login
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Login