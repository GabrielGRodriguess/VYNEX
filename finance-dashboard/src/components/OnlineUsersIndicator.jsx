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
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/[0.03] border border-brand-green/20 backdrop-blur-md shadow-[0_0_15px_rgba(163,255,18,0.05)]">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green shadow-[0_0_8px_#A3FF12]"></span>
      </div>
      
      <div className="flex items-center gap-1.5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] font-black text-brand-green"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        
        <p className="text-[10px] font-black text-brand-green/80 uppercase tracking-widest whitespace-nowrap">
          {count === 1 ? 'pessoa' : 'pessoas'}{' '}
          <span className="hidden sm:inline">online</span>
          <span className="sm:hidden text-[10px]">on</span>
        </p>
      </div>
    </div>
  );
}

