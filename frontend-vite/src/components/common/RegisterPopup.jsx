import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import Captcha from "./Captcha";
import Cookies from "js-cookie";

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
  padding: 40px 45px;
  width: 90%;
  max-width: 480px;
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
  max-width: 400px;
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

const CaptchaWrapper = styled.div`
  margin: 20px 0;
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
`;

const RegisterButton = styled.button`
  background-color: #518cc7;
  color: white;
  border: none;
  padding: 16px 40px;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3a6a9e;
  }
`;

const LoginText = styled.p`
  color: white;
  font-size: 15px;
  margin: 25px 0 0 0;
  text-align: center;

  a {
    color: white;
    text-decoration: underline;
    cursor: pointer;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const Message = styled.p`
  text-align: center;
  margin: 15px 0 0 0;
  font-size: 15px;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
`;

const ErrorMessage = styled(Message)`
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
`;

const SuccessMessage = styled(Message)`
  color: #51c751;
  background-color: rgba(81, 199, 81, 0.1);
`;

function RegisterPopup({ onClose, onLoginClick }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasError, setHasError] = useState(false);
  const [captcha, setCaptcha] = useState({ value: "", answer: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    const isCaptchaError = captcha.value !== captcha.answer.toString();
    if (isCaptchaError) {
      setError("Incorrect CAPTCHA answer");
      setHasError(true);
      setTimeout(() => setHasError(false), 0);
      return;
    }

    try {
      const response = await axios.post("https://localhost:5000/api/auth/register", {
        pseudo: username,
        email,
        password,
      });

      Cookies.set("session_token", response.data.token, { expires: 7, secure: true, sameSite: 'strict' });
      Cookies.set("user_pseudo", username, { expires: 7, secure: true, sameSite: 'strict' });

      setSuccess("Registration successful!");
      setTimeout(onClose, 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Server error - please try again");
    }
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupBox onClick={(e) => e.stopPropagation()}>
        <PopupTitle>Register for MangaVerse</PopupTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Repeat your password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
          <CaptchaWrapper>
            <Captcha onChange={(data) => setCaptcha(data)} hasError={hasError} />
          </CaptchaWrapper>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <RegisterButton type="submit">Register</RegisterButton>
          <LoginText>
            Already have an account?{" "}
            <a onClick={onLoginClick}>Login Now</a>
          </LoginText>
        </Form>
      </PopupBox>
    </PopupOverlay>
  );
}

export default RegisterPopup;