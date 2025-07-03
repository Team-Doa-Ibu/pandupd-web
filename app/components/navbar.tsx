import React, { useState } from "react";
import { useLocation } from "@remix-run/react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-screen-xl box-border bg-white rounded-full shadow flex items-center justify-between px-4 sm:px-6 py-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="font-semibold text-black">PANDU‑PD</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-6">
            <li>
              <a 
                href="/" 
                className={currentPath === "/" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}
              >
                Utama
              </a>
            </li>
            <li>
              <a 
                href="/terapi" 
                className={currentPath === "/terapi" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}
              >
                Terapi
              </a>
            </li>
            <li>
              <a 
                href="/artikel" 
                className={currentPath === "/artikel" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}
              >
                Artikel
              </a>
            </li>
            <li>
              <a 
                href="/history" 
                className={currentPath === "/history" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}
              >
                Riwayat
              </a>
            </li>
          </ul>
        </div>
        
        {/* Login Button */}
        <div className="hidden md:block">
          <a href="/Login">
            <button className="bg-blue-500 text-white px-5 py-1.5 rounded-full font-semibold hover:bg-blue-600 transition">
              Masuk
            </button>
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none" 
          onClick={toggleMenu}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-screen-xl bg-white rounded-xl shadow-lg py-4 md:hidden">
          <ul className="flex flex-col">
            <li>
              <a 
                href="/" 
                className={`block px-6 py-2 ${currentPath === "/" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Utama
              </a>
            </li>
            <li>
              <a 
                href="/terapi" 
                className={`block px-6 py-2 ${currentPath === "/terapi" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Terapi
              </a>
            </li>
            <li>
              <a 
                href="/artikel" 
                className={`block px-6 py-2 ${currentPath === "/artikel" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Artikel
              </a>
            </li>
            <li>
              <a 
                href="/history" 
                className={`block px-6 py-2 ${currentPath === "/history" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Riwayat
              </a>
            </li>
            <li className="border-t border-gray-100 mt-2 pt-2">
              <div className="px-6 py-2">
                <a href="/Login">
                  <button className="w-full bg-blue-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-600 transition">
                    Masuk
                  </button>
                </a>
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}