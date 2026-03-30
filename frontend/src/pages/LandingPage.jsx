import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import ThemeElegant from './ThemeElegant';
import ThemeMinimalist from './ThemeMinimalist';
import AOS from 'aos';
import 'aos/dist/aos.css';

const API_URL = 'http://localhost:5000/api';

const LandingPage = () => {
  const [config, setConfig] = useState(null);
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => {
    // Initialize Lenis Smooth Scrolling Engine
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smooth: true,
    });
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
      mirror: false
    });

    // Read theme setting directly from actual API DB
    const fetchConfigFromDB = async () => {
      try {
        const res = await fetch(`${API_URL}/config`);
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        console.error('Failed to connect to backend', err);
        // Fallback for demo
        setConfig({ couple_names: 'Romeo & Juliet', wedding_date: '2026-12-12', theme: localStorage.getItem('uleman_theme') || 'elegant' });
      }
    };
    const fetchRsvps = async () => {
      try {
        const res = await fetch(`${API_URL}/rsvps`);
        if (res.ok) {
          const data = await res.json();
          setRsvps(data);
        }
      } catch (err) {
        console.error('Failed to fetch rsvps', err);
      }
    };

    fetchConfigFromDB();
    fetchRsvps();
    
    // Listen for storage changes just so dev menu theme swapping is instant
    const handleStorageChange = (e) => {
      if (e.key === 'uleman_config_sync') {
        fetchConfigFromDB();
      } else if (e.key === 'uleman_theme' && config) {
        setConfig(prev => ({ ...prev, theme: e.newValue || 'elegant' }));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      lenis.destroy();
    };
  }, [config?.theme]); // adding dependency optionally to ensure no stale closure, though it shouldn't matter here

  useEffect(() => {
    if (config?.couple_names) {
      document.title = config.couple_names;
    }
  }, [config?.couple_names]);

  const handleRsvpSubmit = async (rsvpData) => {
    try {
      const res = await fetch(`${API_URL}/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData)
      });
      if (res.ok) {
        alert('Thank you! Your RSVP has been submitted.');
        try {
          const fetchRes = await fetch(`${API_URL}/rsvps`);
          if (fetchRes.ok) {
            const data = await fetchRes.json();
            setRsvps(data);
            // Refresh AOS and optionally trigger a window resize to force 
            // Lenis smooth scroll to recalculate the new document height limits.
            setTimeout(() => {
              AOS.refresh();
              if (window.lenis) window.lenis.resize();
              window.dispatchEvent(new Event('resize'));
            }, 100);
          }
        } catch(e) {}
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit RSVP.');
    }
  };

  if (!config) return <div style={{ background: '#111', height: '100vh', width: '100vw' }}></div>; // Loading state

  // Return the selected theme component with actual config
  if (config.theme === 'minimalist') {
    return <ThemeMinimalist config={config} onRsvpSubmit={handleRsvpSubmit} rsvps={rsvps} />;
  }
  
  // Default is 'elegant'
  return <ThemeElegant config={config} onRsvpSubmit={handleRsvpSubmit} rsvps={rsvps} />;
};

export default LandingPage;
