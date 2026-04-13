import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useUser } from '../context/UserContext';
import { planService } from '../services/planService';
import PlanLock from './PlanLock';
import { Plus, RefreshCcw, Landmark } from 'lucide-react';

export default function BankConnector() {
  const { connections, addConnection, loading } = useFinance();
  const { profile, currentPlan } = useUser();
  const [isLockOpen, setIsLockOpen] = useState(false);

  const handleConnect = async () => {
    // 1. Check Limits based on Plan
    const canAdd = planService.canAddConnection(connections.length, profile?.plan_id || 'free');
    
    if (!canAdd) {
      setIsLockOpen(true);
      return;
    }

    // 2. Mock Connection Logic (Pluggy-ready)
    const mockItemId = `item_${Math.random().toString(36).substr(2, 9)}`;
    const mockProvider = ['Itaú', 'Bradesco', 'Nubank', 'Inter'][Math.floor(Math.random() * 4)];
    
    await addConnection(mockItemId, mockProvider);
  };

  return (
    <div className="flex items-center gap-3">
      {connections.length > 0 && (
        <div className="flex -space-x-3">
          {connections.map((conn, i) => (
            <div 
              key={conn.id} 
              className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs shadow-2xl relative group"
              title={conn.provider}
            >
              <Landmark size={14} className="text-brand-green" />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[8px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20">
                {conn.provider}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={loading}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-6 py-3 rounded-2xl border border-white/5 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          <RefreshCcw size={16} className="animate-spin" />
        ) : (
          <Plus size={16} className="text-brand-green" />
        )}
        <span className="text-[10px] font-black uppercase tracking-widest">
          {connections.length === 0 ? 'Conectar meus bancos' : 'Adicionar Banco'}
        </span>
      </button>

      <PlanLock 
        isOpen={isLockOpen} 
        onClose={() => setIsLockOpen(false)} 
        requiredPlan={currentPlan.id === 'free' ? 'PRO' : 'PREMIUM'} 
      />
    </div>
  );
}
