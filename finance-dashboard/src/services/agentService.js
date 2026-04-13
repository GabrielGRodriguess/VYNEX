/**
 * agentService.js
 * Registry and management logic for specialized AI agents.
 */

export const AGENTS = {
  FINANCIAL_ANALYSIS: {
    id: 'agent_financial_analysis',
    name: 'Analista Financeiro',
    role: 'Analisa seus gastos e comportamento de consumo.',
    avatar: '📊',
    description: 'Especialista em identificar padrões de gastos e sugerir economias.',
    active: true
  },
  INSIGHTS: {
    id: 'agent_insights',
    name: 'Monitor de Insights',
    role: 'Detecta anomalias e tendências em tempo real.',
    avatar: '👁️',
    description: 'Te avisa sobre gastos incomuns ou assinaturas esquecidas.',
    active: true
  },
  SCORE: {
    id: 'agent_score',
    name: 'Estrategista de Score',
    role: 'Focado em aumentar seu potencial de crédito.',
    avatar: '📈',
    description: 'Dicas práticas para elevar seu Vynex Score 2.0.',
    active: true
  },
  CREDIT_DECISION: {
    id: 'agent_credit_decision',
    name: 'Tomador de Decisão',
    role: 'Avalia sua saúde financeira para ofertas de crédito.',
    avatar: '⚖️',
    description: 'O motor que decide suas faixas de limite e taxas.',
    active: true
  },
  OFFERS: {
    id: 'agent_offers',
    name: 'Consultor de Ofertas',
    role: 'Busca as melhores oportunidades de crédito para você.',
    avatar: '💰',
    description: 'Personaliza ofertas de empréstimo e cartão baseadas no seu perfil.',
    active: true
  },
  ALERTS: {
    id: 'agent_alerts',
    name: 'Guardião de Alertas',
    role: 'Seu sistema de aviso prévio.',
    avatar: '🚨',
    description: 'Alertas de vencimento, gastos próximos ao limite e segurança.',
    active: true
  }
};

export const agentService = {
  getAgents() {
    return Object.values(AGENTS);
  },
  
  getActiveAgents() {
    return Object.values(AGENTS).filter(a => a.active);
  },

  toggleAgent(id) {
    // Standardize: Match keys (uppercase) if ID is lowercase/prefixed
    const key = Object.keys(AGENTS).find(k => AGENTS[k].id === id || k === id);
    if (key && AGENTS[key]) {
      AGENTS[key].active = !AGENTS[key].active;
    }
  }
};
