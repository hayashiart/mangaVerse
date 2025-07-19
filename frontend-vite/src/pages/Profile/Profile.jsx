import React, { useState, useEffect } from "react"; // Importe React, useState pour états (ex. champs form), useEffect pour charger données utilisateur
import styled from "styled-components"; // Importe styled pour styles CSS (fond #252F45, etc.)
import axios from "axios"; // Importe axios pour appels API (ex. mise à jour profil)
import Header from "../../components/common/Header"; // Importe Header pour barre haut
import Footer from "../../components/common/Footer"; // Importe Footer pour bas de page
import userIconSrc from "~/assets/icons/png/usersWhite.png"; // Image default pour profil (change si tu as une autre)
// Ajoute après autres imports
import Cropper from "react-cropper";


const ProfilePage = styled.div`
  background-color: #252F45;
  display: flex;
  flex-direction: column;
  justify-content: center; // Centre verticalement
  align-items: center; // Centre horizontalement
  padding: 20px; // Réduit bande haut/bas
  min-height: 100vh; // Remplit toute la page
  margin: 0; // Enlève bande haut
`;

const Title = styled.h2` // Titre "Profile" en Montserrat blanc bold
  font-family: "Montserrat", sans-serif; // Police Montserrat
  font-weight: bold; // Gras
  color: white; // Blanc
  font-size: 24px; // Taille grande pour titre
  margin-bottom: 20px; // Espace sous le titre
`;

const Input = styled.input` // Inputs (fond sombre, texte blanc)
  background-color: #182032;
  border: none;
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
  font-family: "Lora", serif;
  font-size: 14px;
  width: 300px; // Largeur fixe
  margin-bottom: 15px;
  outline: none;
`;

const SaveButton = styled.button` // Bouton "Save Changes" bleu #518CC7
  background-color: #518CC7;
  border-radius: 10px;
  border: none;
  padding: 10px 15px;
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  cursor: pointer;
  width: 320px; // Un peu plus large que inputs

  &:hover {
    opacity: 0.8;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px); // Moins header/footer
  width: 100%;
  flex-grow: 1; // Étend pour remplir
`;

// Remplace ProfileImage
const ProfileImage = styled.img`
  width: 150px; // Fixe largeur
  height: 150px; // Fixe hauteur égale pour cercle
  border-radius: 50%; // Cercle
  object-fit: cover; // Remplit le cercle sans déformer
  margin-bottom: 20px;
  margin-top: 20px;
`;

const FormContainer = styled.div` // Conteneur pour les inputs/bouton
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div` // Conteneur pour image et upload dessous
  display: flex;
  flex-direction: column;
  align-items: center; // Centre horizontal
`;

const ErrorText = styled.p` // Texte erreur en rouge
  font-family: "Lora", serif;
  color: red;
  font-size: 14px;
  margin: 0 0 15px 0;
  text-align: center;
`;

const Button = styled.button` // Bouton pour "Upload" (fond #424C61, texte blanc)
  background-color: #424C61;
  border-radius: 10px;
  border: none;
  padding: 10px 15px;
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    opacity: 0.8;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function Profile() {

const [username, setUsername] = useState(""); // État pour username (prérempli)
const [email, setEmail] = useState(""); // État pour email (prérempli)
const [newPassword, setNewPassword] = useState(""); // État pour nouveau password
const [repeatPassword, setRepeatPassword] = useState(""); // État pour répétition
const [profilePhoto, setProfilePhoto] = useState(userIconSrc); // État pour URL image (default userIconSrc)
const [selectedFile, setSelectedFile] = useState(null); // État pour le fichier choisi (null au départ)
const [error, setError] = useState(""); // Pour erreurs (ex. passwords ne match pas)

const [imageSrc, setImageSrc] = useState(null); // Source pour Cropper
const [cropper, setCropper] = useState(null); // Référence Cropper

const usernameRegex = /^[A-Za-z0-9_]{3,}$/; // Letters, numbers, underscore, min 3
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Format email valid

useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login");
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(response.data.pseudo);
        setEmail(response.data.email);
        if (response.data.profile_photo) setProfilePhoto(`http://localhost:5000${response.data.profile_photo}`);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  }, []);
  
  const handleSave = async () => {
    if (newPassword !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!usernameRegex.test(username)) {
        setError("Username: letters/numbers/underscore, min 3 chars");
        return;
      }
      if (!emailRegex.test(email)) {
        setError("Invalid email");
        return;
      }
      if (newPassword && newPassword.length < 6) {
        setError("Password min 6 chars");
        return;
      }
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login");
    try {
      await axios.put("http://localhost:5000/api/user/update", {
        pseudo: username,
        email,
        password: newPassword
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Profile updated");
      setNewPassword("");
      setRepeatPassword("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  // Remplace handleUpload
const handleUpload = async () => {
  if (!cropper) return alert("Choose and adjust an image first");
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login");
  console.log("Upload attempt with cropped image, token:", token);
  const croppedCanvas = cropper.getCroppedCanvas({
    width: 150, // Taille pour profil
    height: 150
  });
  croppedCanvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("photo", blob, "cropped.jpg");
    try {
      const response = await axios.post("http://localhost:5000/api/user/upload-photo", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      console.log("Upload response:", response.data);
      setProfilePhoto(`http://localhost:5000${response.data.url}`);
      localStorage.setItem("profile_photo", `http://localhost:5000${response.data.url}`);
      setImageSrc(null);
      setSelectedFile(null);
    } catch (err) {
      console.log("Upload error:", err.response?.data || err.message);
      alert("Error uploading photo: " + (err.response?.data?.error || "Server error"));
    }
  }, "image/jpeg");
};
  
  return (
    <>
      <Header />
      <ProfilePage>
      <ProfileContainer>
<ImageContainer>
  <ProfileImage src={profilePhoto} alt="Profile Image" />
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.readAsDataURL(file);
      }
    }}
  />
{imageSrc && (
  <Cropper
    style={{ height: 300, width: 300 }} // Agrandi aperçu
    src={imageSrc}
    viewMode={1} // Restreint au cadre
    aspectRatio={1} // Cercle 1:1
    guides={false} // Pas de grilles
    scalable={true} // Permet zoom
    zoomable={true} // Active zoom explicite
    cropBoxMovable={true} // Permet glisser
    cropBoxResizable={false} // Fixe taille cercle
    dragMode="move" // Mode glisser
    center={true} // Centre image
    minCropBoxWidth={150} // Taille min cercle
    minCropBoxHeight={150} // Taille min cercle
    onInitialized={(instance) => setCropper(instance)}
  />
)}
  <Button onClick={handleUpload} disabled={!imageSrc}>Upload</Button>
</ImageContainer>
  <FormContainer>
    <Title>Profile</Title>
    <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
    <Input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} placeholder="Repeat New Password" />
    {error && <ErrorText>{error}</ErrorText>}
    <SaveButton onClick={handleSave}>Save Changes</SaveButton>
  </FormContainer>
</ProfileContainer>
      </ProfilePage>
      <Footer /> 
    </>
  );
}

export default Profile;