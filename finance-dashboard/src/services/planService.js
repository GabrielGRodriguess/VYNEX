/**
 * planService.js
 * Manages tiers, limits and feature availability.
 */

export const openFinanceProgress = 60;

export const PLANS = {
  FREE: {
    id: 'FREE',
    name: 'Gratuito',
    price: 0,
    subtitle: 'Para começar sua organização financeira',
    features: [
      'Painel financeiro inteligente',
      'Lançamentos manuais ilimitados',
      'Importação de extratos (PDF/OFX)',
      'Conexão Bancária Real (Fase Beta)'
    ]
  },
  PRO_PASS: {
    id: 'PRO_PASS',
    name: 'VYNEX Pro Pass',
    price: 29.90,
    subtitle: 'Acesso Pro Antecipado',
    description: 'Garanta sua vaga no ecossistema Pro e tenha prioridade máxima na liberação das conexões automáticas estáveis.',
    features: [
      'Acesso Prioritário ao Open Finance',
      'Análises de Crédito Avançadas',
      'Suporte Prioritário do Nex',
      'Experiência Sem Anúncios',
      'Selo de Membro Fundador'
    ]
  }
};

export const planService = {
  getPlanById(id) {
    const planId = id?.toUpperCase();
    if (planId === 'PRO' || planId === 'PREMIUM') return PLANS.PRO_PASS;
    return PLANS[planId] || PLANS.FREE;
  },

  canAddAgent(currentActiveCount, planId, role = 'free') {
    // Admin roles always have unlimited access
    if (role === 'admin') return true;
    
    const plan = this.getPlanById(planId);
    
    // Explicitly handle FREE plan limit of 2
    if (planId?.toUpperCase() === 'FREE' || role === 'free') {
      return currentActiveCount < 2;
    }

    return true; // Pro Pass has unlimited agents for now
  },

  canAddConnection(currentCount, planId) {
    const plan = this.getPlanById(planId);
    if (plan.id === 'FREE') return currentCount < 1;
    return true; // Pro Pass will eventually have more
  },

  hasFeature(planId, featureKey) {
    const plan = this.getPlanById(planId);
    if (plan.id === 'PRO_PASS') return true;
    return false;
  },

  getAvailablePlans() {
    return Object.values(PLANS);
  },

  getOpenFinanceStatus(progress) {
    if (progress >= 100) return { 
      status: 'Liberado', 
      next: 'Open Finance liberado', 
      label: 'Liberado',
      title: 'Open Finance liberado para assinantes Pro Pass' 
    };
    if (progress >= 75) return { 
      status: 'Quente', 
      next: 'Liberado', 
      label: 'Quente',
      title: 'Open Finance está aquecendo'
    };
    if (progress >= 40) return { 
      status: 'Morno avançado', 
      next: 'Quente', 
      label: 'Morno',
      title: 'Open Finance está aquecendo'
    };
    return { 
      status: 'Frio', 
      next: 'Morno', 
      label: 'Frio',
      title: 'Open Finance está aquecendo'
    };
  }
};
