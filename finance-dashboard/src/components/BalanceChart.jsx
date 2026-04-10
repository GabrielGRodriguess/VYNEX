import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';

export default function BalanceChart() {
  const { transactions, balance: currentBalance } = useFinance();

  // Calcula a evolução do saldo de trás para frente
  const data = transactions
    .slice()
    .reverse()
    .reduce((acc, t) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].saldo : currentBalance - transactions.reduce((sum, tx) => {
          // This logic is a bit flawed for a simple mock, let's simplify
          return sum + (tx.type === 'income' ? tx.amount : -tx.amount);
      }, 0);
      
      const prevSaldo = acc.length > 0 ? acc[acc.length - 1].saldo : (currentBalance - transactions.reduce((total, curr) => total + (curr.type === 'income' ? curr.amount : -curr.amount) , 0));
      
      // Let's just use a simpler approach for the mock:
      return acc;
    }, []);

  // Simplified for the demo purpose: historical balance points
  const getHistoricalData = () => {
    let runningBalance = currentBalance;
    const history = [{ date: 'Hoje', saldo: runningBalance }];
    
    transactions.slice(0, 10).forEach(t => {
      if (t.type === 'income') runningBalance -= t.amount;
      else runningBalance += t.amount;
      history.unshift({ date: t.date, saldo: runningBalance });
    });
    
    return history;
  };

  const chartData = getHistoricalData();

  return (
    <div className="glass p-6 h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Evolução do Saldo</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip 
            formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="saldo" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#3b82f6' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
