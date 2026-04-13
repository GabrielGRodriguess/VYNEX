import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useUser } from '../context/UserContext';
import { aiService } from '../services/aiService';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { balance, transactions } = useFinance();
  const { profile } = useUser();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    // Build Context
    const context = aiService.buildFinancialContext({ balance, transactions }, profile);
    
    // Get AI Response (Multi-agent orchestrated)
    const aiResponse = await aiService.getChatResponse(userMsg, context);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
  };

  return (
    <>
      {/* Floating Entry Button - More subtle on mobile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-brand-green text-slate-950 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(163,255,18,0.3)] z-[60] cursor-pointer group"
      >
        <div className="absolute inset-0 rounded-full bg-brand-green animate-ping opacity-20 group-hover:opacity-40" />
        <MessageSquare size={24} className="sm:size-7" />
      </motion.button>

      {/* Main Chat Interface - Mobile Height Fixed */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed inset-4 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[600px] glass-card overflow-hidden z-[100] flex flex-col border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header: Multi-Agent Hub Identity */}
            <div className="p-4 sm:p-6 border-b border-white/5 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center text-brand-green">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-tight">VYNEX Inteligência</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    <p className="text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest">Agentes Ativos</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conversation Core */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/20 no-scrollbar"
            >
              <div className="flex gap-3 max-w-[90%] sm:max-w-[85%]">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-green shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl rounded-tl-none border border-white/5 space-y-3">
                  <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">
                    Olá! Analisei sua saúde financeira e identifiquei um Perfil Vynex de alta eficiência. 
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed font-bold">
                    Como posso te ajudar a otimizar sua organização financeira hoje?
                  </p>
                </div>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-brand-green text-slate-950 shadow-[0_0_10px_rgba(163,255,18,0.3)]' : 'bg-slate-800 text-brand-green'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl border ${
                      msg.role === 'user' 
                        ? 'bg-brand-green/10 border-brand-green/20 rounded-tr-none text-brand-green' 
                        : 'bg-slate-900 border-white/5 rounded-tl-none text-slate-200'
                    }`}>
                      <p className="text-[11px] sm:text-xs leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 pl-10 items-center">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Analisando...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestions Layer */}
            <div className="px-4 sm:px-6 py-3 border-t border-white/5 bg-slate-900/20 flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { icon: <TrendingUp size={12}/>, text: 'Ver meu score' },
                { icon: <ShieldCheck size={12}/>, text: 'Dicas de perfil' }
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(btn.text);
                    // Manual submit logic would go here
                  }}
                  className="whitespace-nowrap flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-brand-green/10 hover:text-brand-green transition-all"
                >
                  {btn.icon} {btn.text}
                </button>
              ))}
            </div>

            {/* Conversation Entry */}
            <form onSubmit={handleSend} className="p-4 sm:p-6 border-t border-white/5 bg-slate-900/40">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Pergunte à inteligência..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl py-3 sm:py-4 pl-4 pr-14 text-[11px] sm:text-xs text-white focus:border-brand-green focus:outline-none transition-all placeholder:text-slate-700"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-2 w-8 h-8 sm:w-10 sm:h-10 bg-brand-green text-slate-950 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105"
                >
                  <Send size={16} sm:size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
