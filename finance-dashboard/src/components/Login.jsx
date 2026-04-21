import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, ShieldAlert, UserPlus, RefreshCw, KeyRound, Check } from 'lucide-react';
import logo from '../assets/vynex-logo.png';
import VynexLogo from './VynexLogo';
import { supabase } from '../services/supabaseClient';

export default function Login({ onLogin, initialView = 'login' }) {
  const [view, setView] = useState(initialView); // 'login' | 'signup' | 'forgot' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Por favor, insira seu e-mail.');
      return;
    }

    setLoading(true);

    try {
      if (view === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        if (data.user) onLogin(data.user);
      } else if (view === 'signup') {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        const { data, error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: email.split('@')[0] }
          }
        });
        if (authError) throw authError;
        setSuccess('Conta criada! Já pode acessar.');
        setTimeout(() => setView('login'), 2000);
      } else if (view === 'forgot') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });
        if (authError) throw authError;
        setSuccess('Link enviado! Verifique sua caixa de entrada.');
      } else if (view === 'reset') {
        const { error: authError } = await supabase.auth.updateUser({ password });
        if (authError) throw authError;
        setSuccess('Senha atualizada com sucesso!');
        setTimeout(() => setView('login'), 2000);
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const getViewTitle = () => {
    switch(view) {
      case 'signup': return 'Criar Conta';
      case 'forgot': return 'Recuperar Acesso';
      case 'reset': return 'Nova Senha';
      default: return 'Bem-vindo ao VYNEX';
    }
  };

  const getButtonText = () => {
    if (loading) return 'Processando...';
    switch(view) {
      case 'signup': return 'Criar conta';
      case 'forgot': return 'Enviar link';
      case 'reset': return 'Salvar senha';
      default: return 'Acessar plataforma';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <VynexLogo className="h-12" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center mt-4">
            {getViewTitle()}
          </h1>
          <div className="flex items-center gap-2 mt-3 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inteligência Financeira</span>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.06)] border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {view !== 'reset' && (
                  <div className="space-y-2">
                    <label className="label-style ml-1">Seu e-mail</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input 
                        type="email" 
                        required
                        placeholder="seu@email.com"
                        className="w-full pl-12 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all h-14"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {(view === 'login' || view === 'signup' || view === 'reset') && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="label-style">
                        {view === 'reset' ? 'Nova Senha' : 'Sua senha'}
                      </label>
                      {view === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setView('forgot')}
                          className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                          Esqueceu?
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all h-14"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {(view === 'signup') && (
                  <div className="space-y-2">
                    <label className="label-style ml-1">Confirmar senha</label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all h-14"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
                <ShieldAlert size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <Check size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{success}</span>
              </motion.div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full h-15 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {getButtonText()}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
            {view === 'login' ? (
              <button onClick={() => setView('signup')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 flex items-center gap-2 transition-colors">
                <UserPlus size={14} /> Não tem conta? Cadastre-se
              </button>
            ) : (
              <button onClick={() => setView('login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 flex items-center gap-2 transition-colors">
                <RefreshCw size={14} /> Já tem conta? Entre aqui
              </button>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2">
           <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Acesso Seguro Institucional</span>
           </div>
           <p className="text-center text-slate-400 text-[9px] font-medium uppercase tracking-widest px-10 leading-relaxed opacity-60">
             Criptografia de ponta a ponta padrão bancário.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
