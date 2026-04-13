/**
 * VYNEX Score 2.0 - Intelligence & Refining
 * Calculates a score from 0 to 1000 based on hybrid data (Form + Bank).
 * Behavior-first logic inspired by Pierre Finance.
 */

export const getDecisionResult = (formData, financialData = null) => {
  const { 
    renda, tipo_vinculo, possui_consignado, 
    status_margem, fez_portabilidade 
  } = formData;

  let scorePoints = 0;
  let result = {
    produto_recomendado: 'Análise Manual',
    tipo_lead: 'analise_manual',
    score_vynex: 0,
    perfil_vinculo: tipo_vinculo ? tipo_vinculo.toLowerCase().trim() : 'nao_informado',
    mensagem_front: '',
    faixa_credito: 'Sujeito à análise',
    status_analise: 'oportunidade_identificada',
    behavioral_breakdown: []
  };

  // 1. Demographic & Stability Points (Max 300)
  const vincPoints = {
    'Servidor Público': 150,
    'Aposentado / Pensionista': 150,
    'CLT': 100,
    'Autônomo': 50
  };
  scorePoints += vincPoints[tipo_vinculo] || 0;

  if (status_margem === 'Livre') scorePoints += 100;
  if (possui_consignado === 'Sim') scorePoints += 50;

  // 2. Behavioral Intelligence (Max 700)
  if (financialData && financialData.transactions?.length > 0) {
    const { balance, monthlyIncome, monthlySurplus, incomeConsistency, riskRatio, fixedExpenseRatio, riskEvents } = financialData;
    
    // a. Liquidity (Balance) - Max 150
    if (balance > 10000) scorePoints += 150;
    else if (balance > 2000) scorePoints += 80;
    else if (balance > 500) scorePoints += 30;

    // b. Surplus & Savings Capacity - Max 250
    const surplusBonus = Math.min((monthlySurplus / 2000) * 250, 250);
    if (surplusBonus > 0) {
      scorePoints += surplusBonus;
      result.behavioral_breakdown.push({ label: 'Sobra Mensal Positiva', type: 'positive' });
    } else {
      scorePoints -= 50; // Penalty for negative month
      result.behavioral_breakdown.push({ label: 'Déficit no Período', type: 'negative' });
    }

    // c. Consistency & Frequency - Max 200
    scorePoints += (incomeConsistency * 200);
    if (incomeConsistency > 0.8) result.behavioral_breakdown.push({ label: 'Renda Recorrente Estável', type: 'positive' });

    // d. Risk Penalization (The "Bet" Factor)
    if (riskEvents > 0) {
      const penalty = Math.min(riskEvents * 40, 300); // Heavy penalty for high frequency
      scorePoints -= penalty;
      result.behavioral_breakdown.push({ label: `Detectado Padrão de Risco (${riskEvents} eventos)`, type: 'negative' });
    }

    // e. Fixed Expense Ratio Check
    if (fixedExpenseRatio > 0.6) {
      scorePoints -= 100;
      result.behavioral_breakdown.push({ label: 'Comprometimento Elevado (>60%)', type: 'negative' });
    }
  } else {
    // Fallback if no banking data
    const declaredIncome = Number(renda) || 0;
    scorePoints += Math.min((declaredIncome / 10000) * 300, 300);
  }

  // Final Normalization
  result.score_vynex = Math.max(Math.min(Math.round(scorePoints), 1000), 0);

  // 3. Product Intelligence
  const category = creditDecisionEngine.getRiskCategory(result.score_vynex);
  result.status_analise = category.label;
  result.mensagem_front = creditDecisionEngine.getAnalysisSummary(result.score_vynex, financialData?.riskEvents > 0);

  // 4. Multi-Bank Capacity Estimation
  const effectiveIncome = financialData?.monthlyIncome || (Number(renda) || 0);
  const surplusRef = financialData?.monthlySurplus || (effectiveIncome * 0.2);
  
  // Conservative limit: 30% of surplus * 48 months, weighted by score
  const capacityFactor = result.score_vynex / 1000;
  const estimatedLimit = Math.max(surplusRef, 0) * 0.4 * 48 * capacityFactor;

  if (result.score_vynex >= 400 && estimatedLimit > 1000) {
    result.faixa_credito = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(estimatedLimit);
    result.produto_recomendado = 'Empréstimo Estratégico';
    result.tipo_lead = 'hot_lead';
  }

  return result;
};

export const creditDecisionEngine = {
  getRiskCategory(score) {
    if (score >= 800) return { label: 'Alta Eficiência', color: 'text-brand-green', bg: 'bg-brand-green/20' };
    if (score >= 600) return { label: 'Consistência Sólida', color: 'text-emerald-400', bg: 'bg-emerald-400/20' };
    if (score >= 400) return { label: 'Perfil em Evolução', color: 'text-amber-500', bg: 'bg-amber-500/20' };
    return { label: 'Risco Elevado', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  },

  getAnalysisSummary(score, hasRisk) {
    if (hasRisk && score < 600) return "Identificamos padrões de volatilidade e despesas de alto risco que estão impactando sua capacidade de crédito. Recomendamos silenciar agentes de risco por 30 dias.";
    if (score >= 800) return "Sua saúde financeira é exemplar. Com alta consistência e sobra mensal recorrente, você tem acesso às taxas mais baixas do ecossistema Vynex.";
    if (score >= 600) return "Você possui um perfil estável. Manter sua sobra mensal acima de 20% da renda pode te levar ao nível de Alta Eficiência em breve.";
    if (score >= 400) return "Há potencial de otimização. Reduzir custos fixos e evitar gastos não classificados fortalecerá sua pontuação nos próximos meses.";
    return "No momento, seu perfil exige uma reorganização. O foco deve ser na proteção do saldo e identificação de renda extra.";
  }
};
