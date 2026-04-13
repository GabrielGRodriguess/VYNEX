import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useInsights() {
  const { analytics } = useFinance();

  const insights = useMemo(() => {
    const generatedInsights = [];

    // 1. SURPLUS/SAVINGS INSIGHT
    if (analytics.monthlySurplus > 1000) {
      generatedInsights.push({
        id: 'ia-insight-surplus',
        type: 'feedback',
        label: 'Capacidade de Aporte',
        icon: '💰',
        text: `Identifiquei um superávit real de R$ ${analytics.monthlySurplus.toFixed(0)} nos últimos 30 dias. Este valor é ideal para começar uma reserva de emergência ou acelerar seus investimentos.`,
        color: 'text-brand-green'
      });
    } else if (analytics.monthlySurplus < 0) {
      generatedInsights.push({
        id: 'ia-insight-deficit',
        type: 'alert',
        label: 'Alerta de Déficit',
        icon: '⚠️',
        text: `Sua operação mensal fechou no negativo em R$ ${Math.abs(analytics.monthlySurplus).toFixed(0)}. Recomendo revisar seus custos variáveis para evitar o uso de crédito caro no próximo mês.`,
        color: 'text-rose-500'
      });
    }

    // 2. RISK DETECTION (Layer 2 Classification)
    if (analytics.riskEvents > 0) {
      generatedInsights.push({
        id: 'ia-insight-risk',
        type: 'alert',
        label: 'Padrão de Risco',
        icon: '🎲',
        text: `Detectamos ${analytics.riskEvents} movimentações em plataformas de alto risco/apostas. Esse comportamento impacta diretamente seu Score Vynex e sua confiabilidade bancária.`,
        color: 'text-amber-500'
      });
    }

    // 3. FIXED EXPENSE ANALYSIS
    if (analytics.fixedExpenseRatio > 0.5) {
      generatedInsights.push({
        id: 'ia-insight-fixed',
        type: 'alert',
        label: 'Comprometimento Elevado',
        icon: '🏠',
        text: `Seus custos fixos consomem ${(analytics.fixedExpenseRatio * 100).toFixed(0)}% da sua renda. O ideal é manter esse valor abaixo de 50% para garantir sua liberdade de escolha financeira.`,
        color: 'text-blue-400'
      });
    }

    // 4. INCOME CONSISTENCY / CREDIT OPPORTUNITY
    if (analytics.incomeConsistency > 0.8 && analytics.monthlyIncome > 2000) {
      generatedInsights.push({
        id: 'ia-insight-consistency',
        type: 'feedback',
        label: 'Saúde de Recebimentos',
        icon: '✅',
        text: "Sua renda apresenta alta previsibilidade e consistência. Isso te posiciona como um cliente de baixo risco e abre portas para as melhores taxas de crédito do ecossistema.",
        color: 'text-emerald-400',
        action: 'credit'
      });
    }

    // FALLBACK IF NO INSIGHTS YET
    if (generatedInsights.length === 0) {
      generatedInsights.push({
        id: 'ia-insight-fallback',
        type: 'feedback',
        label: 'Inteligência Ativa',
        icon: '✨',
        text: "Minha IA está processando suas primeiras conexões. Em breve, gerarei recomendações profundas sobre seu comportamento e potencial de crédito.",
        color: 'text-brand-green'
      });
    }

    return generatedInsights.slice(0, 3);
  }, [analytics]);

  return insights;
}

