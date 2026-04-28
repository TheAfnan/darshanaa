import { Backpack, Calendar, Leaf, Menu, MoreVertical, Plane, Smile, User, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRightSidebar } from "../hooks/useRightSidebar";
import logoImage from "../images/images-map-logo.png";
import RightSidebar from "./RightSidebar";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: sidebarIsOpen, openSidebar, closeSidebar } = useRightSidebar();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: Backpack },
    { name: "Mood AI", path: "/mood", icon: Smile },
    { name: "Travel Hub", path: "/travelhub", icon: Plane },
    { name: "All Cities", path: "/cities", icon: MoreVertical },
    { name: "Essentials", path: "/travel-essentials", icon: Calendar },
    { name: "Cultural Odyssey", path: "/festivals", icon: Leaf },
    { name: "Eco Travel", path: "/sustainable", icon: User },
    { name: "Local-Guides", path: "/guides", icon: X },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 select-none group flex-shrink-0"
          >
            {/* Logo Image */}
            <img 
              src={logoImage} 
              alt="DarShana Logo" 
              className="h-24 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 flex-shrink-0"
            />
            
            {/* Logo Text */}
            <div className="text-xl sm:text-2xl font-extrabold font-serif tracking-tight drop-shadow-lg whitespace-nowrap flex-shrink-0">
              <span className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Dar
              </span>
              <span className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 bg-clip-text text-transparent">
                Shana
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}

          <div className="hidden md:flex items-center space-x-1 md:ml-6 lg:ml-10 text-xs">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group relative px-3 py-2 rounded-full text-xs flex items-center gap-1.5 font-medium transition-all duration-200
                    ${active ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md" : "text-slate-700 hover:bg-orange-50 hover:text-orange-700"}
                    hover:scale-105 focus:scale-105
                  `}
                  style={{ overflow: 'hidden' }}
                >
                  {Icon && <Icon size={16} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}

            {/* CTA + Kebab Menu */}
            <div className="ml-4 flex items-center gap-3">
              <Link
                to="/booking"
                className={`group relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200
                  ${isActive('/booking') ? 'text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}
                  hover:scale-105 focus:scale-105
                `}
                style={{ overflow: 'hidden' }}
              >
                <span className="relative z-10">Book Trip</span>
              </Link>
              
              {/* Kebab Menu (3-dot) */}
              <button
                onClick={openSidebar}
                className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-100/50 rounded-full transition-all duration-300 hover:scale-110"
                title="More options"
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-orange-600"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-white/20 shadow-xl">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 transform ${
                    isActive(link.path)
                      ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md"
                      : "text-slate-700 hover:text-orange-600 hover:bg-orange-50/60"
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  {link.name}
                </Link>
              );
            })}

            {/* CTA button */}
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg mt-4 shadow-md font-bold"
            >
              Book Trip
            </Link>
          </div>
        </div>
      )}

      {/* Right Sidebar Drawer */}
      <RightSidebar isOpen={sidebarIsOpen} onClose={closeSidebar} />
    </nav>
  );
};

export default Navbar;
