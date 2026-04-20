import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, LayoutDashboard, UserCheck, Plus } from 'lucide-react';
import BankConnector from './BankConnector';

export default function EmptyState() {
  const cards = [
    {
      icon: <ShieldCheck className="text-brand-primary" />,
      title: "Segurança nível bancário",
      desc: "Seus dados são criptografados com o mesmo padrão dos grandes bancos."
    },
    {
      icon: <Zap className="text-blue-400" />,
      title: "Inteligência 24h",
      desc: "Nossos agentes analisam seu dinheiro enquanto você dorme."
    },
    {
      icon: <LayoutDashboard className="text-purple-400" />,
      title: "Dashboard inteligente",
      desc: "Uma visão consolidada de todo o seu patrimônio em um só lugar."
    },
    {
      icon: <UserCheck className="text-amber-500" />,
      title: "Você no controle",
      desc: "Decisões baseadas em dados reais, não em palpites."
    }
  ];

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">
            Traga clareza para sua <br/>
            <span className="text-brand-primary">vida financeira</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Enquanto a conexão automática com bancos está em fase de liberação (Beta), você pode usar o VYNEX normalmente adicionando transações ou importando seu extrato.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => document.getElementById('add-transaction-btn')?.click()}
            className="w-full sm:w-auto bg-brand-primary text-slate-950 px-8 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-all"
          >
            + Adicionar Transação
          </button>
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              onClick={() => document.getElementById('import-statement-btn')?.click()}
              className="flex-1 sm:flex-none border border-slate-700 text-slate-400 px-6 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Importar Extrato
            </button>
            <BankConnector />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-6 text-left space-y-4 border-white/5 hover:border-brand-primary/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                {card.icon}
              </div>
              <div>
                <h4 className="font-black text-white uppercase tracking-tight text-sm">{card.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
