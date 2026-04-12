import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, ShieldAlert, UserPlus, RefreshCw, KeyRound, Check } from 'lucide-react';
import logo from '../assets/vynex-logo.png';
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
      case 'signup': return 'Criar Nova Conta';
      case 'forgot': return 'Recuperar Acesso';
      case 'reset': return 'Nova Senha';
      default: return 'Seja bem-vindo';
    }
  };

  const getButtonText = () => {
    if (loading) return 'Processando...';
    switch(view) {
      case 'signup': return 'Cadastrar Agora';
      case 'forgot': return 'Enviar Link';
      case 'reset': return 'Salvar Senha';
      default: return 'Acessar Plataforma';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-brand-green/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[0%] right-[-5%] w-96 h-96 bg-brand-green/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.img 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={logo} 
            alt="VYNEX Logo" 
            className="h-16 w-auto mb-4 drop-shadow-[0_0_15px_rgba(163,255,18,0.3)]"
          />
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter text-center">
            {getViewTitle()}
          </h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green neon-glow"></span>
            Financial Intelligence
          </p>
        </div>

        <div className="glass p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-green/30 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Email Field (Always visible except in reset) */}
                {view !== 'reset' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail corporativo</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 text-slate-500" size={18} />
                      <input 
                        type="email" 
                        required
                        placeholder="exemplo@vynex.com"
                        className="input-style pl-12 h-14"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Password Field (Not in forgot) */}
                {(view === 'login' || view === 'signup' || view === 'reset') && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {view === 'reset' ? 'Nova Senha' : 'Sua senha'}
                      </label>
                      {view === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setView('forgot')}
                          className="text-[9px] font-black text-brand-green uppercase tracking-widest hover:underline"
                        >
                          Esqueceu?
                        </button>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 text-slate-500" size={18} />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="input-style pl-12 h-14"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Confirm Password (SignUp/Reset) */}
                {(view === 'signup') && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmar Senha</label>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-4 text-slate-500" size={18} />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="input-style pl-12 h-14"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <ShieldAlert size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-brand-green bg-brand-green/10 p-3 rounded-xl border border-brand-green/20">
                <Check size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{success}</span>
              </motion.div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full h-16 bg-brand-green text-slate-950 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] shadow-2xl shadow-brand-green/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {getButtonText()}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            {view === 'login' ? (
              <button onClick={() => setView('signup')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white flex items-center gap-2">
                <UserPlus size={14} /> Não tem conta? Cadastre-se
              </button>
            ) : (
              <button onClick={() => setView('login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white flex items-center gap-2">
                <RefreshCw size={14} /> Voltar para o Login
              </button>
            )}
            
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <ShieldCheck size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest">Acesso Seguro VYNEX Intel</span>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] font-medium mt-8 uppercase tracking-widest px-10 leading-relaxed">
          O VYNEX utiliza criptografia de ponta a ponta para proteger seus dados financeiros institucionais.
        </p>
      </motion.div>
    </div>
  );
}
