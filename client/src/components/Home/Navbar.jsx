import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { X, Menu, User, LogOut, Settings, BarChart3, Users, Package } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToSection = (id) => {
    if (currentPath !== "/") {
      navigate(`/#${id}`);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { label: "Home", action: () => navigate("/") },
        { label: "Features", action: () => scrollToSection("features") },
        { label: "Pricing", action: () => scrollToSection("pricing") },
      ];
    }

    if (isAdmin) {
      return [
        { label: "Dashboard", action: () => navigate("/admin/dashboard") },
        { label: "Users", action: () => navigate("/admin/users") },
        { label: "Foods", action: () => navigate("/admin/foods") },
        { label: "Analytics", action: () => navigate("/admin/analytics") },
      ];
    }

    return [
      { label: "Dashboard", action: () => navigate("/dashboard") },
      { label: "Track Nutrition", action: () => navigate("/track-nutrition") },
      { label: "Reports", action: () => navigate("/reports") },
    ];
  };

  return (
    <nav className="bg-[#14532D] text-white px-4 py-2 sm:px-6 sm:py-4 flex items-center justify-between relative z-50">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="FitTrack Logo" className="h-8 sm:h-12 w-auto" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4 sm:space-x-6">
        {getNavItems().map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="hover:text-yellow-400 transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Desktop Auth Section */}
      <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
        {isAuthenticated ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 bg-[#1A7F44] hover:bg-[#2A9D5F] text-white px-3 py-2 rounded-full font-semibold text-sm transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{user?.username || 'User'}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-green-600 capitalize">{user?.role}</p>
                </div>

                {isAdmin ? (
                  <>
                    <button
                      onClick={() => { navigate('/admin/dashboard'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </button>
                    <button
                      onClick={() => { navigate('/admin/users'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Manage Users</span>
                    </button>
                    <button
                      onClick={() => { navigate('/admin/foods'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Manage Foods</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => { navigate('/track-nutrition'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Track Nutrition</span>
                    </button>
                  </>
                )}

                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#1A7F44] hover:bg-[#2A9D5F] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-colors"
          >
            Get Started
          </button>
        )}
      </div>

      {/* Hamburger/Cross Button */}
      <div className="md:hidden flex items-center relative z-50">
        {isMobileMenuOpen ? (
          <X
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          />
        ) : (
          <Menu onClick={toggleMobileMenu} />
        )}
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs bg-[#14532D]/90 backdrop-blur-lg h-screen transform transition-transform duration-300 ease-in-out z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start p-6 space-y-4 h-full">
          {/* User Info (if authenticated) */}
          {isAuthenticated && (
            <div className="w-full border-b border-green-600 pb-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{user?.username}</span>
              </div>
              <p className="text-green-200 text-sm">{user?.email}</p>
              <p className="text-green-300 text-xs capitalize">{user?.role}</p>
            </div>
          )}

          {/* Navigation Items */}
          {getNavItems().map((item, index) => (
            <button
              key={index}
              onClick={() => {
                toggleMobileMenu();
                item.action();
              }}
              className="hover:text-yellow-400 transition-colors text-lg w-full text-left"
            >
              {item.label}
            </button>
          ))}

          {/* Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                toggleMobileMenu();
                handleLogout();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold text-lg transition-colors w-full text-left flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                toggleMobileMenu();
                navigate("/login");
              }}
              className="bg-[#1A7F44] hover:bg-[#2A9D5F] text-white px-4 py-2 rounded-full font-semibold text-lg transition-colors w-full text-left"
            >
              Get Started
            </button>
          )}
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
