import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, TrendingUp, ShieldCheck, Zap, DollarSign } from 'lucide-react';
import { useNex } from '../context/NexContext.jsx';
import nexNeutral  from '../assets/mascot/nex-neutral.png';
import nexThinking from '../assets/mascot/nex-thinking.png';
import nexResult   from '../assets/mascot/nex-result.png';
import nexGuiding  from '../assets/mascot/nex-guiding.png';

// ─── Mapa de estados do Nex ───────────────────────────────────────────────────
const STATE = {
  idle:     { src: nexNeutral,  anim: 'nex-breathe'  },
  thinking: { src: nexThinking, anim: 'nex-thinking' },
  guiding:  { src: nexGuiding,  anim: 'nex-talking'  },
  result:   { src: nexResult,   anim: 'nex-success'  },
  neutral:  { src: nexNeutral,  anim: 'nex-breathe'  },
};

// ─── Mini avatar inline nas mensagens (sem container circular) ────────────────
function NexInlineAvatar({ mood = 'idle' }) {
  const { src, anim } = STATE[mood] || STATE.idle;
  return (
    <div className="shrink-0 w-8 self-end" style={{ marginBottom: '-2px' }}>
      <img
        src={src}
        alt="Nex"
        className={`w-full h-auto ${anim}`}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0,160,255,0.35))',
        }}
        draggable={false}
      />
    </div>
  );
}

