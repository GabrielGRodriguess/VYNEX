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

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e'];

  return (
    <div className="glass p-6 h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Gastos por Categoria</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          Nenhuma despesa registrada
        </div>
      )}
    </div>
  );
}
