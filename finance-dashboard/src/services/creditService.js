/**
 * creditService.js
 * Advanced credit scoring and offer generation (Vynex Score 2.0).
 */
import { getDecisionResult } from './creditDecisionEngine';

export const creditService = {
  /**
   * Calculates the Vynex Score 2.0 (Scale 0-1000)
   */
  calculateScore2(financialData, profile) {
    if (!financialData) return 300; // Baseline for new users without data

    // Use the core engine but extend it with data-driven multipliers
    const decision = getDecisionResult({
      renda: profile?.estimated_income || 2500,
      tipo_vinculo: profile?.vinculo || 'CLT',
      status_margem: 'Livre' // Placeholder for logic
    }, financialData);

    return decision.score_vynex;
  },

  /**
   * Gets a list of personalized loan/credit offers.
   */
  getPersonalizedOffers(score, financialData) {
    const offers = [];

    if (score >= 800) {
      offers.push({
        id: 'premium_loan',
        title: 'Empréstimo Premium',
        amount: 'R$ 25.000',
        rate: '1.29% a.m.',
        active: true
      });
    }

    if (score >= 500) {
      offers.push({
        id: 'credit_card',
        title: 'Cartão VYNEX Black',
        amount: 'Limite R$ 5.000',
        rate: 'Anuidade Zero',
        active: true
      });
    }

    return offers.filter(o => o.active);
  },

  /**
   * Translates score into a risk category
   */
  getRiskCategory(score) {
    if (score >= 800) return { label: 'Excelente', color: 'text-brand-primary', bg: 'bg-brand-primary/10' };
    if (score >= 600) return { label: 'Bom', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (score >= 400) return { label: 'Regular', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'Baixo', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  }
};
