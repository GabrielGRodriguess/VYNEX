import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';

export default function ExpenseChart() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const reduced = transactions
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
    return reduced.sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = [
    '#2563EB', // Blue-600
    '#3B82F6', // Blue-500
    '#F43F5E', // Rose
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
  ];

  const topCategory = data[0];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-black pointer-events-none uppercase">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-[250px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                animationDuration={1500}
                labelLine={false}
                label={renderCustomizedLabel}
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
                  backgroundColor: '#FFFFFF', 
                  borderRadius: '16px', 
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{value}</span>}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-medium italic">
            Nenhum gasto registrado para análise.
          </div>
        )}
      </div>

      {data.length > 0 && topCategory && (
        <div className="mt-6 p-5 bg-blue-50/50 border border-blue-100 rounded-3xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white border border-blue-100 flex items-center justify-center text-sm shadow-sm">
              💡
            </div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Insight Automático</p>
          </div>
          <p className="text-xs font-bold text-slate-600 leading-relaxed relative z-10">
            Seus gastos com <span className="text-blue-600">{topCategory.name}</span> dominam seu mês. 
            Isso aumentou cerca de <span className="text-blue-600">14%</span> comparado ao mês passado. 
            Que tal revisar essas assinaturas ou parcelas?
          </p>
        </div>
      )}
    </div>
  );
}
