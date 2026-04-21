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

  const totalExpenses = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  const COLORS = [
    '#2563EB', // Blue-600
    '#6366F1', // Indigo-500
    '#8B5CF6', // Violet-500
    '#EC4899', // Pink-500
    '#F59E0B', // Amber-500
    '#10B981', // Emerald-500
  ];

  const topCategory = data[0];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-[220px] relative">
        {data.length > 0 ? (
          <>
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
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '16px', 
                    border: '1px solid #F1F5F9',
                    color: '#0F172A',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontWeight: 800, textTransform: 'capitalize' }}
                  formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{value}</span>}
                  iconType="circle"
                  iconSize={6}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Gasto</p>
               <p className="text-xl font-black text-slate-900">
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalExpenses)}
               </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-medium italic text-sm">
            Nenhum gasto registrado ainda.
          </div>
        )}
      </div>

      {data.length > 0 && topCategory && (
        <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alerta de Comportamento</p>
          </div>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">
            Sua maior despesa é <span className="text-blue-600 font-bold uppercase tracking-tight">{topCategory.name}</span>. 
            Mantenha atenção a este grupo para otimizar sua margem livre.
          </p>
        </div>
      )}
    </div>
  );
}
