import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';

export default function ExpenseChart() {
  const { transactions } = useFinance();

  const data = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({ name: t.category, value: Number(t.amount) });
      }
      return acc;
    }, []);

  const COLORS = ['#A3FF12', '#00C853', '#B2FF59', '#1E293B', '#64748B', '#FFFFFF'];

  return (
    <div className="w-full h-full min-h-[300px]">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                   key={`cell-${index}`} 
                   fill={COLORS[index % COLORS.length]} 
                   className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F172A', 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white'
              }}
              formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            />
            <Legend 
               verticalAlign="bottom" 
               formatter={(value) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{value}</span>}
               iconType="circle"
               iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500 font-medium italic">
          Aguardando registros...
        </div>
      )}
    </div>
  );
}
