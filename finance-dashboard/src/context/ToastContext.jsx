import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    
    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (title, message, duration) => addToast('success', title, message, duration),
    error: (title, message, duration) => addToast('error', title, message, duration),
    warning: (title, message, duration) => addToast('warning', title, message, duration),
    info: (title, message, duration) => addToast('info', title, message, duration),
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-brand-primary" size={24} />;
      case 'error': return <XCircle className="text-rose-500" size={24} />;
      case 'warning': return <AlertCircle className="text-amber-500" size={24} />;
      default: return <Info className="text-blue-400" size={24} />;
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className="toast-item"
            >
              <div className="flex-shrink-0">
                {getIcon(t.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-xs uppercase tracking-tight truncate">
                  {t.title}
                </p>
                {t.message && (
                  <p className="text-slate-400 text-[10px] font-bold mt-1 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
              <button 
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-slate-600 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
