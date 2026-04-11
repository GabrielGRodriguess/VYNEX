import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchBankData } from '../services/api';
import { fetchAllData } from '../services/pluggyService';

export const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const storedTransactions = localStorage.getItem('finance_transactions');
    const storedBalance = localStorage.getItem('finance_balance');

    if (storedTransactions && storedBalance) {
      setTransactions(JSON.parse(storedTransactions));
      setBalance(JSON.parse(storedBalance));
      setLoading(false);
    } else {
      fetchBankData().then(data => {
        setBalance(data.balance);
        setTransactions(data.transactions);
        setLoading(false);
        localStorage.setItem('finance_balance', JSON.stringify(data.balance));
        localStorage.setItem('finance_transactions', JSON.stringify(data.transactions));
      });
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('finance_balance', JSON.stringify(balance));
      localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }
  }, [balance, transactions, loading]);

  const addTransaction = (transaction) => {
    const newTx = { ...transaction, id: Date.now() };
    setTransactions(prev => [newTx, ...prev]);
    
    if (transaction.type === 'income') {
      setBalance(prev => prev + Number(transaction.amount));
    } else {
      setBalance(prev => prev - Number(transaction.amount));
    }
  };

  const deleteTransaction = (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    
    if (tx.type === 'income') {
      setBalance(prev => prev - Number(tx.amount));
    } else {
      setBalance(prev => prev + Number(tx.amount));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const savedItemId = localStorage.getItem('vynex_bank_item_id');
    if (savedItemId && transactions.length === 0) {
      setBankData({ item: { id: savedItemId } });
    }
  }, []);

  const setBankData = async (data) => {
    if (data.item) {
      setLoading(true);
      try {
        const bankData = await fetchAllData(data.item.id);
        
        // Update balance and transactions
        setBalance(bankData.balance);
        setTransactions(prev => {
          const fromBank = bankData.transactions;
          const manuals = prev.filter(t => !t.fromBank);
          return [...fromBank, ...manuals];
        });

        // Set persistent metadata
        if (data.item.id === 'mock-item') {
          setIsDemoMode(true);
        } else {
          localStorage.setItem('vynex_bank_item_id', data.item.id);
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
    const total = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    return total || 0;
  };

  const getExpense = () => {
    const total = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    return total || 0;
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
      isBankConnected
    }}>
      {children}
    </FinanceContext.Provider>
  );
}


export function useFinance() {
  return useContext(FinanceContext);
}
