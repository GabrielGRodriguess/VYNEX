import React, { useState, useEffect, Component } from 'react';
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
import { UserProvider, useUser } from './context/UserContext';
import { ToastProvider, useToast } from './context/ToastContext';
import ChatAssistant from './components/ChatAssistant';
import Onboarding from './components/Onboarding';
import logo from './assets/vynex-logo.png';
import Login from './components/Login';
import EmptyState from './components/EmptyState';
import AgentGrid from './components/Agents/AgentGrid';
import SettingsPage from './components/Settings/SettingsPage';
import AccountPage from './components/Profile/AccountPage';
import { LayoutDashboard, TrendingUp, History, LogOut, Settings as SettingsIcon, Shield, Users, Crown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


function DashboardContent({ onSimulateCredit }) {
  const { transactions } = useFinance();
  
  console.log("[VYNEX] DashboardContent render - Transactions count:", transactions?.length);

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8">
      <SummaryCards />
      
      {/* Strategic Profile CTA Card - Intelligence First */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 sm:p-8 bg-brand-green/10 border-brand-green/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-brand-green/40 transition-all cursor-pointer"
        onClick={onSimulateCredit}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-brand-green/10 transition-colors"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green shadow-[0_0_20px_rgba(163,255,18,0.2)]">
            <TrendingUp size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Otimize seu Perfil</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md">Sua movimentação indica um perfil de alta eficiência. Descubra como transformar isso em vantagens estratégicas.</p>
          </div>
        </div>
        <button 
          className="w-full sm:w-auto relative z-10 bg-brand-green text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-green/20 text-xs sm:text-sm"
        >
          Analisar meu potencial
        </button>
      </motion.div>

      {/* Contextual AI Power-up Banner - Conversion Trigger */}
      {useUser().currentPlan.id === 'free' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-6 border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tight">Desbloqueie todo o potencial da IA</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ative múltiplos agentes e conexões ilimitadas no Plano Pro.</p>
            </div>
          </div>
          <button 
            onClick={() => useUser().setActiveSection('account')}
            className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-white transition-colors"
          >
            Ver Planos →
          </button>
        </motion.div>
      )}

      <FinancialInsights />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="glass p-4 sm:p-6 h-[300px] sm:h-[350px]">
          <h3 className="text-[10px] sm:text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green neon-glow"></span>
            Minha Evolução
          </h3>
          <div className="h-[210px] sm:h-[260px]">
            <BalanceChart />
          </div>
        </div>
        <div className="glass p-4 sm:p-6 h-[300px] sm:h-[350px]">
          <h3 className="text-[10px] sm:text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green neon-glow"></span>
            Distribuição de Gastos
          </h3>
          <div className="h-[210px] sm:h-[260px]">
            <ExpenseChart />
          </div>
        </div>
      </div>
      <TransactionList />
    </div>
  );
}

