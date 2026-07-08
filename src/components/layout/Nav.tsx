import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { CivixLogo } from '../CivixLogo';

const Nav: React.FC = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-paper border-b border-line' : 'bg-transparent border-b border-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Civix Home">
          <CivixLogo className="h-9 w-auto" />
        </Link>
        
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

        {/* Mobile menu button (placeholder for actual mobile menu) */}
        <button className="md:hidden text-ink p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
};

export default Nav;
