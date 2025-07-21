import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const nameRegex = /^[A-Za-z\s]{2,}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupBox = styled.div`
  background-color: #2f394f;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 350px;
    padding: 18px;
  }
`;

const PopupTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 22px;
  }
`;

const Input = styled.input`
  background-color: #182032;
  border: none;
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
  font-family: "Lora", serif;
  font-size: 14px;
  width: 85%;
  margin-bottom: 15px;
  outline: none;

  &::placeholder {
    color: white;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    width: 100%;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 9px 13px;
    font-size: 13px;
  }
`;

const TextArea = styled.textarea`
  background-color: #182032;
  border: none;
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
  font-family: "Lora", serif;
  font-size: 14px;
  width: 85%;
  height: 100px;
  margin-bottom: 15px;
  outline: none;

  &::placeholder {
    color: white;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    width: 100%;
    height: 80px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 9px 13px;
    font-size: 13px;
    height: 90px;
  }
`;

const SendButton = styled.button`
  background-color: #518cc7;
  border-radius: 10px;
  border: none;
  padding: 10px 15px;
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  cursor: pointer;
  width: 85%;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
    width: 100%;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 9px 13px;
    font-size: 15px;
  }
`;

const ErrorText = styled.p`
  font-family: "Lora", serif;
  color: red;
  font-size: 14px;
  margin: 0 0 15px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 10px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 13px;
  }
`;

const SuccessText = styled.p`
  font-family: "Lora", serif;
  color: green;
  font-size: 14px;
  margin: 0 0 15px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 10px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 13px;
  }
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
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setError("Names must be letters only, min 2 chars");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (subject.length < 5) {
      setError("Subject min 5 chars");
      return;
    }
    if (message.length < 10) {
      setError("Message min 10 chars");
      return;
    }
    if (!firstName || !lastName || !email || !subject || !message) {
      setError("All fields required");
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
      setSuccess("Message sent!");
      setError("");
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <PopupOverlay onClick={onClose} aria-label="Contact form overlay"> {/* WCAG: Ajouté aria-label pour accessibilité */}
      <PopupBox onClick={(e) => e.stopPropagation()} aria-label="Contact form container"> {/* WCAG: Ajouté aria-label pour accessibilité */}
        <PopupTitle>Contact Us</PopupTitle>
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          aria-label="First name input" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          aria-label="Last name input" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email input" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          aria-label="Subject input" // WCAG: Ajouté aria-label pour accessibilité
        />
        <TextArea
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Message input" // WCAG: Ajouté aria-label pour accessibilité
        />
        {error && <ErrorText role="alert">{error}</ErrorText>} {/* WCAG: Ajouté role="alert" pour accessibilité */}
        {success && <SuccessText role="alert">{success}</SuccessText>} {/* WCAG: Ajouté role="alert" pour accessibilité */}
        <SendButton onClick={handleSubmit} aria-label="Send contact message"> {/* WCAG: Ajouté aria-label pour accessibilité */}
          Send
        </SendButton>
      </PopupBox>
    </PopupOverlay>
  );
}

export default ContactPopup;