import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock de Score do Serasa/Similar
function consultarScore(cpf) {
  // CPF simulado: CPFs terminados em 0 ou 1 costumam dar score baixo para teste
  if (cpf.endsWith('0') || cpf.endsWith('1')) {
    return {
      score: Math.floor(Math.random() * (400 - 300 + 1)) + 300,
      pendencias: true,
      renda_estimada: 2500
    };
  }
  return {
    score: Math.floor(Math.random() * (900 - 450 + 1)) + 450,
    pendencias: false,
    renda_estimada: 5000
  };
}

const history = [];

app.get('/historico', (req, res) => {
  res.json(history.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

app.post('/analise', (req, res) => {
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
    cpf: cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4"), // Mascarar CPF
    score,
    status,
    probabilidade: probabilidade.toFixed(1),
    motivo,
    sugestao,
    cor,
    data: { renda, parcela, entrada },
    date: new Date().toISOString()
  };

  history.push(result);
  res.json(result);
});


app.listen(PORT, () => {
  console.log(`VYNEX Credit Engine running on port ${PORT}`);
});
