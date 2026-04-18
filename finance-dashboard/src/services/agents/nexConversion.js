import { salesTemplates } from '../../constants/salesTemplates';

/**
 * Nex Conversion Engine
 * Decides the best financial offer and WhatsApp strategy based on the user's diagnostic.
 */
export const nexConversion = {
  /**
   * Returns the recommended offer and CTA text for the user.
   * @param {Object} report The analysisReport object.
   */
  getRecommendedOffer(report) {
    if (!report || !report.score) return null;

    const score = report.score.value;
    
    if (score >= 800) {
      return {
        id: 'credit_investment',
        title: 'Crédito de Elite',
        cta: 'Acessar Taxas VIP',
        message: 'Seu perfil é nota A. Você tem pré-apvação para linhas de investimento com taxas reduzidas.',
        waIntent: salesTemplates.HANDOVER.ELITE(score)
      };
    }

    if (score >= 600) {
      return {
        id: 'card_black',
        title: 'Upgrade de Cartão',
        cta: 'Ver Benefícios Black',
        message: 'Sua gestão é sólida. Que tal transformar seus gastos em milhas e benefícios exclusivos?',
        waIntent: salesTemplates.HANDOVER.BALANCED(score)
      };
    }

    if (score >= 400) {
      return {
        id: 'debt_consolidation',
        title: 'Fôlego Mensal',
        cta: 'Reduzir Parcelas',
        message: 'Identifiquei um peso nos seus custos fixos. Podemos trocar dívidas caras por uma parcela única menor.',
        waIntent: salesTemplates.HANDOVER.CAUTION(score)
      };
    }

    return {
      id: 'financial_recovery',
      title: 'Recuperação Vynex',
      cta: 'Limpar Perfil Agora',
      message: 'Seu diagnóstico é crítico. Vamos criar um plano de 90 dias para recuperar seu score e crédito.',
      waIntent: salesTemplates.HANDOVER.CRITICAL()
    };
  }
};
