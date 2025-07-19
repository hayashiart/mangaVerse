import React from "react";
import styled from "styled-components";
import logoSrc from "~/assets/icons/png/MangaVerselogoBlanc.png"; // Changé à MangaVerselogoBlanc.png
import tiktokSrc from "~/assets/icons/png/tiktok.png";
import youtubeSrc from "~/assets/icons/png/youtube.png";
import facebookSrc from "~/assets/icons/png/facebook.png";
import instagramSrc from "~/assets/icons/png/instagram.png";

const FooterContainer = styled.footer`
  background-color: #101726;
  padding: 40px; /* Changé de 20px à 40px pour plus de hauteur */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 40px;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Logo = styled.img`
  width: auto;
  height: 120px; /* Changé de 60px à 120px pour agrandir */
  margin-bottom: 10px;
`;

const Copyright = styled.p`
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end; /* Place les icônes en bas */
  gap: 15px;
  align-items: flex-end; /* Aligné à droite */
`;

const SocialIcon = styled.img`
  width: auto;
  height: 30px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <LeftSection>
        <Logo src={logoSrc} alt="MangaVerse Logo" />
        <Copyright>©2025 MangaVerse.com</Copyright>
      </LeftSection>
      <RightSection>
        <SocialIcon src={tiktokSrc} alt="TikTok" />
        <SocialIcon src={facebookSrc} alt="Facebook" />
        <SocialIcon src={instagramSrc} alt="Instagram" />
      </RightSection>
    </FooterContainer>
  );
}

export default Footer;