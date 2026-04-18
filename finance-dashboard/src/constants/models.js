/**
 * VYNEX Financial Data Models (Fase 1)
 */

/**
 * @typedef {Object} VynexTransaction
 * @property {string} id
 * @property {string} userId
 * @property {'manual' | 'ocr' | 'statement' | 'whatsapp' | 'pluggy'} source
 * @property {Object} sourceMetadata
 * @property {string} [sourceMetadata.fileName]
 * @property {string} [sourceMetadata.externalId]
 * @property {number} [sourceMetadata.confidence]
 * @property {string} date - ISO 8601
 * @property {number} amount
 * @property {'income' | 'expense'} type
 * @property {string} description
 * @property {string} category
 * @property {boolean} isRisk
 * @property {boolean} isFixed
 * @property {string[]} tags
 */

/**
 * @typedef {Object} AnalysisReport
 * @property {Object} summary
 * @property {number} summary.totalBalance
 * @property {number} summary.monthlyIncome
 * @property {number} summary.monthlyExpense
 * @property {number} summary.surplus
 * @property {Object} score
 * @property {number} score.value - 0 to 1000
 * @property {string} score.label
 * @property {'up' | 'down' | 'stable'} score.trend
 * @property {Object} assessment
 * @property {number} assessment.riskRatio
 * @property {number} assessment.fixedExpenseRatio
 * @property {number} assessment.incomeConsistency
 * @property {Object.<string, number>} categoryBreakdown
 * @property {Array<Object>} insights
 */

export const SOURCE_TYPES = {
  MANUAL: 'manual',
  OCR: 'ocr',
  STATEMENT: 'statement',
  WHATSAPP: 'whatsapp',
  PLUGGY: 'pluggy'
};

export const INITIAL_ANALYSIS_REPORT = {
  summary: { totalBalance: 0, monthlyIncome: 0, monthlyExpense: 0, surplus: 0 },
  score: { value: 0, label: 'Pendente', trend: 'stable' },
  assessment: { riskRatio: 0, fixedExpenseRatio: 0, incomeConsistency: 0 },
  categoryBreakdown: {},
  insights: []
};
