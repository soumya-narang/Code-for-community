import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';
import type { Project, Status } from '../store/useProjectStore';
import { CivixLogo } from '../components/CivixLogo';

// Lifecycle stages in order
const LIFECYCLE: Status[] = ['In Review', 'Prioritized', 'Approved for Funding'];

function getActiveStageIndex(status: Status): number {
  if (status === 'Deferred') return -1; // special case
  return LIFECYCLE.indexOf(status);
}

const Track: React.FC = () => {
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('p1');
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Derived stats
  const totalSubmissions = projects.reduce((sum, p) => sum + p.submissionCount, 0);
  const approvedCount = projects.filter(p => p.status === 'Approved for Funding' || p.status === 'Prioritized').length;
  const complianceRate = Math.round((approvedCount / projects.length) * 100);

  const sortedProjects = [...projects].sort((a, b) => b.score - a.score);
  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  const toggleFlag = (id: string) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-paper text-slate font-sans">

      {/* ── Header ── */}
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center" aria-label="Civix Home">
              <CivixLogo className="h-9 w-auto" />
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/submit" className="font-sans text-sm text-slate hover:text-ink transition-colors">
                Submit Issue
              </Link>
              <Link to="/dashboard" className="font-mono text-[10px] text-slate hover:text-ink uppercase tracking-widest transition-colors">
                MP Login →
              </Link>
            </div>
          </div>

          <span className="font-mono text-[10px] text-seal uppercase tracking-widest block mb-3">
            Public Accountability
          </span>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-ink leading-tight">
            The Constituency Public Ledger & Promise Tracker
          </h1>
          <p className="font-sans text-slate mt-3 max-w-3xl leading-relaxed">
            Every development request evaluated by Civix is tracked publicly. Priorities are set by evidence, not volume, and every status change is logged here for your review.
          </p>
        </div>
      </header>

      {/* ── Stats Strip ── */}
      <div className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-line">
          <div className="flex flex-col py-4 md:py-0 md:pr-8">
            <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Total Citizen Submissions Evaluated</span>
            <span className="font-mono text-3xl text-ink mt-2">{totalSubmissions}</span>
          </div>
          <div className="flex flex-col py-4 md:py-0 md:px-8">
            <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Data-Prioritized Projects Approved</span>
            <span className="font-mono text-3xl text-ink mt-2">{approvedCount}</span>
          </div>
          <div className="flex flex-col py-4 md:py-0 md:pl-8">
            <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Allocation Trust Index</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="font-mono text-3xl text-ink">{complianceRate}</span>
              <span className="font-mono text-lg text-slate">%</span>
            </div>
            <span className="font-mono text-[10px] text-slate mt-1">Data vs. Loudest-Complaint Compliance</span>
          </div>
        </div>
      </div>

      {/* ── Public Ledger ── */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="font-mono text-[10px] text-seal uppercase tracking-widest mb-8">Live Priority Ledger</h2>

        <div className="border-t border-line flex flex-col">
          {sortedProjects.map((project, index) => {
            const rank = index + 1;
            const stageIndex = getActiveStageIndex(project.status);
            const isDeferred = project.status === 'Deferred';
            const isFlagged = flaggedIds.has(project.id);

            return (
              <div key={project.id} className="border-b border-line">
                {/* Row */}
                <div className="py-8 flex flex-col lg:flex-row gap-6 lg:gap-10">

                  {/* Left: Rank + Score */}
                  <div className="flex items-start gap-6 lg:w-36 shrink-0">
                    <span className="font-mono text-3xl text-ink">{rank.toString().padStart(2, '0')}</span>
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-slate uppercase tracking-wide">Score</span>
                      <span className="font-mono text-xl text-ink">{project.score}/100</span>
                    </div>
                  </div>

                  {/* Center: Theme, Justification, Timeline */}
                  <div className="flex-grow flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                      <h3 className="font-display text-xl text-ink">{project.theme}</h3>
                      <span className="font-mono text-[10px] text-slate uppercase tracking-widest">{project.ward}</span>
                      <span className="font-mono text-[10px] text-slate">{project.submissionCount} submissions</span>
                    </div>

                    {/* "Why this matters" justification */}
                    <p className="font-sans text-sm text-slate leading-relaxed max-w-3xl">
                      {project.justification}
                    </p>

                    {/* Multi-Stage Lifecycle Timeline */}
                    <div className="flex flex-wrap items-center gap-0 mt-2">
                      {/* Submitted — always active */}
                      <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-ink bg-ink text-paper">
                        Submitted
                      </span>
                      <span className="font-mono text-[10px] text-line mx-1 hidden sm:inline">→</span>

                      {/* AI Evaluated — always active */}
                      <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-ink bg-ink text-paper">
                        AI Evaluated
                      </span>
                      <span className="font-mono text-[10px] text-line mx-1 hidden sm:inline">→</span>

                      {isDeferred ? (
                        <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-slate text-slate bg-slate/5">
                          Deferred
                        </span>
                      ) : (
                        LIFECYCLE.map((stage, i) => {
                          const isActive = i <= stageIndex;
                          const isCurrent = i === stageIndex;
                          return (
                            <React.Fragment key={stage}>
                              <span
                                className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                                  isActive
                                    ? isCurrent
                                      ? 'border-seal bg-seal/10 text-seal'
                                      : 'border-ink bg-ink text-paper'
                                    : 'border-line text-line'
                                }`}
                              >
                                {stage}
                              </span>
                              {i < LIFECYCLE.length - 1 && (
                                <span className="font-mono text-[10px] text-line mx-1 hidden sm:inline">→</span>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right: Flag Discrepancy */}
                  <div className="lg:w-48 shrink-0 flex flex-col items-start lg:items-end gap-2">
                    <span className="font-mono text-[10px] text-slate">
                      Updated {new Date(project.lastUpdated).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => toggleFlag(project.id)}
                      className={`font-mono text-[10px] leading-snug text-left lg:text-right transition-colors ${
                        isFlagged ? 'text-signal' : 'text-slate/60 hover:text-signal'
                      }`}
                    >
                      {isFlagged
                        ? '⚑ Discrepancy flagged. Under review.'
                        : 'Is this actually progressing? Flag a discrepancy.'}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── "Explain the Scoring" Interactive ── */}
      <section className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <span className="font-mono text-[10px] text-seal uppercase tracking-widest block mb-3">
            Transparency
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-3">
            How is my request weighed?
          </h2>
          <p className="font-sans text-sm text-slate max-w-2xl mb-10 leading-relaxed">
            Civix doesn't just count complaints. It cross-references your submission against public data sources to measure real need. Select a project below to see its scoring breakdown explained in plain language.
          </p>

          {/* Project selector */}
          <div className="flex flex-wrap gap-2 mb-10">
            {sortedProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`px-4 py-2 text-sm font-sans border transition-colors ${
                  selectedProjectId === p.id
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line text-slate hover:border-ink hover:text-ink'
                }`}
              >
                {p.theme}
              </button>
            ))}
          </div>

          {/* Scoring explanation */}
          <AnimatePresence mode="wait">
            {selectedProject && (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Plain-language sentence */}
                <div className="border-l-2 border-seal pl-6 py-2 mb-10">
                  <p className="font-sans text-base text-ink leading-relaxed">
                    The <span className="font-display font-semibold">{selectedProject.theme}</span> project 
                    holds a priority score of <span className="font-mono font-semibold">{selectedProject.score}/100</span> because 
                    its <span className="font-mono font-semibold">{selectedProject.signals[2].value}% public demand-gap weight</span> {selectedProject.signals[2].value > selectedProject.signals[0].value ? 'outweighs' : 'complements'} its <span className="font-mono font-semibold">{selectedProject.signals[0].value}% raw complaint volume</span>.
                    {selectedProject.submissionCount > 30 
                      ? ` Despite ${selectedProject.submissionCount} citizen submissions driving attention, the algorithm weights structural need above volume.`
                      : selectedProject.submissionCount < 10
                        ? ` Even with only ${selectedProject.submissionCount} submissions, the underlying demand data elevated this project's ranking.`
                        : ''
                    }
                  </p>
                </div>

                {/* Signal grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-line">
                  {selectedProject.signals.map((signal, idx) => (
                    <div key={idx} className="border-r border-b border-line p-6 flex flex-col justify-between">
                      <p className="font-sans text-xs text-slate mb-4">{signal.label}</p>
                      <div>
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="font-mono text-2xl text-ink">{signal.value}</span>
                          <span className="font-mono text-xs text-slate">%</span>
                        </div>
                        <div className="h-1 w-full bg-line relative overflow-hidden">
                          <motion.div
                            className={`absolute top-0 left-0 bottom-0 ${signal.value > 50 ? 'bg-seal' : 'bg-ink/40'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${signal.value}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comparison callout for Ward 6 narrative */}
                {selectedProject.ward === 'Ward 6' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 border border-line p-6"
                  >
                    <h3 className="font-display text-2xl text-ink mb-3">
                      Why This Matters: The Ward 6 Story
                    </h3>
                    {selectedProject.id === 'p1' ? (
                      <p className="font-sans text-sm text-ink leading-relaxed">
                        The <strong>Vocational Centre</strong> received only <span className="font-mono">12</span> citizen complaints, 
                        while the <strong>School Upgrade</strong> received <span className="font-mono">50</span>. 
                        Yet the Vocational Centre ranks <span className="font-mono">#1</span> because public facility-distance data reveals <span className="font-mono">3×</span> the 
                        population is underserved with a <span className="font-mono">12km</span> gap to the nearest alternative. 
                        Volume alone would have misallocated resources.
                      </p>
                    ) : (
                      <p className="font-sans text-slate text-sm leading-relaxed">
                        The <strong>School Upgrade</strong> generated <span className="font-mono">50</span> complaints, which was the 
                        highest volume of any project. However, capacity data shows the school operates at only <span className="font-mono">70%</span> utilization. 
                        The algorithm correctly deprioritized this request relative to the Vocational Centre, which serves a 
                        population with <span className="font-mono">3×</span> greater structural need.
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
};

export default Track;
