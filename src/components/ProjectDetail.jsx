import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';
import '../styles/ProjectDetail.css';
import { supabase } from '../supabaseClient';

const ProjectDetail = () => {
  const { slug, id } = useParams(); 
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const mobileScrollRef = useRef(null); 
  const imageRef = useRef(null);        
  const infoContainerRef = useRef(null);

  // --- LOOP LOGIC REFS ---
  const touchStartX = useRef(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: projData, error: projError } = await supabase
          .from('projects')
          .select('id, name, path')
          .eq('path', slug)
          .single();

        if (projError || !projData) throw new Error("Project not found");
        setProject(projData);

        const { data: artData, error: artError } = await supabase
          .from('artworks')
          .select('*')
          .eq('project_id', projData.id)
          .order('display_order', { ascending: true });

        if (artError) throw artError;
        setArtworks(artData);

        if (id) {
            const foundIndex = artData.findIndex(a => a.display_order.toString() === id);
            if (foundIndex !== -1) {
                setActiveIndex(foundIndex);
                // Instant Jump on Load
                if (mobileScrollRef.current) {
                     setTimeout(() => {
                        mobileScrollRef.current.scrollTo({
                            left: foundIndex * mobileScrollRef.current.clientWidth,
                            behavior: 'auto' 
                        });
                     }, 0);
                }
            }
        }

      } catch (err) {
        console.error("Error loading detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  // --- 2. SYNC SCROLL & LOOP DETECTION ---
  const handleMobileScroll = () => {
      if (mobileScrollRef.current) {
          const scrollLeft = mobileScrollRef.current.scrollLeft;
          const width = mobileScrollRef.current.clientWidth;
          const newIndex = Math.round(scrollLeft / width);
          
          if (newIndex >= 0 && newIndex < artworks.length && newIndex !== activeIndex) {
              setActiveIndex(newIndex);
          }
      }
  };

  // --- 3. GESTURE HANDLERS FOR LOOPING ---
  const onTouchStart = (e) => {
      touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
      if (!touchStartX.current) return;
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;
      const threshold = 50; // Minimum swipe distance

      // 1. Loop Next: If at last image and swipe Left
      if (activeIndex === artworks.length - 1 && diff > threshold) {
          if (mobileScrollRef.current) {
              // Scroll back to start
              mobileScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          }
      }

      // 2. Loop Prev: If at first image and swipe Right
      if (activeIndex === 0 && diff < -threshold) {
          if (mobileScrollRef.current) {
              // Scroll to end
              const width = mobileScrollRef.current.clientWidth;
              mobileScrollRef.current.scrollTo({ 
                  left: (artworks.length - 1) * width, 
                  behavior: 'smooth' 
              });
          }
      }
      
      touchStartX.current = null;
  };

  // --- 4. DESKTOP RESIZE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && infoContainerRef.current) {
        const imgRect = imageRef.current.getBoundingClientRect();
        if (imgRect.width > 0) {
            infoContainerRef.current.style.width = `${imgRect.width}px`;
        }
      }
    };
    window.addEventListener('resize', handleResize);
    if (imageRef.current) {
        imageRef.current.onload = handleResize;
        if (imageRef.current.complete) handleResize();
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, artworks]); 

  // --- RENDER ---
  if (loading) return <div className="projectpage"><Navbar /></div>;
  if (!project || artworks.length === 0) return null;

  const currentImage = artworks[activeIndex] || artworks[0]; 
  const SPECIAL_HIDDEN_IDS = ['studio-work', 'graduation-photos', 'event-photos'];
  let titleLine = project.name;
  if (!SPECIAL_HIDDEN_IDS.includes(slug) && currentImage?.title) {
      titleLine = `${project.name}, ${currentImage.title}`;
  }

  // Desktop Handlers
  const handleNext = () => {
    const next = (activeIndex + 1) % artworks.length;
    setActiveIndex(next);
    navigate(`/${slug}/detail/${artworks[next].display_order}`);
  };
  const handlePrev = () => {
    const prev = (activeIndex - 1 + artworks.length) % artworks.length;
    setActiveIndex(prev);
    navigate(`/${slug}/detail/${artworks[prev].display_order}`);
  };

  return (
    <div className="projectpage">
        <Navbar />
        <div className="projectpage-main">
            
            {/* MOBILE FILM STRIP */}
            <div 
                className="mobile-film-strip" 
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                onTouchStart={onTouchStart} // ADDED LOOP HANDLER
                onTouchEnd={onTouchEnd}     // ADDED LOOP HANDLER
            >
                {artworks.map((art) => (
                    <div key={art.id} className="mobile-image-wrapper">
                        <img 
                            src={art.image_url} 
                            alt={art.title} 
                            className="mobile-project-image"
                            draggable="false"
                        />
                    </div>
                ))}
            </div>

            {/* DESKTOP VIEW */}
            <div className="desktop-image-container">
                {artworks.length > 1 && (
                    <button className="nav-arrow left-arrow" onClick={handlePrev}>&lt;</button>
                )}
                <img
                    ref={imageRef}
                    src={currentImage.image_url}
                    alt={currentImage.title}
                    className="project-image" 
                />
                {artworks.length > 1 && (
                    <button className="nav-arrow right-arrow" onClick={handleNext}>&gt;</button>
                )}
            </div>

            {/* INFO SECTION */}
            <div className="project-info-container" ref={infoContainerRef}>
                <div className="image-details">
                    <p className="name">{titleLine}</p>
                    
                    {(currentImage.medium || currentImage.material) && (
                        <p className="medium" style={{ whiteSpace: 'pre-wrap' }}>
                            {currentImage.medium || currentImage.material}
                        </p>
                    )}
                    
                    {(currentImage.size || currentImage.dimensions) && (
                        <p className="dimensions">{currentImage.size || currentImage.dimensions}</p>
                    )}
                    
                    <p className="year">{currentImage.year}</p>
                </div>
                
                <div className="thumbnail-link-container">
                    <button className="thumbnail-link" onClick={() => navigate(`/${slug}/thumbnail`)}>
                        SHOW THUMBNAILS
                    </button>
                </div>
            </div>

        </div>
        <CopyrightBar color="black" />
    </div>
  );
};

export default ProjectDetail;