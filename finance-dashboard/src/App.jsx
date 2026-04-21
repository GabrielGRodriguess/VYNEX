import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import ExpenseChart from './components/ExpenseChart';
import BalanceChart from './components/BalanceChart';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import BankConnector from './components/BankConnector';
import OnlineUsersIndicator from './components/OnlineUsersIndicator';
import CreditAnalysis from './components/CreditAnalysis';
import CreditHistory from './components/CreditHistory';

import { UserProvider, useUser } from './context/UserContext';
import { ToastProvider, useToast } from './context/ToastContext';
import ChatAssistant from './components/ChatAssistant';
import Onboarding from './components/Onboarding';
import logo from './assets/vynex-logo.png';
import VynexLogo from './components/VynexLogo';
import Login from './components/Login';
import EmptyState from './components/EmptyState';
import AgentGrid from './components/Agents/AgentGrid';
import SettingsPage from './components/Settings/SettingsPage';
import AccountPage from './components/Profile/AccountPage';
import {
  LayoutDashboard, TrendingUp, History, LogOut,
  Settings as SettingsIcon, Shield, Users, Crown, Zap,
  Database, Activity, Menu, X, Home, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NexProvider, useNex } from './context/NexContext.jsx';
import NexCharacter from './components/Mascot/NexCharacter';

import FinancialHealthCard from './components/FinancialHealthCard';
import LiquidityRiskCard from './components/LiquidityRiskCard';
import InsightWall from './components/Intelligence/InsightWall';
import NexAssistantCard from './components/NexAssistantCard';
import QuickActions from './components/QuickActions';
import SummaryCards from './components/SummaryCards';
import CreditSimulation from './components/CreditSimulation';
import ManualInboundWizard from './components/ManualInbound/ManualInboundWizard';
import StatementInboundWizard from './components/StatementInbound/StatementInboundWizard';
import PaymentModal from './components/PaymentModal';

// ─── NAV CONFIG ──────────────────────────────────────────────────────────────
const NAV_TABS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: 'New' },
  { id: 'agents',   icon: Users,           label: 'Agentes IA' },
  { id: 'credit',   icon: Shield,          label: 'Inteligência' },
  { id: 'account',  icon: Crown,           label: 'Planos' },
  { id: 'history',  icon: History,         label: 'Histórico' },
];

const MOBILE_NAV = [
  { id: 'dashboard', icon: Home,     label: 'Início' },
  { id: 'credit',    icon: Zap,      label: 'NEX AI' },
  { id: 'history',   icon: History,  label: 'Extrato' },
  { id: 'account',   icon: User,     label: 'Perfil' },
];

