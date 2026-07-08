import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../../store/useProjectStore';
import type { Project, Status } from '../../store/useProjectStore';

interface PriorityRowProps {
  project: Project;
  rank: number;
}

const PriorityRow: React.FC<PriorityRowProps> = ({ project, rank }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const updateStatus = useProjectStore((state) => state.updateStatus);

  const [status, setStatus] = useState<Status>(project.status);
  const [justification, setJustification] = useState(project.statusJustification || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (justification.trim() === '') return;
    updateStatus(project.id, status, justification);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="border-b border-line bg-paper flex flex-col transition-colors hover:bg-line/5">
      {/* Closed State (Clickable Header) */}
      <div 
        className="w-full flex flex-col md:flex-row md:items-center py-4 px-6 md:py-6 gap-4 md:gap-8 cursor-pointer outline-none focus-visible:bg-line/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-seal"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
      >
        {/* Rank */}
        <div className="w-12 shrink-0">
          <span className="font-mono text-2xl text-ink">
            {rank.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Title, Location & Justification */}
        <div className="flex-grow flex flex-col gap-1 md:w-1/3">
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-lg text-ink line-clamp-1">{project.theme}</h3>
            <span className="font-sans text-xs text-slate whitespace-nowrap px-2 py-0.5 border border-line bg-paper hidden sm:inline-block">
              {project.ward}
            </span>
          </div>
          <p className="font-sans text-xs text-slate line-clamp-1">{project.justification}</p>
        </div>

        {/* Visualizer & Score */}
        <div className="flex items-center gap-6 md:w-1/3 mt-2 md:mt-0">
          <div className="flex-grow hidden sm:block h-1 bg-line relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 bottom-0 bg-ink" 
              style={{ width: `${project.score}%` }} 
            />
          </div>
          <div className="flex items-baseline gap-1 shrink-0 w-16 justify-end">
            <span className="font-mono text-2xl text-ink">{project.score}</span>
            <span className="font-mono text-xs text-slate">/100</span>
          </div>
        </div>

        {/* Submissions & Status indicators */}
        <div className="flex items-center justify-between md:justify-end gap-6 md:w-48 shrink-0">
          <span className="font-mono text-xs text-slate">{project.submissionCount} submissions</span>
          <div className="flex items-center gap-2">
            {/* Status dot */}
            <span className={`w-2 h-2 rounded-full ${
              project.status === 'Completed' ? 'bg-seal' : 
              project.status === 'In Progress' ? 'bg-ink' : 'bg-line'
            }`} />
            {/* Expand icon */}
            <svg 
              className={`w-4 h-4 text-slate transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded State */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 pt-2 md:pl-24 border-t border-line/50 border-dashed flex flex-col lg:flex-row gap-12 lg:gap-16">
              
              {/* Left Column: Signals & Submissions */}
              <div className="flex-grow flex flex-col gap-8 lg:w-2/3">
                {/* Score Breakdown (Reusing pattern from landing page) */}
                <div>
                  <h4 className="font-mono text-xs text-ink uppercase tracking-widest mb-4">Score Breakdown</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {project.signals.map((signal, idx) => (
                      <div key={idx} className="flex flex-col justify-end border-l border-line pl-4 py-1">
                        <p className="font-sans text-xs text-slate mb-2 line-clamp-2">{signal.label}</p>
                        <p className="font-mono text-lg text-ink mb-2">{signal.value}%</p>
                        <div className="h-0.5 w-full bg-line relative overflow-hidden">
                          <motion.div 
                            className={`absolute top-0 left-0 bottom-0 ${signal.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${signal.value}%` }}
                            transition={{ duration: 0.8, delay: 0.1 + (idx * 0.1) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw Submissions Sample */}
                <div>
                  <h4 className="font-mono text-xs text-ink uppercase tracking-widest mb-4">Raw Citizen Sample</h4>
                  <div className="flex flex-col gap-4">
                    {project.submissions.map((sub) => (
                      <div key={sub.id} className="border-l-2 border-line pl-4">
                        <p className="font-sans text-sm text-ink italic leading-relaxed">"{sub.text}"</p>
                        <div className="flex gap-3 mt-2">
                          <span className="font-mono text-[10px] text-slate">{sub.timestamp}</span>
                          {sub.language && (
                            <span className="font-mono text-[10px] text-seal uppercase">Translated from {sub.language}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Update Status Form */}
              <div className="lg:w-1/3 flex flex-col bg-line/10 p-6 border border-line">
                <h4 className="font-mono text-xs text-ink uppercase tracking-widest mb-4">Mark Status</h4>
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs text-slate">Current Status</label>
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value as Status)}
                      className="w-full border border-line bg-paper px-3 py-2 text-sm font-sans text-ink focus:outline-none focus:border-ink rounded-none appearance-none"
                    >
                      <option value="Proposed">Proposed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs text-slate">Public Justification (Required)</label>
                    <textarea 
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      required
                      rows={3}
                      placeholder="Why is this status changing?"
                      className="w-full border border-line bg-paper p-3 text-sm font-sans text-ink focus:outline-none focus:border-ink rounded-none resize-none"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="mt-2 w-full bg-ink text-paper py-2.5 text-sm font-sans font-medium hover:bg-opacity-90 transition-colors flex justify-center"
                  >
                    {isSaved ? 'Saved.' : 'Save update'}
                  </button>
                  <p className="font-mono text-[10px] text-slate text-center mt-2">
                    Updates will appear on the public Trust Page.
                  </p>
                </form>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriorityRow;
