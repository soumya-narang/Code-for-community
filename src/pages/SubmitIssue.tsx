import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CivixLogo } from '../components/CivixLogo';

type SubmitCategory = 'Education' | 'Health' | 'Roads' | 'Water' | 'Electricity' | 'Sanitation' | 'Other';

interface AIResponse {
  tracking_id: string;
  normalized_text: string;
  category: string;
  sentiment: string;
}

const CATEGORY_OPTIONS: SubmitCategory[] = ['Education', 'Health', 'Roads', 'Water', 'Electricity', 'Sanitation'];
const WARD_OPTIONS = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9'];

const SubmitIssue: React.FC = () => {
  const [category, setCategory] = useState<SubmitCategory>('Education');
  const [ward, setWard] = useState('Ward 6');
  const [description, setDescription] = useState('');
  
  const [extraction, setExtraction] = useState<AIResponse | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFinalSubmit = async () => {
    if (description.trim().length < 10) {
      setErrorMsg("Description must be at least 10 characters long.");
      return;
    }
    
    setIsExtracting(true);
    setErrorMsg('');
    setExtraction(null);

    try {
      const res = await fetch('http://localhost:8080/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_text: description,
          category: category,
          ward: ward,
          lat: 0.0,
          lng: 0.0,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: AIResponse = await res.json();
      setExtraction(data);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to submit issue to backend. Ensure the server is running on :8080.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleReset = () => {
    setCategory('Education');
    setWard('Ward 6');
    setDescription('');
    setExtraction(null);
    setIsExtracting(false);
    setIsSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-paper text-slate font-sans">
      
      {/* Header */}
      <header className="border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center" aria-label="Civix Home">
              <CivixLogo className="h-9 w-auto" />
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
            <span className="font-mono text-[10px] text-seal uppercase tracking-widest">Step 01: Collect</span>
            <span className="w-8 h-px bg-line inline-block" />
            <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Citizen Intake Terminal</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl text-ink leading-tight">
            Submit a development request for your ward.
          </h1>
          <p className="font-sans text-slate mt-3 max-w-2xl leading-relaxed">
            Your submission is anonymized, tagged by AI, and cross-referenced against public data to determine real demand instead of just looking at complaint volume.
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
                <div className="flex items-between justify-between mb-4">
                  <label className="font-mono text-[10px] text-ink uppercase tracking-widest block">
                    Issue Description
                  </label>
                  <span className="font-mono text-[10px] text-slate">{description.length} chars</span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in your own words. We support multiple languages..."
                  className="w-full h-32 border border-line bg-paper px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-ink resize-none"
                />
              </div>

              {errorMsg && (
                <div className="mt-6 text-red-600 font-sans text-sm font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button & Loader */}
              <div className="py-8 flex flex-col md:flex-row md:items-center gap-6">
                <button
                  onClick={handleFinalSubmit}
                  disabled={isExtracting || description.trim().length < 10}
                  className={`px-8 py-4 text-sm font-sans font-medium transition-colors ${
                    isExtracting || description.trim().length < 10
                      ? 'bg-line text-slate cursor-not-allowed'
                      : 'bg-ink text-paper hover:bg-ink/90'
                  }`}
                >
                  {isExtracting ? 'Connecting to Civix AI...' : 'Submit Evidence'}
                </button>
              </div>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="py-16 flex flex-col items-start border border-line p-8"
            >
              <div className="w-12 h-12 border-2 border-seal flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-seal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-ink mb-3">Submission Recorded</h2>
              <p className="font-sans text-sm text-slate max-w-md mb-8">
                Your input has been processed by AI, translated, tagged, and added to the evidence pool for your ward.
              </p>
              
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line mb-8">
                <div className="bg-paper p-5">
                  <span className="font-mono text-[10px] text-slate uppercase tracking-widest block mb-2">Tracking ID</span>
                  <span className="font-mono text-sm text-ink">{extraction?.tracking_id}</span>
                </div>
                <div className="bg-paper p-5">
                  <span className="font-mono text-[10px] text-slate uppercase tracking-widest block mb-2">AI Tagged Category</span>
                  <span className="font-sans text-sm text-ink">{extraction?.category}</span>
                </div>
                <div className="bg-paper p-5">
                  <span className="font-mono text-[10px] text-slate uppercase tracking-widest block mb-2">Urgency Level</span>
                  <span className="font-sans text-sm text-ink">{extraction?.sentiment}</span>
                </div>
                <div className="bg-paper p-5">
                  <span className="font-mono text-[10px] text-slate uppercase tracking-widest block mb-2">Normalized Text</span>
                  <span className="font-sans text-sm text-ink italic leading-relaxed line-clamp-2">"{extraction?.normalized_text}"</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 text-sm font-sans border border-ink text-ink hover:bg-ink hover:text-paper transition-colors text-center"
                >
                  Submit Another
                </button>
                <Link
                  to="/track"
                  className="px-6 py-3 text-sm font-sans bg-ink text-paper hover:bg-ink/90 transition-colors text-center"
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
