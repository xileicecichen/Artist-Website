import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAssetPath } from '../utils/paths.js';
import { supabase } from '../supabaseClient'; // Make sure this path is correct
import '../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/";

    // State to hold the dynamic projects from Supabase
    const [dbProjects, setDbProjects] = useState([]);

    // Fetch projects on component mount
    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('id, name, path')
                .eq('is_active', true) // Only show active projects in the menu
                .order('display_order', { ascending: true });

            if (error) {
                console.error("Error fetching navbar projects:", error);
            } else {
                setDbProjects(data);
            }
        };

        fetchProjects();
    }, []);

    const handleInstagramClick = () => {
        window.open('https://www.instagram.com/xilei_ceci_chen?igsh=MThuc2R0bHp1NjBoeA%3D%3D&utm_source=qr', '_blank', 'noopener,noreferrer');
    };

    const navbarClass = isHome ? "navbar navbar--white" : "navbar navbar--black";
    const textClass = isHome ? "navbarText navbarText--white" : "navbarText navbarText--black";
    const instaIcon = isHome ? "/images/instagram.svg" : "/images/instagramb.svg";

    const nameSectionClass = isHome
    ? "nameSection" 
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
                {/* Dynamic Projects from Supabase */}
                {dbProjects.map((project) => (
                    <span 
                        key={project.id} 
                        className={`title ${textClass}`} 
                        onClick={() => navigate(`/${project.path}/thumbnail`)}
                    >
                        {project.name}
                    </span>
                ))}
                <span className={`title ${textClass}`} onClick={() => navigate('/archive/thumbnail')}>ARCHIVE WORK</span>
            </div>

            <div className="workSection">
                {/* These remain hardcoded as requested/implied (not in projects table) */}
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

      <div className="instagramIcon" aria-label="Visit Ceci Instagram" onClick={handleInstagramClick}>
        <img src={getAssetPath(instaIcon)} alt="Instagram" />
      </div>
    </div>
  );
};

export default Navbar;