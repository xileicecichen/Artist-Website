import React from 'react';
import '../styles/Home.css';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';
import { getAssetPath } from '../utils/paths.js';

export default function HomePage() {
  const bgUrl = getAssetPath('/images/home-page/home-page.webp');

  return (
    <>
      {/* LAYER 1: The Background (Floods the screen, ignores notch) */}
      <div 
        className="home-background" 
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      {/* LAYER 2: The Content (Respects the notch, holds Navbar) */}
      <div className="home-content">
        <Navbar />
        <CopyrightBar color="white" />
      </div>
    </>
  );
}