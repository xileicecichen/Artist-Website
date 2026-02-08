import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';
import '../styles/SubPage.css';

export default function CVPage() {
  const [categories, setCategories] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: catData, error: catError } = await supabase
          .from('cv_categories')
          .select(`*, cv_items (id, year_range, content, display_order)`)
          .order('display_order', { ascending: true });

        if (catError) throw catError;

        const sortedData = catData.map(cat => ({
          ...cat,
          cv_items: cat.cv_items.sort((a, b) => a.display_order - b.display_order)
        }));
        setCategories(sortedData);

        const { data: fileData } = supabase
          .storage
          .from('documents')
          .getPublicUrl('Xilei Ceci Chen Resume.pdf'); 
        
        if (fileData) {
            const uniqueUrl = `${fileData.publicUrl}?t=${new Date().getTime()}`;
            setResumeUrl(uniqueUrl);
        }

      } catch (err) {
        console.error("Error fetching CV:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="subpage">
            <Navbar />
            <div className="subpage-main">Loading...</div>
            <CopyrightBar />
        </div>
    );
  }

  return (
    <div className="subpage">
        <Navbar />

        <div className='subpage-main'>
            {categories.map((cat) => (
                // WRAPPER DIV: This controls the spacing between sections
                <div key={cat.id} className="cv-category-block">
                    
                    {/* TITLE */}
                    <div className='cvpage-title'>{cat.title}</div>

                    {/* CONTENT */}
                    <div className='cvpage-text'>
                        {cat.cv_items.map((item) => (
                            <div key={item.id} style={{ marginBottom: '6px' }}>
                                {cat.title === 'BIO' ? (
                                    <span>{item.content}</span>
                                ) : (
                                    <span>
                                        {item.year_range && <span style={{marginRight:'15px'}}>{item.year_range}</span>}
                                        <span dangerouslySetInnerHTML={{ __html: item.content }} />
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* DOWNLOAD RESUME */}
            {resumeUrl && (
                <div className="cv-category-block">
                    <div className='cvpage-title'>
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer"> 
                            DOWNLOAD RESUME 
                        </a>
                    </div>
                </div>
            )}
        </div>

        <CopyrightBar />
    </div>
  );
}