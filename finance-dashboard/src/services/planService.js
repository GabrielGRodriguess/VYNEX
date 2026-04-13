/**
 * planService.js
 * Manages tiers, limits and feature availability.
 */

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    maxConnections: 1,
    features: ['Dashboard Básico', 'Insights de Crédito', '1 Conexão Bancária'],
    price: 0
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    maxConnections: 5,
    features: ['Até 5 Conexões', 'Chat IA Ilimitado', 'Insights Avançados', 'Suporte Prioritário'],
    price: 29.90
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    maxConnections: 99,
    features: ['Conexões Ilimitadas', 'Gestão Multi-Perfil', 'Mentoria de Crédito', 'Taxas Exclusivas'],
    price: 49.90
  }
};

export const planService = {
  getPlanById(id) {
    return Object.values(PLANS).find(p => p.id === id) || PLANS.FREE;
  },

  canAddConnection(currentCount, planId) {
    const plan = this.getPlanById(planId);
    return currentCount < plan.maxConnections;
  },

  getAvailablePlans() {
    return Object.values(PLANS);
  }
};
