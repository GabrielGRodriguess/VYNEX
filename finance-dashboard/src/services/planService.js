/**
 * planService.js
 * Manages tiers, limits and feature availability.
 */

export const PLANS = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: 0,
    maxConnections: 1,
    maxActiveAgents: 2,
    features: [
      '1 Conexão bancária',
      '2 Agentes de IA Ativos',
      'Dashboard Financeiro básico',
      'Insights de gastos simples',
      'Análise de Score básico'
    ]
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 29,
    maxConnections: 5,
    maxActiveAgents: Infinity,
    features: [
      'Até 5 Conexões bancárias',
      'Todos os Agentes Ativos',
      'Dashboard Avançado',
      'Insights comportamentais',
      'Análise de Crédito precisa',
      'Suporte prioritário (Email)'
    ]
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Premium',
    price: 49,
    maxConnections: Infinity,
    maxActiveAgents: Infinity,
    features: [
      'Conexões Ilimitadas',
      'Todos os Agentes Ativos',
      'Inteligência Consolidada Multi-banco',
      'Relatórios de Renda Real',
      'Vynex Score 2.0 (Deep Data)',
      'Suporte VIP 24h (WhatsApp)'
    ]
  }
};

export const planService = {
  getPlanById(id) {
    return PLANS[id?.toUpperCase()] || PLANS.FREE;
  },

  canAddAgent(currentActiveCount, planId, role = 'free') {
    // Admin and Premium roles always have unlimited access
    if (role === 'admin' || role === 'premium') return true;
    
    const plan = this.getPlanById(planId);
    
    // Explicitly handle FREE plan limit of 2
    if (planId?.toUpperCase() === 'FREE' || role === 'free') {
      return currentActiveCount < 2;
    }

    return currentActiveCount < plan.maxActiveAgents;
  },

  canAddConnection(currentCount, planId) {
    const plan = this.getPlanById(planId);
    return currentCount < plan.maxConnections;
  },

  hasFeature(planId, featureKey) {
    const plan = this.getPlanById(planId);
    if (planId === 'PREMIUM') return true;
    if (planId === 'PRO') {
      return ['advanced_dash', 'behavioral_insights'].includes(featureKey);
    }
    return false;
  },

  getAvailablePlans() {
    return Object.values(PLANS);
  }
};
