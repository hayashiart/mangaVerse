import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import RegisterPopup from "./RegisterPopup";
import ContactPopup from "./ContactPopup";
import axios from "axios";
import Cookies from "js-cookie";
import logoSrc from "~/assets/icons/png/MangaVerselogoBlanc.png";
import searchIconSrc from "~/assets/icons/png/loupeWhite.png";
import userIconSrc from "~/assets/icons/png/usersWhite.png";

// === HEADER PRINCIPAL ===
const HeaderWrapper = styled.header`
  width: 100%;
  background: linear-gradient(135deg, #0f1625 0%, #1a2335 100%);
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 20px 0;
`;

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1200px) {
    padding: 0 25px;
  }
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

// === CÔTÉ GAUCHE ===
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;

  @media (max-width: 1200px) {
    gap: 30px;
  }
`;

const Logo = styled.img`
  height: 85px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.08);
  }

  @media (max-width: 1200px) {
    height: 75px;
  }
  @media (max-width: 768px) {
    height: 65px;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 45px;

  @media (max-width: 1200px) {
    gap: 30px;
  }
  @media (max-width: 1000px) {
    display: none;
  }
`;

const NavLink = styled(RouterNavLink)`
  color: white;
  font-family: "Montserrat", sans-serif;
  font-size: 19px;
  font-weight: 600;
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;

  &:hover,
  &.active {
    color: #70a1ff;
  }

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 3px;
    bottom: -10px;
    left: 50%;
    background: #518cc7;
    transition: all 0.3s ease;
    border-radius: 2px;
  }

  &:hover::after,
  &.active::after {
    width: 100%;
    left: 0;
  }

  @media (max-width: 1200px) {
    font-size: 17px;
  }
`;

// === CÔTÉ DROIT ===
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 1200px) {
    gap: 20px;
  }
`;

// BARRE DE RECHERCHE
const SearchBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 50px;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  min-width: 380px;
  border: 2px solid rgba(81, 140, 199, 0.4);
  transition: all 0.3s ease;

  &:hover {
    border-color: #518cc7;
    box-shadow: 0 0 0 5px rgba(81, 140, 199, 0.25);
  }

  @media (max-width: 1000px) {
    min-width: 300px;
  }
  @media (max-width: 768px) {
    min-width: 250px;
  }
  @media (max-width: 600px) {
    display: none;
  }
`;

const SearchIcon = styled.img`
  width: 26px;
  height: 26px;
  opacity: 0.8;
  margin-right: 15px;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 17px;
  width: 100%;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

// BOUTON USER / LOGIN
const UserButton = styled.button`
  background: linear-gradient(135deg, #2f3b55, #1e2740);
  border: 2px solid #518cc7;
  color: white;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(81, 140, 199, 0.6);
    border-color: #70a1ff;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 15px;
  }
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #518cc7;
  transition: all 0.3s;

  ${UserButton}:hover & {
    transform: scale(1.1);
  }
`;

// BURGER MENU — PLUS VISIBLE ET BIEN POSITIONNÉ
const BurgerMenu = styled.div`
  position: fixed;
  top: 110px; /* PLUS BAS POUR ÊTRE BIEN VISIBLE */
  right: 30px;
  background: #2f3b55;
  border-radius: 18px;
  padding: 28px 25px;
  box-shadow: 0 25px 70px rgba(0,0,0,0.8);
  border: 2px solid #518cc7;
  z-index: 9999; /* AU-DESSUS DE TOUT */
  min-width: 260px;
  opacity: ${(props) => (props.$open ? 1 : 0)};
  visibility: ${(props) => (props.$open ? "visible" : "hidden")};
  transform: translateY(${(props) => (props.$open ? "0" : "-20px")});
  transition: all 0.4s ease;

  @media (max-width: 768px) {
    right: 20px;
    top: 95px;
    padding: 22px 20px;
    min-width: 220px;
  }
`;

const BurgerItem = styled.button`
  display: block;
  width: 100%;
  padding: 16px 22px;
  background: none;
  border: none;
  color: white;
  text-align: left;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(81,140,199,0.4);
    padding-left: 30px;
    color: #70a1ff;
  }

  &.logout {
    color: #ff6b6b;
    margin-top: 20px;
    border-top: 1px solid #444;
    padding-top: 25px;
    font-weight: 600;
  }
`;

function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(userIconSrc);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userPseudo, setUserPseudo] = useState("");
  const navigate = useNavigate();
  const burgerRef = useRef(null);

  const token = Cookies.get("session_token");

  useEffect(() => {
    if (token) {
      axios
        .get("https://localhost:5000/api/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setProfilePhoto(
            `https://localhost:5000${res.data.profile_photo || ""}` || userIconSrc
          );
          setUserRole(res.data.role);
          setUserPseudo(res.data.pseudo || "User");
        })
        .catch(() => {
          setProfilePhoto(userIconSrc);
        });
    }
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("session_token");
    Cookies.remove("user_pseudo");
    setProfilePhoto(userIconSrc);
    setUserRole(null);
    setIsBurgerOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (burgerRef.current && !burgerRef.current.contains(e.target)) {
        setIsBurgerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAuthenticated = !!token;

  return (
    <>
      <HeaderWrapper>
        <Container>
          <LeftSection>
            <Logo src={logoSrc} alt="MangaVerse" />
            <NavLinks>
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/all-mangas">All Mangas</NavLink>
              <NavLink
                to="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  setIsContactOpen(true);
                }}
              >
                Contact
              </NavLink>
            </NavLinks>
          </LeftSection>

          <RightSection>
            <SearchBar>
              <SearchIcon src={searchIconSrc} alt="" />
              <SearchInput placeholder="Search a manga..." />
            </SearchBar>

            {isAuthenticated ? (
              <UserButton onClick={() => setIsBurgerOpen(!isBurgerOpen)}>
                <UserAvatar src={profilePhoto} alt="Profile" />
                {userPseudo}
              </UserButton>
            ) : (
              <UserButton onClick={() => setIsLoginOpen(true)}>
                Login
              </UserButton>
            )}
          </RightSection>
        </Container>
      </HeaderWrapper>

      {/* BURGER MENU — EN ANGLAIS, PLUS VISIBLE */}
      <BurgerMenu $open={isBurgerOpen} ref={burgerRef}>
        <BurgerItem onClick={() => { navigate("/profile"); setIsBurgerOpen(false); }}>
          Profile
        </BurgerItem>
        <BurgerItem onClick={() => { navigate("/favorites"); setIsBurgerOpen(false); }}>
          Favorites
        </BurgerItem>
        <BurgerItem onClick={() => { navigate("/bookmarks"); setIsBurgerOpen(false); }}>
          Bookmarks
        </BurgerItem>
        {(userRole === "admin" || userRole === "librarian") && (
          <BurgerItem onClick={() => { navigate("/admin"); setIsBurgerOpen(false); }}>
            Admin
          </BurgerItem>
        )}
        <BurgerItem className="logout" onClick={handleLogout}>
          Logout
        </BurgerItem>
      </BurgerMenu>

      {isLoginOpen && (
        <LoginPopup
          onClose={() => setIsLoginOpen(false)}
          onRegisterClick={() => {
            setIsRegisterOpen(true);
            setIsLoginOpen(false);
          }}
        />
      )}
      {isRegisterOpen && (
        <RegisterPopup
          onClose={() => setIsRegisterOpen(false)}
          onLoginClick={() => {
            setIsLoginOpen(true);
            setIsRegisterOpen(false);
          }}
        />
      )}
      {isContactOpen && <ContactPopup onClose={() => setIsContactOpen(false)} />}
    </>
  );
}

export default Header;