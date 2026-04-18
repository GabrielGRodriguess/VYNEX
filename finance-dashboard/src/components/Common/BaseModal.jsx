import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const BaseModal = ({ isOpen, onClose, title, children, showClose = true, maxWidth = 'max-w-md' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`modal-container ${maxWidth}`}
          >
            {/* Background design elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                {title && (
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
                    <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(163,255,18,0.5)]"></span>
                    {title}
                  </h2>
                )}
                
                {showClose && (
                  <button 
                    onClick={onClose} 
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all border border-white/5 hover:border-white/10 group active:scale-95"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                )}
              </div>

              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BaseModal;
