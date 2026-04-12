import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
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
import DemoControls from './components/DemoControls';
import logo from './assets/vynex-logo.png';
import { LayoutDashboard, TrendingUp, History, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';


function DashboardContent({ onSimulateCredit }) {
  const { transactions } = useFinance();

  return (
    <div className="grid grid-cols-1 gap-8">
      <SummaryCards />
      
      {/* Strategic Credit CTA Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 bg-brand-green/10 border-brand-green/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-brand-green/40 transition-all cursor-pointer"
        onClick={onSimulateCredit}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-brand-green/10 transition-colors"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green shadow-[0_0_20px_rgba(163,255,18,0.2)]">
            <TrendingUp size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Limite pré-aprovado</h3>
            <p className="text-slate-400 text-sm max-w-md">Com base na sua movimentação, você tem grandes chances de liberar crédito com taxas menores hoje.</p>
          </div>
        </div>
        <button 
          className="relative z-10 bg-brand-green text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-green/20"
        >
          Simular meu crédito
        </button>
      </motion.div>

      <FinancialInsights />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 h-[350px]">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green neon-glow"></span>
            Minha Evolução
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

function MainApp({ user, onLogout }) {
  const { loading } = useFinance();
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
          <div className="hidden sm:flex flex-col border-l border-white/10 pl-4 sm:pl-6">
            <p className="text-slate-500 font-black text-[8px] sm:text-[10px] uppercase tracking-widest leading-none">
              Inteligência Financeira
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-brand-green/5 border border-brand-green/10 px-4 py-1.5 rounded-full ml-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            <span className="text-[9px] font-black text-brand-green uppercase tracking-widest leading-none">Assistente de Decisões</span>
          </div>
          <DemoControls />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-4 mr-2">
             <div className="text-right">
                <p className="text-[9px] font-black text-white uppercase tracking-tighter leading-none">{user?.email?.split('@')[0]}</p>
                <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Conta VYNEX</p>
             </div>
             <button onClick={onLogout} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                <LogOut size={16} />
             </button>
          </div>
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
            Minha Visão Financeira
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
            Simular Crédito
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
              <DashboardContent onSimulateCredit={() => setActiveSection('credit')} />
            ) : activeSection === 'credit' ? (
              <CreditAnalysis user={user} />
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    setLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <FinanceProvider user={user}>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        {!user ? (
          <Login 
            onLogin={(u) => setUser(u)} 
            initialView={recoveryMode ? 'reset' : 'login'} 
          />
        ) : (
          <MainApp user={user} onLogout={() => supabase.auth.signOut()} />
        )}
      </div>
    </FinanceProvider>
  );
}

export default App;
