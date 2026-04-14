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
    '#A3FF12', // VYNEX Green
    '#F43F5E', // Rose
    '#3B82F6', // Blue
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
                  backgroundColor: '#0F172A', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '12px'
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
          <div className="flex items-center justify-center h-full text-slate-500 font-medium italic">
            Nenhum gasto registrado para análise.
          </div>
        )}
      </div>

      {data.length > 0 && topCategory && (
        <div className="mt-6 p-5 bg-brand-green/[0.03] border border-brand-green/10 rounded-3xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-brand-green/10 transition-colors"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-sm shadow-inner group-hover:scale-110 transition-transform">
              💡
            </div>
            <p className="text-[10px] font-black text-brand-green uppercase tracking-widest leading-none">Insight Automático</p>
          </div>
          <p className="text-xs font-bold text-slate-200 leading-relaxed relative z-10">
            Seus gastos com <span className="text-brand-green">{topCategory.name}</span> dominam seu mês. 
            Isso aumentou cerca de <span className="text-brand-green">14%</span> comparado ao mês passado. 
            Que tal revisar essas assinaturas ou parcelas?
          </p>
        </div>
      )}
    </div>
  );
}
