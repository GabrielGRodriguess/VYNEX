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

    // 1. ANÁLISE DE COMPORTAMENTO (Humanized AI - 4 Steps)
    
    // REGRA DE GASTO ELEVADO
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] > 1000) {
      const [catName, total] = topCategory;
      generatedInsights.push({
        id: 'ia-insight-expense',
        type: 'alert',
        label: 'Análise de Fluxo',
        icon: '🧠',
        text: `Percebi que seus gastos com "${catName}" somam ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)} este mês. Isso indica que uma parte considerável da sua renda está concentrada aqui, o que pode apertar seu orçamento. Tente revisar o que é essencial nessa categoria. Se precisar de mais fôlego, posso verificar se você consegue reduzir suas parcelas atuais com uma nova simulação de crédito.`,
        color: 'text-amber-500',
        action: 'credit'
      });
    }

    // REGRA DE RENDA ESTÁVEL (Sutileza e Confiança)
    const totalIncome = income.reduce((acc, t) => acc + Number(t.amount), 0);
    if (totalIncome > 3000 && generatedInsights.length < 2) {
      generatedInsights.push({
        id: 'ia-insight-income',
        type: 'feedback',
        label: 'Perfil de Crédito',
        icon: '⭐️',
        text: "Vi que seus recebimentos estão estáveis e acima da média. Isso é um excelente sinal de saúde financeira e aumenta muito sua confiabilidade para o mercado. Com esse perfil, você consegue as melhores taxas do mercado agora mesmo. Vale a pena ver quanto de limite você tem liberado.",
        color: 'text-brand-green',
        action: 'credit'
      });
    }

    // REGRA DE SALDO BAIXO / APERTO
    if (balance < 1000 && balance > 0 && generatedInsights.length < 3) {
      generatedInsights.push({
        id: 'ia-insight-balance',
        type: 'alert',
        label: 'Saúde Financeira',
        icon: '📉',
        text: `Seu saldo está em ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}, um valor que pode te deixar exposto a imprevistos. Me parece que as contas do mês estão pesando mais do que o esperado. Recomendo acompanhar seus gastos diários de perto nos próximos dias. Se a situação apertar, podemos ver se existe alguma alternativa de crédito para reorganizar suas dívidas e aliviar seu caixa.`,
        color: 'text-rose-500',
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
        text: "Ainda estou aprendendo sobre seu ritmo financeiro, mas já vi que você é organizado. Continue registrando suas movimentações para que eu possa te dar conselhos mais precisos. Em breve, terei uma visão clara do seu potencial de crédito.",
        color: 'text-brand-green'
      });
    }

    return generatedInsights.slice(0, 3);
  }, [transactions, balance]);

  return insights;
}
