import React, { useState } from 'react';
import { Store, ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-purple-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <button
            id="nav-brand-logo"
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="xyz.com homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform shadow-xs">
              <Store className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#1E1B4B]">
              xyz<span className="text-indigo-600">.com</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              id="nav-link-home"
              onClick={() => handleNav('/')}
              className={`text-sm font-semibold transition-colors relative py-1 focus:outline-none cursor-pointer ${
                currentPath === '/'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Home
              {currentPath === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>

            <button
              id="nav-link-how-it-works"
              onClick={() => handleNav('/how-it-works')}
              className={`text-sm font-semibold transition-colors relative py-1 focus:outline-none cursor-pointer ${
                currentPath === '/how-it-works'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              How It Works
              {currentPath === '/how-it-works' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <button
              id="nav-btn-register"
              onClick={() => handleNav('/register')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              <span>Register Your Store</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            id="mobile-nav-home"
            onClick={() => handleNav('/')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              currentPath === '/'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Home
          </button>
          <button
            id="mobile-nav-how-it-works"
            onClick={() => handleNav('/how-it-works')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              currentPath === '/how-it-works'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            How It Works
          </button>
          <button
            id="mobile-nav-register"
            onClick={() => handleNav('/register')}
            className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
          >
            <span>Register Your Store</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
