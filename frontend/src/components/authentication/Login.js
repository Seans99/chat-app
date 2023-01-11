import React, { useState } from 'react'
import { Form, Button, InputGroup } from "react-bootstrap"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false)

  const handleClick = () => setShow(!show);
  const submitHandler = () => { };

  return (
    <div>
      <Form>
        <Form.Group className="mb-4" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
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