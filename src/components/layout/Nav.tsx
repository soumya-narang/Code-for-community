import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { CivixLogo } from '../CivixLogo';

const Nav: React.FC = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-paper border-b border-line' : 'bg-transparent border-b border-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Civix Home" onClick={closeMobileMenu}>
          <CivixLogo className="h-9 w-auto" />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#product" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-sm font-sans font-medium text-slate hover:text-ink transition-colors">
            Product
          </a>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'}); }} className="text-sm font-sans font-medium text-slate hover:text-ink transition-colors">
            How it works
          </a>
          <Link to="/submit" className="text-sm font-sans font-medium text-slate hover:text-ink transition-colors">
            Submit Issue
          </Link>
          <Link to="/track" className="text-sm font-sans font-medium text-slate hover:text-ink transition-colors">
            Trust
          </Link>
          <Link to="/dashboard" className="bg-ink text-paper px-5 py-2.5 rounded-sm text-sm font-sans font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-seal focus:ring-offset-2 focus:ring-offset-paper">
            MP Dashboard
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-ink p-2"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-paper border-b border-line overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              <a 
                href="#product" 
                onClick={(e) => { e.preventDefault(); closeMobileMenu(); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                className="text-base font-sans font-medium text-slate hover:text-ink transition-colors block py-2 border-b border-line/50"
              >
                Product
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => { e.preventDefault(); closeMobileMenu(); document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'}); }} 
                className="text-base font-sans font-medium text-slate hover:text-ink transition-colors block py-2 border-b border-line/50"
              >
                How it works
              </a>
              <Link 
                to="/submit" 
                onClick={closeMobileMenu}
                className="text-base font-sans font-medium text-slate hover:text-ink transition-colors block py-2 border-b border-line/50"
              >
                Submit Issue
              </Link>
              <Link 
                to="/track" 
                onClick={closeMobileMenu}
                className="text-base font-sans font-medium text-slate hover:text-ink transition-colors block py-2 border-b border-line/50"
              >
                Trust
              </Link>
              <Link 
                to="/dashboard" 
                onClick={closeMobileMenu}
                className="bg-ink text-paper px-5 py-3 rounded-sm text-base font-sans font-medium hover:bg-opacity-90 transition-all text-center mt-2 block"
              >
                MP Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Nav;
