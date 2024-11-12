// Header.js
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const Header = () => {
  const { user, logout } = useAuth();
  const logoRef = useRef(null);

  useEffect(() => {
    const logoAnimation = gsap.timeline({ repeat: -1, repeatDelay: 10 });
    
    logoAnimation
      .to(logoRef.current, {
        duration: 2,
        opacity: 0.7,
        scale: 1.2,
        ease: 'power2.inOut',
      })
      .to(logoRef.current, {
        duration: 2,
        opacity: 1,
        scale: 1,
        ease: 'power2.inOut',
      });

    return () => logoAnimation.kill();
  }, []);

  const navigationLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/fasting-timer', label: 'Fasting Timer' },
    { to: '/weight-tracker', label: 'Weight Tracker' },
    { to: '/yoga-exercises', label: 'Yoga Exercises' },
    { to: '/bmr-calculator', label: 'BMR Calculator' },
    { to: '/journey-log', label: 'Journey Log' },
    { to: '/health-benefits', label: 'Health Benefits' },
  ];

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="logo text-2xl font-bold" ref={logoRef}>
          Fastinjoy
        </Link>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="hidden md:flex gap-4">
                {navigationLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <button
                onClick={logout}
                className="btn btn-primary"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;