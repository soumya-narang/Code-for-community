import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-line bg-paper sticky top-0 z-20">
        <span className="font-display font-semibold text-xl text-ink">Civix</span>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-ink"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-0 top-[65px] md:top-0 md:relative md:w-60 lg:w-[240px] bg-paper md:border-r border-line
        flex-col z-10 transition-transform duration-300 ease-in-out md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:block">
          <Link to="/" className="font-display font-semibold text-2xl text-ink">Civix</Link>
        </div>

        <nav className="mt-4 md:mt-8 flex flex-col w-full h-full">
          <Link 
            to="/dashboard"
            className={`py-3 px-6 font-sans text-sm block border-l-4 transition-colors ${
              location.pathname === '/dashboard' 
                ? 'border-seal text-ink font-medium bg-line/10' 
                : 'border-transparent text-slate hover:text-ink hover:bg-line/5'
            }`}
          >
            Priority List
          </Link>
          
          <div className="py-3 px-6 font-sans text-sm block border-l-4 border-transparent text-slate/50 cursor-not-allowed">
            <div className="flex items-center justify-between">
              <span>Submissions</span>
              <span className="font-mono text-[10px] text-seal uppercase tracking-widest border border-seal/30 px-1.5 py-0.5">Demo Scope: Locked</span>
            </div>
          </div>

          <Link 
            to="/track"
            className={`py-3 px-6 font-sans text-sm block border-l-4 transition-colors ${
              location.pathname === '/track' 
                ? 'border-seal text-ink font-medium bg-line/10' 
                : 'border-transparent text-slate hover:text-ink hover:bg-line/5'
            }`}
          >
            Trust Page
          </Link>

          <div className="mt-auto py-3 px-6 font-sans text-sm block border-l-4 border-transparent text-slate/40 border-t border-line cursor-not-allowed">
            Settings
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
