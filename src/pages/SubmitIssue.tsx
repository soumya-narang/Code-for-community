import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';
import type { Category } from '../store/useProjectStore';

type SubmitCategory = Exclude<Category, 'All' | 'Other'>;

interface AIExtraction {
  location: string;
  category: string;
  sentiment: string;
  matchedProject: string | null;
  matchedProjectId: string | null;
  confidence: number;
}

const CATEGORY_OPTIONS: SubmitCategory[] = ['Education', 'Health', 'Roads', 'Water', 'Electricity', 'Sanitation'];
const WARD_OPTIONS = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9'];

// Simulated AI extraction logic — pattern-matches against keywords to demonstrate the pipeline
function simulateExtraction(text: string, ward: string, category: SubmitCategory): AIExtraction {
  const lower = text.toLowerCase();

  let sentiment = 'Informational';
  const urgentWords = ['dangerous', 'accident', 'sick', 'unsafe', 'broken', 'cut off', 'no access', 'emergency', 'dying', 'collapse', 'flooded'];
  const frustratedWords = ['tired', 'nothing done', 'ignored', 'years', 'waiting', 'useless', 'corrupt'];
  if (urgentWords.some(w => lower.includes(w))) sentiment = 'Urgent / Safety Risk';
  else if (frustratedWords.some(w => lower.includes(w))) sentiment = 'Frustrated / Repeated Request';
  else if (lower.length > 60) sentiment = 'Moderate Concern';

  let inferredCategory = category;
  if (lower.includes('school') || lower.includes('training') || lower.includes('skill') || lower.includes('vocational') || lower.includes('college')) inferredCategory = 'Education';
  if (lower.includes('road') || lower.includes('pothole') || lower.includes('highway') || lower.includes('bridge')) inferredCategory = 'Roads';
  if (lower.includes('water') || lower.includes('pipe') || lower.includes('bore') || lower.includes('tap') || lower.includes('drinking')) inferredCategory = 'Water';
  if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('doctor') || lower.includes('health')) inferredCategory = 'Health';
  if (lower.includes('electric') || lower.includes('power') || lower.includes('transformer') || lower.includes('voltage')) inferredCategory = 'Electricity';
  if (lower.includes('drain') || lower.includes('sewer') || lower.includes('garbage') || lower.includes('waste') || lower.includes('toilet')) inferredCategory = 'Sanitation';

  // Try to match to an existing project theme
  let matchedProject: string | null = null;
  let matchedProjectId: string | null = null;
  const projects = useProjectStore.getState().projects;
  
  for (const p of projects) {
    if (p.ward !== ward) continue;
    const themeWords = p.theme.toLowerCase().split(/\s+/);
    const textLower = text.toLowerCase();
    // Check if any significant theme words appear in the text
    const matchCount = themeWords.filter(w => w.length > 3 && textLower.includes(w)).length;
    if (matchCount >= 1 && p.category === inferredCategory) {
      matchedProject = p.theme;
      matchedProjectId = p.id;
      break;
    }
  }
  // Fallback: match by category + ward
  if (!matchedProject) {
    const fallback = projects.find(p => p.ward === ward && p.category === inferredCategory);
    if (fallback) {
      matchedProject = fallback.theme;
      matchedProjectId = fallback.id;
    }
  }

  return {
    location: ward,
    category: inferredCategory,
    sentiment,
    matchedProject,
    matchedProjectId,
    confidence: matchedProject ? 87 + Math.floor(Math.random() * 10) : 62 + Math.floor(Math.random() * 15),
  };
}

