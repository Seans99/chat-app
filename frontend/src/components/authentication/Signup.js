import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Form, Button, InputGroup } from "react-bootstrap"
import profilePic from "../../assets/images/profile-pic.png"
import "./Signup.css"

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const [image, setImage] = useState();
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)

  const handleClick1 = () => setShow1(!show1);
  const handleClick2 = () => setShow2(!show2);

  const submitHandler = () => { };

  const navigate = useNavigate();


  const postDetails = (images) => {
    setImageLoading(true);
    if (images === undefined) {
      alert("Please select an image!")
      return;
    }
    console.log(images);
    if (images.type === 'image/jpeg' || images.type === 'image/png') {
      if (images.size >= 1048576) {
        return alert("Max file size is 1mb");
      } else {
        setImage(images);
        setImagePreview(URL.createObjectURL(images));
      }
      const data = new FormData();
      data.append('file', images);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'chat-app-upload-img');
      fetch('https://api.cloudinary.com/v1_1/chat-app-upload-img/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url.toString());
          setImageLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setImageLoading(false);
        });
    } else {
      alert("Please select an image!")
      setImageLoading(false);
      return;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name, !email, !password, !image) {
      return alert("Please fill in all the fields!");
    }
    if (!password === confirmPassword) {
      return alert("Passwords do not match!")
    }

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, image })
      });
      const content = await res.json();
      navigate("/chat");
      console.log(content);
    } catch (error) {
      return alert("An error occured, please try again later.")
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <div className="signup-profile-pic__container">
          <img src={imagePreview || profilePic} className="signup-profile-pic" />
          <label htmlFor='image-upload' className="image-upload-label">
            <i className='fas fa-plus-circle add-picture-icon'></i>
          </label>
          <input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={(e) => postDetails(e.target.files[0])} />
        </div>

        <Form.Group className="mb-4" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} required />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} required />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control type={show1 ? "text" : "password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
            <Button variant="dark" onClick={handleClick1}>{show1 ? "Hide" : "Show"}</Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-5" controlId="formBasicConfirmPassword">
          <Form.Label>Confirm password</Form.Label>
          <InputGroup>
            <Form.Control type={show2 ? "text" : "password"} placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required />
            <Button variant="dark" onClick={handleClick2}>{show2 ? "Hide" : "Show"}</Button>
          </InputGroup>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="success" type="submit" onClick={submitHandler}>
            Signup
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Signup