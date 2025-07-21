import React, { useState, useEffect, useRef } from "react";
import styled, { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import RegisterPopup from "./RegisterPopup";
import logoSrc from "~/assets/icons/png/MangaVerselogoBlanc.png";
import searchIconSrc from "~/assets/icons/png/loupeWhite.png";
import arrowIconSrc from "~/assets/icons/png/flecheBlancDroit.png";
import userIconSrc from "~/assets/icons/png/usersWhite.png";
import ContactPopup from "./ContactPopup";
import axios from "axios";
import Cookies from "js-cookie";

// Configuration pour filtrer les props non-DOM
const shouldForwardProp = (prop) => isPropValid(prop) && !prop.startsWith("$");

const BurgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: none;

  @media (max-width: 1200px) {
    display: block;
  }
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 20px;
  margin-right: 20px;

  @media (max-width: 1200px) {
    display: none;
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

  @media (max-width: 1200px) {
    display: none;
  }
`;

const HeaderContainer = styled.header`
  font-family: "Montserrat", sans-serif;
  padding: 10px 20px;
  background-color: #101726;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1200px) {
    padding: 10px;
    height: 80px;
  }
  @media (max-width: 768px) {
    padding: 5px;
    height: 60px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;

  @media (max-width: 1200px) {
    margin-right: 10px;
  }
  @media (max-width: 768px) {
    margin-right: 5px;
  }
`;

const LogoAndNav = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.img`
  height: 60px;
  margin-right: 20px;

  @media (max-width: 1200px) {
    height: 50px;
    margin-right: 15px;
  }
  @media (max-width: 768px) {
    height: 40px;
    margin-right: 10px;
  }
`;

const NavLink = styled(RouterNavLink)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 1200px) {
    font-size: 15px;
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
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

  @media (max-width: 1200px) {
    padding: 4px 12px;
    font-size: 12px;
    margin-left: 8px;
  }
  @media (max-width: 768px) {
    padding: 3px 10px;
    font-size: 10px;
    margin-left: 5px;
  }
`;

const ArrowIcon = styled.img`
  width: 20px;
  margin-left: 5px;

  @media (max-width: 1200px) {
    width: 18px;
    margin-left: 4px;
  }
  @media (max-width: 768px) {
    width: 16px;
    margin-left: 3px;
  }
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

  @media (max-width: 1200px) {
    font-size: 12px;
  }
  @media (max-width: 768px) {
    font-size: 10px;
    display: none;
  }
`;

const SearchBar = styled.div`
  border-radius: 20px;
  background-color: #1b2335;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  width: 250px;

  @media (max-width: 1200px) {
    width: 200px;
    padding: 3px 10px;
  }
  @media (max-width: 768px) {
    width: 150px;
    padding: 2px 8px;
    display: none;
  }
`;

const SearchIcon = styled.img`
  width: 20px;
  opacity: 0.5;
  margin-right: 10px;

  @media (max-width: 1200px) {
    width: 18px;
    margin-right: 8px;
  }
  @media (max-width: 768px) {
    width: 16px;
    margin-right: 5px;
  }
`;

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

  @media (max-width: 1200px) {
    padding: 4px 12px;
    font-size: 12px;
    margin-left: 15px;
  }
  @media (max-width: 768px) {
    padding: 3px 10px;
    font-size: 10px;
    margin-left: 10px;
  }
`;

const UserIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;

  @media (max-width: 1200px) {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
`;

const BurgerMenu = styled.div`
  position: absolute;
  top: 70px;
  right: 20px;
  background-color: #2f394f;
  border-radius: 10px;
  padding: 15px;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transform: ${(props) => (props.$isOpen ? "translateY(0)" : "translateY(-10px)")};
  transition: opacity 0.3s ease, transform 0.3s ease;

  @media (max-width: 1200px) {
    top: 60px;
    right: 15px;
    padding: 10px;
    gap: 10px;
  }
  @media (max-width: 768px) {
    top: 50px;
    right: 10px;
    padding: 8px;
    gap: 8px;
  }
`;

const MenuOption = styled.button`
  background: none;
  border: none;
  font-family: "Lora", serif;
  color: ${(props) => (props.$isLogout ? "#ff0000" : "white")};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 5px;
  width: 140px;

  &:hover {
    background-color: #1b2335;
    opacity: 1;
  }

  @media (max-width: 1200px) {
    font-size: 12px;
    padding: 6px 10px;
    width: 120px;
  }
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 4px 8px;
    width: 100px;
  }
`;

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem("profile_photo") || userIconSrc);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const burgerRef = useRef(null);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const handleContactClick = () => {
    setIsContactOpen(true);
  };

  const handleClosePopup = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const handleBurgerClick = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  const handleLogout = () => {
    Cookies.remove("session_token");
    Cookies.remove("user_pseudo");
    setProfilePhoto(userIconSrc); // Réinitialise la photo de profil
setUserRole(null); // Réinitialise le rôle
    setIsBurgerOpen(false);
  };

  useEffect(() => {
    async function fetchUserPhoto() {
      const token = Cookies.get("session_token");
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.profile_photo) {
          setProfilePhoto(`http://localhost:5000${response.data.profile_photo}`);
          localStorage.setItem("profile_photo", `http://localhost:5000${response.data.profile_photo}`);
        }
      } catch (err) {
        console.error("Error fetching user photo:", err);
      }
    }
    fetchUserPhoto();
  }, []);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const token = Cookies.get("session_token");
        if (!token) return;
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User role response:", response.data.role);
        setUserRole(response.data.role);
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    }
    fetchUserRole();
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

  const isAuthenticated = !!Cookies.get("session_token");
