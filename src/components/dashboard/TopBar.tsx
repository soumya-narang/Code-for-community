import React from 'react';
import type { Category } from '../../store/useProjectStore';

interface TopBarProps {
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }) => {
  const categories: Category[] = ['All', 'Education', 'Health', 'Roads', 'Water', 'Electricity', 'Sanitation', 'Other'];

  return (
    <div className="border-b border-line bg-paper px-6 py-6 md:py-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
      
      {/* Left: Heading & Timestamp */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-ink">Constituency Priority List</h1>
        <p className="font-mono text-xs text-slate mt-2 uppercase tracking-wide">
          Updated 14 min ago
        </p>
      </div>

      {/* Right: Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full border text-sm font-sans transition-colors ${
                activeCategory === cat
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line text-slate hover:border-slate'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search themes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-48 lg:w-64 border border-line bg-transparent px-4 py-1.5 text-sm font-sans text-ink placeholder:text-slate/50 focus:outline-none focus:border-ink transition-colors rounded-none"
          />
        </div>
      </div>

    </div>
  );
};

export default TopBar;
