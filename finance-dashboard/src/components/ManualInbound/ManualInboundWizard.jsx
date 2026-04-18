import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { manualToVynexAdapter } from '../../services/adapters/manualAdapter';
import BaseModal from '../Common/BaseModal';
import { ChevronRight, ChevronLeft, Check, TrendingUp, Home, Coffee, AlertTriangle, Wallet } from 'lucide-react';

const STEPS = [
  { id: 'intro', title: 'Boas-vindas' },
  { id: 'income', title: 'Ganhos', icon: <TrendingUp size={20} /> },
  { id: 'fixed', title: 'Sobrevivência', icon: <Home size={20} /> },
  { id: 'variable', title: 'Estilo de Vida', icon: <Coffee size={20} /> },
  { id: 'debts', title: 'Compromissos', icon: <AlertTriangle size={20} /> },
  { id: 'review', title: 'Análise Final', icon: <Check size={20} /> }
];

export default function ManualInboundWizard({ isOpen, onClose }) {
  const { ingestFinancialData } = useFinance();
  const { user } = useUser();
  const toast = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    income: '',
    extraIncome: '',
    housing: '',
    education: '',
    subscriptions: '',
    food: '',
    transport: '',
    leisure: '',
    debts: '',
    balance: ''
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleComplete = async () => {
    try {
      const transactions = manualToVynexAdapter(formData, user?.id);
      await ingestFinancialData(transactions, 'manual');
      toast.success('Análise Concluída', 'Sua inteligência financeira foi atualizada com sucesso.');
      onClose();
    } catch (err) {
      toast.error('Erro no Processamento', 'Não foi possível gerar sua análise manual agora.');
    }
  };

  const StepContent = () => {
    const step = STEPS[currentStep].id;
    
    switch (step) {
      case 'intro':
        return (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-brand-green/10 rounded-3xl flex items-center justify-center text-brand-green mx-auto border border-brand-green/20">
              <Wallet size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Mapeamento Inteligente</h3>
              <p className="text-slate-400 text-sm italic">"Vou analisar sua saúde financeira através da sua visão real. Não preciso de extratos agora."</p>
            </div>
            <button 
              onClick={nextStep}
              className="w-full bg-brand-green text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
            >
              Começar Mapeamento
            </button>
          </div>
        );

      case 'income':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="label-style">Qual sua renda mensal principal?</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-green font-black">R$</span>
                <input 
                  type="number" 
                  className="input-style pl-12"
                  placeholder="0,00"
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="label-style">Rendas extras ou bônus médios?</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-black">R$</span>
                <input 
                  type="number" 
                  className="input-style pl-12"
                  placeholder="0,00"
                  value={formData.extraIncome}
                  onChange={(e) => setFormData({...formData, extraIncome: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'fixed':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="label-style">Moradia (Aluguel/Condo/Luz)</label>
              <input 
                type="number" 
                className="input-style"
                placeholder="R$ 0,00"
                value={formData.housing}
                onChange={(e) => setFormData({...formData, housing: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="label-style">Educação e Cursos</label>
              <input 
                type="number" 
                className="input-style"
                placeholder="R$ 0,00"
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
              />
            </div>
          </div>
        );

      case 'variable':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="label-style">Alimentação e Mercado (Mês)</label>
              <input 
                type="number" 
                className="input-style"
                placeholder="R$ 0,00"
                value={formData.food}
                onChange={(e) => setFormData({...formData, food: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="label-style">Lazer e Delivery</label>
              <input 
                type="number" 
                className="input-style"
                placeholder="R$ 0,00"
                value={formData.leisure}
                onChange={(e) => setFormData({...formData, leisure: e.target.value})}
              />
            </div>
          </div>
        );

      case 'debts':
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-4 text-left">
              <label className="label-style text-center">Soma de parcelas e dívidas hoje?</label>
              <input 
                type="number" 
                className="input-style text-center text-xl font-black text-rose-500"
                placeholder="R$ 0,00"
                value={formData.debts}
                onChange={(e) => setFormData({...formData, debts: e.target.value})}
              />
              <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest">Inclua empréstimos, cartões parcelados e financiamentos.</p>
            </div>
          </div>
        );

      case 'review':
        const totalOut = Number(formData.housing) + Number(formData.education) + Number(formData.food) + Number(formData.leisure) + Number(formData.debts);
        const totalIn = Number(formData.income) + Number(formData.extraIncome);
        const margin = totalIn - totalOut;

        return (
          <div className="space-y-6">
            <div className="glass p-6 border-brand-green/20 bg-brand-green/5 text-center">
              <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">Margem Estimada</p>
              <h4 className={`text-3xl font-black ${margin >= 0 ? 'text-white' : 'text-rose-500'}`}>
                R$ {margin.toLocaleString('pt-BR')}
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Total Ganhos</span>
                <span className="text-white">R$ {totalIn}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Total Gastos</span>
                <span className="text-white">R$ {totalOut}</span>
              </div>
            </div>
            <button 
              onClick={handleComplete}
              className="w-full bg-neon-gradient text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-green/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Gerar Inteligência
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={STEPS[currentStep].title}>
      <div className="min-h-[400px] flex flex-col">
        {/* Progress Bar */}
        {currentStep > 0 && (
          <div className="flex gap-1 mb-10">
            {STEPS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx <= currentStep ? 'bg-brand-green shadow-[0_0_10px_rgba(163,255,18,0.4)]' : 'bg-slate-800'}`} 
              />
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepContent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep > 0 && currentStep < STEPS.length - 1 && (
          <div className="flex gap-4 mt-10">
            <button 
              onClick={prevStep}
              className="p-5 rounded-2xl bg-slate-900 text-slate-500 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextStep}
              className="flex-1 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
            >
              Próximo <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