const SubmitIssue: React.FC = () => {
  const addSubmission = useProjectStore((s) => s.addSubmission);

  const [category, setCategory] = useState<SubmitCategory>('Education');
  const [ward, setWard] = useState('Ward 6');
  const [description, setDescription] = useState('');
  
  const [extraction, setExtraction] = useState<AIExtraction | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSimulate = () => {
    if (description.trim().length < 10) return;
    setIsExtracting(true);
    setExtraction(null);
    // Simulate async AI processing
    setTimeout(() => {
      const result = simulateExtraction(description, ward, category);
      setExtraction(result);
      setIsExtracting(false);
    }, 1200);
  };

  const handleFinalSubmit = () => {
    if (!extraction) return;
    if (extraction.matchedProjectId) {
      addSubmission(extraction.matchedProjectId, description);
    }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setCategory('Education');
    setWard('Ward 6');
    setDescription('');
    setExtraction(null);
    setIsExtracting(false);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-paper text-slate font-sans">
      
      {/* Header */}
      <header className="border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="text-3xl font-display font-semibold text-ink tracking-tight">
              Civix
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/track" className="font-sans text-sm text-slate hover:text-ink transition-colors">
                Track Promises
              </Link>
              <Link to="/dashboard" className="font-mono text-[10px] text-slate hover:text-ink uppercase tracking-widest transition-colors">
                MP Login →
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] text-seal uppercase tracking-widest">01 — Collect</span>
            <span className="w-8 h-px bg-line inline-block" />
            <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Citizen Intake Terminal</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl text-ink leading-tight">
            Submit a development request for your ward.
          </h1>
          <p className="font-sans text-slate mt-3 max-w-2xl leading-relaxed">
            Your submission is anonymized, tagged by AI, and cross-referenced against public data to determine real demand — not just complaint volume.
          </p>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Field: Category */}
              <div className="py-6 border-b border-line">
                <label className="font-mono text-[10px] text-ink uppercase tracking-widest block mb-4">
                  Issue Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 text-sm font-sans border transition-colors ${
                        category === cat
                          ? 'border-ink bg-ink text-paper'
                          : 'border-line text-slate hover:border-ink hover:text-ink'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field: Ward */}
              <div className="py-6 border-b border-line">
                <label className="font-mono text-[10px] text-ink uppercase tracking-widest block mb-4">
                  Ward / Location
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full max-w-xs border border-line bg-paper px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-ink rounded-none appearance-none cursor-pointer"
                >
                  {WARD_OPTIONS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Field: Description */}
              <div className="py-6 border-b border-line">
                <label className="font-mono text-[10px] text-ink uppercase tracking-widest block mb-4">
                  Describe the Issue
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="e.g. The path to the tapovan training facility is completely cut off, we have to travel 12km to the next town for any skill development..."
                  className="w-full border border-line bg-paper p-4 text-sm font-sans text-ink leading-relaxed focus:outline-none focus:border-ink rounded-none resize-none placeholder:text-slate/50"
                />
                
                {/* Simulate Button */}
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={handleSimulate}
                    disabled={description.trim().length < 10 || isExtracting}
                    className={`px-6 py-3 text-sm font-sans font-medium border transition-all ${
                      description.trim().length < 10
                        ? 'border-line text-slate/40 cursor-not-allowed'
                        : 'border-ink text-ink hover:bg-ink hover:text-paper'
                    }`}
                  >
                    {isExtracting ? 'Processing…' : 'Simulate AI Breakdown'}
                  </button>
                  <span className="font-mono text-[10px] text-slate">
                    {description.trim().length < 10 ? 'Min 10 characters' : `${description.length} characters`}
                  </span>
                </div>
              </div>

              {/* AI Extraction Preview */}
              <AnimatePresence>
                {isExtracting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="py-8 border-b border-line">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 border-2 border-ink animate-spin" />
                        <span className="font-mono text-xs text-ink">Running extraction pipeline…</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {extraction && !isExtracting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="py-8 border-b border-line">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="font-mono text-[10px] text-seal uppercase tracking-widest">AI Extraction Preview</span>
                        <span className="w-8 h-px bg-seal inline-block" />
                        <span className="font-mono text-[10px] text-slate">Pipeline Confidence: {extraction.confidence}%</span>
                      </div>

                      {/* Extracted Tags */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        {[
                          { label: 'Location', value: extraction.location },
                          { label: 'Category', value: extraction.category },
                          { label: 'Extracted Sentiment', value: extraction.sentiment },
                        ].map((tag) => (
                          <motion.div
                            key={tag.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="border-l-2 border-seal pl-4"
                          >
                            <span className="font-mono text-[10px] text-slate uppercase tracking-widest block mb-1">{tag.label}</span>
                            <span className="font-sans text-sm text-ink font-medium">{tag.value}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Matched Project */}
                      {extraction.matchedProject && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="bg-ink/5 border border-line p-5 mb-8"
                        >
                          <span className="font-mono text-[10px] text-ink uppercase tracking-widest block mb-2">
                            Matched to Existing Theme
                          </span>
                          <p className="font-display text-lg text-ink">{extraction.matchedProject}</p>
                          <p className="font-sans text-xs text-slate mt-1">
                            Your submission will be added to this theme's citizen evidence pool, strengthening its data signal.
                          </p>
                        </motion.div>
                      )}

                      {!extraction.matchedProject && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="border border-line p-5 mb-8"
                        >
                          <span className="font-mono text-[10px] text-slate uppercase tracking-widest block mb-2">
                            No Existing Theme Match
                          </span>
                          <p className="font-sans text-sm text-slate">
                            This will be logged as a new unmatched submission and reviewed during the next evaluation cycle.
                          </p>
                        </motion.div>
                      )}

                      {/* Final Submit */}
                      <button
                        onClick={handleFinalSubmit}
                        className="bg-ink text-paper px-8 py-3 text-sm font-sans font-medium hover:bg-ink/90 transition-colors"
                      >
                        Confirm & Submit to Ward Record
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="py-16 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 border-2 border-seal flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-seal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-ink mb-3">Submission Recorded</h2>
              <p className="font-sans text-sm text-slate max-w-md mb-2">
                Your input has been anonymized, tagged, and added to the evidence pool.
              </p>
              {extraction?.matchedProject && (
                <p className="font-mono text-xs text-seal mb-6">
                  Linked to theme: "{extraction.matchedProject}" — submission count updated live.
                </p>
              )}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 text-sm font-sans border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
                >
                  Submit Another
                </button>
                <Link
                  to="/track"
                  className="px-6 py-3 text-sm font-sans bg-ink text-paper hover:bg-ink/90 transition-colors"
                >
                  View Public Ledger →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SubmitIssue;
