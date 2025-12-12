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

const ForgotPasswordLink = styled.a`
  color: white;
  font-size: 15px;
  text-decoration: underline;
  margin: 15px 0;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const LoginButton = styled.button`
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

const RegisterText = styled.p`
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

const ErrorText = styled.p`
  color: #ff6b6b;
  font-size: 15px;
  margin: 15px 0 0 0;
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

function LoginPopup({ onClose, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [captcha, setCaptcha] = useState({ value: "", answer: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isError = captcha.value !== captcha.answer.toString();
    if (isError) {
      setError("Incorrect CAPTCHA answer");
      setHasError(true);
      setTimeout(() => setHasError(false), 0);
      return;
    }

    try {
      const response = await axios.post("https://localhost:5000/api/auth/login", {
        email,
        password,
      });

      Cookies.set("session_token", response.data.token, { expires: 7, secure: true, sameSite: 'strict' });
      Cookies.set("user_pseudo", response.data.pseudo, { expires: 7, secure: true, sameSite: 'strict' });
      Cookies.set("user_role", response.data.role, { expires: 7, secure: true, sameSite: 'strict' });

      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupBox onClick={(e) => e.stopPropagation()}>
        <PopupTitle>Login to MangaVerse</PopupTitle>
        <Form onSubmit={handleSubmit}>
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
          <CaptchaWrapper>
            <Captcha onChange={(data) => setCaptcha(data)} hasError={hasError} />
          </CaptchaWrapper>
          {error && <ErrorText>{error}</ErrorText>}
          <ForgotPasswordLink>Forgot Your Password?</ForgotPasswordLink>
          <LoginButton type="submit">Login Now</LoginButton>
          <RegisterText>
            Don't have an account?{" "}
            <a onClick={onRegisterClick}>Register Now</a>
          </RegisterText>
        </Form>
      </PopupBox>
    </PopupOverlay>
  );
}

export default LoginPopup;