// ─── Mensagem do Nex ──────────────────────────────────────────────────────────
function NexMessage({ children, mood }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-end gap-3 max-w-[92%]"
    >
      <NexInlineAvatar mood={mood} />
      <div
        className="px-5 py-4 rounded-[24px] rounded-bl-none text-[13px] text-slate-200 leading-[1.6]"
        style={{ 
          background: 'rgba(25,30,50,0.95)', 
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// ─── Mensagem do usuário ──────────────────────────────────────────────────────
function UserMessage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-end gap-3 justify-end max-w-[92%] ml-auto"
    >
      <div
        className="px-5 py-4 rounded-[24px] rounded-br-none text-[13px] text-cyan-50 font-medium leading-[1.6]"
        style={{ 
          background: 'linear-gradient(135deg, rgba(0,120,255,0.2), rgba(0,180,255,0.1))', 
          border: '1px solid rgba(0,180,255,0.25)',
          boxShadow: '0 8px 24px rgba(0,100,255,0.1)'
        }}
      >
        {children}
      </div>
      <div
        className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border"
        style={{ 
          background: 'rgba(0,180,255,0.15)', 
          borderColor: 'rgba(0,180,255,0.3)' 
        }}
      >
        <User size={15} className="text-cyan-400" />
      </div>
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2 max-w-[90%]"
    >
      <NexInlineAvatar mood="thinking" />
      <div
        className="flex gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ background: 'rgba(15,20,35,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
      </div>
    </motion.div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ChatAssistant() {
  const { 
    isOpen, 
    setIsOpen, 
    messages, 
    currentMood, 
    isTyping, 
    suggestions, 
    sendMessageToNex,
    executeNexAction 
  } = useNex();

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Foca no input ao abrir
  useEffect(() => {
    if (isOpen && inputRef.current)
      setTimeout(() => inputRef.current?.focus(), 320);
  }, [isOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const val = e.target.elements.chatInput.value;
    if (!val.trim() || isTyping) return;
    
    sendMessageToNex(val);
    e.target.elements.chatInput.value = '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0,  scale: 1    }}
          exit={{   opacity: 0, x: 40, scale: 0.95  }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-4 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[420px] sm:h-[680px] z-[100] flex flex-col overflow-hidden rounded-[32px]"
          style={{
            background: 'rgba(7, 10, 18, 0.98)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Linha de brilho superior */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none z-10"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.4), transparent)' }}
          />

          {/* ── Header ── */}
          <div
            className="relative flex items-end shrink-0 overflow-visible"
            style={{ minHeight: 150, padding: '0 20px 16px' }}
          >
            {/* Gradiente de fundo do header */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(0,10,30,0.7) 0%, transparent 100%)' }}
            />

            {/* ── Nex no header ── */}
            <motion.div
              key={currentMood}
              initial={{ opacity: 0.7, scale: 0.96 }}
              animate={{ opacity: 1,   scale: 1    }}
              transition={{ duration: 0.3 }}
              className="relative z-10 shrink-0"
              style={{ width: 120, marginBottom: -18, marginLeft: -12 }}
            >
              <img
                src={STATE[currentMood]?.src || nexNeutral}
                alt="Nex"
                draggable={false}
                className={`w-full h-auto ${STATE[currentMood]?.anim || 'nex-breathe'}`}
                style={{
                  filter: [
                    'drop-shadow(0 0 25px rgba(0,170,255,0.55))',
                    'drop-shadow(0 0 10px rgba(0,120,220,0.4))',
                  ].join(' '),
                }}
              />
            </motion.div>

            {/* Info textual */}
            <div className="relative z-10 flex-1 pb-2 pl-4 min-w-0">
              <h3 className="text-lg font-black text-white tracking-tight">Nex</h3>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mt-0.5"
                style={{ color: 'rgba(120,150,190,0.9)' }}
              >
                Copiloto Inteligente
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${isTyping ? 'animate-pulse' : ''}`}
                  style={{ background: isTyping ? '#fbbf24' : '#22d3ee', boxShadow: `0 0 10px ${isTyping ? '#fbbf24' : '#22d3ee'}66` }}
                />
                <span
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: 'rgba(100,120,150,0.9)' }}
                >
                  {isTyping ? 'Analisando dados...'
                    : currentMood === 'guiding'  ? 'Respondendo...'
                    : currentMood === 'result'   ? 'Análise pronta'
                    : 'Pronto para ajudar'}
                </span>
              </div>
            </div>

            {/* Botão Fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-2xl transition-all"
              style={{ color: 'rgba(150,170,200,0.6)', background: 'rgba(255,255,255,0.03)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(150,170,200,0.6)'; }}
            >
              <X size={20} />
            </button>

            {/* Linha separadora */}
            <div
              className="absolute bottom-0 inset-x-0 h-px"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
          </div>

          {/* ── Mensagens ── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-6 space-y-6 no-scrollbar"
          >
            {messages.map((m, i) =>
              m.role === 'assistant'
                ? <NexMessage key={i} mood={m.mood}>{m.text}</NexMessage>
                : <UserMessage key={i}>{m.text}</UserMessage>
            )}

            <AnimatePresence>
              {isTyping && <TypingDots />}
            </AnimatePresence>
          </div>

          {/* ── Sugestões (Chips horizontais com scroll suave) ── */}
          {!isTyping && suggestions.length > 0 && (
            <div
              className="px-5 py-4 flex gap-2 overflow-x-auto no-scrollbar shrink-0"
              style={{ 
                borderTop: '1px solid rgba(255,255,255,0.03)',
                background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.2))'
              }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessageToNex(s)}
                  className="whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold tracking-tight transition-all shrink-0 border"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.07)',
                    color: 'rgba(180,200,230,0.85)',
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.background = 'rgba(0,180,255,0.08)'; 
                    e.currentTarget.style.color = '#22d3ee'; 
                    e.currentTarget.style.borderColor = 'rgba(0,180,255,0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; 
                    e.currentTarget.style.color = 'rgba(180,200,230,0.85)'; 
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* ── Input ── */}
          <form
            onSubmit={handleFormSubmit}
            className="p-5 shrink-0"
            style={{ 
              borderTop: '1px solid rgba(255,255,255,0.06)', 
              background: 'rgba(10,14,24,0.85)' 
            }}
          >
            <div className="relative flex items-center">
              <input
                name="chatInput"
                ref={inputRef}
                type="text"
                autoComplete="off"
                placeholder="Pergunte qualquer coisa ao Nex..."
                disabled={isTyping}
                className="w-full rounded-[20px] py-4 pl-5 pr-14 text-[13px] text-white placeholder:text-slate-600 outline-none transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(15,22,40,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={e  => e.target.style.borderColor = 'rgba(0,180,255,0.4)'}
                onBlur={e   => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button
                type="submit"
                disabled={isTyping}
                className="absolute right-2 w-10 h-10 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg"
                style={{
                  background: '#06b6d4',
                  boxShadow: '0 0 20px rgba(6,182,212,0.3)',
                  color: '#020617',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#22d3ee'}
                onMouseLeave={e => e.currentTarget.style.background = '#06b6d4'}
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
