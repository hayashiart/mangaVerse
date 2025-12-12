// src/components/common/Footer.jsx
import React from "react";
import styled from "styled-components";
import logoSrc from "~/assets/icons/png/MangaVerselogoBlanc.png";
import tiktokSrc from "~/assets/icons/png/tiktok.png";
import facebookSrc from "~/assets/icons/png/facebook.png";
import instagramSrc from "~/assets/icons/png/instagram.png";

const FooterWrapper = styled.footer`
  background: #101726;
  padding: 60px 40px 40px;
  margin-top: 0;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 50px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Logo = styled.img`
  height: 90px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 75px;
  }
`;

const Brand = styled.h3`
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  font-family: "Montserrat", sans-serif;
`;

const Tagline = styled.p`
  color: #a0d8ff;
  font-size: 15px;
  margin: 0;
  opacity: 0.9;
`;

const LinksSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 1024px) {
    gap: 30px;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  h4 {
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px 0;
    font-family: "Montserrat", sans-serif;
  }
`;

const FooterLink = styled.p`
  color: #a0d8ff;
  font-size: 15px;
  margin: 10px 0;
  cursor: default;
`;

const SocialSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 25px;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const SocialIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 1px solid rgba(81,140,199,0.2);

  &:hover {
    background: #518cc7;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(81,140,199,0.4);
  }

  img {
    width: 26px;
    height: 26px;
  }
`;

const Copyright = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #2a3550;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <Container>
        <LogoSection>
          <Logo src={logoSrc} alt="MangaVerse Logo" />
          <Brand>MangaVerse</Brand>
          <Tagline>Your ultimate manga platform</Tagline>
        </LogoSection>

        <LinksSection>
          <Column>
            <h4>Navigation</h4>
            <FooterLink>Home</FooterLink>
            <FooterLink>All Mangas</FooterLink>
            <FooterLink>Favorites</FooterLink>
            <FooterLink>Bookmarks</FooterLink>
          </Column>

          <Column>
            <h4>Legal</h4>
            <FooterLink>Terms of Service</FooterLink>
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink>Cookie Policy</FooterLink>
            <FooterLink>Legal Notice</FooterLink>
            <FooterLink>Contact & Support</FooterLink>
          </Column>
        </LinksSection>

        <SocialSection>
          <div>
            <h4 style={{color: "white", margin: "0 0 20px 0", textAlign: "right"}}>Follow us</h4>
            <SocialLinks>
              <SocialIcon>
                <img src={tiktokSrc} alt="TikTok" />
              </SocialIcon>
              <SocialIcon>
                <img src={facebookSrc} alt="Facebook" />
              </SocialIcon>
              <SocialIcon>
                <img src={instagramSrc} alt="Instagram" />
              </SocialIcon>
            </SocialLinks>
          </div>
        </SocialSection>

        <Copyright>
          © 2025 MangaVerse.com - All rights reserved
        </Copyright>
      </Container>
    </FooterWrapper>
  );
}