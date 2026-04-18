import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnlineUsersIndicator() {
  const [count, setCount] = useState(7);

  useEffect(() => {
    let timeoutId;
    
    const updateCount = () => {
      setCount(prev => {
        const change = Math.random() > 0.6 ? 1 : -1;
        const next = prev + change;
        if (next < 3) return 4;
        if (next > 12) return 11;
        return next;
      });

      // Random interval between 8s and 25s
      const nextInterval = Math.floor(Math.random() * (25000 - 8000 + 1)) + 8000;
      timeoutId = setTimeout(updateCount, nextInterval);
    };

    timeoutId = setTimeout(updateCount, 10000);

    return () => clearTimeout(timeoutId);
  }, []);

  const getCopy = (n) => {
    const copies = [
      'analisando crédito agora',
      'consultando limite neste momento',
      'simulando taxas agora',
      'verificando margem livre'
    ];
    // Keep it stable for a bit by using count as seed
    return copies[n % copies.length];
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/[0.03] border border-brand-primary/20 backdrop-blur-md shadow-[0_0_15px_rgba(163,255,18,0.05)]">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary shadow-[0_0_8px_#A3FF12]"></span>
      </div>
      
      <div className="flex items-center gap-1.5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[10px] font-black text-brand-primary"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        
        <p className="text-[10px] font-black text-brand-primary/80 uppercase tracking-widest whitespace-nowrap">
          {getCopy(count)}
        </p>
      </div>
    </div>
  );
}

