import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const isPositive = payload[0].value >= 0;
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xl shadow-blue-900/10 backdrop-blur-sm">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">
          {payload[0].payload.fullDate || payload[0].payload.date}
        </p>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-blue-600' : 'bg-rose-500'}`} />
          <p className={`text-base font-black ${isPositive ? 'text-slate-900' : 'text-rose-600'}`}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function BalanceChart() {
  const { transactions, balance: currentBalance } = useFinance();

  const chartData = useMemo(() => {
    let runningBalance = currentBalance;
    const history = [{ 
      date: 'Hoje', 
      fullDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
      saldo: runningBalance 
    }];
    
    // Reverse logic: to find past balances, we subtract income and add expenses
    transactions.slice(0, 10).forEach(t => {
      if (t.type === 'income') runningBalance -= t.amount;
      else runningBalance += t.amount;
      
      const d = new Date(t.date);
      history.unshift({ 
        date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 
        fullDate: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
        saldo: runningBalance 
      });
    });
    return history;
  }, [transactions, currentBalance]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return 'stable';
    const first = chartData[0].saldo;
    const last = chartData[chartData.length - 1].saldo;
    if (last > first * 1.02) return 'up';
    if (last < first * 0.98) return 'down';
    return 'stable';
  }, [chartData]);

  const brandColor = trend === 'down' ? '#F43F5E' : '#2563EB';

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${trend === 'up' ? 'bg-blue-600' : trend === 'down' ? 'bg-rose-500' : 'bg-slate-400'} animate-pulse`}></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Fluxo: {trend === 'up' ? 'Positivo' : trend === 'down' ? 'Reduzindo' : 'Estável'}
           </span>
        </div>
      </div>
      
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={brandColor} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={brandColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => value === 0 ? '0' : `${value > 0 ? '+' : ''}${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }} />
            <Area 
              type="monotone" 
              dataKey="saldo" 
              stroke={brandColor} 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorSaldo)" 
              animationDuration={1500}
              activeDot={{ r: 6, fill: brandColor, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
