import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const isPositive = payload[0].value >= 0;
    return (
      <div className="glass p-4 border-slate-200 bg-white shadow-xl">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">{payload[0].payload.date}</p>
        <p className={`text-sm font-black ${isPositive ? 'text-blue-600' : 'text-rose-500'}`}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function BalanceChart() {
  const { transactions, balance: currentBalance } = useFinance();

  const chartData = useMemo(() => {
    let runningBalance = currentBalance;
    const history = [{ date: 'Hoje', saldo: runningBalance }];
    
    // Mostramos apenas os últimos 6 lances para maior clareza
    transactions.slice(0, 6).forEach(t => {
      if (t.type === 'income') runningBalance -= t.amount;
      else runningBalance += t.amount;
      history.unshift({ 
        date: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 
        saldo: runningBalance 
      });
    });
    return history;
  }, [transactions, currentBalance]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return 'stable';
    const first = chartData[0].saldo;
    const last = chartData[chartData.length - 1].saldo;
    if (last > first * 1.05) return 'up';
    if (last < first * 0.95) return 'down';
    return 'stable';
  }, [chartData]);

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${trend === 'up' ? 'bg-blue-600' : trend === 'down' ? 'bg-rose-500' : 'bg-slate-400'} animate-pulse`}></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Tendência: {trend === 'up' ? 'Crescimento' : trend === 'down' ? 'Atenção' : 'Estável'}
           </span>
        </div>
        {trend === 'down' && (
          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
            Ação Sugerida
          </span>
        )}
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={trend === 'down' ? '#F43F5E' : '#2563EB'} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={trend === 'down' ? '#F43F5E' : '#2563EB'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="saldo" 
              stroke={trend === 'down' ? '#F43F5E' : '#2563EB'} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorSaldo)" 
              animationDuration={1500}
              activeDot={{ r: 6, fill: trend === 'down' ? '#F43F5E' : '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
