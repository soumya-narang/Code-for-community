import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import type { Category } from '../../store/useProjectStore';
import PriorityRow from './PriorityRow';

interface PriorityListProps {
  activeCategory: Category;
  searchQuery: string;
}

const PriorityList: React.FC<PriorityListProps> = ({ activeCategory, searchQuery }) => {
  const projects = useProjectStore((state) => state.projects);

  // Apply filters
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.theme.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.ward.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort by score (descending)
  const sortedProjects = [...filteredProjects].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full">
      {/* Table Header (hidden on mobile for simplicity, but good for context) */}
      <div className="hidden md:flex w-full items-center py-3 px-6 border-b border-line bg-line/10">
        <div className="w-12 shrink-0">
          <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Rank</span>
        </div>
        <div className="flex-grow md:w-1/3">
          <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Theme & Location</span>
        </div>
        <div className="md:w-1/3">
          <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Priority Score</span>
        </div>
        <div className="flex justify-end md:w-48 shrink-0 pr-12">
          <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Volume & Status</span>
        </div>
      </div>

      {/* Ranked List */}
      <div className="flex flex-col border-b border-line">
        {sortedProjects.length > 0 ? (
          sortedProjects.map((project, index) => (
            <PriorityRow key={project.id} project={project} rank={index + 1} />
          ))
        ) : (
          <div className="py-16 px-6 text-center">
            <p className="font-sans text-slate">No priorities found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriorityList;
