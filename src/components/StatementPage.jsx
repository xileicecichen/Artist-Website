import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from './Navbar';
import CopyrightBar from './CopyrightBar';
import '../styles/SubPage.css';

export default function StatementPage() {
  const [statement, setStatement] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatement = async () => {
      const { data, error } = await supabase
        .from('artist_statement')
        .select('content')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching statement:', error);
      } else if (data) {
        setStatement(data.content);
      }
      setLoading(false);
    };

    fetchStatement();
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
            <div className='statement-text'>
                {statement}
            </div>
        </div>

        <CopyrightBar />
    </div>
  );
}