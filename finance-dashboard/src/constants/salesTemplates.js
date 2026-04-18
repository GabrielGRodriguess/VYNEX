/**
 * VYNEX Sales Scripts Matrix
 * Organized by financial profile and conversion stage.
 */
export const salesTemplates = {
  // 1. Initial Handover Scripts (Pre-filled for WA link)
  HANDOVER: {
    ELITE: (score) => `Olá Nex! Vi que meu Score Vynex é ${score} (Elite). Quero acessar as taxas de investimento exclusivas e os benefícios Black que o app indicou.`,
    BALANCED: (score) => `Olá Nex! Meu Score Vynex é ${score}. Vi que tenho potencial de otimização e quero ver como posso melhorar meus benefícios.`,
    CAUTION: (score) => `Olá! Vi que meu comprometimento financeiro está alto (Score ${score}). Quero ajuda para reduzir minhas parcelas e liberar fôlego mensal.`,
    CRITICAL: () => `Nex, preciso de ajuda urgente. Meu diagnóstico deu crítico e quero iniciar meu plano de recuperação financeira.`
  },

  // 2. Automated Follow-up Scripts
  FOLLOW_UP: {
    ONE_HOUR: (name) => `Oi ${name}, ainda por aí? Minha análise sobre sua margem de manobra ainda está ativa. Quer que eu te mostre como liberar fôlego mensal hoje?`,
    TWENTY_FOUR_HOURS: () => `Opa! Notei que sua janela de oportunidade para taxa VIP expira hoje. Amanhã o sistema recalcula seu score. Vamos aproveitar agora?`,
    THREE_DAYS: () => `Vi que não seguimos. Preparei um mini-guia rápido: "3 passos para subir seu score 50 pontos em 30 dias". Posso te enviar?`
  },

  // 3. Closing Phrases
  CLOSING: {
    URGENCY: "Essa condição é válida apenas enquanto seu diagnóstico atual estiver ativo.",
    BENEFIT: "Essa mudança pode liberar até 15% da sua renda mensal já no próximo mês.",
    ACTION: "Posso prosseguir com a emissão da sua proposta?"
  }
};
