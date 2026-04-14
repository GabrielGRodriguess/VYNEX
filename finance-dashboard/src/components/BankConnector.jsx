import { useState, useEffect } from 'react';
import { PluggyConnect } from 'react-pluggy-connect';
import { useFinance } from '../context/FinanceContext';
import { useUser } from '../context/UserContext';
import { planService } from '../services/planService';
import { getConnectToken } from '../services/pluggyService';
import PlanLock from './PlanLock';
import { Plus, RefreshCcw, Landmark, Info } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function BankConnector() {
  const { connections, addConnection, loading } = useFinance();
  const { profile, currentPlan } = useUser();
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [connectToken, setConnectToken] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const toast = useToast();

  const handleConnectStart = async () => {
    // 1. Check Limits based on Plan
    const canAdd = planService.canAddConnection(connections.length, profile?.plan_id || 'free');
    
    if (!canAdd) {
      setIsLockOpen(true);
      return;
    }

    try {
      setIsConnecting(true);
      const token = await getConnectToken();
      setConnectToken(token);
    } catch (err) {
      console.error('[VYNEX] Failed to start connection:', err);
      toast.error('Erro de Inicialização', 'Não foi possível preparar a conexão. Verifique sua chave API.');
      setIsConnecting(false);
    }
  };

  const handleSuccess = async (item) => {
    try {
      // SUCCESS: Real itemId returned by Pluggy
      await addConnection(item.id, item.connector.name);
      toast.success('Banco Conectado!', `Sua conta do ${item.connector.name} foi integrada com sucesso.`);
    } catch (err) {
      console.error('[VYNEX] Sync error after connection:', err);
      toast.error('Erro na Sincronização', 'O banco foi conectado, mas houve um erro ao salvar os dados iniciais.');
    } finally {
      setConnectToken(null);
      setIsConnecting(false);
    }
  };

  const handleError = (error) => {
    console.error('[VYNEX] Pluggy Connect Error:', error);
    toast.error('Opa!', 'A conexão foi interrompida ou houve um erro no widget de conexão.');
    setConnectToken(null);
    setIsConnecting(false);
  };

  const limitReached = connections.length >= currentPlan.maxConnections;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {connections.length > 0 && (
        <div className="hidden sm:flex -space-x-3">
          {connections.map((conn, i) => (
            <div 
              key={conn.id} 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-[0.75rem] bg-slate-900 border border-white/10 flex items-center justify-center text-xs shadow-2xl relative group"
              title={conn.provider}
            >
              <Landmark size={12} className="text-brand-green sm:size-[14px]" />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[8px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20">
                {conn.provider}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage Indicator - Contextual UI */}
      {!loading && connections.length > 0 && (
        <div className={`hidden lg:flex flex-col items-end mr-2 px-3 py-1.5 rounded-xl border ${limitReached ? 'border-rose-500/20 bg-rose-500/5' : 'border-white/5 bg-white/5'}`}>
           <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Limite Uso</p>
           <p className={`text-[10px] font-black ${limitReached ? 'text-rose-500' : 'text-brand-green'}`}>
             {connections.length} / {currentPlan.maxConnections === Infinity ? '∞' : currentPlan.maxConnections}
           </p>
        </div>
      )}

      <button
        onClick={handleConnectStart}
        disabled={loading || isConnecting}
        className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border transition-all active:scale-95 disabled:opacity-50 min-w-0 max-w-[140px] xs:max-w-none ${
          limitReached 
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20' 
            : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
        }`}
      >
        {loading || isConnecting ? (
          <RefreshCcw size={14} className="animate-spin shrink-0 sm:size-4" />
        ) : (
          <Plus size={14} className={`${limitReached ? 'text-amber-500' : 'text-brand-green'} shrink-0 sm:size-4`} />
        )}
        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest truncate">
          {isConnecting ? 'Inicializando...' : (connections.length === 0 ? 'Conectar meus bancos' : (limitReached ? 'Aumentar Limite' : 'Novo Banco'))}
        </span>
      </button>

      {connectToken && (
        <PluggyConnect
          connectToken={connectToken}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={() => {
            setConnectToken(null);
            setIsConnecting(false);
          }}
        />
      )}

      <PlanLock 
        isOpen={isLockOpen} 
        onClose={() => setIsLockOpen(false)} 
        requiredPlan={currentPlan.id === 'free' ? 'PRO' : 'PREMIUM'} 
      />
    </div>
  );
}
