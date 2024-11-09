import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { useHistory } from 'react-router-dom';
import gsap from 'gsap';
 // Assuming your CSS is in a file named Header.css

const Header = () => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const logoRef = useRef(null);

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  useEffect(() => {
    const logoAnimation = gsap.timeline({ repeat: -1, repeatDelay: 10 });

    logoAnimation.to(logoRef.current, {
      duration: 2,
      opacity: 0,
      scale: 1.2,
      ease: "power2.inOut"
    })
    .to(logoRef.current, {
      duration: 2,
      opacity: 1,
      scale: 1,
      ease: "power2.inOut"
    });

    return () => {
      logoAnimation.kill();
    };
  }, []);

  return (
    <header className="animated-header">
      <nav>
        <Link to="/" className="logo" ref={logoRef}>
          Fastinjoy
        </Link>
        <div className="nav-links">
          {user && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/fasting-timer">Fasting Timer</Link>
              <Link to="/weight-tracker">Weight Tracker</Link>
              <Link to="/yoga-exercises">Yoga Exercises</Link>
              <Link to="/bmr-calculator">BMR Calculator</Link>
              <Link to="/journey-log">Journey Log</Link>
              <Link to="/health-benefits">Health Benefits</Link>
            </>
          )}
        </div>
        {user && (
          <button onClick={handleLogout} className="button">Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
