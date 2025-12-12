import React, { useState } from "react";
import styled from "styled-components";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import UsersAdmin from "./UsersAdmin";
import Books from "./Books";
import { createGlobalStyle } from "styled-components";

// Ajoute après les imports
const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

const AdminPage = styled.main`
  background-color: #182032;
  min-height: 100vh;           /* CHANGÉ : min-height au lieu de height */
  padding-bottom: 0 100px;        /* AJOUTÉ : espace en bas pour le footer */
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10px;
    padding-bottom: 120px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  width: 100%;
  margin: 40px auto 0;
  flex-grow: 1;
  min-height: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 20px auto;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    margin: 30px auto;
  }
`;

const Sidebar = styled.nav`
  width: 250px;
  background-color: #2f3b55;
  border-radius: 10px;
  padding: 20px;
  margin-right: 20px;
  flex-shrink: 0;
  height: fit-content;
  max-height: 80vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
    padding: 15px;
    max-height: 60vh;
  }
`;

const SidebarTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  color: white;
  font-family: "Lora", serif;
  font-size: 16px;
  text-align: left;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #518cc7;
  }
  ${({ active }) => active && `background-color: #518cc7;`}

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const Content = styled.section`
  flex: 1;
  background-color: #2f3b55;
  border-radius: 10px;
  padding: 20px;
  color: white;
  min-width: 0;

  /* AJOUTE TOUTES CES LIGNES (c’est ce qui manquait) */
  height: calc(100vh - 220px);   /* prend presque toute la hauteur de l’écran */
  min-height: 700px;             /* hauteur minimale fixe, même si peu importe le contenu */
  display: flex;
  flex-direction: column;
  overflow-y: auto;              /* scroll interne si trop de contenu */

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 8px;
    height: auto;
    min-height: 500px;
  }
`;

const StyledHeader = styled(Header)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const StyledFooter = styled(Footer)`
  max-width: 1200px;
  width: 100%;
  margin: 10px auto 0;
  padding-top: 5px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 5px;
    margin: 5px auto;
  }
`;

const shouldForwardProp = (prop) => isPropValid(prop) && !prop.startsWith("$");

function Admin() {
  const [activeSection, setActiveSection] = useState("Users");

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <>
      <GlobalStyle />
      {/* Ajouter meta tags ici avec react-helmet si utilisé :
      <Helmet>
        <title>Admin Panel - MangaVerse</title>
        <meta name="description" content="Manage users, books, and more on the MangaVerse admin panel." />
        <meta name="keywords" content="admin, manga, management, users" />
        <meta name="robots" content="index, follow" />
      </Helmet> */}
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <AdminPage aria-label="Admin management panel"> {/* WCAG: Ajouté aria-label pour accessibilité */}
          <StyledHeader />
          <MainContent>
            <Sidebar aria-label="Admin navigation menu"> {/* WCAG: Ajouté aria-label pour accessibilité */}
              <SidebarTitle>MangaVerse Administration</SidebarTitle>
              <MenuItem active={activeSection === "Users"} onClick={() => handleSectionChange("Users")} aria-label="Navigate to Users section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
                Users
              </MenuItem>
              <MenuItem active={activeSection === "Books"} onClick={() => handleSectionChange("Books")} aria-label="Navigate to Books section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
                Books
              </MenuItem>
              <MenuItem active={activeSection === "Categories"} onClick={() => handleSectionChange("Categories")} aria-label="Navigate to Categories section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
                Categories
              </MenuItem>
              <MenuItem active={activeSection === "Tags"} onClick={() => handleSectionChange("Tags")} aria-label="Navigate to Tags section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
                Tags
              </MenuItem>
              <MenuItem active={activeSection === "Authors"} onClick={() => handleSectionChange("Authors")} aria-label="Navigate to Authors section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
                Authors
              </MenuItem>
              <MenuItem active={activeSection === "Reviews"} onClick={() => handleSectionChange("Reviews")} aria-label="Navigate to Reviews section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
                Reviews
              </MenuItem>
              <MenuItem active={activeSection === "Contacts"} onClick={() => handleSectionChange("Contacts")} aria-label="Navigate to Contacts section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
                Contacts
              </MenuItem>
            </Sidebar>
            <Content>
              {activeSection === "Users" ? (
                <UsersAdmin />
              ) : activeSection === "Books" ? (
                <Books />
              ) : (
                <>
                  <h2>{activeSection} Management</h2>
                  <p>Coming soon...</p>
                </>
              )}
            </Content>
          </MainContent>
          <StyledFooter />
        </AdminPage>
      </StyleSheetManager>
    </>
  );
}

export default Admin;