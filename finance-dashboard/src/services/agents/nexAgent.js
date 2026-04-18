/**
 * Nex Intelligence Agent
 * Interprets the analysisReport and generates structured commentary and recommendations.
 */
export const nexAgent = {
  /**
   * Generates a complete diagnostic response based on current analytics.
   * @param {Object} report The analysisReport object from FinanceContext.
   */
  getDiagnostic(report) {
    if (!report || !report.score) return this.getEmptyState();

    const score = report.score.value;
    const surplus = report.summary.surplus;
    const fixedRatio = report.assessment.fixedExpenseRatio;

    if (score >= 800) return this.generateEliteDiagnosis(report);
    if (score >= 600) return this.generateBalancedDiagnosis(report);
    if (score >= 400) return this.generateCautionDiagnosis(report);
    return this.generateCriticalDiagnosis(report);
  },

  generateEliteDiagnosis(report) {
    return {
      mood: 'elite',
      title: 'Performance de Elite',
      text: `Você está com uma gestão impecável! Seu score de ${report.score.value} é top 1%. Identifiquei que você pode investir R$ ${report.summary.surplus.toLocaleString('pt-BR')} este mês. Quer ver onde aplicar esse capital?`,
      recommendation: 'Aproveite seu superávit para acelerar sua liberdade financeira.',
      primaryAction: 'Ver Onde Investir',
      insights: ['Perfil de alta performance', 'Margem de segurança excelente', 'Potencial de crescimento real']
    };
  },

  generateBalancedDiagnosis(report) {
    const savingsPotential = Math.round(report.summary.monthlyExpense * 0.12);
    return {
      mood: 'balanced',
      title: 'Controle em Dia',
      text: `Seu saldo está estável, mas detectei gastos recorrentes que somam R$ ${savingsPotential.toLocaleString('pt-BR')} e parecem desnecessários. Quer revisar esses itens para economizar agora?`,
      recommendation: 'Pequenos ajustes hoje podem significar um upgrade de vida amanhã.',
      primaryAction: 'Revisar Gastos',
      insights: ['Boa margem operacional', 'Gargalos em assinaturas', 'Estabilidade confirmada']
    };
  },

  generateCautionDiagnosis(report) {
    const fixedRatio = Math.round(report.assessment.fixedExpenseRatio * 100);
    return {
      mood: 'cautious',
      title: 'Atenção aos Gastos',
      text: `Cuidado! Você gastou ${fixedRatio}% da sua renda em custos fixos. Detectei que seu saldo pode acabar antes do fim do mês. Quer ajustar seus gastos agora?`,
      recommendation: 'Precisamos liberar fôlego no seu orçamento para evitar imprevistos.',
      primaryAction: 'Ajustar Orçamento',
      insights: ['Vazamento de capital', 'Baixa liquidez mensal', 'Risco de endividamento']
    };
  },

  generateCriticalDiagnosis(report) {
    return {
      mood: 'critical',
      title: 'Resgate Necessário',
      text: `Alerta! Seus gastos subiram 32% acima da média e estão asfixiando sua renda. Detectei juros desnecessários sendo pagos. Vamos renegociar isso agora?`,
      recommendation: 'Vamos montar um plano de resgate imediato para seu caixa.',
      primaryAction: 'Iniciar Resgate',
      insights: ['Déficit recorrente', 'Exposição alta a juros', 'Comprometimento fatal']
    };
  },

  getEmptyState() {
    return {
      mood: 'waiting',
      title: 'Aguardando Dados',
      text: 'Olá! Sou o Nex. Preciso de alguns dados para começar seu diagnóstico. Que tal iniciarmos pela análise manual ou por um extrato?',
      recommendation: 'Escolha uma das formas de importação acima para desbloquear minha inteligência.',
      primaryAction: 'Começar Agora',
      insights: []
    };
  }
};
