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
import logo from './assets/vynex-logo.png';
import { LayoutDashboard, TrendingUp } from 'lucide-react';

function DashboardContent({ onAddTransaction }) {
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="VYNEX Logo" 
              className="h-8 md:h-10 w-auto object-contain flex-shrink-0 mix-blend-screen drop-shadow-[0_0_12px_rgba(163,255,18,0.3)] transition-all" 
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-slate-500 font-semibold text-[10px] md:text-xs uppercase tracking-[0.1em] border-l border-white/10 pl-4 hidden md:block">
              High Performance Finance
            </p>
            {isDemoMode && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-tighter rounded-full border border-amber-500/20">
                Demo
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <OnlineUsersIndicator />
          <BankConnector />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-neon-gradient text-slate-950 p-3 sm:px-6 sm:py-3 rounded-xl font-black hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-brand-green/20"
          >
            <span className="text-xl">+</span> <span className="hidden sm:inline">Nova Transação</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-2 mb-12 p-1.5 bg-slate-900/50 rounded-2xl w-fit border border-white/5">
        <button
          onClick={() => setActiveSection('dashboard')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeSection === 'dashboard' 
            ? 'bg-slate-800 text-brand-green shadow-xl border border-white/5' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <LayoutDashboard size={14} />
          Visão Geral
        </button>
        <button
          onClick={() => setActiveSection('credit')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeSection === 'credit' 
            ? 'bg-slate-800 text-brand-green shadow-xl border border-white/5' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <TrendingUp size={14} />
          Análise de Crédito
        </button>
      </nav>

      {/* Content Area */}
      <main>
        {activeSection === 'dashboard' ? (
          <DashboardContent />
        ) : (
          <CreditAnalysis />
        )}
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

