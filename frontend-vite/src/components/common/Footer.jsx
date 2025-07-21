import React from "react";
import styled from "styled-components";
import logoSrc from "~/assets/icons/png/MangaVerselogoBlanc.png";
import tiktokSrc from "~/assets/icons/png/tiktok.png";
import youtubeSrc from "~/assets/icons/png/youtube.png";
import facebookSrc from "~/assets/icons/png/facebook.png";
import instagramSrc from "~/assets/icons/png/instagram.png";

const FooterContainer = styled.footer`
  background-color: #101726;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 40px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 30px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    margin-bottom: 20px;
  }
`;

const Logo = styled.img`
  width: auto;
  height: 120px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    height: 90px;
    margin-bottom: 8px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    height: 100px;
  }
`;

const Copyright = styled.p`
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 12px;
    text-align: center;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 13px;
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 15px;
  align-items: flex-end;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 10px;
  }
`;

const SocialIcon = styled.img`
  width: auto;
  height: 30px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    height: 25px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    height: 28px;
  }
`;

function Footer() {
  return (
    <FooterContainer aria-label="Footer section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
      <LeftSection>
        <Logo src={logoSrc} alt="MangaVerse logo" /> {/* WCAG: Ajouté alt pour accessibilité */}
        <Copyright>©2025 MangaVerse.com - All rights reserved</Copyright>
      </LeftSection>
      <RightSection>
        <SocialIcon src={tiktokSrc} alt="MangaVerse TikTok profile" /> {/* WCAG: Ajouté alt pour accessibilité */}
        <SocialIcon src={facebookSrc} alt="MangaVerse Facebook page" /> {/* WCAG: Ajouté alt pour accessibilité */}
        <SocialIcon src={instagramSrc} alt="MangaVerse Instagram profile" /> {/* WCAG: Ajouté alt pour accessibilité */}
      </RightSection>
    </FooterContainer>
  );
}

export default Footer;