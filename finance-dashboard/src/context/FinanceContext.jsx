import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { fetchAllData } from '../services/pluggyService';

export const FinanceContext = createContext();

export function FinanceProvider({ user, children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // LOAD REAL DATA FROM SUPABASE
  useEffect(() => {
    async function loadData() {
      if (!user) {
        setBalance(0);
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .from('finance_transactions')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data) {
        setTransactions(data);
        // Calculate balance from transaction history
        const total = data.reduce((acc, t) => {
          return t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount);
        }, 0);
        setBalance(total);
      } else {
        console.error("Erro ao carregar transações:", error);
        setBalance(0);
        setTransactions([]);
      }
      setLoading(false);
    }

    if (!isDemoMode) {
      loadData();
    }
  }, [user, isDemoMode]);

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
    } else {
      console.error("Erro ao salvar transação:", error);
    }
    setLoading(false);
  };

  const deleteTransaction = async (id) => {
    if (isDemoMode) {
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        if (tx.type === 'income') setBalance(prev => prev - Number(tx.amount));
        else setBalance(prev => prev + Number(tx.amount));
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
      return;
    }

    if (!user) return;

    const { error } = await supabase
      .from('finance_transactions')
      .delete()
      .eq('id', id);

    if (!error) {
      const tx = transactions.find(t => t.id === id);
      if (tx.type === 'income') setBalance(prev => prev - Number(tx.amount));
      else setBalance(prev => prev + Number(tx.amount));
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const loadDemoData = () => {
    setIsDemoMode(true);
    const demoTransactions = [
      { id: 'd1', type: 'income', amount: 5000, category: 'Salário', date: '2026-04-10' },
      { id: 'd2', type: 'expense', amount: 1200, category: 'Aluguel', date: '2026-04-11' },
      { id: 'd3', type: 'expense', amount: 150, category: 'Transporte', date: '2026-04-12' },
      { id: 'd4', type: 'income', amount: 1200, category: 'Comissão', date: '2026-04-12' },
    ];
    setTransactions(demoTransactions);
    setBalance(4850);
  };

  const setBankData = async (data) => {
    if (data.item && user) {
      setLoading(true);
      try {
        const bankData = await fetchAllData(data.item.id);
        
        setBalance(bankData.balance);
        setTransactions(bankData.transactions);

        if (data.item.id === 'mock-item') {
          setIsDemoMode(true);
        } else {
          localStorage.setItem(`vynex_u_${user.email}_bank_item_id`, data.item.id);
          setIsDemoMode(false);
        }

      } catch (error) {
        console.error("Erro ao sincronizar banco:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getIncome = () => {
    return transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  };

  const getExpense = () => {
    return transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
  };

  const isBankConnected = isDemoMode || (transactions.some(t => t.fromBank));

  return (
    <FinanceContext.Provider value={{
      balance,
      transactions,
      loading,
      addTransaction,
      deleteTransaction,
      setBankData,
      getIncome,
      getExpense,
      isDemoMode,
      loadDemoData,
      isBankConnected
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
