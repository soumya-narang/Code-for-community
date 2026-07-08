import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen pt-32 pb-20 px-6 flex flex-col justify-center max-w-6xl mx-auto">
      
      <div className="mb-16 md:mb-24">
        <motion.p 
          className="font-mono text-xs md:text-sm uppercase tracking-widest text-seal mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          AI for Constituency Development Planning
        </motion.p>
        
        <motion.h1 
          className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight md:leading-tight mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="block text-slate font-normal">Priority isn't who shouts loudest.</span>
          <span className="block text-ink font-semibold mt-2">It's who needs it most.</span>
        </motion.h1>
        
        <motion.p 
          className="font-sans text-lg md:text-xl text-slate max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Civix consolidates citizen requests and ranks them against real-world demand data, allowing elected representatives to allocate resources based on evidence instead of noise.
        </motion.p>
      </div>

      {/* Signature Element: The Balance Visualization */}
      <motion.div 
        className="w-full border-t border-b border-line py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
          
          {/* Left Side: Volume-driven */}
          <div className="flex flex-col">
            <div className="mb-4">
              <h3 className="font-sans font-medium text-ink text-lg">Ward 6: School Upgrade</h3>
              <p className="font-mono text-slate text-sm mt-1">RAW COMPLAINT VOLUME</p>
            </div>
            
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-4xl font-semibold text-ink">50</span>
              <span className="font-mono text-sm text-slate">requests</span>
            </div>

            <div className="h-1 bg-line w-full rounded-none overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-slate"
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
              />
            </div>
            
            {/* Empty space to match the right side's data annotations height */}
            <div className="mt-6 flex flex-col gap-2 opacity-30 pointer-events-none">
              <div className="flex justify-between items-center py-2 border-b border-dashed border-line">
                <span className="font-sans text-xs">No demographic flags</span>
                <span className="font-mono text-xs">-</span>
              </div>
            </div>
          </div>

          {/* Right Side: Evidence-driven */}
          <div className="flex flex-col md:border-l md:border-line md:pl-8 relative">
            <div className="mb-4">
              <h3 className="font-sans font-medium text-ink text-lg">Ward 6: Vocational Centre</h3>
              <p className="font-mono text-seal text-sm mt-1">EVIDENCE-BACKED PRIORITY</p>
            </div>
            
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-4xl font-semibold text-ink">12</span>
              <span className="font-mono text-sm text-slate">requests</span>
            </div>

            <div className="h-1 bg-line w-full rounded-none overflow-hidden relative mb-6">
              {/* The base volume bar (small) */}
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-slate"
                initial={{ width: 0 }}
                animate={{ width: '20%' }}
                transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
              />
              {/* The evidence boost bar that overtakes the left side */}
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-signal"
                initial={{ width: '20%' }}
                animate={{ width: '95%' }}
                transition={{ duration: 1.5, delay: 2.2, ease: 'easeOut' }}
                style={{ originX: 0 }}
              />
            </div>

            <div className="flex flex-col gap-0 border-t border-line">
              <motion.div 
                className="flex justify-between items-center py-2.5 border-b border-line"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                <span className="font-sans text-sm text-slate">Distance to nearest alternative</span>
                <span className="font-mono text-sm text-ink font-medium">12km</span>
              </motion.div>
              
              <motion.div 
                className="flex justify-between items-center py-2.5 border-b border-line"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.7 }}
              >
                <span className="font-sans text-sm text-slate">Population served vs capacity</span>
                <span className="font-mono text-sm text-ink font-medium">3&times;</span>
              </motion.div>

              <motion.div 
                className="flex justify-between items-center py-2.5 border-b border-line"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.9 }}
              >
                <span className="font-sans text-sm text-slate">Existing transport links</span>
                <span className="font-mono text-sm text-signal font-medium">0</span>
              </motion.div>
            </div>
          </div>

        </div>
        
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 3 }}
        >
          <p className="font-mono text-xs text-slate tracking-wide">
            Same ward. Fewer complaints. Higher priority because the data backs it up.
          </p>
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;
