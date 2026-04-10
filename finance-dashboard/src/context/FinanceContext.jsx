import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchBankData } from '../services/api';

export const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    
    let newBalance = balance;
    if (transaction.type === 'income') {
      newBalance = balance + Number(transaction.amount);
    } else {
      newBalance = balance - Number(transaction.amount);
    }
    setBalance(newBalance);
  };

  const getIncome = () => transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const getExpense = () => transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <FinanceContext.Provider value={{
      balance,
      transactions,
      loading,
      addTransaction,
      getIncome,
      getExpense
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
