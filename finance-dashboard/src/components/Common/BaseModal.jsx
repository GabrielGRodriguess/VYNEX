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
            className="absolute inset-0 cursor-pointer"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className={`modal-container ${maxWidth}`}
          >
            {/* Soft decorative glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                {title && (
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                    {title}
                  </h2>
                )}
                
                {showClose && (
                  <button 
                    onClick={onClose} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100 group active:scale-95"
                  >
                    <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
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
