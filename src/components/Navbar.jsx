import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/";

    const handleInstagramClick = () => {
        window.open('https://www.instagram.com/xilei_ceci_chen?igsh=MThuc2R0bHp1NjBoeA%3D%3D&utm_source=qr', '_blank', 'noopener,noreferrer');
    };

    const navbarClass = isHome ? "navbar navbar--white" : "navbar navbar--black";
    const textClass = isHome ? "navbarText navbarText--white" : "navbarText navbarText--black";
    const instaIcon = isHome ? "/images/instagram.svg" : "/images/instagramb.svg";

    const nameSectionClass = isHome
    ? "nameSection" // No hover/click styles
    : "nameSection nameSection--hoverable";

  return (
    <div className={navbarClass}>

        <div
            className={nameSectionClass}
            tabIndex={isHome ? -1 : 0}
            style={isHome ? { cursor: "default" } : { cursor: "pointer" }}
            onClick={isHome ? undefined : () => navigate("/")}
            aria-disabled={isHome ? "true" : undefined}
        >
            <span className={`nameEN ${textClass}`}>XILEI <br /> CECI <br /> CHEN</span>
            <span className={`nameCN ${textClass}`}>陈&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;熙蕾</span>
        </div>

        {isHome && (
            <>
            <div className="projectSection">
                <span className={`title ${textClass}`} onClick={() => navigate('/we-tried-to-hold-it-together/thumbnail')}>WE TRIED TO HOLD IT TOGETHER</span>
                <span className={`title ${textClass}`} onClick={() => navigate('/marry-the-planet/thumbnail')}>MARRY THE PLANET 嫁给星球</span>
                <span className={`title ${textClass}`} onClick={() => navigate('/untitled/thumbnail')}>UNTITLED</span>
                <span className={`title ${textClass}`} onClick={() => navigate('/nowhere-to-hide/thumbnail')}>NOWHERE TO HIDE</span>
                <span className={`title ${textClass}`} onClick={() => navigate('/cemetery-one-month/thumbnail')}>CEMETERY ONE MONTH 墓地一月</span>
                <span className={`title ${textClass}`} onClick={() => navigate('/studio-work/thumbnail')}>STUDIO WORK</span>
            </div>

            <div className="workSection">
                <span className={`title ${textClass}`} onClick={() => navigate('/event-photos/thumbnail')}>EVENT PHOTOS</span>
                <span className={`title ${textClass}`} onClick={() => navigate('/graduation-photos/thumbnail')}>GRADUATION PHOTOS</span>   
            </div>
            </>
        )}

        <div className="naviSection">
            <span className={`title ${textClass}`} onClick={() => navigate('/cv')}>CV</span>
            <span className={`title ${textClass}`} onClick={() => navigate('/statement')}>STATEMENT</span>
            <span className={`title ${textClass}`} onClick={() => navigate('/contact')}>CONTACT</span>
      </div>

      {/* Instagram icon (clickable, bottom left) */}
      <div className="instagramIcon" aria-label="Visit Ceci Instagram" onClick={handleInstagramClick}>
        <img src={instaIcon} alt="Instagram" />
      </div>
    </div>
  );
};

export default Navbar;