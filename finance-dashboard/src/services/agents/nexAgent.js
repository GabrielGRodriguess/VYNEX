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
      title: 'Performance de Elite Desbloqueada',
      text: `Gestão impecável. Seu Score de ${report.score.value} te coloca no topo. Identifiquei uma "janela de liquidez" de R$ ${report.summary.surplus.toLocaleString('pt-BR')} que poucos brasileiros possuem.`,
      recommendation: 'Você está deixando dinheiro parado. Desbloqueie agora seu acesso a taxas de alavancagem que só investidores institucionais costumam ver.',
      primaryAction: 'Acessar Taxas VIP',
      insights: [
        'Perfil de alta conversão patrimonial',
        'Margem de segurança institucional',
        'Livre de armadilhas de juros'
      ]
    };
  },

  generateBalancedDiagnosis(report) {
    return {
      mood: 'balanced',
      title: 'Potencial de Otimização',
      text: `Controle sólido, mas com "gargalos" ocultos. Seu score de ${report.score.value} sugere que você está a um passo de um upgrade real nos seus benefícios bancários.`,
      recommendation: 'Identifiquei pontos onde você pode trocar gastos comuns por cashback e milhas de alto valor. Quer ver como?',
      primaryAction: 'Falar com Especialista',
      insights: [
        'Boa margem operacional',
        'Oportunidade de upgrade black',
        'Estabilidade financeira confirmada'
      ]
    };
  },

  generateCautionDiagnosis(report) {
    return {
      mood: 'cautious',
      title: 'Alerta de Comprometimento',
      text: `Sua margem está sendo "sugada" por custos fixos (${Math.round(report.assessment.fixedExpenseRatio * 100)}%). Seu score de ${report.score.value} indica que você está perdendo fôlego mensal.`,
      recommendation: 'Existe um caminho para liberar até R$ 500,00 mensais apenas renegociando taxas e contratos que vi aqui. Vamos agir?',
      primaryAction: 'Liberar Fôlego Mensal',
      insights: [
        'Vazamento de capital em fixos',
        'Risco de liquidez em 60 dias',
        'Janela de renegociação aberta'
      ]
    };
  },

  generateCriticalDiagnosis(report) {
    return {
      mood: 'critical',
      title: 'Resgate Financeiro Urgente',
      text: `Alerta Vermelho. Seu Score de ${report.score.value} sinaliza um "colapso de fluxo de caixa". Seus gastos estão asfixiando sua renda.`,
      recommendation: 'Precisamos de um plano de estancamento imediato. Vou te ajudar a priorizar o que pagar e como renegociar para sair do sufoco hoje.',
      primaryAction: 'Iniciar Resgate Agora',
      insights: [
        'Comprometimento de renda fatal',
        'Déficit operacional recorrente',
        'Alta exposição a juros abusivos'
      ]
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
