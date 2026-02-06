import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';
import '../styles/ProjectDetail.css';
import { supabase } from '../supabaseClient';

const ProjectDetail = () => {
  const { slug, order } = useParams(); 
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const imageRef = useRef(null);
  const infoContainerRef = useRef(null);

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

      } catch (err) {
        console.error("Error loading detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);


  // --- 2. RESIZE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && infoContainerRef.current) {
        const img = imageRef.current;
        const infoContainer = infoContainerRef.current;
        
        // This ensures the info box matches the VISUAL width of the image
        const imgRect = img.getBoundingClientRect();
        
        if (window.innerWidth > 1200) {
          infoContainer.style.width = `${imgRect.width}px`;
        } else {
          infoContainer.style.width = '90%';
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    if (imageRef.current) {
        if (imageRef.current.complete) handleResize();
        imageRef.current.onload = handleResize;
    }
    
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [loading, order, artworks]); // Re-run when image changes


  // --- 3. RENDER GUARDS ---
  if (loading) {
      return (
        <div className="projectpage">
            <Navbar />
            <div className="projectpage-main" style={{color:'white', paddingTop:'100px'}}>
                Loading...
            </div>
            <CopyrightBar color="black" />
        </div>
      );
  }

  if (!project || artworks.length === 0) {
    return <div className="error-message">Project not found</div>;
  }

  const currentOrder = parseInt(order, 10);
  const currentIndex = artworks.findIndex(a => a.display_order === currentOrder);
  const currentImage = artworks[currentIndex];

  if (!currentImage) {
      return <div className="error-message">Image not found</div>;
  }


  // --- 4. DISPLAY LOGIC ---
  const SPECIAL_HIDDEN_IDS = ['studio-work', 'graduation-photos', 'event-photos'];
  const hasMultipleImages = artworks.length > 1;

  let titleLine = null;

  // Only calculate title if not in the hidden list
  if (!SPECIAL_HIDDEN_IDS.includes(slug)) {
      // NEW LOGIC: Always add the title if it exists, regardless of how many images there are
      if (currentImage.title) {
          titleLine = `${project.name}, ${currentImage.title}`;
      } else {
          titleLine = project.name;
      }
  }


  // --- 5. NAVIGATION ---
  const handlePrevious = () => {
    if (hasMultipleImages) {
      if (currentIndex === 0) {
        const lastOrder = artworks[artworks.length - 1].display_order;
        navigate(`/${slug}/detail/${lastOrder}`);
      } else {
        const prevOrder = artworks[currentIndex - 1].display_order;
        navigate(`/${slug}/detail/${prevOrder}`);
      }
    }
  };

  const handleNext = () => {
    if (hasMultipleImages) {
      if (currentIndex === artworks.length - 1) {
        const firstOrder = artworks[0].display_order;
        navigate(`/${slug}/detail/${firstOrder}`);
      } else {
        const nextOrder = artworks[currentIndex + 1].display_order;
        navigate(`/${slug}/detail/${nextOrder}`);
      }
    }
  };

  const navigateToThumbnails = () => {
    navigate(`/${slug}/thumbnail`);
  };


  // --- 6. RENDER ---
  return (
    <div className="projectpage">
        <Navbar />
        <div className="projectpage-main">
            <div className="image-container">
            {hasMultipleImages && (
                <button
                className="nav-arrow left-arrow"
                onClick={handlePrevious}
                aria-label="Previous image"
                >
                &lt;
                </button>
            )}
            
            <img
                ref={imageRef}
                src={currentImage.image_url}
                alt={`${project.name} - ${currentImage.title || ''}`}
                className="project-image"
                // --- THE FIX ---
                // We limit the image to 100% of the parent container's height/width
                // 'objectFit: contain' ensures the aspect ratio is preserved
                style={{ 
                    maxHeight: '100%', 
                    maxWidth: '100%', 
                    width: 'auto', 
                    height: 'auto',
                    objectFit: 'contain'
                }} 
            />

            {hasMultipleImages && (
                <button
                className="nav-arrow right-arrow"
                onClick={handleNext}
                aria-label="Next image"
                >
                &gt;
                </button>
            )}
            </div>

            <div className="project-info-container" ref={infoContainerRef}>
                <div className="image-details">
                    {titleLine && <p className="name">{titleLine}</p>}
                    
                    <p className="medium" style={{ whiteSpace: 'pre-wrap' }}>
                        {currentImage.material}
                    </p>
                    
                    {currentImage.size && ( <p className="dimensions">{currentImage.size}</p>)}
                    
                    <p className="year">{currentImage.year}</p>
                </div>
                
                <div className="thumbnail-link-container">
                    <button className="thumbnail-link" onClick={navigateToThumbnails}>
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