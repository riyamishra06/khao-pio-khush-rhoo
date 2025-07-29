import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToSection = (id) => {
    if (currentPath !== '/') {
      navigate(`/#${id}`);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-[#14532D] text-white px-4 py-2 sm:px-6 sm:py-4 flex items-center justify-between relative z-50">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <img src={logo} alt="FitTrack Logo" className="h-8 sm:h-12 w-auto" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4 sm:space-x-6">
        <button
          onClick={() => navigate('/')}
          className={`hover:text-yellow-400 transition-colors ${currentPath === '/' ? 'text-yellow-400' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => scrollToSection('features')}
          className="hover:text-yellow-400 transition-colors"
        >
          Features
        </button>
        <button
          onClick={() => scrollToSection('pricing')}
          className="hover:text-yellow-400 transition-colors"
        >
          Pricing
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-[#1A7F44] hover:bg-[#2A9D5F] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-colors"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#0F3D22] hover:bg-[#1A7F44] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-colors"
        >
          Log In
        </button>
      </div>

      {/* Hamburger/Cross Button */}
      <div className="md:hidden flex items-center relative z-50">
        <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs bg-[#14532D]/90 backdrop-blur-lg h-screen transform transition-transform duration-300 ease-in-out z-40 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-start p-6 space-y-4 h-full">
          <button
            onClick={() => navigate('/')}
            className={`hover:text-yellow-400 transition-colors text-lg ${currentPath === '/' ? 'text-yellow-400' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-yellow-400 transition-colors text-lg"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="hover:text-yellow-400 transition-colors text-lg"
          >
            Pricing
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#1A7F44] hover:bg-[#2A9D5F] text-white px-4 py-2 rounded-full font-semibold text-lg transition-colors w-full text-left"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#0F3D22] hover:bg-[#1A7F44] text-white px-4 py-2 rounded-full font-semibold text-lg transition-colors w-full text-left"
          >
            Log In
          </button>
        </div>
      </div>

      {/* Overlay for closing menu when clicking outside */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;