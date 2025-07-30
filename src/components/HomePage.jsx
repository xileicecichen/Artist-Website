import React from 'react';
import '../styles/Home.css';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';


export default function HomePage() {

  return (
    <div className="homepage">
      {/* Main background image fills viewport */}
      <img
        className="mainImage"
        src="/images/home-page/home-page.webp"
        alt="Ceci Chen Artwork"
        draggable={false}
      />

      <Navbar />

      <CopyrightBar color="white" />
    </div>
  );
}