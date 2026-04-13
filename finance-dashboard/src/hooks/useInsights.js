import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useInsights() {
  const { transactions, balance } = useFinance();

  const insights = useMemo(() => {
    if (!transactions.length) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    const currentMonthTxs = expenses.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const categoryTotals = currentMonthTxs.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

    const latest = transactions[0];
    const generatedInsights = [];

    // 2. COMPARAÇÃO MENSAL (Trend Analysis)
    const prevMonthTxs = expenses.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1);
    });
    const prevTotal = prevMonthTxs.reduce((acc, t) => acc + Number(t.amount), 0);
    const currentTotal = currentMonthTxs.reduce((acc, t) => acc + Number(t.amount), 0);
    
    if (prevTotal > 0 && currentTotal > prevTotal * 1.1) {
      const diff = ((currentTotal / prevTotal - 1) * 100).toFixed(0);
      generatedInsights.push({
        id: 'ia-insight-trend',
        type: 'alert',
        label: 'Tendência Mensal',
        icon: '📈',
        text: `Seus gastos subiram ${diff}% em relação ao mês passado. Esse aumento repentino pode comprometer suas metas de longo prazo. Que tal revisarmos juntos onde esse valor extra foi aplicado? Posso te ajudar a encontrar economias para equilibrar o mês.`,
        color: 'text-rose-500'
      });
    }

    // 3. DETECÇÃO DE RECORRÊNCIA (Pierre Style)
    const recurringKeys = ['netflix', 'spotify', 'amazon', 'gym', 'academia', 'cloud', 'assine'];
    const detectedSubscriptions = expenses.filter(t => 
      recurringKeys.some(key => t.description.toLowerCase().includes(key))
    );

    if (detectedSubscriptions.length > 0 && generatedInsights.length < 3) {
      generatedInsights.push({
        id: 'ia-insight-recurring',
        type: 'feedback',
        label: 'Assinaturas Detectadas',
        icon: '📑',
        text: `Identifiquei ${detectedSubscriptions.length} assinaturas recorrentes na sua conta. Pequenos valores mensais podem passar despercebidos, mas juntos eles impactam sua liquidez. Quer uma lista detalhada do que você está pagando via VYNEX?`,
        color: 'text-blue-400'
      });
    }

    // 4. FALLBACK OU PERFIL DE CRÉDITO (VYNEX Core)
    const totalIncome = income.reduce((acc, t) => acc + Number(t.amount), 0);
    if (totalIncome > 3000 && generatedInsights.length < 3) {
      generatedInsights.push({
        id: 'ia-insight-income',
        type: 'feedback',
        label: 'Perfil de Crédito',
        icon: '⭐️',
        text: "Vi que seus recebimentos consolidados estão estáveis. Isso aumenta muito sua confiabilidade. Com esse perfil, você consegue as melhores taxas do mercado agora mesmo. Vale a pena ver quanto de limite você tem liberado.",
        color: 'text-brand-green',
        action: 'credit'
      });
    }

    // FALLBACK HUMANIZADO
    if (generatedInsights.length === 0) {
      generatedInsights.push({
        id: 'ia-insight-fallback',
        type: 'feedback',
        label: 'Inteligência VYNEX',
        icon: '✨',
        text: "Estou analisando seu novo patrimônio consolidado. Quanto mais bancos você conectar, mais precisos serão meus conselhos sobre seu dinheiro e potencial de crédito.",
        color: 'text-brand-green'
      });
    }

    return generatedInsights.slice(0, 3);
  }, [transactions, balance]);

  return insights;
}