function MainApp({ user, onLogout }) {
  const { profile, loading: userLoading } = useUser();
  const { connections, isBankConnected, loading: financeLoading } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  console.log("[VYNEX] MainApp Check:", { 
    user: user?.email, 
    userLoading, 
    financeLoading, 
    hasProfile: !!profile,
    connections: connections?.length,
    activeSection
  });

  if (financeLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 lg:py-12 overflow-x-hidden">
      {/* Responsive Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <img 
              src={logo} 
              alt="VYNEX Logo" 
              className="h-7 sm:h-9 md:h-12 w-auto object-contain flex-shrink-0 mix-blend-screen drop-shadow-[0_0_12px_rgba(163,255,18,0.3)]" 
            />
            <div className="hidden xs:flex flex-col border-l border-white/10 pl-3 sm:pl-6 leading-none">
              <p className="text-slate-500 font-black text-[8px] sm:text-[10px] uppercase tracking-widest">
                Inteligência
              </p>
               <p className="text-slate-500 font-black text-[8px] sm:text-[10px] uppercase tracking-widest">
                Financeira
              </p>
            </div>
          </div>
          <div className="sm:hidden flex items-center gap-2">
             <DemoControls />
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4 overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
             <button 
              onClick={() => setActiveSection('account')}
              className={`text-right group p-2 rounded-2xl transition-all flex flex-col items-end min-w-0 max-w-[100px] xs:max-w-[140px] sm:max-w-[180px] ${activeSection === 'account' ? 'bg-brand-green/10' : 'hover:bg-white/5'}`}
            >
                <p className={`text-[10px] font-black uppercase tracking-tighter leading-none truncate w-full ${activeSection === 'account' ? 'text-brand-green' : 'text-white'}`}>{user?.email?.split('@')[0]}</p>
                <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300">Perfil</p>
             </button>
             <button 
              onClick={() => setActiveSection('settings')}
              className={`p-2 transition-colors shrink-0 ${activeSection === 'settings' ? 'text-brand-green' : 'text-slate-500 hover:text-white'}`}
             >
                <SettingsIcon size={18} />
             </button>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:block h-8 w-px bg-white/5 mx-2" />
            <div className="hidden sm:block">
               <DemoControls />
            </div>
            <div className="hidden xs:block">
              <BankConnector />
            </div>
            {useUser().currentPlan.id !== 'premium' && (
              <button 
                onClick={() => setActiveSection('account')}
                className="hidden md:flex items-center gap-2 bg-brand-green/10 text-brand-green border border-brand-green/20 px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-brand-green/20 transition-all"
              >
                <Crown size={12} /> Fazer Upgrade
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-neon-gradient text-slate-950 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-green/20 shrink-0"
            >
               <span className="text-lg sm:text-xl leading-none mt-[-2px]">+</span> 
               <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-black">Lançar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Refined for mobile scroll */}
      <div className="mb-8 sm:mb-12">
        <nav className="flex items-center gap-1 p-1 bg-slate-900/40 rounded-[1.25rem] w-full sm:w-fit border border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={14} />, label: 'Dashboard' },
            { id: 'agents', icon: <Users size={14} />, label: 'Agentes IA' },
            { id: 'credit', icon: <Shield size={14} />, label: 'Inteligência' },
            { id: 'account', icon: <Crown size={14} />, label: 'Planos' },
            { id: 'history', icon: <History size={14} />, label: 'Histórico' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                activeSection === tab.id 
                ? 'bg-slate-800 text-brand-green shadow-xl border border-white/10' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile-only tools - Responsive Visibility */}
      <div className="sm:hidden flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 bg-slate-900/20 p-4 rounded-2xl border border-white/5 flex items-center justify-center">
            <OnlineUsersIndicator />
          </div>
          <div className="flex-1 bg-slate-900/20 p-2 rounded-2xl border border-white/5 flex items-center justify-center">
            <BankConnector />
          </div>
        </div>
      </div>

      <div className="hidden lg:block mb-8">
        <OnlineUsersIndicator />
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
              !isBankConnected ? (
                <EmptyState />
              ) : (
                <DashboardContent onSimulateCredit={() => setActiveSection('credit')} />
              )
            ) : activeSection === 'agents' ? (
              <AgentGrid />
            ) : activeSection === 'credit' ? (
              <CreditAnalysis user={user} />
            ) : activeSection === 'history' ? (
              <CreditHistory />
            ) : activeSection === 'settings' ? (
              <SettingsPage />
            ) : (
              <AccountPage />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {profile && !profile.onboarding_completed && <Onboarding />}
    </div>
  );
}

// simple Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[VYNEX FATAL ERROR]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/20 flex items-center justify-center text-rose-500 mb-8 border border-rose-500/30">
            <Shield size={40} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Opa! Algo deu errado.</h1>
          <p className="text-slate-400 max-w-md mb-8 italic">Pode ser um problema temporário de conexão ou de processamento de dados.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-green text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-green/20"
          >
            Tentar Novamente
          </button>
          <div className="mt-12 p-4 bg-black/40 rounded-2xl border border-white/5 max-w-2xl w-full text-left overflow-auto">
             <p className="text-[10px] font-mono text-slate-500 break-all">{this.state.error?.toString()}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    setLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[VYNEX] Auth Session:", session?.user?.email || "No session");
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error("[VYNEX] Auth Error:", err);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[VYNEX] Auth Event:", event);
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
    <ErrorBoundary>
      <ToastProvider>
        <FinanceProvider user={user}>
          <UserProvider user={user}>
            <div className="min-h-screen bg-slate-950 text-slate-200">
              {!user ? (
                <Login 
                  onLogin={(u) => setUser(u)} 
                  initialView={recoveryMode ? 'reset' : 'login'} 
                />
              ) : (
                <>
                  <MainApp user={user} onLogout={() => supabase.auth.signOut()} />
                  <ChatAssistant />
                </>
              )}
            </div>
          </UserProvider>
        </FinanceProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
