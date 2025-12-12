import React from 'react';

export default function TestImage() {
  // Test avec require
  const logo = require('../assets/icons/png/MangaVerselogoBlanc.png');
  return (
    <div>
      <h2>Test import image avec require</h2>
      <img src={logo} alt="logo" />
      <img src="/MangaVerselogoBlanc.png" alt="logo public" />
    </div>
  );
}