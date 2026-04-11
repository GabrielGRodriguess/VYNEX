// Vercel Serverless Function: Unified Credit Analysis Engine
// Location: /api/analise.js

// Shared history cache (Volatile in serverless)
let history = []; 

function consultarScore(cpf) {
  // CPF simulado: CPFs terminados em 0 ou 1 dão score baixo
  if (cpf.endsWith('0') || cpf.endsWith('1')) {
    return {
      score: Math.floor(Math.random() * (400 - 300 + 1)) + 300,
      pendencias: true
    };
  }
  return {
    score: Math.floor(Math.random() * (900 - 550 + 1)) + 550,
    pendencias: false
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { tipo, cpf, renda, parcela, entrada, bankData } = req.body;
  
  if (!tipo || !cpf || !renda || !parcela) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  const { score, pendencias } = consultarScore(cpf);
  
  // Intelligent Probability Engine
  let probabilidade = (score / 1000) * 100;
  
  // Apply Bank Data Impact (Pluggy Integration Phase 1)
  if (bankData && bankData.connected) {
    if (bankData.income > 4000) probabilidade += 5;
    if (bankData.expense > bankData.income * 0.6) probabilidade -= 5;
  }
  
  // Clamp probability between 0 and 100
  probabilidade = Math.min(Math.max(probabilidade, 0), 100);

  let status = 'Aprovado';
  let motivo = 'Seu perfil atende aos requisitos de crédito automático.';
  let sugestao = 'Alta chance de aprovação imediata. Prossiga para a formalização.';

  if (tipo === 'consignado') {
    if (parcela > renda * 0.35) {
      status = 'Negado';
      motivo = 'Margem consignável insuficiente (máximo 35% da renda).';
      sugestao = 'Tente um valor de parcela menor para se adequar à margem.';
    } else if (score < 400 || pendencias) {
      status = 'Análise Manual';
      motivo = 'Pontuação de crédito (Score) ou restrições exigem validação humana.';
      sugestao = 'Nossa equipe entrará em contato em até 24h.';
    }
  } else if (tipo === 'imobiliario') {
    if (score < 600) {
      status = 'Negado';
      motivo = 'Pontuação de crédito insuficiente para esta modalidade (mínimo 600).';
      sugestao = 'Regularize pendências para aumentar seu score VYNEX.';
    } else if (parcela > renda * 0.30) {
      status = 'Negado';
      motivo = 'Comprometimento de renda acima de 30%.';
      sugestao = 'Considere um imóvel de menor valor ou aumente o aporte inicial.';
    } else if (entrada < (parcela * 120 * 0.2) && entrada < renda * 0.2) { 
      // Simplified: if entrance is low
      status = 'Análise Manual';
      motivo = 'Valor de entrada inferior ao recomendado (20%).';
      sugestao = 'Aumentar o valor da entrada aumenta significativamente sua chance.';
    }
  }

  const result = {
    id: Math.random().toString(36).substr(2, 9),
    tipo,
    cpf: cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4"),
    score,
    status,
    probabilidade: probabilidade.toFixed(1),
    motivo,
    sugestao,
    data: { renda, parcela, entrada },
    date: new Date().toISOString()
  };

  res.status(200).json(result);
}
