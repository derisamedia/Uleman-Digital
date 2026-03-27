import React, { useState, useEffect } from 'react';
import { Home, Heart, Calendar, MessageCircleHeart } from 'lucide-react';
import './BottomNavbar.css';

const BottomNavbar = ({ themeMode = 'elegant' }) => {
  const [active, setActive] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'couple', icon: Heart, label: 'Mempelai' },
    { id: 'events', icon: Calendar, label: 'Acara' },
    { id: 'rsvp', icon: MessageCircleHeart, label: 'Ucapan' }
  ];

  const handleClick = (id) => {
    setActive(id);
    const element = document.getElementById(id);
    if (element) {
      if (window.lenis) {
        window.lenis.scrollTo('#' + id, { offset: -20, duration: 1.5 });
      } else {
        window.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      
      scrollTimeout = requestAnimationFrame(() => {
        let currentActive = 'home';
        // Add a small offset to trigger the active state earlier when scrolling down
        const triggerOffset = window.innerHeight * 0.4;
        const scrollPos = window.scrollY + triggerOffset;

        for (const item of navItems) {
          const element = document.getElementById(item.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            
            // If the scroll position passed the top of the element
            if (scrollPos >= absoluteTop) {
              currentActive = item.id;
            }
          }
        }

        // Safe bottom of document check
        const docHeight = Math.max(
          document.body.scrollHeight, 
          document.documentElement.scrollHeight,
          document.body.offsetHeight, 
          document.documentElement.offsetHeight
        );
        
        // Only override if we are truly at the bottom and the doc is scrollable
        if (docHeight > window.innerHeight + 100 && 
            Math.round(window.scrollY + window.innerHeight) >= docHeight - 50) {
          currentActive = 'rsvp';
        }

        setActive(currentActive);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    };
  }, []);

  return (
    <div className={`bottom-navbar ${themeMode}`}>
      <div className="nav-container">
        {navItems.map((item) => (
          <div 
            key={item.id} 
            className={`bottom-nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => handleClick(item.id)}
          >
            <item.icon size={22} className="bottom-nav-icon" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
