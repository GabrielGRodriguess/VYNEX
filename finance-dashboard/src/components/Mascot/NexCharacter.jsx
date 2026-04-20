import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNex } from '../../context/NexContext.jsx';
import nexNeutral from '../../assets/mascot/nex-neutral.png';
import nexThinking from '../../assets/mascot/nex-thinking.png';
import nexResult   from '../../assets/mascot/nex-result.png';
import nexGuiding  from '../../assets/mascot/nex-guiding.png';

const MOOD_ASSETS = {
  idle:     { src: nexNeutral,  anim: 'nex-breathe'  },
  thinking: { src: nexThinking, anim: 'nex-thinking' },
  guiding:  { src: nexGuiding,  anim: 'nex-talking'  },
  result:   { src: nexResult,   anim: 'nex-success'  },
  neutral:  { src: nexNeutral,  anim: 'nex-breathe'  },
};

// ─── Falas proativas ──────────────────────────────────────────────────────────
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
  const lastIdx        = useRef(-1);

  // ── Mensagem proativa (30–50s) ──
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
    if (!isOpen) {
      setIsOpen(true);
      setProactiveMsg(null);
    }
  };

  // No character when chat is open
  if (isOpen) return null;

  const currentAsset = MOOD_ASSETS[currentMood] || MOOD_ASSETS.idle;

  return (
    <>
      {/* ── Speech bubble proativa ── */}
      <AnimatePresence>
        {proactiveMsg && (
          <motion.div
            key={proactiveKey}
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              bottom: 200,
              right: 24,
              maxWidth: 190,
              zIndex: 58,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '12px 16px',
                borderRadius: '16px 16px 4px 16px',
                fontSize: 11,
                lineHeight: 1.5,
                color: '#cbd5e1',
                background: 'rgba(10, 15, 28, 0.94)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              }}
            >
              {proactiveMsg}
              {/* Seta que aponta pro Nex */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  right: 20,
                  width: 12,
                  height: 12,
                  background: 'rgba(10, 15, 28, 0.94)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderTop: 'none',
                  borderLeft: 'none',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PERSONAGEM FLUTUANTE ── */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.8 }}
        onClick={handleClick}
        title="Falar com o Nex"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 12,
          zIndex: 59,
          cursor: 'pointer',
          width: 150,
          transform: 'translateY(12%)',
          background: 'none',
          border: 'none',
          padding: 0,
          outline: 'none',
        }}
        whileHover={{
          y: -14,
          transition: { type: 'spring', stiffness: 200, damping: 15 },
        }}
        whileTap={{ scale: 0.96 }}
      >
        <motion.img
          key={currentMood}
          src={currentAsset.src}
          alt={`Nex - ${currentMood}`}
          draggable={false}
          loading="lazy"
          className={currentAsset.anim}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            filter: [
              'drop-shadow(0 0 24px rgba(0, 170, 255, 0.5))',
              'drop-shadow(0 0 10px rgba(0, 120, 220, 0.35))',
              'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.5))',
            ].join(' '),
            userSelect: 'none',
            pointerEvents: 'auto',
          }}
        />
      </motion.div>
    </>
  );
}
