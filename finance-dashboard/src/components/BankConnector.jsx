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
      alert('Erro ao iniciar conexão com o banco. Usando modo de simulação.');
      handleSuccess({ item: { id: 'mock-item' } });
      setIsConnecting(false);
    }
  };

  const handleSuccess = (itemData) => {
    console.log('Conectado com sucesso!', itemData);
    // Aqui avisamos o nosso "cérebro" que agora temos dados reais
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
      <div className="fixed inset-0 z-[100] bg-white">
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
      className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg 
        ${isConnecting ? 'bg-gray-300' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100'}`}
    >
      {isConnecting ? (
        <span className="animate-pulse">Conectando...</span>
      ) : (
        <>
          <span className="text-xl">🏦</span> Conectar Nubank
        </>
      )}
    </button>
  );
}
