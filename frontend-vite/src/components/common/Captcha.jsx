import React, { useState, useEffect } from "react";
import styled from "styled-components";

const CaptchaInput = styled.input`
  background-color: #f9f9f9; // Fond gris clair comme Google
  border: 1px solid #d3d3d3; // Bordure légère
  border-radius: 4px; // Coins arrondis
  font-family: "Roboto", sans-serif; // Police Google
  font-weight: bold; // Texte en gras
  color: #333; // Texte sombre pour contraste
  padding: 10px;
  width: 150px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Ombre légère
  &::placeholder {
    color: #555; // Gris moyen pour le placeholder
    opacity: 1; // Pleine opacité
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

const Captcha = ({ onChange, hasError }) => {
  // Génère une nouvelle question et réponse
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1; // Nombre aléatoire entre 1 et 10
    const num2 = Math.floor(Math.random() * 10) + 1; // Nombre aléatoire entre 1 et 10
    return { question: `What is ${num1} + ${num2}?`, answer: num1 + num2 };
  };

  // États pour la réponse de l'utilisateur et les données du CAPTCHA
  const [captcha, setCaptcha] = useState("");
  const [captchaData, setCaptchaData] = useState(generateCaptcha());

  // Réinitialise le CAPTCHA si une erreur est détectée
  useEffect(() => {
    if (hasError) {
      setCaptchaData(generateCaptcha()); // Nouvelle question
      setCaptcha(""); // Efface la réponse
    }
  }, [hasError]);

  // Met à jour la réponse et informe le parent
  const handleChange = (e) => {
    const value = e.target.value;
    setCaptcha(value);
    onChange({ value, answer: captchaData.answer }); // Envoie valeur et réponse correcte
  };

  return (
    <CaptchaInput
      type="text"
      placeholder={captchaData.question}
      value={captcha}
      onChange={handleChange}
      aria-label="CAPTCHA answer input"
    />
  );
};

export default Captcha;