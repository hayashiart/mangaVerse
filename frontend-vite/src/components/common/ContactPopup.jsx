import React, { useState } from "react"; // Importe React et useState pour gérer les états (ex. champs du form)
import styled from "styled-components"; // Importe styled pour les styles CSS-in-JS
import axios from "axios"; // Importe axios pour envoyer la requête au backend (/api/contact)

const nameRegex = /^[A-Za-z\s]{2,}$/; // Regex for names: letters/spaces, min 2 chars
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Regex for valid email

const PopupOverlay = styled.div` // Overlay sombre pour la popup (comme fond obscurci)
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

const PopupBox = styled.div` // Box principale de la popup (fond #2f394f, comme Login/Register)
  background-color: #2f394f;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PopupTitle = styled.h2` // Titre "Contact" (police Montserrat, blanc)
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
`;

const Input = styled.input` // Inputs standards (fond #182032, texte blanc)
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
`;

const TextArea = styled.textarea` // Grosse input pour message (fond #182032, texte blanc, hauteur 100px)
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
`;

const SendButton = styled.button` // Bouton "Send" (fond #518cc7, texte blanc)
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
`;

const ErrorText = styled.p` // Texte erreur en rouge
  font-family: "Lora", serif;
  color: red;
  font-size: 14px;
  margin: 0 0 15px 0;
  text-align: center;
`;

const SuccessText = styled.p` // Texte succès en vert
  font-family: "Lora", serif;
  color: green;
  font-size: 14px;
  margin: 0 0 15px 0;
  text-align: center;
`;

function ContactPopup({ onClose }) {
    const [firstName, setFirstName] = useState(""); // État pour First Name (vide au départ)
    const [lastName, setLastName] = useState(""); // État pour Last Name
    const [email, setEmail] = useState(""); // État pour Email
    const [subject, setSubject] = useState(""); // État pour Subject
    const [message, setMessage] = useState(""); // État pour Message (gros input)
    const [error, setError] = useState(""); // État pour erreurs (ex. champs vides)
    const [success, setSuccess] = useState(""); // État pour message succès
  
    const handleSubmit = async (e) => { // Fonction appelée au clic "Send"
      e.preventDefault(); // Empêche rechargement page
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
      if (!firstName || !lastName || !email || !subject || !message) { // Vérifie si tous les champs remplis
        setError("All fields required");
        return;
      }
      try {
        await axios.post("http://localhost:5000/api/contact", { // Envoie à /api/contact (Firebase)
          first_name: firstName,
          last_name: lastName,
          email,
          subject,
          message,
        });
        setSuccess("Message sent!"); // Succès
        setError(""); // Efface erreur
        setTimeout(onClose, 2000); // Ferme popup après 2s pour voir succès
      } catch (err) {
        setError(err.response?.data?.error || "Server error"); // Affiche erreur backend
      }
    };
  
    return (
      <PopupOverlay onClick={onClose}>
        <PopupBox onClick={(e) => e.stopPropagation()}>
          <PopupTitle>Contact</PopupTitle>
          <Input
  type="text"
  placeholder="First Name"
  value={firstName} // Lie à l'état
  onChange={(e) => setFirstName(e.target.value)} // Met à jour l'état
/>
<Input
  type="text"
  placeholder="Last Name"
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
/>
<Input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
<Input
  type="text"
  placeholder="Subject"
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
/>
<TextArea
  placeholder="Type your message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
{error && <ErrorText>{error}</ErrorText>}
{success && <SuccessText>{success}</SuccessText>} 
<SendButton onClick={handleSubmit}>Send</SendButton>
        </PopupBox>
      </PopupOverlay>
    );
  }

export default ContactPopup;