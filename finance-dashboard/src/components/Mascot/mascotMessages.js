                    que   /**
 * VYNEX Mascot Nex - Message System
 * Sistema de falas contextual com rotação e leve randomização.
 * Evita repetição consecutiva usando controle de índice por categoria.
 */

const messages = {
  onboarding: [
    "Eu sou o Nex. Vou analisar seu potencial financeiro.",
    "Bem-vindo à VYNEX. Estou aqui pra te guiar.",
    "Prazer! Sou o Nex, sua inteligência financeira pessoal.",
    "Deixa comigo. Vou te mostrar como otimizar suas finanças.",
  ],

  connectingBank: [
    "Me conecta com seu banco que eu faço uma análise completa.",
    "É só leitura, não mexo em nada.",
    "Preciso ver seus extratos pra entender seu perfil. Tudo seguro.",
    "Conecte seu banco e eu descubro oportunidades pra você.",
    "Open Finance é 100% seguro. Vou só ler seus dados.",
  ],

  loading: [
    "Analisando seus dados...",
    "Procurando oportunidades...",
    "Cruzando informações dos seus extratos...",
    "Processando seu perfil financeiro...",
    "Quase lá... só mais um momento.",
    "Identificando padrões no seu comportamento financeiro...",
  ],

  result: [
    "Tem algo interessante aqui.",
    "Você tem margem disponível.",
    "Achei oportunidades pro seu perfil.",
    "Seu score ficou acima da média. Bom sinal.",
    "Análise concluída. Veja o que encontrei.",
  ],

  error: [
    "Esse banco está instável agora.",
    "Algo deu errado. Tenta de novo em breve.",
    "Não consegui acessar seus dados agora. Tentamos de novo?",
    "Houve um problema de conexão. Mas calma, vamos resolver.",
  ],

  noIntegration: [
    "Integração em liberação… falta pouco.",
    "Essa funcionalidade está quase pronta. Aguenta firme!",
    "Em breve essa feature estará disponível pra você.",
  ],

  idle: [
    "Tô aqui se precisar de algo.",
    "Quer que eu analise alguma coisa?",
    "Se tiver dúvida, é só chamar.",
    "Sincronize seu banco para eu trabalhar com precisão máxima.",
  ],

  dashboard: [
    "Sua saúde financeira parece estável. Continue assim.",
    "Vi que seus gastos estão dentro do esperado. Bom sinal.",
    "Lembre: quanto mais dados automáticos eu tenho, melhor te oriento.",
    "Evite ajustes manuais para não enviesar minha inteligência.",
  ],

  automationAdvocacy: [
    "Conectar o banco é 10x mais preciso que digitar gastos.",
    "Me dê dados reais e eu te dou previsões reais.",
    "A magia acontece quando seus dados fluem automaticamente.",
    "Ajustes manuais são exceções, a automação é a regra aqui.",
  ],
};

// Controle de repetição - armazena último índice por categoria
const lastUsedIndex = {};

/**
 * Retorna uma mensagem aleatória da categoria, evitando repetição consecutiva.
 * @param {string} category - Categoria da mensagem (ex: 'onboarding', 'loading')
 * @returns {string} Mensagem selecionada
 */
export function getMessage(category) {
  const pool = messages[category];
  if (!pool || pool.length === 0) {
    return "...";
  }

  if (pool.length === 1) {
    return pool[0];
  }

  let index;
  do {
    index = Math.floor(Math.random() * pool.length);
  } while (index === lastUsedIndex[category]);

  lastUsedIndex[category] = index;
  return pool[index];
}

/**
 * Retorna todas as mensagens de uma categoria (para debug/preview).
 * @param {string} category
 * @returns {string[]}
 */
export function getAllMessages(category) {
  return messages[category] || [];
}

export default messages;
