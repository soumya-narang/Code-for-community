import React from 'react';
import { motion } from 'framer-motion';

const ScoringEngine: React.FC = () => {
  const signals = [
    { label: "Citizen complaint volume", value: 30, color: "bg-slate" },
    { label: "Urgency / sentiment", value: 15, color: "bg-slate" },
    { label: "Demand-gap (public data)", value: 35, color: "bg-signal" },
    { label: "Recency / trend", value: 20, color: "bg-slate" },
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-line">
      <div className="mb-16">
        <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-seal mb-6">
          The Scoring Engine
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-ink leading-tight mb-8 max-w-3xl">
          Every score is a sentence, not a black box.
        </h2>
      </div>

      <div className="mb-3">
        <span className="font-mono text-[10px] text-seal uppercase tracking-widest opacity-80">Demo :</span>
      </div>
      <div className="border border-line bg-paper">
        {/* Header row */}
        <div className="p-6 md:p-8 border-b border-line flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <span className="font-mono text-xs text-seal uppercase tracking-widest block mb-2">Priority #1</span>
            <h3 className="font-sans text-xl md:text-2xl text-ink font-medium">Ward 6 Vocational Centre</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-slate uppercase tracking-wide">Total Score</span>
            <span className="font-mono text-3xl text-ink">87</span>
          </div>
        </div>

        {/* Signals breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-line">
          {signals.map((signal, index) => (
            <div key={index} className="p-6 md:p-8 flex flex-col justify-between h-40 md:h-48">
              <div>
                <p className="font-sans text-sm text-slate h-10">{signal.label}</p>
              </div>
              <div>
                <p className="font-mono text-2xl text-ink mb-3">{signal.value}%</p>
                <div className="h-1 w-full bg-line relative overflow-hidden">
                  <motion.div 
                    className={`absolute top-0 left-0 bottom-0 ${signal.color}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${signal.value}%` }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, delay: 0.2 + (index * 0.15), ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Justification row */}
        <div className="p-6 md:p-8 border-t border-line bg-line/10">
          <p className="font-sans text-ink text-sm md:text-base leading-relaxed">
            <span className="font-mono text-seal mr-3">JUSTIFICATION:</span>
            Ranked #1 because travel-distance data shows 3&times; the population is underserved, despite fewer raw complaints than the school upgrade request.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScoringEngine;
