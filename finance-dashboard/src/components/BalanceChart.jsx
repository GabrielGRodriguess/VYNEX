import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';

export default function BalanceChart() {
  const { transactions, balance: currentBalance } = useFinance();

  // Simplified for the demo purpose: historical balance points
  const getHistoricalData = () => {
    let runningBalance = currentBalance;
    const history = [{ date: 'Hoje', saldo: runningBalance }];
    
    transactions.slice(0, 8).forEach(t => {
      if (t.type === 'income') runningBalance -= t.amount;
      else runningBalance += t.amount;
      history.unshift({ date: t.date, saldo: runningBalance });
    });
    
    return history;
  };

  const chartData = getHistoricalData();

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A3FF12" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#A3FF12" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            tickFormatter={(value) => `R$ ${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0F172A', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
            }}
            itemStyle={{ color: '#A3FF12', fontWeight: 900 }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
            formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
          />
          <Area 
            type="monotone" 
            dataKey="saldo" 
            stroke="#A3FF12" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorSaldo)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
