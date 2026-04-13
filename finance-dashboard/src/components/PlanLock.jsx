import { Lock, Crown, Check, X } from 'lucide-react';
import { PLANS } from '../services/planService';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import BaseModal from './Common/BaseModal';

export default function PlanLock({ isOpen, onClose, requiredPlan = 'PRO' }) {
  const { updatePlan } = useUser();
  const toast = useToast();
  const targetPlan = PLANS[requiredPlan];

  const handleUpgrade = () => {
    updatePlan(targetPlan.id);
    toast.success('Assinatura Atualizada', `Você agora tem acesso aos benefícios do Plano ${targetPlan.name}!`);
    onClose();
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-lg"
    >
      <div className="relative z-10 space-y-8 text-center py-4">
        <div className="w-20 h-20 bg-brand-green/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-brand-green/20">
          <Crown className="text-brand-green" size={40} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">Funcionalidade Premium</h2>
          <p className="text-slate-500 text-sm">
            Esta funcionalidade está disponível apenas para membros <span className="text-brand-green font-bold">{targetPlan.name}</span>.
          </p>
        </div>

        <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-6 text-left space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incluído no {targetPlan.name}:</p>
          <div className="space-y-3">
            {targetPlan.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Check size={12} />
                </div>
                <span className="text-xs text-slate-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleUpgrade}
            className="w-full py-5 bg-neon-gradient text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-brand-green/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Fazer Upgrade Agora
          </button>

          <button 
            onClick={onClose}
            className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors"
          >
            Voltar ao dashboard
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
