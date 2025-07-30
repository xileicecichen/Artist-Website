// src/components/CopyrightBar.jsx
import React from 'react';
import '../styles/CopyrightBar.css';

export default function CopyrightBar({ color = "black" }) {
  return (
    <div className={`copyright-bar copyright-bar--${color}`}>
      © {new Date().getFullYear()} XILEI CECI CHEN
    </div>
  );
}