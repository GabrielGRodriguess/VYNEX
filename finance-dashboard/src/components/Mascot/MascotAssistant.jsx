import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus } from 'lucide-react';
import { getStateConfig, MASCOT_STATES, getAllAssets } from './mascotStates';
import { getMessage } from './mascotMessages';

// Tamanhos do mascote
const SIZES = {
  sm: { img: 64, container: 80 },
  md: { img: 96, container: 120 },
  lg: { img: 140, container: 170 },
};

// Animações CSS via framer-motion variants
const mascotAnimations = {
  breathe: {
    animate: {
      y: [0, -4, 0],
      scale: [1, 1.02, 1],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  float: {
    animate: {
      y: [0, -8, 0],
      rotate: [0, 1, -1, 0],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  'pulse-glow': {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.85, 1],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  celebrate: {
    animate: {
      y: [0, -12, 0],
      rotate: [0, -3, 3, 0],
      scale: [1, 1.08, 1],
    },
    transition: {
      duration: 0.8,
      repeat: 2,
      ease: 'easeOut',
    },
  },
  shake: {
    animate: {
      x: [0, -4, 4, -4, 0],
    },
    transition: {
      duration: 0.5,
      repeat: 1,
    },
  },
};

// Pré-carrega todos os assets do mascote
function preloadAssets() {
  getAllAssets().forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

export default function MascotAssistant({ activeSection, isBankConnected, isLoading, hasError, isOnboarding }) {
  const [currentState, setCurrentState] = useState(MASCOT_STATES.IDLE);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const autoHideTimer = useRef(null);
  const showTimer = useRef(null);
  const hasShownOnboarding = useRef(false);
  const hasShownDashboard = useRef(false);

  // Pré-carrega assets no mount
  useEffect(() => {
    preloadAssets();
  }, []);

  // Determinar estado com base nos triggers do app
  const determineState = useCallback(() => {
    if (isOnboarding && !hasShownOnboarding.current) {
      hasShownOnboarding.current = true;
      return MASCOT_STATES.ONBOARDING;
    }

    if (hasError) {
      return MASCOT_STATES.ERROR;
    }

    if (isLoading) {
      return MASCOT_STATES.LOADING;
    }

    if (activeSection === 'credit') {
      return MASCOT_STATES.LOADING;
    }

    if (activeSection === 'dashboard' && !isBankConnected) {
      return MASCOT_STATES.CONNECTING_BANK;
    }

    if (activeSection === 'dashboard' && isBankConnected && !hasShownDashboard.current) {
      hasShownDashboard.current = true;
      return MASCOT_STATES.DASHBOARD;
    }

    if (activeSection === 'agents') {
      return MASCOT_STATES.NO_INTEGRATION;
    }

    return null; // Não mostrar
  }, [activeSection, isBankConnected, isLoading, hasError, isOnboarding]);

  // Reagir a mudanças de contexto
  useEffect(() => {
    if (isDismissed) return;

    const newState = determineState();

    if (!newState) {
      // Sem razão pra aparecer agora - esconder com delay
      if (showTimer.current) clearTimeout(showTimer.current);
      setIsVisible(false);
      return;
    }

    const config = getStateConfig(newState);

    // Limpar timers anteriores
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    if (showTimer.current) clearTimeout(showTimer.current);

    // Mostrar mascote com um leve delay (não ser intrusivo)
    showTimer.current = setTimeout(() => {
      setCurrentState(newState);
      setMessage(getMessage(config.messageCategory));
      setIsMinimized(false);
      setIsVisible(true);

      // Auto-hide se configurado
      if (config.autoHide && config.autoHideDelay > 0) {
        autoHideTimer.current = setTimeout(() => {
          setIsVisible(false);
        }, config.autoHideDelay);
      }
    }, 1200); // Delay de 1.2s antes de aparecer

    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    };
  }, [activeSection, isBankConnected, isLoading, hasError, isOnboarding, isDismissed, determineState]);

  // Handlers de interação
  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Reativar após um tempo
    setTimeout(() => setIsDismissed(false), 60000); // 1 minuto
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    // Resetar auto-hide
    const config = getStateConfig(currentState);
    if (config.autoHide && config.autoHideDelay > 0) {
      if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
      autoHideTimer.current = setTimeout(() => {
        setIsVisible(false);
      }, config.autoHideDelay);
    }
  };

  const config = getStateConfig(currentState);
  const sizeConfig = SIZES[config.size] || SIZES.sm;
  const animation = mascotAnimations[config.animation] || mascotAnimations.breathe;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-[55] flex flex-col items-end gap-2"
          style={{ maxWidth: isMinimized ? '60px' : '320px' }}
        >
          {/* Balão de mensagem */}
          <AnimatePresence>
            {!isMinimized && message && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ delay: 0.3 }}
                className="relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl rounded-br-sm p-4 shadow-2xl shadow-black/40 max-w-[280px]"
              >
                {/* Controles */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={handleMinimize}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-all"
                    title="Minimizar"
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-rose-400 transition-all"
                    title="Fechar"
                  >
                    <X size={12} />
                  </button>
                </div>

                {/* Indicador de nome */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.2em]">Nex</span>
                </div>

                {/* Mensagem */}
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed pr-8">
                  {message}
                </p>

                {/* Seta do balão */}
                <div className="absolute -bottom-1 right-4 w-3 h-3 bg-slate-900/95 border-r border-b border-white/10 rotate-45 transform" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mascote */}
          <motion.div
            {...animation}
            onClick={isMinimized ? handleMaximize : undefined}
            className={`relative cursor-pointer group ${isMinimized ? 'hover:scale-110' : ''}`}
            style={{
              width: isMinimized ? 48 : sizeConfig.container,
              height: isMinimized ? 48 : sizeConfig.container,
            }}
          >
            {/* Glow de fundo */}
            <div
              className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-50 transition-opacity"
              style={{
                background: 'radial-gradient(circle, rgba(0, 180, 255, 0.3) 0%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />

            {/* Imagem do mascote */}
            <img
              src={config.image}
              alt="Nex - Assistente VYNEX"
              className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,180,255,0.3)]"
              draggable={false}
            />

            {/* Badge de notificação quando minimizado */}
            {isMinimized && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center z-20 shadow-lg shadow-cyan-400/40"
              >
                <span className="text-[7px] font-black text-slate-950">!</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
