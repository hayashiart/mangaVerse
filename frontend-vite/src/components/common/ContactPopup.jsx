import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

const nameRegex = /^[A-Za-z\s]{2,}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Animation douce d'apparition
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
`;

const PopupBox = styled.div`
  background-color: #2f394f;
  border-radius: 20px;
  padding: 40px 50px;
  width: 90%;
  max-width: 520px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.6s ease-out forwards;
`;

const PopupTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 28px;
  text-align: center;
  margin: 0 0 35px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  max-width: 420px; /* limite la largeur pour éviter le collage aux bords */
  padding: 16px 20px;
  margin: 12px 0;
  background-color: #1b2335;
  border: none;
  border-radius: 12px;
  color: white;
  font-family: "Lora", serif;
  font-size: 16px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    background-color: #222a40;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  max-width: 420px;
  height: 140px;
  padding: 16px 20px;
  margin: 12px 0;
  background-color: #1b2335;
  border: none;
  border-radius: 12px;
  color: white;
  font-family: "Lora", serif;
  font-size: 16px;
  resize: vertical;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    background-color: #222a40;
  }
`;

const SendButton = styled.button`
  background-color: #518cc7;
  color: white;
  border: none;
  padding: 16px 50px;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 420px;
  margin-top: 25px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3a6a9e;
  }
`;

const Message = styled.p`
  text-align: center;
  margin: 15px 0 0 0;
  font-size: 15px;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  max-width: 420px;
`;

const ErrorMessage = styled(Message)`
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
`;

const SuccessMessage = styled(Message)`
  color: #51c751;
  background-color: rgba(81, 199, 81, 0.1);
`;

function ContactPopup({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setError("Names must contain only letters (min 2 characters)");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }
    if (subject.length < 5) {
      setError("Subject must be at least 5 characters");
      return;
    }
    if (message.length < 10) {
      setError("Message must be at least 10 characters");
      return;
    }

    try {
      await axios.post("https://localhost:5000/api/contact", {
        first_name: firstName,
        last_name: lastName,
        email,
        subject,
        message,
      });
      setSuccess("Message sent successfully!");
      setTimeout(onClose, 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Server error - please try again");
    }
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupBox onClick={(e) => e.stopPropagation()}>
        <PopupTitle>Contact Us</PopupTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <TextArea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <SendButton type="submit">Send Message</SendButton>
        </Form>
      </PopupBox>
    </PopupOverlay>
  );
}

export default ContactPopup;