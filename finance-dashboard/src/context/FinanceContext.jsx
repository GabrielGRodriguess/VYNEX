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

  // Advanced metrics calculated from transactions
  const analytics = useMemo(() => {
    try {
      return financialService.getAnalytics(transactions);
    } catch (err) {
      console.error("[VYNEX] FinanceProvider analytics error:", err);
      // Absolute fallback if everything else fails
      return {
        monthlyIncome: 0,
        monthlyExpense: 0,
        monthlySurplus: 0,
        categoryDistribution: {},
        transactionCount: 0
      };
    }
  }, [transactions]);

  // 1. LOAD CONNECTIONS AND TRANSACTIONS
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
        // Load bank connections
        const { data: connData } = await supabase
          .from('bank_connections')
          .select('*')
          .eq('user_id', user.id);

        const currentConnections = connData || [];
        setConnections(currentConnections);

        // Load manual transactions
        const { data: txData } = await supabase
          .from('finance_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        const manualTxs = txData || [];

        // Aggregate using Service (Includes Layer 2 Classification)
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
      const newConnections = [...connections, data];
      setConnections(newConnections);
      
      // Re-trigger global sync with classification
      const aggregated = await financialService.getAggregatedData(newConnections, transactions.filter(t => !t.fromBank));
      setBalance(aggregated.balance);
      setTransactions(aggregated.transactions);
    }
    setLoading(false);
  };

  const addTransaction = async (transaction) => {
    if (isDemoMode) {
       const newTx = { ...transaction, id: Date.now() };
       const classified = financialService.classifyTransactions([newTx])[0];
       setTransactions(prev => [classified, ...prev]);
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
      const classified = financialService.classifyTransactions([data[0]])[0];
      setTransactions(prev => [classified, ...prev]);
      if (transaction.type === 'income') setBalance(prev => prev + Number(transaction.amount));
      else setBalance(prev => prev - Number(transaction.amount));
    }
    setLoading(false);
  };

  const deleteTransaction = async (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    if (isDemoMode || tx.fromBank) {
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

  return (
    <FinanceContext.Provider value={{
      balance,
      transactions,
      connections,
      loading,
      addTransaction,
      deleteTransaction,
      addConnection,
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

