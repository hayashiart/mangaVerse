import React from "react";
import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import Captcha from "./Captcha"; // Importe le composant CAPTCHA
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

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

const RegisterButton = styled.button`
  background-color: #518cc7;
  border-radius: 10px;
  border: none;
  padding: 10px 15px;
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 15px;
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

const LoginText = styled.p`
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  margin: 0;

  a {
    color: white;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 13px;
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
  color: #00ff00;
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

const CaptchaInput = styled(Input)`
  background-color: #1b2335;
  border: 2px solid #518cc7;
  font-weight: bold;
  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

function RegisterPopup({ onClose, onLoginClick }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasError, setHasError] = useState(false); // Indique si une erreur s'est produite
  const [captcha, setCaptcha] = useState({ value: "", answer: "" }); // État pour stocker valeur et réponse


  const handleSubmit = async (e) => {
    e.preventDefault();
console.log("Captcha:", captcha); // Vérifie la valeur de captcha
const isError = password !== repeatPassword || captcha.value !== captcha.answer.toString();
if (password !== repeatPassword) {
  setError("Passwords do not match");
  setHasError(true); // Signale une erreur
  setTimeout(() => setHasError(false), 0); // Réinitialise après un court délai
  return;
}
if (isError) {
  setError("Incorrect CAPTCHA answer");
  setHasError(true); // Signale une erreur
  setTimeout(() => setHasError(false), 0); // Réinitialise après un court délai
  return;
}
setHasError(false); // Réinitialise après succès
setError(""); // Efface l'erreur en cas de succès
    try {
      const response = await axios.post("https://localhost:5000/api/register", {
        pseudo: username,
        email,
        password,
      });
      console.log("API response:", response.data);
      setTimeout(() => {
        Cookies.set("session_token", response.data.token, { expires: 7, httpOnly: false, secure: true, sameSite: 'strict' });
        Cookies.set("user_pseudo", username, { expires: 7, httpOnly: false, secure: true, sameSite: 'strict' });
        console.log("Cookies créés après délai:", Cookies.get("session_token"), Cookies.get("user_pseudo"));
        setSuccess("Inscription réussie !");
        setError("");
        setTimeout(() => {
          onClose();
        }, 2000);
      }, 0);
setSuccess("Inscription réussie !");
      setError("");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <PopupOverlay onClick={onClose} aria-label="Registration form overlay"> {/* WCAG: Ajouté aria-label pour accessibilité */}
      <PopupBox onClick={(e) => e.stopPropagation()} aria-label="Registration form container"> {/* WCAG: Ajouté aria-label pour accessibilité */}
        <PopupTitle>Register for MangaVerse</PopupTitle>
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-label="Username input for registration" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email input for registration" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password input for registration" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Input
          type="password"
          placeholder="Repeat your password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          aria-label="Repeat password input for registration" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Captcha onChange={(data) => setCaptcha(data)} hasError={hasError} />
        {error && <ErrorText role="alert">{error}</ErrorText>} {/* WCAG: Ajouté role="alert" pour accessibilité */}
        {success && <SuccessText role="alert">{success}</SuccessText>} {/* WCAG: Ajouté role="alert" pour accessibilité */}
        <RegisterButton onClick={handleSubmit} aria-label="Register button"> {/* WCAG: Ajouté aria-label pour accessibilité */}
          Register
        </RegisterButton>
        <LoginText>
          Already have an account?{" "}
          <a onClick={onLoginClick} aria-label="Login now link"> {/* WCAG: Ajouté aria-label pour accessibilité */}
            Login Now
          </a>
        </LoginText>
      </PopupBox>
    </PopupOverlay>
  );
}

export default RegisterPopup;