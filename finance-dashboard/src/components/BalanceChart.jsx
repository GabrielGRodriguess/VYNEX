import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useFinance } from '../context/FinanceContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 border-white/10 shadow-2xl">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">{payload[0].payload.date}</p>
        <p className="text-sm font-black text-brand-green">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

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
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em]">{value}</span>}
                iconType="circle"
                iconSize={6}
             />
          <Area 
            type="monotone" 
            dataKey="saldo" 
            name="Saldo"
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
