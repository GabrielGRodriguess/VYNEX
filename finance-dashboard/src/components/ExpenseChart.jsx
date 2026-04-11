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

  const COLORS = [
  '#A3FF12', // Vynex Neon Green
  '#3B82F6', // Electric Blue
  '#8B5CF6', // Vivid Purple
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#F43F5E', // Rose
];


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
               align="center"
               wrapperStyle={{ paddingTop: '20px' }}
               formatter={(value) => <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em]">{value}</span>}
               iconType="circle"
               iconSize={6}
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
