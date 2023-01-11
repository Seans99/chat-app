import React, { useState } from 'react'
import { Form, Button, InputGroup } from "react-bootstrap"
import profilePic from "../../assets/images/profile-pic.png"
import "./Signup.css"

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const [image, setImage] = useState(null);
  /* const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); */
  const [picLoading, setPicLoading] = useState(false);

  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)

  const handleClick1 = () => setShow1(!show1);
  const handleClick2 = () => setShow2(!show2);

  const submitHandler = () => { };

  /* async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "chat-app");
    data.append("cloud_name", "chat-app-upload-img")
    try {
      setUploadingImg(true);
      let res = await fetch(process.env.CLOUDINARY_URL, {
        method: "post",
        body: data,
      });
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) return alert("Please upload your profile picture");
    const url = await uploadImage(image);
    console.log(url);
  } */

  const postDetails = async (pics) => {
    setPicLoading(true);
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "chat-app-upload-img");
      fetch(process.env.CLOUDINARY_URL, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      alert("Please select a profile picture")
      setPicLoading(false);
      return;
    }
  };

  return (
    <div>
      <Form>
        <div className="signup-profile-pic__container">
          <img src={image || profilePic} className="signup-profile-pic" />
          <label htmlFor='image-upload' className="image-upload-label">
            <i className='fas fa-plus-circle add-picture-icon'></i>
          </label>
          <input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={(e) => postDetails(e.target.files[0])} />
        </div>

        <Form.Group className="mb-4" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)} value={name} required />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
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