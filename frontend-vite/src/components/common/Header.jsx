import React, { useState, useEffect, useRef } from "react";
import styled, { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { NavLink as RouterNavLink } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import RegisterPopup from "./RegisterPopup";
import logoSrc from "~/assets/icons/png/MangaVerselogoBlanc.png";
import searchIconSrc from "~/assets/icons/png/loupeWhite.png";
import arrowIconSrc from "~/assets/icons/png/flecheBlancDroit.png";
import userIconSrc from "~/assets/icons/png/usersWhite.png";
import ContactPopup from "./ContactPopup";
import { useNavigate } from "react-router-dom"; // Importe useNavigate pour rediriger vers une page au clic
import axios from "axios"; // Ajoute pour fetchUserPhoto

// Configuration pour filtrer les props non-DOM
const shouldForwardProp = (prop) => isPropValid(prop) && !prop.startsWith("$");

const HeaderContainer = styled.header`
  font-family: "Montserrat", sans-serif;
  padding: 10px 20px;
  background-color: #101726;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoAndNav = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.img`
  height: 60px;
  margin-right: 20px;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 20px;
  margin-right: 20px;
`;

const NavLink = styled(RouterNavLink)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const ContactButton = styled.button`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const LoginButton = styled.button`
  border-radius: 20px;
  background-color: #518cc7;
  border: none;
  padding: 5px 15px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;

  &:hover {
    opacity: 0.8;
  }
`;

const ArrowIcon = styled.img`
  width: 20px;
  margin-left: 5px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  color: #ffffff;
  opacity: 0.5;
  font-family: "Lora", serif;
  font-size: 14px;
  width: 80%;
  outline: none;

  &::placeholder {
    color: #ffffff;
    opacity: 0.5;
  }
`;

const SearchBar = styled.div`
  border-radius: 20px;
  background-color: #1b2335;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  width: 250px;
`;

const SearchIcon = styled.img`
  width: 20px;
  opacity: 0.5;
  margin-right: 10px;
`;

// Bouton blanc pour l'utilisateur connecté avec icône circulaire et pseudo
const UserButton = styled.button`
  border-radius: 20px;
  background-color: #2F3B55;
  border: none;
  padding: 5px 15px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;

  &:hover {
    opacity: 0.8;
  }
`;

// Icône utilisateur circulaire
// Remplace UserIcon
const UserIcon = styled.img`
  width: 24px; // Fixe largeur
  height: 24px; // Fixe hauteur égale pour cercle
  border-radius: 50%; // Cercle
  object-fit: cover; // Remplit le cercle sans déformer
  margin-right: 8px;
`;

// Menu burger qui s'affiche au clic sur UserButton
const BurgerMenu = styled.div`
  position: absolute;
  top: 70px; /* Sous le header */
  right: 20px; /* Aligné à droite */
  background-color: #2f394f; /* Fond comme les popups */
  border-radius: 10px;
  padding: 15px; /* Espace interne */
  display: ${(props) => (props.$isOpen ? "flex" : "none")}; /* Contrôle l'affichage */
  flex-direction: column;
  gap: 12px; /* Espace entre les options */
  z-index: 1000; /* Au-dessus des autres éléments */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Ombre subtile */
  opacity: ${(props) => (props.$isOpen ? 1 : 0)}; /* Opacité pour animation */
  transform: ${(props) => (props.$isOpen ? "translateY(0)" : "translateY(-10px)")}; /* Glissement */
  transition: opacity 0.3s ease, transform 0.3s ease; /* Transition fluide */
`;

const MenuOption = styled.button`
  background: none;
  border: none;
  font-family: "Lora", serif;
  color: ${(props) => (props.$isLogout ? "#ff0000" : "white")};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  padding: 8px 12px; /* Ajouté pour plus d'espace autour du texte */
  border-radius: 5px; /* Coins arrondis pour chaque option */
  width: 140px; /* Largeur fixe pour uniformité */
  
  &:hover {
    background-color: #1b2335; /* Fond sombre au survol, comme SearchBar */
    opacity: 1; /* Annule l'opacité pour clarté */
  }
`;

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // Ajouté pour RegisterPopup
  const [isContactOpen, setIsContactOpen] = useState(false);
  // Récupère le pseudo depuis localStorage pour vérifier si connecté
  const pseudo = localStorage.getItem("pseudo");

  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem("profile_photo") || userIconSrc); // Charge image de localStorage ou default
  // État pour gérer l'ouverture/fermeture du menu burger
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  // Référence pour le conteneur du menu burger
  const burgerRef = useRef(null);
  const navigate = useNavigate(); // Crée une fonction navigate pour changer de page

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false); // Ferme RegisterPopup si ouverte
  };

  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false); // Ferme LoginPopup si ouverte
  };

  const handleContactClick = () => {
    setIsContactOpen(true);
  };

  const handleClosePopup = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false); // Ferme les deux popups
  };

  // Ouvre ou ferme le menu burger
  const handleBurgerClick = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  // Vide localStorage et ferme le menu pour déconnexion