// ─── DASHBOARD CONTENT ────────────────────────────────────────────────────────
function DashboardContent({ setActiveSection, onOpenModal, onOpenWizard, onOpenStatement }) {
  const { analytics, normalizedTransactions } = useFinance();
  const hasData = normalizedTransactions.length > 0;

  return (
    <div className="space-y-16 pb-20 sm:pb-32">

      {/* 1 · NEX Hero Card (Primary Focus) */}
      <section className="section !mb-0">
        <NexAssistantCard
          onOpenAnalysis={() => setActiveSection('credit')}
          onOpenSimulation={() => {
            const el = document.getElementById('credit-simulation');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      </section>

      {/* 2 · Quick Actions */}
      <section className="section !mb-0">
        <QuickActions
          onAddTransaction={onOpenModal}
          onImportStatement={onOpenStatement}
          onWizard={onOpenWizard}
          onSimulateCredit={() => {
            const el = document.getElementById('credit-simulation');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      </section>

      {/* 3 · Credit Simulation (The Opportunity) */}
      <section id="credit-simulation" className="section !mb-0 pt-8">
        <CreditSimulation />
      </section>

      {/* 4 · Intelligence Diagnosis */}
      <section className="section !mb-0 pt-8">
        <h3 className="section-title">Diagnóstico de Inteligência</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FinancialHealthCard score={analytics.score} />
          </div>
          <div className="lg:col-span-1">
            <LiquidityRiskCard fixedExpenseRatio={analytics.assessment.fixedExpenseRatio} />
          </div>
        </div>
      </section>

      {/* 5 · Insights (Principais Achados) */}
      {hasData && (
        <section className="section !mb-0">
          <InsightWall insights={analytics.insights} />
        </section>
      )}

      {/* 6 · Financial Fundamentals */}
      <section className="section !mb-0">
        <h3 className="section-title">Indicadores Financeiros</h3>
        <SummaryCards />
      </section>

      {/* 7 · Charts & Data */}
      <section className="section !mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-8 min-h-[400px] flex flex-col">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Evolução Patrimonial
            </h3>
            <div className="flex-1 min-h-[280px]">
              <BalanceChart />
            </div>
          </div>
          <div className="glass p-8 min-h-[400px] flex flex-col">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
              Distribuição de Gastos
            </h3>
            <div className="flex-1 min-h-[280px]">
              <ExpenseChart />
            </div>
          </div>
        </div>
      </section>

      {/* 8 · Transactions History */}
      <section className="section !mb-0 pb-10">
        <h3 className="section-title">Movimentações Recentes</h3>
        <TransactionList />
      </section>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const { profile, loading: userLoading, paymentModal, setPaymentModal } = useUser();
  const { isBankConnected, normalizedTransactions = [], loading: financeLoading } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  const { setActiveSection: setNexActiveSection, registerActions } = useNex();
  const { currentPlan } = useUser();

  useEffect(() => {
    setNexActiveSection(activeSection);
  }, [activeSection, setNexActiveSection]);

  useEffect(() => {
    registerActions({
      setActiveSection: (section) => setActiveSection(section),
      openManualWizard: () => setIsWizardOpen(true),
      openStatementWizard: () => setIsStatementOpen(true),
      openAddTransactionModal: () => setIsModalOpen(true),
    });
  }, [registerActions]);

  if (financeLoading || userLoading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-600/20 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Sincronizando Inteligência…</p>
        </div>
      </div>
    );
  }

  const handleNavClick = (id) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const userName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="app-shell">
      <div className="page-container py-6 sm:py-10">
        
        {/* ── HEADER ── */}
        <header className="flex items-center justify-between mb-8 sm:mb-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <VynexLogo className="h-10 sm:h-12" />
            <div className="hidden lg:flex flex-col border-l border-slate-200 pl-4 leading-none gap-1">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Inteligência</p>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Financeira</p>
            </div>
          </div>

          {/* Right side Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden xl:flex items-center gap-6 mr-4">
              <OnlineUsersIndicator />
              <div className="w-px h-6 bg-slate-200" />
              <BankConnector />
            </div>

            {currentPlan?.id !== 'premium' && (
              <button
                onClick={() => setActiveSection('account')}
                className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                <Crown size={14} /> <span className="hidden md:inline">Virar Pro</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('account')}
              className={`flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2.5 rounded-2xl transition-all ${
                activeSection === 'account' ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-black text-slate-900 leading-none">{userName}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Perfil VYNEX</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">
                {userName[0]}
              </div>
            </button>

            <button
              onClick={() => handleNavClick('settings')}
              className={`p-3 rounded-2xl transition-all ${
                activeSection === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <SettingsIcon size={22} />
            </button>

            <button
              onClick={onLogout}
              className="hidden xs:flex p-3 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
            >
              <LogOut size={22} />
            </button>
          </div>
        </header>

        {/* ── DESKTOP NAVIGATION ── */}
        <nav className="hidden sm:flex items-center gap-3 mb-16 p-2 bg-white border border-slate-200 rounded-[1.5rem] w-fit shadow-sm">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-[1.125rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                    : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.badge && !isActive && (
                  <span className="bg-blue-100 text-blue-600 text-[9px] px-2 py-0.5 rounded-full ml-1">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── MAIN CONTENT AREA ── */}
        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeSection === 'dashboard' ? (
                !isBankConnected && normalizedTransactions.length === 0 ? (
                  <EmptyState />
                ) : (
                  <DashboardContent
                    setActiveSection={setActiveSection}
                    onOpenModal={() => setIsModalOpen(true)}
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
                <SettingsPage onAddTransaction={() => setIsModalOpen(true)} />
              ) : (
                <AccountPage />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-2xl border-t border-slate-200 px-8 pt-4 pb-10">
        <nav className="flex items-center justify-between max-w-md mx-auto">
          {MOBILE_NAV.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id || (tab.id === 'dashboard' && activeSection === 'agents');
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <div className={`p-2.5 rounded-2xl transition-all ${isActive ? 'bg-blue-50' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── UTILITY COMPONENTS ── */}
      <ManualInboundWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
      <StatementInboundWizard isOpen={isStatementOpen} onClose={() => setIsStatementOpen(false)} />
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} triggerSource={activeSection} />
      {profile && !profile.onboarding_completed && <Onboarding />}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, url: '' })}
        checkoutUrl={paymentModal.url}
      />
    </div>
  );
}

// ─── ROOT LEVEL ──────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('[VYNEX FATAL]', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 rounded-[2.5rem] bg-rose-50 flex items-center justify-center text-rose-500 mb-8 border border-rose-100 shadow-2xl shadow-rose-500/10">
            <Shield size={48} />
          </div>
          <h1 className="text-3xl font-black mb-4 tracking-tight">Sistema em Manutenção</h1>
          <p className="text-slate-500 max-w-sm mb-10 font-medium">Não se preocupe, seus dados estão seguros. Estamos realizando um polimento final no sistema.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full max-w-xs h-14"
          >
            Reiniciar VYNEX
          </button>
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-blue-600/20 rounded-full" />
          <div className="absolute w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Iniciando VYNEX…</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <FinanceProvider user={user}>
          <UserProvider user={user}>
            <NexProvider>
              {!user ? (
                <Login onLogin={setUser} initialView={recoveryMode ? 'reset' : 'login'} />
              ) : (
                <>
                  <MainApp user={user} onLogout={() => { supabase.auth.signOut(); setUser(null); }} />
                  <NexCharacter />
                  <ChatAssistant />
                </>
              )}
            </NexProvider>
          </UserProvider>
        </FinanceProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
