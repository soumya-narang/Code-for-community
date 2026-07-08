import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Priority List', path: '/dashboard' },
    { name: 'Submissions', path: '/dashboard/submissions' },
    { name: 'Trust Page', path: '/track' },
    { name: 'Settings', path: '/dashboard/settings' },
  ];

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

        <nav className="mt-4 md:mt-8 flex flex-col w-full">
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/dashboard');
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={`py-3 px-6 font-sans text-sm block border-l-4 transition-colors ${
                  isActive 
                    ? 'border-seal text-ink font-medium bg-line/10' 
                    : 'border-transparent text-slate hover:text-ink hover:bg-line/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
