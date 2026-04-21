import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNex } from '../../context/NexContext.jsx';
import { MessageCircle, X } from 'lucide-react';
import NexMascot from '../NexMascot';

const PROACTIVE = [
  'Quer que eu analise sua margem?',
  'Encontrei algo interessante no seu perfil.',
  'Posso identificar oportunidades pra você.',
  'Alguma dúvida financeira?',
  'Sua movimentação mudou esta semana.',
];

export default function NexCharacter() {
  const { isOpen, setIsOpen, currentMood } = useNex();
  const [proactiveMsg, setProactiveMsg] = useState(null);
  const [proactiveKey, setProactiveKey] = useState(0);
  const proactiveTimer = useRef(null);
  const lastIdx = useRef(-1);

  // Proactive message every 30-50s
  useEffect(() => {
    const schedule = () => {
      clearTimeout(proactiveTimer.current);
      proactiveTimer.current = setTimeout(() => {
        if (!isOpen) {
          let idx;
          do { idx = Math.floor(Math.random() * PROACTIVE.length); }
          while (idx === lastIdx.current && PROACTIVE.length > 1);
          lastIdx.current = idx;
          setProactiveMsg(PROACTIVE[idx]);
          setProactiveKey(k => k + 1);
          setTimeout(() => setProactiveMsg(null), 6000);
        }
        schedule();
      }, 30000 + Math.random() * 20000);
    };
    schedule();
    return () => clearTimeout(proactiveTimer.current);
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setProactiveMsg(null);
  };

  // Map mood → NexMascot variant
  const nexMood = currentMood === 'thinking' ? 'thinking'
    : currentMood === 'result' ? 'happy'
    : currentMood === 'guiding' ? 'guiding'
    : 'neutral';

  return (
    <>
      {/* Proactive speech bubble */}
      <AnimatePresence>
        {proactiveMsg && !isOpen && (
          <motion.div
            key={proactiveKey}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: 92,
              right: 24,
              maxWidth: 200,
              zIndex: 58,
              pointerEvents: 'none',
            }}
          >
            <div
              className="bg-white border border-slate-200 shadow-xl rounded-2xl rounded-br-sm px-4 py-3"
              style={{ fontSize: 12, lineHeight: 1.5, color: '#334155' }}
            >
              {proactiveMsg}
              {/* Caret */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -5,
                  right: 18,
                  width: 10,
                  height: 10,
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderTop: 'none',
                  borderLeft: 'none',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Trigger Button – clean, small, never covering content */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 1 }}
        onClick={handleClick}
        aria-label="Falar com o NEX"
        title="Falar com o NEX"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 59,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
          border: '2px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} color="white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} color="white" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Mood indicator dot */}
        {!isOpen && (
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: nexMood === 'thinking' ? '#f59e0b' : nexMood === 'happy' ? '#22c55e' : '#60a5fa',
              border: '2px solid white',
            }}
          />
        )}
      </motion.button>
    </>
  );
}
