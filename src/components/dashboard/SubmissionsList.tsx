import React from 'react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../../store/useProjectStore';
import type { Category } from '../../store/useProjectStore';

interface SubmissionsListProps {
  activeCategory: Category;
  searchQuery: string;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({ activeCategory, searchQuery }) => {
  const projects = useProjectStore((s) => s.projects);

  // Flatten submissions from all projects and attach project metadata
  const allSubmissions = projects.flatMap(p => 
    p.submissions.map(s => ({
      ...s,
      theme: p.theme,
      ward: p.ward,
      category: p.category
    }))
  );

  // Filter based on active category and search query
  const filteredSubmissions = allSubmissions.filter((sub) => {
    const matchesCategory = activeCategory === 'All' || sub.category === activeCategory;
    const matchesSearch = 
      sub.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.ward.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-4 px-6 md:px-10 py-3 border-b border-line text-[10px] uppercase tracking-widest font-mono text-slate bg-paper sticky top-[65px] md:top-0 z-10">
        <div className="col-span-8 md:col-span-6">Citizen Testimony & Source</div>
        <div className="col-span-4 md:col-span-3 text-right md:text-left">Details</div>
        <div className="hidden md:block col-span-3 text-right">Time</div>
      </div>

      <div className="flex flex-col">
        {filteredSubmissions.length === 0 ? (
          <div className="p-10 text-center font-sans text-slate">
            No submissions match the current filters.
          </div>
        ) : (
          filteredSubmissions.map((sub, index) => (
            <motion.div 
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-12 gap-4 px-6 md:px-10 py-6 border-b border-line hover:bg-line/5 transition-colors group bg-paper"
            >
              {/* Main Content */}
              <div className="col-span-8 md:col-span-6 flex flex-col gap-2">
                <p className="font-sans text-ink text-sm md:text-base leading-relaxed">
                  "{sub.text}"
                </p>
                {sub.language && sub.language !== 'English' && (
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-line/20 text-slate inline-block w-max">
                    Translated from {sub.language}
                  </span>
                )}
              </div>

              {/* Details (Theme & Ward) */}
              <div className="col-span-4 md:col-span-3 flex flex-col items-end md:items-start gap-1">
                <span className="font-sans text-sm text-ink">{sub.theme}</span>
                <span className="font-mono text-[10px] text-slate uppercase tracking-widest">{sub.ward}</span>
                <span className="font-mono text-[10px] text-slate md:hidden mt-2">{sub.timestamp}</span>
              </div>

              {/* Timestamp (Desktop) */}
              <div className="hidden md:flex col-span-3 items-start justify-end">
                <span className="font-mono text-[11px] text-slate">{sub.timestamp}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubmissionsList;
