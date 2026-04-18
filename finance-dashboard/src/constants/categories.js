/**
 * Centralized Financial Categories for VYNEX
 * Use this to maintain consistency across classification, display, and input.
 */

export const CATEGORIES = {
  SALARY: {
    id: 'SALARY',
    label: 'Salário',
    type: 'income',
    keywords: ['SALARIO', 'PROVENTOS', 'VENCIMENTOS', 'PAGAMENTO', 'FOLHA', 'RENDA MENSAL'],
    color: 'brand-green'
  },
  EXTRA_INCOME: {
    id: 'EXTRA_INCOME',
    label: 'Renda Extra',
    type: 'income',
    keywords: ['PIX RECEBIDO', 'TRANSFERENCIA RECEBIDA', 'TED RECEBIDA', 'RENDA EXTRA'],
    color: 'emerald-400'
  },
  RISK: {
    id: 'RISK',
    label: 'Apostas / Risco',
    type: 'expense',
    keywords: ['BET', 'BETANO', 'CASINO', 'JOGO', 'LOTERIA', 'BELA VISTA', 'GREEN', 'DÍVIDA', 'PARCELA'],
    color: 'rose-500',
    isRisk: true
  },
  HOUSING: {
    id: 'HOUSING',
    label: 'Moradia / Fixo',
    type: 'expense',
    keywords: ['ALUGUEL', 'CONDOMINIO', 'LUZ', 'AGUA', 'INTERNET', 'NETFLIX', 'SPOTIFY', 'MORADIA', 'ASSINATURA'],
    color: 'blue-400',
    isFixed: true
  },
  TRANSPORT: {
    id: 'TRANSPORT',
    label: 'Transporte',
    type: 'expense',
    keywords: ['UBER', '99APP', 'POSTO', 'COMBUSTIVEL', 'ESTACIONAMENTO'],
    color: 'amber-400'
  },
  FOOD: {
    id: 'FOOD',
    label: 'Alimentação',
    type: 'expense',
    keywords: ['IFOOD', 'MCDONALDS', 'RESTAURANTE', 'MERCADO', 'SUPERMERCADO', 'PADARIA', 'ALIMENTAÇÃO'],
    color: 'orange-400'
  },
  EDUCATION: {
    id: 'EDUCATION',
    label: 'Educação',
    type: 'expense',
    keywords: ['CURSO', 'FACULDADE', 'ESCOLA', 'EDUCAÇÃO', 'LIVRO'],
    color: 'indigo-400'
  },
  LEISURE: {
    id: 'LEISURE',
    label: 'Lazer',
    type: 'expense',
    keywords: ['CINEMA', 'SHOW', 'LAZER', 'VIAGEM', 'DELIVERY'],
    color: 'purple-400'
  },
  SHOPPING: {
    id: 'SHOPPING',
    label: 'Compras',
    type: 'expense',
    keywords: ['SHOPPING', 'AMAZON', 'MERCADO LIVRE', 'COMPRA', 'LOJA'],
    color: 'pink-400'
  },
  OTHER: {
    id: 'OTHER',
    label: 'Outros',
    type: 'expense',
    keywords: [],
    color: 'slate-400'
  }
};

/**
 * Returns the category label for a given ID.
 */
export const getCategoryLabel = (id) => CATEGORIES[id]?.label || id;

/**
 * Returns the full category object by ID.
 */
export const getCategoryById = (id) => CATEGORIES[id] || CATEGORIES.OTHER;

/**
 * Returns categories filtered by type.
 */
export const getCategoriesByType = (type) => 
  Object.values(CATEGORIES).filter(cat => cat.type === type);
