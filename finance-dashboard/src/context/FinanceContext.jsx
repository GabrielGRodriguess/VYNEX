import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { supabase } from '../services/supabaseClient';
import { financialService } from '../services/financialService';

export const FinanceContext = createContext();

export function FinanceProvider({ user, children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // 1. LOAD CONNECTIONS AND MANUAL TRANSACTIONS
  useEffect(() => {
    async function loadAllData() {
      if (!user) {
        setBalance(0);
        setTransactions([]);
        setConnections([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Load connections
        const { data: connData, error: connError } = await supabase
          .from('bank_connections')
          .select('*')
          .eq('user_id', user.id);

        const currentConnections = connData || [];
        setConnections(currentConnections);

        // Load manual transactions
        const { data: txData, error: txError } = await supabase
          .from('finance_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        const manualTxs = txData || [];

        // Aggregate using Service
        const aggregated = await financialService.getAggregatedData(currentConnections, manualTxs);
        
        setBalance(aggregated.balance);
        setTransactions(aggregated.transactions);

      } catch (err) {
        console.error("Erro ao carregar dados financeiros:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!isDemoMode) {
      loadAllData();
    }
  }, [user, isDemoMode]);

  const addConnection = async (itemId, provider) => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('bank_connections')
      .insert([{ user_id: user.id, itemId, provider }])
      .select()
      .single();

    if (!error && data) {
      setConnections(prev => [...prev, data]);
      // Re-trigger global sync
      const aggregated = await financialService.getAggregatedData([...connections, data], transactions.filter(t => !t.fromBank));
      setBalance(aggregated.balance);
      setTransactions(aggregated.transactions);
    }
    setLoading(false);
  };

  const addTransaction = async (transaction) => {
    if (isDemoMode) {
       const newTx = { ...transaction, id: Date.now() };
       setTransactions(prev => [newTx, ...prev]);
       if (transaction.type === 'income') setBalance(prev => prev + Number(transaction.amount));
       else setBalance(prev => prev - Number(transaction.amount));
       return;
    }

    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('finance_transactions')
      .insert([{
        user_id: user.id,
        type: transaction.type,
        amount: Number(transaction.amount),
        category: transaction.category,
        date: transaction.date || new Date().toISOString().split('T')[0],
        description: transaction.description || '',
        from_bank: transaction.fromBank || false
      }])
      .select();

    if (!error && data) {
      setTransactions(prev => [data[0], ...prev]);
      if (transaction.type === 'income') setBalance(prev => prev + Number(transaction.amount));
      else setBalance(prev => prev - Number(transaction.amount));
    }
    setLoading(false);
  };

  const deleteTransaction = async (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    if (isDemoMode || tx.fromBank) {
      // For demo or bank txs we don't delete from DB, just filter UI (reset on reload)
      setTransactions(prev => prev.filter(t => t.id !== id));
      if (tx.type === 'income') setBalance(prev => prev - Number(tx.amount));
      else setBalance(prev => prev + Number(tx.amount));
      return;
    }

    const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      if (tx.type === 'income') setBalance(prev => prev - Number(tx.amount));
      else setBalance(prev => prev + Number(tx.amount));
    }
  };

  const getIncome = () => transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const getExpense = () => transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

  const analytics = useMemo(() => financialService.getAnalytics(transactions), [transactions]);

  return (
    <FinanceContext.Provider value={{
      balance,
      transactions,
      connections,
      loading,
      addTransaction,
      deleteTransaction,
      addConnection,
      getIncome,
      getExpense,
      analytics,
      isDemoMode,
      setIsDemoMode,
      isBankConnected: connections.length > 0 || isDemoMode
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
