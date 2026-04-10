import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import SummaryCards from './components/SummaryCards';
import ExpenseChart from './components/ExpenseChart';
import BalanceChart from './components/BalanceChart';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';

function DashboardContent() {
  const { loading } = useFinance();
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
          <h1 className="text-3xl font-bold text-gray-900">Meu Dashboard</h1>
          <p className="text-gray-500">Bem-vindo de volta ao seu controle financeiro.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
        >
          <span className="text-xl">+</span> Nova Transação
        </button>
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
