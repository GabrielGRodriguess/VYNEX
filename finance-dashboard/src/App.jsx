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
import { LayoutDashboard, TrendingUp, History, LogOut, Settings as SettingsIcon, Shield, Users, Crown, Zap, Database, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NexProvider } from './context/NexContext';
import NexCharacter from './components/Mascot/NexCharacter';

import ScoreGaugeCard from './components/Intelligence/ScoreGaugeCard';
import InsightWall from './components/Intelligence/InsightWall';
import NexDashboardCommentary from './components/Intelligence/NexDashboardCommentary';
import ManualInboundWizard from './components/ManualInbound/ManualInboundWizard';
import StatementInboundWizard from './components/StatementInbound/StatementInboundWizard';

function DashboardContent({ onSimulateCredit, setActiveSection, onOpenWizard, onOpenStatement }) {
  const { analytics, normalizedTransactions } = useFinance();
  const hasData = normalizedTransactions.length > 0;
  
  return (
    <div className="space-y-16 sm:space-y-20">
      {hasData && <NexDashboardCommentary />}

      {/* 1. Ingestion Strategy Layer - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-blue-300 transition-all cursor-pointer bg-blue-50/20 border-blue-100"
          onClick={onOpenWizard}
        >
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Análise Manual</h3>
              <p className="text-slate-500 text-[10px] leading-relaxed max-w-[280px]">Mapeie sua saúde financeira em 2 minutos sem precisar conectar seu banco.</p>
            </div>
          </div>
          <button className="btn-primary w-fit text-[9px] py-3">
            Começar Agora
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-blue-300 transition-all cursor-pointer"
          onClick={onOpenStatement}
        >
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Upload de Extratos</h3>
              <p className="text-slate-500 text-[10px] leading-relaxed max-w-[280px]">Importe arquivos CSV ou PDF para uma análise automática e profunda.</p>
            </div>
          </div>
          <button className="w-fit border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-50 transition-all">
            Importar Arquivo
          </button>
        </motion.div>
      </div>

      {/* 2. Intelligence Diagnosis Layer */}
      {hasData && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ScoreGaugeCard score={analytics.score} />
            </div>
            <div className="lg:col-span-1">
              <div className="glass h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Risco de Liquidez</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Seu comprometimento com gastos fixos é de <strong>{(analytics.assessment.fixedExpenseRatio * 100).toFixed(0)}%</strong> da renda identificada.
                  </p>
                </div>
                <div className="mt-6 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 shadow-sm" 
                    style={{ width: `${analytics.assessment.fixedExpenseRatio * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Insights & Action Layer */}
      {hasData && <InsightWall insights={analytics.insights} />}

      {/* 4. Numbers & Fundamentals Layer */}
      <div className="space-y-6">
        <h3 className="section-title">Fundamentos Financeiros</h3>
        <SummaryCards />
      </div>

      {/* 5. Patterns & Behaviors Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="glass p-4 sm:p-6 h-[300px] sm:h-[350px]">
          <h3 className="text-[10px] sm:text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary neon-glow"></span>
            Evolução Mensal
          </h3>
          <div className="h-[210px] sm:h-[260px]">
            <BalanceChart />
          </div>
        </div>
        <div className="glass p-4 sm:p-6 h-[300px] sm:h-[350px]">
          <h3 className="text-[10px] sm:text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary neon-glow"></span>
            Categorias de Gasto
          </h3>
          <div className="h-[210px] sm:h-[260px]">
            <ExpenseChart />
          </div>
        </div>
      </div>

      {/* 6. Transparency Layer */}
      <div className="space-y-6">
        <h3 className="section-title">Base de Dados Normalizada</h3>
        <TransactionList />
      </div>
    </div>
  );
}

function MainApp({ user, onLogout }) {
  const { profile, loading: userLoading } = useUser();
  const { connections, isBankConnected, normalizedTransactions = [], loading: financeLoading } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);

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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
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
              className="h-7 sm:h-9 md:h-12 w-auto object-contain flex-shrink-0 drop-shadow-[0_0_12px_rgba(37,99,235,0.1)]" 
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
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4 overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
             <button 
              onClick={() => setActiveSection('account')}
              className={`text-right group p-2 rounded-2xl transition-all flex flex-col items-end min-w-0 max-w-[100px] xs:max-w-[140px] sm:max-w-[180px] ${activeSection === 'account' ? 'bg-blue-50' : 'hover:bg-slate-100'}`}
            >
                <p className={`text-[10px] font-black uppercase tracking-tighter leading-none truncate w-full ${activeSection === 'account' ? 'text-brand-primary' : 'text-slate-900'}`}>{user?.email?.split('@')[0]}</p>
                <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300">Perfil</p>
             </button>
             <button 
              onClick={() => setActiveSection('settings')}
              className={`p-2 transition-colors shrink-0 ${activeSection === 'settings' ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-900'}`}
              title="Configurações"
             >
                <SettingsIcon size={18} />
             </button>
             <button 
              onClick={onLogout}
              className="p-2 transition-colors shrink-0 text-slate-500 hover:text-rose-500"
              title="Sair"
             >
                <LogOut size={18} />
             </button>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:block h-8 w-px bg-white/5 mx-2" />
            <div className="hidden sm:block">
            </div>
            <div className="hidden xs:block">
              <BankConnector />
            </div>
            {useUser().currentPlan.id !== 'premium' && (
              <button 
                onClick={() => setActiveSection('account')}
                className="hidden md:flex items-center gap-2 bg-blue-50 text-brand-primary border border-blue-100 px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-100 transition-all"
              >
                <Crown size={12} /> Fazer Upgrade
              </button>
            )}
            {/* "Lançar" button removed from global header */}
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Refined for mobile scroll */}
      <div className="mb-8 sm:mb-12">
        <nav className="flex items-center gap-1 p-1 bg-white rounded-[1.25rem] w-full sm:w-fit border border-slate-200 overflow-x-auto no-scrollbar shadow-sm">
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
                ? 'bg-blue-50 text-brand-primary shadow-sm border border-blue-100' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'dashboard' && <span className="ml-1 px-1 bg-brand-primary text-white text-[6px] rounded-full">New</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile-only tools - Responsive Visibility */}
      <div className="sm:hidden flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm">
            <OnlineUsersIndicator />
          </div>
          <div className="flex-1 bg-white p-2 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm">
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
              !isBankConnected && normalizedTransactions.length === 0 ? (
                <div className="space-y-8">
                  <EmptyState />
                  <div className="max-w-md mx-auto">
                    <button 
                      onClick={() => setIsWizardOpen(true)}
                      className="w-full bg-brand-primary text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-all"
                    >
                      Análise Manual Expressa
                    </button>
                  </div>
                </div>
              ) : (
                <DashboardContent 
                  onSimulateCredit={() => setActiveSection('credit')} 
                  setActiveSection={setActiveSection}
                  onOpenWizard={() => setIsWizardOpen(true)}
                  onOpenStatement={() => setIsStatementOpen(true)}
                />
              )
            ) : activeSection === 'agents' ? (
              <AgentGrid />
            ) : activeSection === 'credit' ? (
              <CreditAnalysis user={user} />
            ) : activeSection === 'history' ? (
              <CreditHistory />
            ) : activeSection === 'settings' ? (
              <SettingsPage onAddException={() => setIsModalOpen(true)} />
            ) : (
              <AccountPage />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <ManualInboundWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

      <StatementInboundWizard
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
      />

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        triggerSource={activeSection}
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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center text-slate-900">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/20 flex items-center justify-center text-rose-500 mb-8 border border-rose-500/30">
            <Shield size={40} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Opa! Algo deu errado.</h1>
          <p className="text-slate-400 max-w-md mb-8 italic">Pode ser um problema temporário de conexão ou de processamento de dados.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-primary text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <FinanceProvider user={user}>
          <UserProvider user={user}>
            <NexProvider>
              <div className="min-h-screen bg-transparent">
                {!user ? (
                  <Login 
                    onLogin={(u) => setUser(u)} 
                    initialView={recoveryMode ? 'reset' : 'login'} 
                  />
                ) : (
                  <>
                    <MainApp user={user} onLogout={() => { supabase.auth.signOut(); setUser(null); }} />
                    <NexCharacter />
                    <ChatAssistant />
                  </>
                )}
              </div>
            </NexProvider>
          </UserProvider>
        </FinanceProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
