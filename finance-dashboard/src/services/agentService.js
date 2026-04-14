/**
 * agentService.js
 * Registry and management logic for specialized AI agents.
 */

export const AGENTS = {
  FINANCIAL_ANALYSIS: {
    id: 'agent_financial_analysis',
    name: 'Analista Financeiro',
    role: 'Especialista em Padrões e Economia',
    avatar: '📊',
    description: 'Analisa seus gastos e comportamento de consumo para sugerir economias inteligentes.',
    active: true
  },
  INSIGHTS: {
    id: 'agent_insights',
    name: 'Monitor de Insights',
    role: 'Vigilante de Anomalias em Tempo Real',
    avatar: '👁️',
    description: 'Detecta gastos incomuns, cobranças duplicadas ou assinaturas esquecidas instantaneamente.',
    active: true
  },
  SCORE: {
    id: 'agent_score',
    name: 'Estrategista de Score',
    role: 'Consultor de Potencial de Crédito',
    avatar: '📈',
    description: 'Fornece dicas práticas e planos de ação para elevar seu Vynex Score 2.0.',
    active: true
  },
  CREDIT_DECISION: {
    id: 'agent_credit_decision',
    name: 'Tomador de Decisão',
    role: 'Avaliador de Saúde Financeira',
    avatar: '⚖️',
    description: 'O motor que avalia seus dados para decidir faixas de limite e taxas personalizadas.',
    active: true
  },
  OFFERS: {
    id: 'agent_offers',
    name: 'Consultor de Ofertas',
    role: 'Caçador de Oportunidades de Crédito',
    avatar: '💰',
    description: 'Busca e personaliza as melhores ofertas de empréstimo e cartões para seu perfil.',
    active: true
  },
  ALERTS: {
    id: 'agent_alerts',
    name: 'Guardião de Alertas',
    role: 'Sistema de Segurança e Prevenção',
    avatar: '🛡️',
    description: 'Te avisa sobre vencimentos, limites próximos e atividades suspeitas de segurança.',
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