const handleLogout = () => {
  localStorage.removeItem("token"); // Supprime le JWT
  localStorage.removeItem("pseudo"); // Supprime le pseudo
  setIsBurgerOpen(false); // Ferme le menu burger
};

// Remplace tous les useEffect par ceci
useEffect(() => {
  async function fetchUserPhoto() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.profile_photo) {
        console.log("Profile photo fetched:", response.data.profile_photo);
        setProfilePhoto(`http://localhost:5000${response.data.profile_photo}`); // Ajoute URL backend
        localStorage.setItem("profile_photo", `http://localhost:5000${response.data.profile_photo}`);
      }
    } catch (err) {
      console.error("Error fetching user photo:", err);
    }
  }
  fetchUserPhoto();
}, []);

useEffect(() => {
  const handleStorageChange = () => {
    const photo = localStorage.getItem("profile_photo");
    if (photo) setProfilePhoto(photo.startsWith("http") ? photo : `http://localhost:5000${photo}`);
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (burgerRef.current && !burgerRef.current.contains(event.target)) {
      setIsBurgerOpen(false);
    }
  };
  if (isBurgerOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isBurgerOpen]);

return (
  <StyleSheetManager shouldForwardProp={shouldForwardProp}>
    <div> {/* Conteneur pour StyleSheetManager */}
      <HeaderContainer>
        <LogoAndNav>
          <Logo src={logoSrc} alt="Manga Scan Logo" />
          <NavLinks>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/all-mangas">All Mangas</NavLink>
            <ContactButton onClick={handleContactClick}>Contact</ContactButton>
          </NavLinks>
        </LogoAndNav>
        <RightSection>
          <SearchBar>
            <SearchIcon src={searchIconSrc} alt="Search Icon" />
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manga..."
            />
          </SearchBar>
          {pseudo ? (
            <UserButton onClick={handleBurgerClick}>
              <UserIcon src={profilePhoto} alt="User Icon" />
              {pseudo}
            </UserButton>
          ) : (
            <LoginButton onClick={handleLoginClick}>
              Login
              <ArrowIcon src={arrowIconSrc} alt="Arrow Right" />
            </LoginButton>
          )}
        </RightSection>
      </HeaderContainer>
      <BurgerMenu $isOpen={isBurgerOpen} ref={burgerRef}>
        <div>
        <MenuOption onClick={() => navigate("/profile")}>Profile</MenuOption>
        <MenuOption onClick={() => navigate("/favorites")}>Favourites</MenuOption>
        <MenuOption onClick={() => navigate("/bookmarks")}>Bookmarks</MenuOption>
          <MenuOption $isLogout onClick={handleLogout}>Logout</MenuOption>
        </div>
      </BurgerMenu>
      {isLoginOpen && <LoginPopup onClose={handleClosePopup} onRegisterClick={handleRegisterClick} />}
      {isRegisterOpen && <RegisterPopup onClose={handleClosePopup} onLoginClick={handleLoginClick} />}
      {isContactOpen && <ContactPopup onClose={() => setIsContactOpen(false)} />}
    </div>
  </StyleSheetManager>
);
}

export default Header;