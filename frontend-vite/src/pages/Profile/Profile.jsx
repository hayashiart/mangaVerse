import React, { useState, useEffect } from "react"; // Importe React, useState pour états, useEffect pour charger données utilisateur
import styled from "styled-components"; // Importe styled pour styles CSS
import axios from "axios"; // Importe axios pour appels API
import Header from "../../components/common/Header"; // Importe Header
import Footer from "../../components/common/Footer"; // Importe Footer
import userIconSrc from "~/assets/icons/png/usersWhite.png"; // Image default pour profil
import Cropper from "react-cropper";
import Cookies from "js-cookie";

const ProfilePage = styled.div`
  background-color: #252F45;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  margin: 0;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  width: 100%;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const Title = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
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
  width: 300px;
  margin-bottom: 15px;
  outline: none;

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 10px;
    font-size: 12px;
  }
`;

const SaveButton = styled.button`
  background-color: #518CC7;
  border-radius: 10px;
  border: none;
  padding: 10px 15px;
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  cursor: pointer;
  width: 320px;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 10px;
    font-size: 14px;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
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
  }
`;

const Button = styled.button`
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

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 10px;
    font-size: 12px;
  }
`;

function Profile() {
  const [username, setUsername] = useState(""); // État pour username
  const [email, setEmail] = useState(""); // État pour email
  const [newPassword, setNewPassword] = useState(""); // État pour nouveau password
  const [repeatPassword, setRepeatPassword] = useState(""); // État pour répétition
  const [profilePhoto, setProfilePhoto] = useState(userIconSrc); // État pour URL image
  const [selectedFile, setSelectedFile] = useState(null); // État pour le fichier choisi
  const [error, setError] = useState(""); // Pour erreurs

  const [imageSrc, setImageSrc] = useState(null); // Source pour Cropper
  const [cropper, setCropper] = useState(null); // Référence Cropper

  const usernameRegex = /^[A-Za-z0-9_]{3,}$/; // Letters, numbers, underscore, min 3
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Format email valid

  useEffect(() => {
    async function fetchUser() {
      const token = Cookies.get("session_token");
      if (!token) return alert("Please login");
      try {
        const response = await axios.get("https://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(response.data.pseudo);
        setEmail(response.data.email);
        if (response.data.profile_photo) setProfilePhoto(`https://localhost:5000${response.data.profile_photo}`);
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
    const token = Cookies.get("session_token");
    if (!token) return alert("Please login");
    try {
      await axios.put("https://localhost:5000/api/user/update", {
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

  const handleUpload = async () => {
    if (!cropper) return alert("Choose and adjust an image first");
    const token = Cookies.get("session_token");
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
        const response = await axios.post("https://localhost:5000/api/user/upload-photo", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
        console.log("Upload response:", response.data);
        setProfilePhoto(`https://localhost:5000${response.data.url}`);
        localStorage.setItem("profile_photo", `https://localhost:5000${response.data.url}`);
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
      <ProfilePage aria-label="Profile page"> {/* WCAG: Ajouté aria-label pour accessibilité */}
        <ProfileContainer>
          <ImageContainer>
            <ProfileImage src={profilePhoto} alt="User profile photo" /> {/* WCAG: Ajouté alt pour accessibilité */}
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
              aria-label="Upload profile photo" // WCAG: Ajouté aria-label pour accessibilité
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
                aria-label="Crop profile photo" // WCAG: Ajouté aria-label pour accessibilité
              />
            )}
            <Button
              onClick={handleUpload}
              disabled={!imageSrc}
              aria-label="Upload cropped photo" // WCAG: Ajouté aria-label pour accessibilité
            >
              Upload
            </Button>
          </ImageContainer>
          <FormContainer>
            <Title>Profile</Title>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              aria-label="Username input" // WCAG: Ajouté aria-label pour accessibilité
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              aria-label="Email input" // WCAG: Ajouté aria-label pour accessibilité
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              aria-label="New password input" // WCAG: Ajouté aria-label pour accessibilité
            />
            <Input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="Repeat New Password"
              aria-label="Repeat password input" // WCAG: Ajouté aria-label pour accessibilité
            />
            {error && <ErrorText role="alert">{error}</ErrorText>} {/* WCAG: Ajouté role="alert" pour accessibilité */}
            <SaveButton
              onClick={handleSave}
              aria-label="Save profile changes" // WCAG: Ajouté aria-label pour accessibilité
            >
              Save Changes
            </SaveButton>
          </FormContainer>
        </ProfileContainer>
      </ProfilePage>
      <Footer />
    </>
  );
}

export default Profile;