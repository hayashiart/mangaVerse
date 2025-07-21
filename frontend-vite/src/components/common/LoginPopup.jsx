import React, { useState, useEffect } from "react";
import styled from "styled-components";
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

const ForgotPasswordLink = styled.a`
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  text-decoration: underline;
  margin-bottom: 15px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 10px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 13px;
  }
`;

const LoginButton = styled.button`
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

const RegisterText = styled.p`
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

const CaptchaInput = styled(Input)`
  background-color: #f9f9f9; // Fond gris clair
  border: 1px solid #d3d3d3; // Bordure légère
  border-radius: 4px; // Coins arrondis
  font-family: "Roboto", sans-serif; // Police Google
  font-weight: bold; // Texte en gras
  color: #333; // Texte sombre pour contraste
  padding: 10px;
  width: 150px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Ombre légère
  &::placeholder { // Style spécifique pour le placeholder
    color: #555; // Gris moyen pour le placeholder
    opacity: 1; // Pleine opacité pour visibilité
  }
  @media (max-width: 768px) {
    width: 120px;
    padding: 8px;
    font-size: 12px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 130px;
    padding: 9px;
    font-size: 13px;
  }
`;

function LoginPopup({ onClose, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false); // Indique si une erreur s'est produite
  const [captcha, setCaptcha] = useState({ value: "", answer: "" }); // État pour stocker valeur et réponse

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Captcha:", captcha); // Vérifie la valeur de captcha
    const isError = captcha.value !== captcha.answer.toString();
    if (isError) {
      setError("Incorrect CAPTCHA answer");
      setHasError(true); // Signale une erreur
      setTimeout(() => setHasError(false), 0); // Réinitialise après un court délai
      return;
    }
    setHasError(false); // Réinitialise après succès
    setError(""); // Efface l'erreur en cas de succès
    try {
      const response = await axios.post("https://localhost:5000/api/login", {
        email,
        password,
      });
      console.log("API response:", response.data);
      setTimeout(() => {
        Cookies.set("session_token", response.data.token, { expires: 7, httpOnly: false, secure: true, sameSite: 'strict' });
        Cookies.set("user_pseudo", response.data.pseudo, { expires: 7, httpOnly: false, secure: true, sameSite: 'strict' });
        console.log("Cookies créés après délai:", Cookies.get("session_token"), Cookies.get("user_pseudo"));
        setError("");
        onClose();
      }, 0);
      setError("");
      onClose();
    } catch (err) {
      const errMsg = err.response?.data?.error || "Server error";
      setError(errMsg);
      alert("Login failed: " + errMsg);
      console.log("Login error:", err);
    }
  };

  return (
    <PopupOverlay onClick={onClose} aria-label="Login form overlay"> {/* WCAG: Ajouté aria-label pour accessibilité */}
      <PopupBox onClick={(e) => e.stopPropagation()} aria-label="Login form container"> {/* WCAG: Ajouté aria-label pour accessibilité */}
        <PopupTitle>Login to MangaVerse</PopupTitle>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email input for login" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password input for login" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Captcha onChange={(data) => setCaptcha(data)} hasError={hasError} />
        {error && <ErrorText role="alert">{error}</ErrorText>} {/* WCAG: Ajouté role="alert" pour accessibilité */}
        <ForgotPasswordLink aria-label="Forgot password link"> {/* WCAG: Ajouté aria-label pour accessibilité */}
          Forgot Your Password?
        </ForgotPasswordLink>
        <LoginButton onClick={handleSubmit} aria-label="Login button"> {/* WCAG: Ajouté aria-label pour accessibilité */}
          Login Now
        </LoginButton>
        <RegisterText>
          Don't have an account?{" "}
          <a onClick={onRegisterClick} aria-label="Register now link"> {/* WCAG: Ajouté aria-label pour accessibilité */}
            Register Now
          </a>
        </RegisterText>
      </PopupBox>
    </PopupOverlay>
  );
}

export default LoginPopup;