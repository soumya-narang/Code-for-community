import React from 'react';
import { motion } from 'framer-motion';

const Problem: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-line">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-seal mb-6">
          The Problem
        </p>
        
        <h2 className="font-display text-3xl md:text-5xl text-ink leading-tight md:leading-tight mb-16 max-w-3xl">
          Development priority is set by access, not need.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <p className="font-sans text-lg text-slate leading-relaxed">
              Today, elected representatives receive thousands of citizen requests through public meetings, hand-written letters, social media, and grievance portals. But without a clear way to organize these scattered reports, there is no way to weigh requests against each other. Priority defaults to those who complain the loudest or have the most direct access, leaving the most vulnerable constituents behind.
            </p>
          </div>

          {/* Right Column: Annotated Visual */}
          <div className="relative">
            <div className="mb-3">
              <span className="font-mono text-[10px] text-seal uppercase tracking-widest opacity-80">Demo :</span>
            </div>
            <div className="flex flex-col border-t border-line">
              <div className="py-4 border-b border-line flex justify-between items-center">
                <span className="font-sans text-ink">Road repair in Ward 2</span>
                <span className="font-mono text-slate text-sm">34 mentions</span>
              </div>
              <div className="py-4 border-b border-line flex justify-between items-center bg-line/20">
                <span className="font-sans text-ink">Water supply in Ward 9</span>
                <span className="font-mono text-slate text-sm">12 mentions</span>
              </div>
              <div className="py-4 border-b border-line flex justify-between items-center">
                <span className="font-sans text-ink">Streetlights in Ward 4</span>
                <span className="font-mono text-slate text-sm">8 mentions</span>
              </div>
              <div className="py-4 border-b border-line flex justify-between items-center">
                <span className="font-sans text-ink">Clinic staffing in Ward 1</span>
                <span className="font-mono text-slate text-sm">3 mentions</span>
              </div>
            </div>

            {/* Annotation */}
            <div className="mt-6 lg:absolute lg:top-1/2 lg:-right-8 lg:translate-x-full lg:-translate-y-1/2">
              <div className="flex items-start gap-3 lg:w-48">
                <div className="hidden lg:block w-8 border-t border-line mt-2" />
                <p className="font-mono text-xs text-seal uppercase tracking-wide leading-relaxed">
                  No objective ranking.<br />
                  No data.<br />
                  Just noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Problem;
