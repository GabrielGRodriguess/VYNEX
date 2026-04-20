import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Palette, Globe, Monitor, Volume2, Smartphone, Database, AlertCircle, Clock } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export default function SettingsPage({ onAddTransaction }) {
  const [prefs, setPrefs] = useState({
    defaultPage: 'dashboard',
    theme: 'dark',
    sound: true,
    vibration: true
  });

  const SettingSection = ({ icon, title, children }) => (
    <div className="glass p-8 border-white/5 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand-primary">
          {icon}
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="space-y-2 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-brand-primary">
          <Settings size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Preferências do App</span>
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
          Personalize sua <span className="text-brand-primary">Experiência</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SettingSection icon={<Monitor />} title="Interface">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-200">Página Inicial</p>
                <p className="text-[10px] text-slate-500">Onde o VYNEX abre por padrão</p>
              </div>
              <select 
                value={prefs.defaultPage}
                onChange={(e) => setPrefs({...prefs, defaultPage: e.target.value})}
                className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="dashboard">Dashboard</option>
                <option value="chat">Chat (AI First)</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-200">Tema do Sistema</p>
                <p className="text-[10px] text-slate-500">Aparência visual do aplicativo</p>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10">
                {['light', 'dark', 'auto'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setPrefs({...prefs, theme: t})}
                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      prefs.theme === t ? 'bg-brand-primary text-slate-950' : 'text-slate-500'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingSection>

        <SettingSection icon={<Volume2 />} title="Sensorial">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-200">Sons de Notificação</p>
                <p className="text-[10px] text-slate-500">Efeitos sonoros nas transações e insights</p>
              </div>
              <button
                onClick={() => setPrefs({...prefs, sound: !prefs.sound})}
                className={`w-12 h-6 rounded-full relative transition-all ${prefs.sound ? 'bg-brand-primary' : 'bg-slate-800'}`}
              >
                <motion.div animate={{ x: prefs.sound ? 24 : 4 }} className="w-4 h-4 rounded-full bg-slate-950 absolute top-1" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-200">Vibração (Haptic)</p>
                <p className="text-[10px] text-slate-500">Feedback físico em dispositivos móveis</p>
              </div>
              <button
                onClick={() => setPrefs({...prefs, vibration: !prefs.vibration})}
                className={`w-12 h-6 rounded-full relative transition-all ${prefs.vibration ? 'bg-brand-primary' : 'bg-slate-800'}`}
              >
                <motion.div animate={{ x: prefs.vibration ? 24 : 4 }} className="w-4 h-4 rounded-full bg-slate-950 absolute top-1" />
              </button>
            </div>
          </div>
        </SettingSection>

        <SettingSection icon={<Database />} title="Dados e Sincronização">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/30 p-6 rounded-2xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-slate-200">Adicionar Transação</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-slate-500 max-w-sm">
                    Registre suas movimentações manualmente para manter seu painel sempre atualizado. 
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-widest border border-brand-primary/20">
                    <AlertCircle size={10} /> Disponível
                  </span>
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Acesso Ilimitado</span>
                </div>
              </div>
              <button
                onClick={onAddTransaction}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
              >
                <AlertCircle size={14} className="text-brand-primary" />
                Nova Transação
              </button>
            </div>
          </div>
        </SettingSection>

        <div className="p-8 flex justify-end">
          <button className="bg-brand-primary text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-primary/20">
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );
}
