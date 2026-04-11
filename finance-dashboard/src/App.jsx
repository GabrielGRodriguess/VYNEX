import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import SummaryCards from './components/SummaryCards';
import ExpenseChart from './components/ExpenseChart';
import BalanceChart from './components/BalanceChart';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import BankConnector from './components/BankConnector';

function DashboardContent() {
  const { loading, isDemoMode } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meu Dashboard</h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 font-medium">Bem-vindo de volta ao seu controle financeiro.</p>
            {isDemoMode && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-tighter rounded-full border border-amber-200">
                Modo de Demonstração
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <BankConnector />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
          >
            <span className="text-xl">+</span> Nova Transação
          </button>
        </div>
      </header>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <BalanceChart />
        <ExpenseChart />
      </div>

      <TransactionList />

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
      <div className="min-h-screen bg-slate-50">
        <DashboardContent />
      </div>
    </FinanceProvider>
  );
}

export default App;
