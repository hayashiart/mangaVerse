import React from "react";
import styled from "styled-components";
import { useState } from "react";
import axios from "axios";

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
`;

const PopupTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
`;

const Input = styled.input`
  background-color: #182032;
  border: none;
  border-radius: 10px; /* Confirmé à 10px */
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
`;

const LoginButton = styled.button`
  background-color: #518cc7;
  border-radius: 10px; /* Confirmé à 10px */
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
`;

const ErrorText = styled.p`
  font-family: "Lora", serif;
  color: red;
  font-size: 14px;
  margin: 0 0 15px 0;
  text-align: center;
`;

function LoginPopup({ onClose, onRegisterClick }) {
    // État pour stocker l'email, le mot de passe et les erreurs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e) => {
      e.preventDefault(); // Empêche le rechargement de la page
      try {
        // Envoie la requête POST à /api/login avec email et password
        const response = await axios.post("http://localhost:5000/api/login", {
          email,
          password,
        });
        // Stocke le JWT et le pseudo dans localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("pseudo", response.data.pseudo);
        // Réinitialise l'erreur
        setError("");
        // Ferme la popup
        onClose();
      } catch (err) {
        const errMsg = err.response?.data?.error || "Server error";
  setError(errMsg);
  alert("Login failed: " + errMsg); // Force alert visible
  console.log("Login error:", err); // Log in F12 console
      }
    };
  
    return (
      <PopupOverlay onClick={onClose}>
        <PopupBox onClick={(e) => e.stopPropagation()}>
          <PopupTitle>Login</PopupTitle>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>} {/* Affiche l'erreur si elle existe */}
          <ForgotPasswordLink>Forgot Your Password?</ForgotPasswordLink>
          <LoginButton onClick={handleSubmit}>Login Now</LoginButton> {/* Appelle handleSubmit */}
          <RegisterText>
            Don't have an account?{" "}
            <a onClick={onRegisterClick}>Register Now</a>
          </RegisterText>
        </PopupBox>
      </PopupOverlay>
    );
  }

export default LoginPopup;