import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnlineUsersIndicator() {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        // Keep between 3 and 12
        if (next < 3) return 3;
        if (next > 12) return 12;
        return next;
       });
    }, 7000); // Update every 7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/40 border border-white/5 backdrop-blur-md">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
      </div>
      
      <div className="flex items-center gap-1.5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] font-black text-white"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest whitespace-nowrap">
          {count === 1 ? 'pessoa' : 'pessoas'}{' '}
          <span className="hidden sm:inline">online</span>
          <span className="sm:hidden text-[10px]">on</span>
        </p>
      </div>
    </div>
  );
}
