import { SOURCE_TYPES } from '../../constants/models';

/**
 * Transforms the Manual Wizard form data into a list of normalized VynexTransactions.
 * @param {Object} formData 
 * @param {string} userId 
 * @returns {import('../../constants/models').VynexTransaction[]}
 */
export const manualToVynexAdapter = (formData, userId) => {
  const transactions = [];
  const today = new Date().toISOString().split('T')[0];

  // 1. Income
  if (formData.income > 0) {
    transactions.push({
      userId,
      source: SOURCE_TYPES.MANUAL,
      date: today,
      amount: Number(formData.income),
      type: 'income',
      description: 'Renda Mensal (Declarada)',
      category: 'Salário',
      tags: ['primary'],
      sourceMetadata: { type: 'wizard_v2' }
    });
  }

  if (formData.extraIncome > 0) {
    transactions.push({
      userId,
      source: SOURCE_TYPES.MANUAL,
      date: today,
      amount: Number(formData.extraIncome),
      type: 'income',
      description: 'Renda Extra (Declarada)',
      category: 'Renda Extras',
      tags: ['extra'],
      sourceMetadata: { type: 'wizard_v2' }
    });
  }

  // 2. Fixed Expenses
  const fixedCategories = [
    { key: 'housing', label: 'Moradia', cat: 'Moradia / Fixo' },
    { key: 'education', label: 'Educação', cat: 'Educação' },
    { key: 'subscriptions', label: 'Assinaturas', cat: 'Moradia / Fixo' }
  ];

  fixedCategories.forEach(item => {
    if (formData[item.key] > 0) {
      transactions.push({
        userId,
        source: SOURCE_TYPES.MANUAL,
        date: today,
        amount: Number(formData[item.key]),
        type: 'expense',
        description: `${item.label} (Declarado)`,
        category: item.cat,
        isFixed: true,
        tags: ['fixed', 'essential'],
        sourceMetadata: { type: 'wizard_v2' }
      });
    }
  });

  // 3. Variable Expenses
  const variableCategories = [
    { key: 'food', label: 'Alimentação', cat: 'Alimentação' },
    { key: 'transport', label: 'Transporte', cat: 'Transporte' },
    { key: 'leisure', label: 'Lazer', cat: 'Lazer' }
  ];

  variableCategories.forEach(item => {
    if (formData[item.key] > 0) {
      transactions.push({
        userId,
        source: SOURCE_TYPES.MANUAL,
        date: today,
        amount: Number(formData[item.key]),
        type: 'expense',
        description: `${item.label} (Média Declarada)`,
        category: item.cat,
        tags: ['variable'],
        sourceMetadata: { type: 'wizard_v2' }
      });
    }
  });

  // 4. Debts / Installments
  if (formData.debts > 0) {
    transactions.push({
      userId,
      source: SOURCE_TYPES.MANUAL,
      date: today,
      amount: Number(formData.debts),
      type: 'expense',
      description: 'Dívidas / Parcelas (Declarado)',
      category: 'Outros',
      isRisk: true,
      tags: ['debt', 'risk'],
      sourceMetadata: { type: 'wizard_v2' }
    });
  }

  return transactions;
};
