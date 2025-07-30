import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';
import '../styles/ProjectDetail.css';
import projectsData from '../data/projects.json';
import { getAssetPath } from '../utils/paths.js';


const ProjectDetail = () => {
  const { projectId, imgId } = useParams(); // Get project ID and image index from the URL
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRef = useRef(null);
  const infoContainerRef = useRef(null);

  // Find the current project based on projectId
  const project = projectsData.find((p) => p.id === projectId);

  useEffect(() => {
    // Update the currentIndex whenever the URL or imgId changes
    if (project && imgId !== undefined) {
      const index = parseInt(imgId, 10);
      if (!isNaN(index) && index >= 0 && index <= project.images.length) {
        setCurrentIndex(index);
      }
    }
  }, [imgId, project]);

  // New effect to adjust info container width based on image width
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && infoContainerRef.current) {
        const img = imageRef.current;
        const infoContainer = infoContainerRef.current;
        
        // Get image and container dimensions
        const imgRect = img.getBoundingClientRect();
        
        // If window width is larger than a threshold (e.g., 1200px)
        if (window.innerWidth > 1200) {
          // Set the info container width to match the image width
          infoContainer.style.width = `${imgRect.width}px`;
        } else {
          // Reset to default for smaller screens
          infoContainer.style.width = '90%';
        }
      }
    };
    
    // Run on mount and when image loads
    window.addEventListener('resize', handleResize);
    if (imageRef.current) {
      imageRef.current.onload = handleResize;
    }
    
    // Initial call
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentIndex]);

  // If the project doesn't exist, show an error message
  if (!project) {
    return <div className="error-message">Project not found</div>;
  }
  const SPECIAL_HIDDEN_IDS = ['studio-work', 'graduation-photos', 'event-photos'];
  const hasMultipleImages = project.images.length > 1;
  const currentImage = project.images[currentIndex - 1];

  let titleLine = null;
  if (!SPECIAL_HIDDEN_IDS.includes(projectId)) {
    if (hasMultipleImages && currentImage?.title) {
      titleLine = `${project.title}, ${currentImage.title}`;
    } else {
      titleLine = project.title;
    }
  }

  // Handle navigation with arrows
  const handlePrevious = () => {
    if (hasMultipleImages) {
      const newIndex = currentIndex - 1;
      if (newIndex === 0) {
        navigate(`/${projectId}/${project.images.length}`);
      }else{
        navigate(`/${projectId}/${newIndex}`);
      }
    }
  };

  const handleNext = () => {
    if (hasMultipleImages) {
      const newIndex = currentIndex + 1;
      if (newIndex === project.images.length + 1) {
        navigate(`/${projectId}/1`);
      }else{
        navigate(`/${projectId}/${newIndex}`);
      }
    }
  };

  const navigateToThumbnails = () => {
    navigate(`/${projectId}/thumbnail`);
  };

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
                src={getAssetPath(currentImage?.full)}
                alt={`${project.title} - Image ${currentIndex + 1}`}
                className="project-image"
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
                <p className="medium">{currentImage?.media}</p>
                {currentImage?.dimension && ( <p className="dimensions">{currentImage.dimension}</p>)}
                <p className="year">{currentImage?.year}</p>
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