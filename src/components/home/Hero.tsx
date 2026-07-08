import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Stage = 'conflict' | 'scanner' | 'evidence';

const Hero: React.FC = () => {
  const [stage, setStage] = useState<Stage>('conflict');
  const [count, setCount] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  // Master Simulation Loop
  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];

    const runLoop = () => {
      setFadeOpacity(1);
      setStage('conflict');
      
      timers.push(setTimeout(() => {
        setStage('scanner');
      }, 4000));
      
      timers.push(setTimeout(() => {
        setStage('evidence');
        setIsSorted(false);
        timers.push(setTimeout(() => setIsSorted(true), 800));
      }, 6000));

      timers.push(setTimeout(() => {
        setFadeOpacity(0);
      }, 9500));

      timers.push(setTimeout(() => {
        runLoop(); 
      }, 10000));
    };

    runLoop();

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  // Rapid Count Animation during Conflict Stage
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (stage === 'conflict') {
      setCount(0);
      let c = 0;
      interval = setInterval(() => {
        c++;
        if (c <= 50) {
          setCount(c);
        } else {
          clearInterval(interval);
        }
      }, 40); // Counts to 50 in 2s
    } else {
      setCount(50);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const springProps = { type: 'spring' as const, stiffness: 200, damping: 25 };

  return (
    <section className="min-h-screen pt-24 pb-48 px-6 flex flex-col justify-center max-w-5xl mx-auto overflow-visible relative">
      
      {/* Intro Headline */}
      <div className="mb-12 text-center relative z-20">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--seal)] mb-4">
          AI for Constituency Development Planning
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
          <span className="block text-slate font-normal">Priority isn't who shouts loudest.</span>
          <span className="block text-ink font-semibold mt-1">It's who needs it most.</span>
        </h1>
      </div>

      <motion.div 
        animate={{ opacity: fadeOpacity }}
        transition={{ duration: 0.4 }}
        className="flex flex-col relative w-full border border-line bg-paper"
      >
        
        {/* Visual Layout Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 p-6 md:p-8 min-h-[400px] overflow-hidden">
           
           {/* Stage 2: The Civix Scanner Line */}
           <AnimatePresence>
              {stage === 'scanner' && (
                <motion.div 
                   initial={{ top: '0%' }}
                   animate={{ top: '100%' }}
                   transition={{ duration: 2, ease: 'linear' }}
                   className="absolute left-0 right-0 h-[2px] z-50 pointer-events-none"
                   style={{ backgroundColor: 'var(--seal)', boxShadow: '0 0 20px 2px var(--seal)' }}
                />
              )}
           </AnimatePresence>
           
           {/* LEFT SIDE: The Loud Noise Channel */}
           <div className="flex flex-col lg:border-r border-line lg:pr-8 pb-10 lg:pb-0">
              <p className="font-mono text-[10px] text-slate uppercase tracking-widest mb-10 text-center lg:text-left">
                [ THE LOUD NOISE CHANNEL // MARKET ROAD POTHOLES&nbsp;]
              </p>
              
              <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
                 <motion.div 
                    layout
                    animate={{ 
                      height: (stage === 'scanner' || stage === 'evidence') ? 30 : 200,
                      opacity: (stage === 'scanner' || stage === 'evidence') ? 0.3 : 1,
                      width: (stage === 'scanner' || stage === 'evidence') ? '60%' : '20%',
                    }}
                    transition={springProps}
                    className="border flex items-end justify-center overflow-hidden self-center border-slate"
                 >
                    <div className="w-full h-full flex flex-col-reverse gap-[1px] p-[1px] opacity-70">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: i < count ? 1 : 0 }}
                          transition={{ duration: 0 }}
                          className="w-full flex-1 bg-slate" 
                        />
                      ))}
                    </div>
                 </motion.div>
              </div>

              <div className="mt-8 text-center h-8">
                 <p className="font-mono text-[11px] lg:text-sm text-ink font-bold uppercase tracking-widest transition-colors duration-300">
                   {count} REPETITIVE COMPLAINTS REGISTERED
                 </p>
              </div>
           </div>

           {/* RIGHT SIDE: The Silent Scarcity Channel */}
           <div className="flex flex-col lg:pl-8 pt-10 lg:pt-0 border-t lg:border-t-0 border-line">
              <p className="font-mono text-[10px] text-slate uppercase tracking-widest mb-10 text-center lg:text-left">
                [ THE SILENT SCARCITY CHANNEL // ISOLATED VOCATIONAL CENTRE&nbsp;]
              </p>
              
              <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
                 {/* The Vector Bracket */}
                 <motion.div 
                    layout
                    animate={{
                       borderColor: (stage === 'scanner' || stage === 'evidence') ? 'var(--seal)' : 'var(--slate)',
                       borderTopWidth: (stage === 'scanner' || stage === 'evidence') ? '4px' : '2px',
                       borderLeftWidth: (stage === 'scanner' || stage === 'evidence') ? '4px' : '2px',
                       borderRightWidth: (stage === 'scanner' || stage === 'evidence') ? '4px' : '2px',
                    }}
                    transition={springProps}
                    className="w-[80%] h-16 opacity-90 flex items-start justify-center pt-2 relative mt-8"
                    style={{ borderTopStyle: 'solid', borderLeftStyle: 'solid', borderRightStyle: 'solid' }}
                 >
                    <div className="absolute -left-1.5 -bottom-2 w-3 h-3 bg-paper border border-ink rounded-sm" />
                    <div className="absolute -right-1.5 -bottom-2 w-3 h-3 bg-paper border border-ink rounded-full" />
                    
                    <motion.span 
                      animate={{
                         scale: (stage === 'scanner' || stage === 'evidence') ? 1.15 : 1,
                         color: (stage === 'scanner' || stage === 'evidence') ? 'var(--seal)' : 'var(--ink)',
                         y: (stage === 'scanner' || stage === 'evidence') ? -35 : -25
                      }}
                      transition={springProps}
                      className="absolute font-mono text-[11px] lg:text-sm font-bold tracking-widest uppercase bg-paper px-4 whitespace-nowrap text-center inline-block"
                    >
                      12km ACCESS GAP<br/>
                      <span className="text-[9px] opacity-70">(ZERO TRANSIT LINKS)</span>
                    </motion.span>
                 </motion.div>
              </div>

              <div className="mt-8 text-center h-8">
                 <p className="font-mono text-[11px] lg:text-sm text-slate font-bold uppercase tracking-widest opacity-60">
                   3 SUBMISSIONS
                 </p>
              </div>
           </div>
        </div>

        {/* Dynamic Subtitle Axis */}
        <div className="min-h-[90px] flex items-center justify-center text-center px-6 md:px-12 w-full border-t border-line py-6 bg-line/5 relative overflow-hidden">
           <AnimatePresence mode="wait">
              {stage === 'conflict' && (
                <motion.p key="1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-sans text-slate text-sm lg:text-base italic max-w-2xl">
                  "Traditional systems prioritize the market road because 50 people shouted loudly over a minor annoyance."
                </motion.p>
              )}
              {stage === 'scanner' && (
                <motion.p key="2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-sans text-slate text-sm lg:text-base italic max-w-2xl">
                  "Civix automatically weighs the complaint volume against real infrastructure data..."
                </motion.p>
              )}
              {stage === 'evidence' && (
                <motion.p key="3" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-mono text-[var(--ink)] text-[11px] lg:text-xs leading-relaxed border-l-2 border-[var(--seal)] pl-4 text-left max-w-3xl">
                  RESULT: Vocational Centre takes <span className="font-bold text-[var(--seal)]">Priority #01</span> because a <span className="font-bold text-[var(--seal)]">12km isolation gap</span> outweighs 50 minor complaints.
                </motion.p>
              )}
           </AnimatePresence>
        </div>

        {/* Mini Ledger Array (Stage 3 Slide-Open) */}
        <div className="w-full absolute bottom-0 left-0 right-0 z-20 flex justify-center translate-y-[calc(100%+2rem)]">
           <AnimatePresence>
              {stage === 'evidence' && (
                 <motion.div 
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -20 }}
                    transition={springProps}
                    className="w-full max-w-2xl flex flex-col items-center"
                 >
                    <div className="w-full flex flex-col gap-3 border border-line bg-paper p-5 md:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                       {isSorted ? (
                          <>
                             <motion.div layout key="clinic" transition={springProps} className="w-full border border-[var(--seal)] bg-[var(--seal)]/5 p-4 flex flex-col md:flex-row justify-between md:items-center gap-2">
                                <span className="font-sans text-ink font-semibold">Vocational Centre</span>
                                <span className="font-mono text-[var(--seal)] font-bold tracking-widest text-[10px] uppercase">Rank #01 // Evidence Priority</span>
                             </motion.div>
                             <motion.div layout key="road" transition={springProps} className="w-full border border-line bg-paper p-4 flex flex-col md:flex-row justify-between md:items-center gap-2 opacity-50">
                                <span className="font-sans text-ink font-medium">Market Road Repair</span>
                                <span className="font-mono text-slate font-bold tracking-widest text-[10px] uppercase">Rank #02 // Deferred</span>
                             </motion.div>
                          </>
                       ) : (
                          <>
                             <motion.div layout key="road" transition={springProps} className="w-full border border-line bg-paper p-4 flex flex-col md:flex-row justify-between md:items-center gap-2">
                                <span className="font-sans text-ink font-medium">Market Road Repair</span>
                                <span className="font-mono text-slate font-bold tracking-widest text-[10px] uppercase">Rank #01 // Raw Volume</span>
                             </motion.div>
                             <motion.div layout key="clinic" transition={springProps} className="w-full border border-line bg-paper p-4 flex flex-col md:flex-row justify-between md:items-center gap-2 opacity-50">
                                <span className="font-sans text-ink font-medium">Vocational Centre</span>
                                <span className="font-mono text-slate font-bold tracking-widest text-[10px] uppercase">Rank #02 // Hidden Need</span>
                             </motion.div>
                          </>
                       )}
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

      </motion.div>
    </section>
  );
};

export default Hero;
