/**
 * VYNEX Score 2.0 - Intelligence & Refining
 * Calculates a score from 0 to 1000 based on hybrid data (Form + Bank).
 */

export const getDecisionResult = (formData, financialData = null) => {
  const { 
    renda, tipo_vinculo, possui_consignado, 
    status_margem, fez_portabilidade, interesse_produto 
  } = formData;

  let scorePoints = 0;
  let result = {
    produto_recomendado: 'Análise Manual',
    tipo_lead: 'analise_manual',
    score_vynex: 0,
    perfil_vinculo: tipo_vinculo ? tipo_vinculo.toLowerCase().trim() : 'nao_informado',
    mensagem_front: '',
    faixa_credito: 'Sujeito à análise',
    status_analise: 'oportunidade_identificada'
  };

  // 1. Demographic & Stability Points (Max 400)
  const vincPoints = {
    'Servidor Público': 180,
    'Aposentado / Pensionista': 180,
    'CLT': 120,
    'Autônomo': 60
  };
  scorePoints += vincPoints[tipo_vinculo] || 0;

  if (possui_consignado === 'Sim') scorePoints += 60;
  if (status_margem === 'Livre') scorePoints += 100;
  if (status_margem === 'Parcialmente usada') scorePoints += 60;
  if (fez_portabilidade === 'Não') scorePoints += 60;

  // 2. Behavioral & Banking Points (Max 600)
  if (financialData) {
    const { balance, totalIncome, totalExpense } = financialData;
    
    // Balance (Liquidity) - Max 250
    if (balance > 15000) scorePoints += 250;
    else if (balance > 5000) scorePoints += 180;
    else if (balance > 1000) scorePoints += 80;

    // Cashflow (Stability) - Max 250
    const surplus = totalIncome - totalExpense;
    if (surplus > 3000) scorePoints += 250;
    else if (surplus > 1000) scorePoints += 150;
    else if (surplus > 0) scorePoints += 50;

    // Consistency (Activity) - Max 100
    if (totalIncome > 2000) scorePoints += 100;
  } else {
    // Fallback if no banking data
    const declaredIncome = Number(renda) || 0;
    if (declaredIncome > 10000) scorePoints += 300;
    else if (declaredIncome > 5000) scorePoints += 200;
    else if (declaredIncome > 2000) scorePoints += 100;
  }

  // Final Normalization
  result.score_vynex = Math.min(scorePoints, 1000);

  // 3. Product Intelligence
  if (result.score_vynex >= 800) {
    result.status_analise = "Perfil Premium - Alta Aprovação";
    result.mensagem_front = "Seu comportamento financeiro é exemplar. Você tem acesso às menores taxas de juros do mercado.";
  } else if (result.score_vynex >= 600) {
    result.status_analise = "Perfil Consistente";
    result.mensagem_front = "Boa saúde financeira. Há ótimas oportunidades de crédito disponíveis para o seu perfil.";
  } else {
    result.status_analise = "Aguardando Maturação";
    result.mensagem_front = "Estamos analisando formas de otimizar seu score para liberar limites maiores.";
  }

  // 4. Capacity Estimation
  const effectiveIncome = financialData ? financialData.totalIncome : (Number(renda) || 0);
  const capacityFactor = result.score_vynex / 1000;
  const estimatedLimit = effectiveIncome * 0.35 * 48 * capacityFactor; // 48 months estimation logic

  if (result.score_vynex >= 400) {
    result.faixa_credito = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(estimatedLimit);
  }

  return result;
};
