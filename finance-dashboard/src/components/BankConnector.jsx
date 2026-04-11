import React, { useState } from 'react';
import { PluggyConnect } from 'react-pluggy-connect';
import { getConnectToken } from '../services/pluggyService';
import { useFinance } from '../context/FinanceContext';

export default function BankConnector() {
  const [connectToken, setConnectToken] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { setBankData } = useFinance();

  const handleStartConnection = async () => {
    setIsConnecting(true);
    try {
      const token = await getConnectToken();
      
      if (token === 'mock-access-token') {
        // Simulate a short delay and then success
        setTimeout(() => {
          handleSuccess({ item: { id: 'mock-item' }, metadata: { institution: { name: 'Nubank (Demo)' } } });
        }, 1500);
        return;
      }
      
      setConnectToken(token);
    } catch (error) {
      alert(`Erro na conexão: ${error.message}`);
      setIsConnecting(false);
    }

  };

  const handleSuccess = (itemData) => {
    console.log('Conectado com sucesso!', itemData);
    setBankData(itemData);
    setConnectToken(null);
    setIsConnecting(false);
  };

  const handleError = (error) => {
    console.error('Erro detalhado no widget:', error);
    
    // Identifica erro de limite de cota do plano Trial
    const isQuotaError = error?.message?.includes('TRIAL_CLIENT_ITEM_CREATE_NOT_ALLOWED');
    
    if (isQuotaError) {
      if (confirm('Sua conta Pluggy (Trial) atingiu o limite de bancos conectados. Deseja usar o "Modo Demo" com dados simulados para continuar testando?')) {
        handleSuccess({ item: { id: 'mock-item' } });
        return;
      }
    }

    if (error && typeof error === 'object') {
      console.log('Mensagem:', error.message);
      console.log('Código:', error.code);
    }
    
    setConnectToken(null);
    setIsConnecting(false);
    
    if (!isQuotaError) {
      alert('O widget da Pluggy encontrou um problema. Verifique o console para mais detalhes.');
    }
  };

  if (connectToken) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950">
        <div className="absolute top-4 right-4 z-[101]">
           <button onClick={() => setConnectToken(null)} className="text-white bg-slate-800 p-2 rounded-lg">&times; Fechar</button>
        </div>
        <PluggyConnect
          connectToken={connectToken}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={() => setConnectToken(null)}
        />
      </div>
    );
  }

  return (
    <button
      onClick={handleStartConnection}
      disabled={isConnecting}
      className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border shadow-lg 
        ${isConnecting 
          ? 'bg-slate-900 border-white/5 text-slate-600 cursor-not-allowed' 
          : 'bg-slate-900 text-white border-white/10 hover:border-brand-green/50 hover:bg-slate-800 shadow-black/50'}`}
    >
      {isConnecting ? (
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
           <span>Sincronizando...</span>
        </div>
      ) : (
        <>
          <span className="text-xl">🔌</span> Sincronizar Banco
        </>
      )}
    </button>
  );
}