const userPseudo = Cookies.get("user_pseudo") || "";

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <div>
        <HeaderContainer>
          <LogoAndNav>
            <Logo src={logoSrc} alt="MangaVerse logo" />
            <BurgerButton onClick={handleBurgerClick} aria-label="Toggle burger menu">
              ☰
            </BurgerButton>
            <NavLinks>
              <NavLink to="/" aria-label="Navigate to Home">Home</NavLink>
              <NavLink to="/all-mangas" aria-label="Navigate to All Mangas">All Mangas</NavLink>
              <ContactButton onClick={handleContactClick} aria-label="Open contact form">Contact</ContactButton>
            </NavLinks>
          </LogoAndNav>
          <RightSection>
            <SearchBar>
              <SearchIcon src={searchIconSrc} alt="Search icon" />
              <SearchInput
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search manga..."
                aria-label="Search manga input"
              />
            </SearchBar>
            {isAuthenticated ? (
  <UserButton onClick={handleBurgerClick} aria-label="Open user menu">
    <UserIcon src={profilePhoto} alt="User profile photo" />
    {userPseudo}
  </UserButton>
) : (
  <LoginButton onClick={handleLoginClick} aria-label="Open login popup">
    Login
    <ArrowIcon src={arrowIconSrc} alt="Arrow right icon" />
  </LoginButton>
)}
          </RightSection>
        </HeaderContainer>
        <BurgerMenu $isOpen={isBurgerOpen} ref={burgerRef}>
          <MenuOption onClick={() => { navigate("/profile"); setIsBurgerOpen(false); }} aria-label="Navigate to Profile">Profile</MenuOption>
          <MenuOption onClick={() => { navigate("/favorites"); setIsBurgerOpen(false); }} aria-label="Navigate to Favorites">Favourites</MenuOption>
          <MenuOption onClick={() => { navigate("/bookmarks"); setIsBurgerOpen(false); }} aria-label="Navigate to Bookmarks">Bookmarks</MenuOption>
          {userRole === "admin" || userRole === "librarian" ? (
            <MenuOption onClick={() => { navigate("/admin"); setIsBurgerOpen(false); }} aria-label="Navigate to Admin">Admin</MenuOption>
          ) : null}
          <MenuOption $isLogout onClick={() => { handleLogout(); setIsBurgerOpen(false); }} aria-label="Logout">Logout</MenuOption>
        </BurgerMenu>
        {isLoginOpen && <LoginPopup onClose={handleClosePopup} onRegisterClick={handleRegisterClick} />}
        {isRegisterOpen && <RegisterPopup onClose={handleClosePopup} onLoginClick={handleLoginClick} />}
        {isContactOpen && <ContactPopup onClose={() => setIsContactOpen(false)} />}
      </div>
    </StyleSheetManager>
  );
}

export default Header;