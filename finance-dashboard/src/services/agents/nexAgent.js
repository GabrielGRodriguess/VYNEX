/**
 * Nex Intelligence Agent - Orchestrator
 * Interprets user messages with full context and generates structured responses.
 */
export const nexAgent = {
  /**
   * Main entry point for processing messages.
   */
  async processMessage(message, context) {
    const query = message.toLowerCase();
    const { currentSection, profile, isPremium, isBankConnected, financialSummary } = context;
    const userName = profile?.name || profile?.email?.split('@')[0] || '';

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 1. Identity & Purpose
    if (query.includes('quem é') || query.includes('seu nome') || query.includes('o que você faz')) {
      return {
        reply: `Eu sou o Nex, sua inteligência financeira aqui no VYNEX. Meu papel é analisar seus dados, explicar o que está acontecendo com seu dinheiro e te guiar para as melhores decisões de crédito e patrimônio.`,
        mood: "neutral",
        actions: [],
        suggestions: ["Como começo?", "Adicionar transação"]
      };
    }

    // 2. Navigation / Location
    if (query.includes('onde estou') || query.includes('que tela') || query.includes('ajuda')) {
      return this.handleNavigationQuery(currentSection, userName);
    }

    // 3. Financial Analysis & Summary
    if (query.includes('financeiro') || query.includes('saldo') || query.includes('resumo') || query.includes('como estou') || query.includes('análise financeira')) {
      return this.handleFinancialSummary(financialSummary, userName);
    }

    // 4. Credit Analysis
    if (query.includes('crédito') || query.includes('limite') || query.includes('score') || query.includes('emprestimo')) {
      return this.handleCreditQuery(financialSummary, isPremium, userName);
    }

    // 5. Data Ingestion (Import/Manual)
    if (query.includes('como começo') || query.includes('usar o app') || query.includes('quero usar')) {
      return {
        reply: "Você pode começar de dois jeitos: adicionando uma transação manualmente ou importando um extrato. Como a conexão automática com bancos ainda está em beta, esse é o melhor caminho agora.",
        mood: "guiding",
        actions: [],
        suggestions: ["Adicionar transação", "Importar extrato"]
      };
    }

    if (query.includes('adicionar') || query.includes('gasto') || query.includes('receita') || query.includes('transação') || query.includes('registrar') || query.includes('lançar')) {
      return {
        reply: "Claro. Vou abrir o cadastro de transação para você registrar essa movimentação agora mesmo.",
        mood: "guiding",
        actions: [{ type: "OPEN_ADD_TRANSACTION_MODAL", requiresConfirmation: false }],
        suggestions: ["Importar extrato", "Ver meu saldo"]
      };
    }

    if (query.includes('extrato') || query.includes('ofx') || query.includes('pdf') || query.includes('importar')) {
      return this.handleImportQuery(isBankConnected);
    }

    if (query.includes('banco') || query.includes('conectar') || query.includes('open finance') || query.includes('não tenho banco')) {
      return {
        reply: "Sem problema! O VYNEX funciona perfeitamente no modo manual. Você pode adicionar suas movimentações ou importar um extrato para eu analisar seus dados sem precisar conectar banco agora.",
        mood: "neutral",
        actions: [],
        suggestions: ["Adicionar transação", "Importar extrato", "Conectar banco (Beta)"]
      };
    }

    if (query.includes('dúvida') || query.includes('pergunta') || query.includes('como funciona')) {
      return {
        reply: "O VYNEX é seu copiloto financeiro. Eu analiso seus gastos e receitas para calcular seu potencial de crédito. No momento, o ideal é você alimentar o sistema manualmente ou via extrato.",
        mood: "neutral",
        actions: [],
        suggestions: ["Adicionar transação", "Quem é o Nex?"]
      };
    }

    // 7. Whitelist Action Triggers (Direct requests)
    if (query === 'adicionar transação') {
      return {
        reply: "Abrindo o formulário de nova transação.",
        mood: "guiding",
        actions: [{ type: "OPEN_ADD_TRANSACTION_MODAL", requiresConfirmation: false }],
        suggestions: ["Importar extrato", "Ver meu saldo"]
      };
    }

    if (query === 'importar extrato') {
      return {
        reply: "Entendido. Vou abrir a tela para você fazer o upload do seu extrato (PDF ou OFX).",
        mood: "guiding",
        actions: [{ type: "OPEN_STATEMENT_WIZARD", requiresConfirmation: false }],
        suggestions: ["Como baixar meu extrato?", "Adicionar transação"]
      };
    }

    if (query.includes('análise manual') || query.includes('analisar crédito') || query.includes('wizard')) {
      return {
        reply: "Entendido. Vou te guiar pela análise manual para mapearmos sua saúde financeira em poucos passos.",
        mood: "guiding",
        actions: [{ type: "OPEN_MANUAL_WIZARD", requiresConfirmation: false }],
        suggestions: ["Adicionar transação", "Importar extrato"]
      };
    }

    // Standard Fallback
    const hasData = (financialSummary?.transactionsCount || 0) > 0;
    
    return {
      reply: `Olá ${userName}! ${hasData 
        ? `Seu saldo atual é de R$ ${financialSummary.balance.toLocaleString('pt-BR')}. Como posso te ajudar com sua análise hoje?` 
        : 'Ainda não tenho movimentações suficientes para uma análise real. Que tal começar adicionando uma transação ou importando um extrato?'}`,
      mood: "neutral",
      actions: [],
      suggestions: ["Adicionar transação", "Importar extrato", "Analisar crédito"]
    };
  },

  handleNavigationQuery(section, userName) {
    const sections = {
      dashboard: "Você está no Dashboard. É o coração do VYNEX onde mostro seu resumo financeiro e score.",
      credit: "Estamos na área de Inteligência de Crédito. Aqui eu calculo seu potencial com base no que você registra.",
      history: "Aqui é o histórico completo de tudo que você já lançou ou importou.",
      settings: "Configurações do sistema. Aqui você ajusta suas preferências.",
      account: "Área de conta e planos. Gerencie seu acesso ao Pro Pass aqui.",
      agents: "Central de agentes especializados. Cada um te ajuda em uma área diferente."
    };

    return {
      reply: sections[section] || `Você está navegando pelo VYNEX, ${userName}. Quer adicionar uma transação ou importar um extrato?`,
      mood: "guiding",
      actions: [],
      suggestions: ["Adicionar transação", "Importar extrato", "Ir para Dashboard"]
    };
  },

  handleCreditQuery(summary, isPremium, userName) {
    const score = summary?.analysisReport?.score?.value || 0;
    
    if (score === 0) {
      return {
        reply: `Ainda não tenho movimentações suficientes para calcular seu score de crédito com precisão. Adicione algumas transações ou importe um extrato para eu começar.`,
        mood: "guiding",
        actions: [],
        suggestions: ["Adicionar transação", "Importar extrato"]
      };
    }

    return {
      reply: `Seu Score Vynex atual é ${score}. Essa pontuação reflete sua saúde financeira com base nos dados que analisei. ${isPremium ? 'Como você é Premium, já estou otimizando seu perfil para melhores ofertas.' : 'No Pro Pass, minha análise é ainda mais profunda para acelerar seu crédito.'}`,
      mood: "result",
      actions: [],
      suggestions: ["Explicar meu score", "Adicionar transação", "Ver ofertas"]
    };
  },

  handleFinancialSummary(summary, userName) {
    const balance = summary?.balance || 0;
    const txCount = summary?.transactionsCount || 0;

    if (txCount === 0) {
      return {
        reply: "Ainda não tenho movimentações suficientes para uma análise real. Adicione algumas transações ou importe um extrato que eu faço a leitura para você agora mesmo.",
        mood: "guiding",
        actions: [],
        suggestions: ["Adicionar transação", "Importar extrato"]
      };
    }

    return {
      reply: `Com base nas movimentações registradas, seu saldo atual é R$ ${balance.toLocaleString('pt-BR')}. ${balance < 0 ? 'Notei que seu saldo está negativo, quer que eu analise onde estão os maiores gastos?' : 'Sua saúde financeira parece estável com o que registramos até aqui.'} Posso te mostrar o detalhamento?`,
      mood: "result",
      actions: [],
      suggestions: ["Ver Dashboard", "Adicionar transação", "Analisar crédito"]
    };
  },

  handleImportQuery(isBankConnected) {
    return {
      reply: "Para eu analisar sua vida financeira, você pode importar seus extratos (PDF/OFX) ou adicionar transações manualmente. A conexão automática está em beta e não é obrigatória.",
      mood: "guiding",
      actions: [],
      suggestions: ["Importar extrato", "Adicionar transação", "Conectar banco (Beta)"]
    };
  },

  getDiagnostic(report) {
    if (!report || !report.summary || report.transactionsCount === 0) {
      return { 
        mood: 'guiding', 
        text: 'Olá! Ainda não tenho dados suficientes para uma análise. Que tal adicionar sua primeira transação ou importar um extrato?' 
      };
    }

    const { summary, assessment, score } = report;
    const surplus = summary.surplus || 0;
    const scoreValue = score?.value || 0;

    if (surplus < 0) {
      return {
        mood: 'caution',
        text: `Atenção: seu saldo projetado está negativo em ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(surplus))}. Precisamos revisar seus custos fixos.`
      };
    }

    if (scoreValue > 700) {
      return {
        mood: 'result',
        text: `Parabéns! Sua saúde financeira está excelente (Score ${scoreValue}). Você tem um perfil ideal para as melhores taxas de investimento.`
      };
    }

    if (assessment.fixedExpenseRatio > 0.6) {
      return {
        mood: 'caution',
        text: 'Seus custos fixos estão comprometendo mais de 60% da sua renda. Recomendo analisarmos formas de otimizar essas despesas.'
      };
    }

    return {
      mood: 'neutral',
      text: `Seu saldo atual é de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalBalance)}. Como posso te ajudar com sua organização hoje?`
    };
  },

  getEmptyState() {
    return { mood: 'waiting', text: 'Sem dados para análise.' };
  }
};
