import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';
import '../styles/ProjectThumbnail.css'; 

// HELPER: Requests a smaller version of the image from Supabase
// This speeds up loading dramatically by not downloading full-resolution files
const getOptimizedUrl = (url) => {
    if (!url) return null;
    // If it's a Supabase Storage URL, append width parameter
    if (url.includes('supabase.co')) {
        return `${url}?width=400&resize=contain`; 
    }
    return url;
};

export default function ProjectThumbnailPage() {
    const { slug } = useParams();
    const location = useLocation();
    
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
                    // --- MODE A: ARCHIVE ---
                    // OPTIMIZATION: Select specific columns only. 
                    // Instead of '*', we only ask for what we need.
                    const { data: projects, error } = await supabase
                        .from('projects')
                        .select(`id, name, path, artworks (image_url, display_order)`)
                        .eq('is_active', false)
                        .order('display_order', { ascending: true });

                    if (error) throw error;

                    const filteredProjects = projects.filter(p => {
                        const name = p.name ? p.name.toLowerCase() : '';
                        return !name.includes('event') && !name.includes('graduation');
                    });

                    setItems(filteredProjects.map(p => ({
                        id: p.id,
                        linkUrl: `/${p.path}/thumbnail`,
                        // Use helper to get smaller image
                        imageUrl: getOptimizedUrl(
                            p.artworks?.sort((a,b)=>a.display_order-b.display_order)[0]?.image_url
                        ),
                        title: p.name
                    })));

                } else {
                    // --- MODE B: SINGLE PROJECT ---
                    
                    const { data: projectData, error: projError } = await supabase
                        .from('projects')
                        .select('id, name') // Fetch only ID and Name
                        .eq('path', slug)
                        .single();

                    if (projError || !projectData) {
                        setNotFound(true);
                        setLoading(false);
                        return;
                    }

                    const { data: artworks, error: artError } = await supabase
                        .from('artworks')
                        .select('id, display_order, image_url, title') // Fetch only needed columns
                        .eq('project_id', projectData.id)
                        .order('display_order', { ascending: true });

                    if (artError) throw artError;

                    setItems(artworks.map(art => ({
                        id: art.id,
                        linkUrl: `/${slug}/detail/${art.display_order}`,
                        imageUrl: getOptimizedUrl(art.image_url),
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
                    {/* Visual improvement: Simple text loader */}
                    <div style={{color: '#888', padding: '40px', fontSize: '12px'}}>
                        LOADING...
                    </div>
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
                                    loading="lazy"    // <--- 1. Lazy Load (Crucial!)
                                    decoding="async"  // <--- 2. Decode off main thread
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