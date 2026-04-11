import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import SummaryCards from './components/SummaryCards';
import ExpenseChart from './components/ExpenseChart';
import BalanceChart from './components/BalanceChart';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import BankConnector from './components/BankConnector';
import logo from './assets/vynex-logo.png';

function DashboardContent() {
  const { loading, isDemoMode } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-10">
        <div className="flex flex-col gap-1">
          <img src={logo} alt="VYNEX Logo" className="h-8 w-auto mb-1" />
          <div className="flex items-center gap-2">
            <p className="text-slate-500 font-medium text-xs">Controle financeiro de alta performance.</p>
            {isDemoMode && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-tighter rounded-full border border-amber-500/20">
                Modo de Demonstração
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <BankConnector />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-neon-gradient text-slate-950 px-6 py-3 rounded-xl font-black hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-brand-green/20"
          >
            <span className="text-xl">+</span> Nova Transação
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <SummaryCards />

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
      <div className="min-h-screen">
        <DashboardContent />
      </div>
    </FinanceProvider>
  );
}

export default App;
