// Vercel Serverless Function for Credit Analysis
// Location: /api/analise.js

// Shared history cache (Volatile in serverless)
// Note: This only persists during a single execution context's life
let history = []; 

function consultarScore(cpf) {
  if (cpf.endsWith('0') || cpf.endsWith('1')) {
    return {
      score: Math.floor(Math.random() * (400 - 300 + 1)) + 300,
      pendencias: true
    };
  }
  return {
    score: Math.floor(Math.random() * (900 - 450 + 1)) + 450,
    pendencias: false
  };
}

export default async function handler(req, res) {
  // Add CORS headers for cross-origin local dev testing if needed
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tipo, cpf, renda, parcela, entrada } = req.body;
  
  if (!tipo || !cpf || !renda || !parcela) {
    return res.status(400).json({ error: 'Dados incompletos para análise.' });
  }

  const { score, pendencias } = consultarScore(cpf);
  const probabilidade = (score / 1000) * 100;
  
  let status = 'Aprovado';
  let motivo = 'Seu perfil atende a todos os requisitos para este crédito.';
  let sugestao = 'Você tem alta chance de aprovação. Prossiga para a contratação.';
  let cor = 'green';

  if (tipo === 'consignado') {
    if (parcela > renda * 0.35) {
      status = 'Negado';
      motivo = 'Margem consignável insuficiente para o valor da parcela desejada.';
      sugestao = 'Reduza o valor da parcela ou aumente o prazo para aumentar suas chances.';
      cor = 'red';
    } else if (score < 400 || pendencias) {
      status = 'Análise Manual';
      motivo = 'Pontuação de crédito (Score) abaixo da política automática ou pendências identificadas.';
      sugestao = 'Nossa equipe entrará em contato para uma análise detalhada.';
      cor = 'yellow';
    }
  } else if (tipo === 'imobiliario') {
    if (score < 600) {
      status = 'Negado';
      motivo = 'Pontuação de crédito insuficiente para financiamento imobiliário.';
      sugestao = 'Trabalhe na regularização de pendências para aumentar seu score.';
      cor = 'red';
    } else if (parcela > renda * 0.3) {
      status = 'Negado';
      motivo = 'Comprometimento de renda acima do limite de 30%.';
      sugestao = 'Tente aumentar o valor da entrada para reduzir as parcelas.';
      cor = 'red';
    } else if (entrada < renda * 0.2 && entrada < (parcela * 120 * 0.2)) {
       status = 'Análise Manual';
       motivo = 'Valor de entrada inferior a 20%. Sujeito a condições especiais.';
       sugestao = 'Aumentar a entrada pode ajudar significativamente na aprovação.';
       cor = 'yellow';
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
    cor,
    data: { renda, parcela, entrada },
    date: new Date().toISOString()
  };

  // Note: Local in-memory history won't survive across different Lambda invocations easily
  // We return the result to the user. Frontend can manage local state for now.
  res.status(200).json(result);
}
