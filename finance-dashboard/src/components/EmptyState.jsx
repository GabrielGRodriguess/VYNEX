import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, LayoutDashboard, UserCheck, Plus } from 'lucide-react';
import BankConnector from './BankConnector';

export default function EmptyState() {
  const cards = [
    {
      icon: <ShieldCheck className="text-brand-green" />,
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
            Para encontrar oportunidades, <br/>
            <span className="text-brand-green">preciso ver como você gasta</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Conecte suas contas para que nossos agentes IA possam analisar sua saúde financeira e liberar as melhores ofertas de crédito.
          </p>
        </div>

        <div className="flex justify-center">
          <BankConnector />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-6 text-left space-y-4 border-white/5 hover:border-brand-green/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-green/10 transition-colors">
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
