import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, Lock } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, checkoutUrl }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Pagamento Seguro VYNEX</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Lock size={10} /> Conexão Criptografada via Mercado Pago
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
            >
              <X size={20} />
            </button>
          </div>

          {/* Iframe Content */}
          <div className="flex-1 bg-slate-100 relative">
            <iframe
              src={checkoutUrl}
              className="w-full h-full border-none"
              title="Mercado Pago Checkout"
              allow="payment"
            />
            
            {/* Overlay if MP blocks iframe (CSP) */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-12 text-center opacity-0 hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-[2px]">
               {/* This is a fail-safe UI if the iframe is blocked by some browsers */}
            </div>
          </div>

          {/* Footer Fallback */}
          <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">
              * Se a página não carregar, clique no botão ao lado
            </p>
            <a 
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              Abrir em tela cheia <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
