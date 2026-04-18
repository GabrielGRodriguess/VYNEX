import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, TrendingUp, ShieldCheck, Zap, DollarSign } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useUser } from '../context/UserContext';
import { useNex } from '../context/NexContext';
import { aiService } from '../services/aiService';
import nexNeutral  from '../assets/mascot/nex-neutral.png';
import nexThinking from '../assets/mascot/nex-thinking.png';
import nexResult   from '../assets/mascot/nex-result.png';
import nexGuiding  from '../assets/mascot/nex-guiding.png';

// ─── Mapa de estados do Nex ───────────────────────────────────────────────────
const STATE = {
  idle:     { src: nexNeutral,  anim: 'nex-breathe'  },
  thinking: { src: nexThinking, anim: 'nex-thinking' },
  talking:  { src: nexGuiding,  anim: 'nex-talking'  },
  success:  { src: nexResult,   anim: 'nex-success'  },
};

const SUGGESTIONS = [
  { icon: <TrendingUp size={11} />, text: 'Como está meu perfil?' },
  { icon: <ShieldCheck size={11} />, text: 'Tenho margem disponível?' },
  { icon: <DollarSign size={11} />, text: 'Onde posso economizar?' },
  { icon: <Zap size={11} />, text: 'Dicas de crédito' },
];

// ─── Mini avatar inline nas mensagens (sem container circular) ────────────────
function NexInlineAvatar({ state = 'idle' }) {
  const { src, anim } = STATE[state] || STATE.idle;
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
function NexMessage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2 max-w-[90%]"
    >
      <NexInlineAvatar />
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm text-[11.5px] text-slate-300 leading-relaxed"
        style={{ background: 'rgba(15,20,35,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2 justify-end max-w-[90%] ml-auto"
    >
      <div
        className="px-4 py-3 rounded-2xl rounded-br-sm text-[11.5px] text-cyan-200 leading-relaxed"
        style={{ background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.18)' }}
      >
        {children}
      </div>
      <div
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(0,180,255,0.12)', border: '1px solid rgba(0,180,255,0.22)' }}
      >
        <User size={13} className="text-cyan-400" />
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
      <NexInlineAvatar state="thinking" />
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
  const { isOpen, setIsOpen } = useNex();

  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [nexState,   setNexState]   = useState('idle');

  const { balance, transactions } = useFinance();
  const { profile }               = useUser();
  const scrollRef                 = useRef(null);
  const inputRef                  = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, nexState]);

  // Foca no input ao abrir
  useEffect(() => {
    if (isOpen && inputRef.current)
      setTimeout(() => inputRef.current?.focus(), 320);
  }, [isOpen]);

  const handleSend = async (text) => {
    const msg = text || input;
    if (!msg.trim() || nexState === 'thinking') return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setNexState('thinking');

    const context  = aiService.buildFinancialContext({ balance, transactions }, profile);
    const response = await aiService.getChatResponse(msg, context);

    setNexState('success');
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setTimeout(() => setNexState('talking'), 650);
    setTimeout(() => setNexState('idle'),    2200);
  };

  const isTyping = nexState === 'thinking';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0,  scale: 1    }}
          exit={{   opacity: 0, x: 40, scale: 0.95  }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-4 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[390px] sm:h-[640px] z-[100] flex flex-col overflow-hidden rounded-3xl"
          style={{
            background: 'rgba(7, 10, 18, 0.97)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Linha de brilho */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none z-10"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.35), transparent)' }}
          />

          {/* ── Header ── */}
          <div
            className="relative flex items-end shrink-0 overflow-visible"
            style={{ minHeight: 140, padding: '0 16px 12px' }}
          >
            {/* Gradiente de fundo do header */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(0,10,30,0.6) 0%, transparent 100%)' }}
            />

            {/* ── Nex no header: sem container, sem borda ── */}
            <motion.div
              key={nexState}
              initial={{ opacity: 0.7, scale: 0.96 }}
              animate={{ opacity: 1,   scale: 1    }}
              transition={{ duration: 0.3 }}
              className="relative z-10 shrink-0"
              style={{ width: 110, marginBottom: -14, marginLeft: -8 }}
            >
              <img
                src={STATE[nexState]?.src || nexNeutral}
                alt="Nex"
                draggable={false}
                className={`w-full h-auto ${STATE[nexState]?.anim || 'nex-breathe'}`}
                style={{
                  filter: [
                    'drop-shadow(0 0 22px rgba(0,170,255,0.5))',
                    'drop-shadow(0 0 8px rgba(0,120,220,0.3))',
                  ].join(' '),
                }}
              />
            </motion.div>

            {/* Info textual */}
            <div className="relative z-10 flex-1 pb-2 pl-3 min-w-0">
              <h3 className="text-base font-black text-white tracking-tight">Nex</h3>
              <p
                className="text-[9px] font-bold uppercase tracking-widest mt-0.5"
                style={{ color: 'rgba(100,130,170,0.8)' }}
              >
                Inteligência Vynex
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'animate-pulse' : ''}`}
                  style={{ background: isTyping ? '#fbbf24' : '#22d3ee' }}
                />
                <span
                  className="text-[8px] font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(90,110,140,0.9)' }}
                >
                  {isTyping ? 'Analisando...'
                    : nexState === 'talking'  ? 'Respondendo...'
                    : nexState === 'success'  ? 'Pronto!'
                    : 'Online'}
                </span>
              </div>
            </div>

            {/* Fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-xl transition-all"
              style={{ color: 'rgba(100,120,150,0.8)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <X size={17} />
            </button>

            {/* Linha separadora */}
            <div
              className="absolute bottom-0 inset-x-0 h-px"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            />
          </div>

          {/* ── Mensagens ── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4 no-scrollbar"
          >
            <NexMessage>
              Oi. Sou o Nex — sua inteligência financeira na Vynex.
              <br /><br />
              Analiso seus dados, identifico oportunidades e te oriento. É só perguntar.
            </NexMessage>

            {messages.map((m, i) =>
              m.role === 'assistant'
                ? <NexMessage key={i}>{m.text}</NexMessage>
                : <UserMessage key={i}>{m.text}</UserMessage>
            )}

            <AnimatePresence>
              {isTyping && <TypingDots />}
            </AnimatePresence>
          </div>

          {/* ── Sugestões ── */}
          {messages.length === 0 && !isTyping && (
            <div
              className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(150,170,200,0.8)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,180,255,0.08)'; e.currentTarget.style.color = '#22d3ee'; e.currentTarget.style.borderColor = 'rgba(0,180,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(150,170,200,0.8)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <span style={{ color: 'rgba(0,180,255,0.6)' }}>{s.icon}</span>
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* ── Input ── */}
          <form
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            className="p-4 shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,14,24,0.7)' }}
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                placeholder="Fala com o Nex..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isTyping}
                className="w-full rounded-2xl py-3.5 pl-4 pr-14 text-xs text-white placeholder:text-slate-700 outline-none transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(10,15,28,0.9)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onFocus={e  => e.target.style.borderColor = 'rgba(0,180,255,0.3)'}
                onBlur={e   => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                style={{
                  background: '#06b6d4',
                  boxShadow: '0 0 14px rgba(6,182,212,0.35)',
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
