/**
 * VYNEX Sales-Focused Credit Decision Engine
 * Decoupled logic to categorize leads and recommend products.
 */

export const getDecisionResult = (formData) => {
  const { 
    nome, renda, tipo_vinculo, possui_consignado, 
    status_margem, fez_portabilidade, interesse_produto 
  } = formData;

  let scorePoints = 0;
  let result = {
    produto_recomendado: 'Análise Manual',
    tipo_lead: 'analise_manual',
    score_vynex: 0,
    perfil_vinculo: tipo_vinculo.toLowerCase().replace(' / ', '_').replace(' ', '_'),
    mensagem_front: '',
    faixa_credito: 'Sujeito à análise',
    cta_secundaria: 'Falar com analista',
    status_analise: 'oportunidade_identificada'
  };

  // 1. Scoring Logic (Points)
  // Vínculo Weights
  const vincPoints = {
    'Servidor Público': 30,
    'Aposentado / Pensionista': 30,
    'CLT': 20,
    'Autônomo': 10
  };
  scorePoints += vincPoints[tipo_vinculo] || 0;

  // Margin Points
  const marginPoints = {
    'Livre': 30,
    'Parcialmente usada': 20,
    'Totalmente usada': 10
  };
  scorePoints += marginPoints[status_margem] || 0;

  // Bonus Points
  if (possui_consignado === 'Sim') scorePoints += 10;
  if (status_margem === 'Totalmente usada' && fez_portabilidade === 'Não') scorePoints += 10;
  
  // Interest compatibility bonus
  // If user knows what they want and it's compatible with their status
  if (interesse_produto !== 'Não sei') scorePoints += 10;

  // Normalize Score (Scale 0-100)
  // Max theoretical points: 30(vinc) + 30(margin) + 10(consig) + 10(port) + 10(int) = 90
  // Let's normalize around 90 as 100.
  result.score_vynex = Math.min(Math.round((scorePoints / 90) * 100), 100);

  // 2. Product Routing Rules (Commercial Priority)
  if (status_margem === 'Livre') {
    result.produto_recomendado = 'Novo Consignado';
    result.tipo_lead = 'consignado_novo';
    result.mensagem_front = "Você possui margem livre significativa. Temos as melhores condições do mercado para novos contratos imediatos.";
    result.cta_secundaria = "Receber simulação completa";
  } 
  else if (status_margem === 'Parcialmente usada') {
    result.produto_recomendado = 'Refinanciamento';
    result.tipo_lead = 'refinanciamento';
    result.mensagem_front = "Você ainda possui margem disponível. Pode liberar valor adicional mantendo o valor da sua parcela atual.";
    result.cta_secundaria = "Ver minha melhor opção";
  } 
  else if (status_margem === 'Totalmente usada' && fez_portabilidade === 'Não') {
    result.produto_recomendado = 'Portabilidade';
    result.tipo_lead = 'portabilidade';
    result.mensagem_front = "Mesmo com sua margem utilizada, identificamos possibilidade de portabilidade para reduzir sua taxa e liberar valor.";
    result.cta_secundaria = "Analisar portabilidade";
  } 
  else if (status_margem === 'Totalmente usada' && fez_portabilidade === 'Sim') {
    result.produto_recomendado = 'Cartão Benefício';
    result.tipo_lead = 'cartao_consignado';
    result.mensagem_front = "Margem principal comprometida, mas você tem pré-aprovação para cartão benefício/margem extra com taxas reduzidas.";
    result.cta_secundaria = "Ver alternativa disponível";
  }

  // 3. Status Labels
  if (result.score_vynex >= 80) result.status_analise = "Perfil forte para análise";
  else if (result.score_vynex >= 60) result.status_analise = "Boa chance de aprovação";
  else if (result.score_vynex >= 40) result.status_analise = "Oportunidade moderada";
  else result.status_analise = "Perfil para análise manual";

  // 4. Estimated Range
  const rendaNum = Number(renda);
  if (result.score_vynex >= 80 && rendaNum > 3000) result.faixa_credito = "R$ 8.000 a R$ 25.000";
  else if (result.score_vynex >= 50) result.faixa_credito = "R$ 3.000 a R$ 8.000";
  else result.faixa_credito = "Até R$ 3.000 (aprox)";

  return result;
};
