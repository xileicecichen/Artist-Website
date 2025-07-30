import React from 'react';
import { useParams, Link } from 'react-router-dom';
import projects from '../data/projects.json'; // Assuming a local JSON file
import '../styles/ProjectThumbnail.css';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';

export default function ProjectThumbnail() {
    const { projectId } = useParams();
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        return (
            <div className="thumbnailpage">
                <Navbar />
                <div className="thumbnailpage-main">
                    <h2 className="error-message">Project not found</h2>
                </div>
                <CopyrightBar />
            </div>
        );
    }

    return (
        <div className="thumbnailpage">
            <Navbar />
            <div className="thumbnailpage-main">
                <div className="thumbnail-grid">
                    {project.images.map(image => (
                        <Link 
                            to={`/${projectId}/${image.id}`} 
                            key={image.id} 
                            className="thumbnail-item"
                        >
                            <div className="thumbnail-container">
                                <img
                                    src={image.thumb}
                                    alt={image.title || `Thumbnail for ${project.title}`}
                                    className="thumbnail-image"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <CopyrightBar />
        </div>
    );
}