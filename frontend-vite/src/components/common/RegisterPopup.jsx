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
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
  font-family: "Lora", serif;
  font-size: 14px;
  width: 85%; /* Même largeur que LoginPopup */
  margin-bottom: 15px;
  outline: none;

  &::placeholder {
    color: white;
    opacity: 0.5;
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
`;

// Affiche les erreurs en rouge, centré, en police Lora
const ErrorText = styled.p`
  font-family: "Lora", serif;
  color: red;
  font-size: 14px;
  margin: 0 0 15px 0;
  text-align: center;
`;

// Affiche le message de succès en vert, centré, en police Lora
const SuccessText = styled.p`
  font-family: "Lora", serif;
  color: #00ff00; /* Vert pour le succès */
  font-size: 14px;
  margin: 0 0 15px 0;
  text-align: center;
`;

function RegisterPopup({ onClose, onLoginClick }) {
    const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    // Vérifie que les mots de passe correspondent
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      // Envoie la requête POST à /api/register avec username, email, password
      const response = await axios.post("http://localhost:5000/api/register", {
        pseudo: username, // Utilise "pseudo" pour correspondre à l'API
        email,
        password,
      });
      // Affiche le message de succès
      setSuccess("Inscription réussie !");
      // Réinitialise l'erreur
      setError("");
      // Ferme la popup après 2 secondes pour voir le message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      // Affiche l'erreur renvoyée par le serveur ou un message par défaut
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupBox onClick={(e) => e.stopPropagation()}>
        <PopupTitle>Create an account</PopupTitle>
        <Input
          type="text"
          placeholder="Username"
          value={username} // Lie l'input à l'état username
          onChange={(e) => setUsername(e.target.value)} // Met à jour l'état username
        />
        <Input
          type="email"
          placeholder="Email"
          value={email} // Lie l'input à l'état email
          onChange={(e) => setEmail(e.target.value)} // Met à jour l'état email
        />
        <Input
          type="password"
          placeholder="Password"
          value={password} // Lie l'input à l'état password
          onChange={(e) => setPassword(e.target.value)} // Met à jour l'état password
        />
        <Input
          type="password"
          placeholder="Repeat Your Password"
          value={repeatPassword} // Lie l'input à l'état repeatPassword
          onChange={(e) => setRepeatPassword(e.target.value)} // Met à jour l'état repeatPassword
        />
        {error && <ErrorText>{error}</ErrorText>}
        {success && <SuccessText>{success}</SuccessText>}
        <RegisterButton onClick={handleSubmit}>Register</RegisterButton>
        <LoginText>
          Already have an account?{" "}
          <a onClick={onLoginClick}>Login Now</a>
        </LoginText>
      </PopupBox>
    </PopupOverlay>
  );
}

export default RegisterPopup;