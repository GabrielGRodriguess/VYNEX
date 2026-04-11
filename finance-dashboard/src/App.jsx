import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import SummaryCards from './components/SummaryCards';
import ExpenseChart from './components/ExpenseChart';
import BalanceChart from './components/BalanceChart';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import BankConnector from './components/BankConnector';
import FinancialInsights from './components/FinancialInsights';
import OnlineUsersIndicator from './components/OnlineUsersIndicator';
import CreditAnalysis from './components/CreditAnalysis';
import CreditHistory from './components/CreditHistory';
import logo from './assets/vynex-logo.png';
import { LayoutDashboard, TrendingUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


function DashboardContent({ onAddTransaction }) {
// ... (omitted for brevity in replacement but kept in file)

  return (
    <div className="grid grid-cols-1 gap-8">
      <SummaryCards />
      <FinancialInsights />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 h-[350px]">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green neon-glow"></span>
            Fluxo de Caixa
          </h3>
          <div className="h-[260px]">
            <BalanceChart />
          </div>
        </div>
        <div className="glass p-6 h-[350px]">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green neon-glow"></span>
            Distribuição de Gastos
          </h3>
          <div className="h-[260px]">
            <ExpenseChart />
          </div>
        </div>
      </div>
      <TransactionList />
    </div>
  );
}

function MainApp() {
  const { loading, isDemoMode } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 overflow-x-hidden">
      <header className="flex items-center justify-between mb-8 sm:mb-12 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <img 
            src={logo} 
            alt="VYNEX Logo" 
            className="h-6 sm:h-9 md:h-12 w-auto object-contain flex-shrink-0 mix-blend-screen drop-shadow-[0_0_12px_rgba(163,255,18,0.3)]" 
          />
          <div className="hidden sm:flex flex-col border-l border-white/10 pl-3 sm:pl-4">
            <p className="text-slate-500 font-black text-[8px] sm:text-[10px] uppercase tracking-widest leading-none">
              High Performance
            </p>
          </div>
          {isDemoMode && (
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] sm:text-[10px] font-black uppercase tracking-tighter rounded-full border border-amber-500/20 whitespace-nowrap">
              Demo
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden lg:block">
            <OnlineUsersIndicator />
          </div>
          <div className="hidden sm:block">
            <BankConnector />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-neon-gradient text-slate-950 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-green/20"
          >
             <span className="text-lg leading-none">+</span> 
             <span className="hidden sm:inline text-xs uppercase tracking-widest">Novo</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs - Fixed Mobile Grid to prevent overflow */}
      <div className="mb-10 sm:mb-12">
        <nav className="grid grid-cols-3 p-1 bg-slate-900/40 rounded-2xl w-full sm:w-fit border border-white/5 gap-1">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`flex items-center justify-center gap-2 px-2 sm:px-8 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
              activeSection === 'dashboard' 
              ? 'bg-slate-800 text-brand-green shadow-xl border border-white/10' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutDashboard size={12} className="hidden xs:block" />
            Geral
          </button>
          <button
            onClick={() => setActiveSection('credit')}
            className={`flex items-center justify-center gap-2 px-2 sm:px-8 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
              activeSection === 'credit' 
              ? 'bg-slate-800 text-brand-green shadow-xl border border-white/10' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <TrendingUp size={12} className="hidden xs:block" />
            Crédito
          </button>
          <button
            onClick={() => setActiveSection('history')}
            className={`flex items-center justify-center gap-2 px-2 sm:px-8 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
              activeSection === 'history' 
              ? 'bg-slate-800 text-brand-green shadow-xl border border-white/10' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <History size={12} className="hidden xs:block" />
            Histórico
          </button>
        </nav>
      </div>

      {/* Mobile-only tools grouped effectively */}
      <div className="lg:hidden flex items-center justify-between gap-4 mb-8">
        <div className="flex-1 bg-slate-900/20 p-3 rounded-2xl border border-white/5 flex items-center justify-center">
          <OnlineUsersIndicator />
        </div>
        <div className="sm:hidden flex-1 bg-slate-900/20 p-3 rounded-2xl border border-white/5 flex items-center justify-center">
          <BankConnector />
        </div>
      </div>


      {/* Content Area */}
      <main className="min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'dashboard' ? (
              <DashboardContent />
            ) : activeSection === 'credit' ? (
              <CreditAnalysis />
            ) : (
              <CreditHistory />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <MainApp />
      </div>
    </FinanceProvider>
  );
}

export default App;
