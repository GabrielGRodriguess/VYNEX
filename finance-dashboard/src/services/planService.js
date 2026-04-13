/**
 * planService.js
 * Manages tiers, limits and feature availability.
 */

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    maxConnections: 1,
    maxActiveAgents: 1,
    features: ['Dashboard Básico', 'Insights de Crédito', '1 Conexão Bancária', '1 Agente Ativo'],
    price: 0
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    maxConnections: 5,
    maxActiveAgents: 3,
    features: ['Até 5 Conexões', 'Chat IA Ilimitado', 'Insights Avançados', 'Suporte Prioritário', '3 Agentes Ativos'],
    price: 29.90
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    maxConnections: 99,
    maxActiveAgents: 10,
    features: ['Conexões Ilimitadas', 'Gestão Multi-Perfil', 'Mentoria de Crédito', 'Taxas Exclusivas', '10 Agentes Ativos'],
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

  canAddAgent(currentCount, planId) {
    const plan = this.getPlanById(planId);
    return currentCount < plan.maxActiveAgents;
  },

  getAvailablePlans() {
    return Object.values(PLANS);
  }
};
