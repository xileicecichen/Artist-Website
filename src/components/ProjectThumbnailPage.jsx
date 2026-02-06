import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';
import '../styles/ProjectThumbnail.css'; 

export default function ProjectThumbnailPage() {
    const { slug } = useParams();
    const location = useLocation();
    
    // Check if we are viewing the "Archive" page or a "Single Project" page
    const isArchive = location.pathname === '/archive/thumbnail';

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setNotFound(false);

            try {
                if (isArchive) {
                    // --- MODE A: ARCHIVE (Show inactive projects) ---
                    const { data: projects, error } = await supabase
                        .from('projects')
                        .select(`*, artworks (image_url, display_order)`)
                        .eq('is_active', false)
                        .order('display_order', { ascending: true });

                    if (error) throw error;

                    // Map projects to the format your layout expects
                    setItems(projects.map(p => ({
                        id: p.id,
                        // Link to that project's thumbnail page
                        linkUrl: `/${p.path}/thumbnail`,
                        // Use the first artwork as the thumbnail
                        imageUrl: p.artworks?.sort((a,b)=>a.display_order-b.display_order)[0]?.image_url,
                        title: p.name
                    })));

                } else {
                    // --- MODE B: SINGLE PROJECT (Show artworks for 'slug') ---
                    
                    // 1. Find the project ID
                    const { data: projectData, error: projError } = await supabase
                        .from('projects')
                        .select('id, name')
                        .eq('path', slug)
                        .single();

                    if (projError || !projectData) {
                        setNotFound(true);
                        setLoading(false);
                        return;
                    }

                    // 2. Fetch artworks
                    const { data: artworks, error: artError } = await supabase
                        .from('artworks')
                        .select('*')
                        .eq('project_id', projectData.id)
                        .order('display_order', { ascending: true });

                    if (artError) throw artError;

                    // Map artworks to the format your layout expects
                    setItems(artworks.map(art => ({
                        id: art.id,
                        // Link to the Detail page for this specific image
                        linkUrl: `/${slug}/detail/${art.display_order}`,
                        imageUrl: art.image_url,
                        title: art.title || projectData.name
                    })));
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, isArchive]);

    // --- RENDER (Strictly following your Original Layout) ---

    if (notFound) {
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

    if (loading) {
        return (
            <div className="thumbnailpage">
                <Navbar />
                <div className="thumbnailpage-main">
                    {/* Optional: Add a loading spinner here if you want */}
                    <div style={{color: 'white', padding: '20px'}}>Loading...</div>
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
                    {items.map(item => (
                        <Link 
                            to={item.linkUrl} 
                            key={item.id} 
                            className="thumbnail-item"
                        >
                            <div className="thumbnail-container">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
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