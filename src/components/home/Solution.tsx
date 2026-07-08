import React from 'react';
import { motion } from 'framer-motion';

const Solution: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto border-t border-line">
      <div className="mb-16">
        <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-seal mb-6">
          How Civix Works
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-ink leading-tight mb-8">
          Three steps from complaint to evidence.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:border-t md:border-line">
        
        {/* Step 01 */}
        <div className="py-8 md:py-12 md:pr-8 border-b md:border-b-0 md:border-r border-line flex flex-col h-full">
          <div className="mb-8">
            <span className="font-mono text-sm text-seal">01 &mdash; Collect</span>
            <p className="font-sans text-slate mt-3 leading-relaxed">
              Citizens submit requests via a simple multilingual form, SMS, or WhatsApp.
            </p>
          </div>
          
          <div className="mt-auto pt-8 border-t border-line border-dashed">
            {/* UI Mockup snippet */}
            <div className="bg-paper border border-line p-4 h-32 flex flex-col gap-3">
              <div className="h-2 w-16 bg-slate/20"></div>
              <div className="h-8 w-full border border-line flex items-center px-3">
                <span className="font-sans text-xs text-slate/50">Describe the issue...</span>
              </div>
              <div className="h-8 w-24 bg-ink ml-auto mt-auto flex items-center justify-center">
                <span className="font-sans text-xs text-paper">Submit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 02 */}
        <div className="py-8 md:py-12 md:px-8 border-b md:border-b-0 md:border-r border-line flex flex-col h-full">
          <div className="mb-8">
            <span className="font-mono text-sm text-seal">02 &mdash; Understand</span>
            <p className="font-sans text-slate mt-3 leading-relaxed">
              AI clusters noisy submissions into recurring themes, tagging category, location, and urgency.
            </p>
          </div>
          
          <div className="mt-auto pt-8 border-t border-line border-dashed relative h-40">
            {/* Animation showing clustering */}
            <div className="absolute inset-0 pt-8 flex items-center justify-center">
              <motion.div 
                className="w-full max-w-[200px] bg-paper border border-ink p-3 z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <p className="font-sans text-sm text-ink font-medium">Road repair &mdash; Ward 4</p>
                <p className="font-mono text-xs text-slate mt-1">12 SUBMISSIONS</p>
              </motion.div>

              {/* Scattered dots animating in */}
              <motion.div 
                className="absolute w-2 h-2 bg-slate rounded-full top-4 left-4"
                initial={{ x: -20, y: -20, opacity: 1 }}
                whileInView={{ x: 60, y: 30, opacity: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <motion.div 
                className="absolute w-2 h-2 bg-slate rounded-full bottom-4 left-10"
                initial={{ x: -20, y: 20, opacity: 1 }}
                whileInView={{ x: 40, y: -20, opacity: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
              <motion.div 
                className="absolute w-2 h-2 bg-slate rounded-full top-8 right-6"
                initial={{ x: 20, y: -10, opacity: 1 }}
                whileInView={{ x: -40, y: 20, opacity: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </div>
          </div>
        </div>

        {/* Step 03 */}
        <div className="py-8 md:py-12 md:pl-8 flex flex-col h-full">
          <div className="mb-8">
            <span className="font-mono text-sm text-seal">03 &mdash; Decide</span>
            <p className="font-sans text-slate mt-3 leading-relaxed">
              The Demand-Supply Scoring Engine cross-references citizen demand against real public data to produce a ranked, justified list.
            </p>
          </div>
          
          <div className="mt-auto pt-8 border-t border-line border-dashed">
            {/* Score readout */}
            <div className="bg-ink p-4 h-32 flex flex-col justify-between">
              <span className="font-mono text-xs text-paper/70 uppercase tracking-widest">Priority Score</span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl text-paper">87</span>
                <span className="font-mono text-sm text-paper/50">/100</span>
              </div>
              <span className="font-mono text-xs text-paper/70 mt-2">&mdash; Demand-gap weighted</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Solution;
