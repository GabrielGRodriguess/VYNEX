import { SOURCE_TYPES } from '../../constants/models';

/**
 * Generic CSV Parser with Heuristics
 * Detects columns and normalizes data into VynexTransactions.
 */
export const csvParser = {
  /**
   * Parses a CSV string and returns an array of normalized transactions.
   */
  parse(csvText, fileName, userId) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) throw new Error('Arquivo vazio ou inválido.');

    const delimiter = this.detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
    const dataRows = lines.slice(1);

    const columnMapping = this.mapHeaders(headers);
    
    const transactions = dataRows.map((row, index) => {
      const cells = row.split(delimiter).map(c => c.trim());
      if (cells.length < headers.length) return null;

      try {
        const rawDate = cells[columnMapping.date];
        const rawDesc = cells[columnMapping.description];
        const rawAmount = cells[columnMapping.amount];

        if (!rawDate || !rawDesc || !rawAmount) return null;

        const amount = this.parseAmount(rawAmount);
        const date = this.parseDate(rawDate);

        return {
          id: `csv-${fileName}-${index}`,
          userId,
          source: SOURCE_TYPES.STATEMENT,
          sourceMetadata: { fileName, format: 'csv', originalRow: index },
          date,
          amount: Math.abs(amount),
          type: amount >= 0 ? 'income' : 'expense',
          description: rawDesc,
          category: 'Outros', // Will be classified by the pipeline
          isRisk: false,
          isFixed: false,
          tags: ['statement_import']
        };
      } catch (err) {
        console.warn(`[CSV Parser] Skipping row ${index}:`, err.message);
        return null;
      }
    }).filter(t => t !== null);

    return transactions;
  },

  detectDelimiter(headerLine) {
    const semiColons = (headerLine.match(/;/g) || []).length;
    const commas = (headerLine.match(/,/g) || []).length;
    return semiColons > commas ? ';' : ',';
  },

  mapHeaders(headers) {
    const mapping = { date: -1, description: -1, amount: -1 };

    headers.forEach((h, i) => {
      if (h.includes('data') || h.includes('date') || h.includes('vencimento')) mapping.date = i;
      if (h.includes('descri') || h.includes('hist') || h.includes('detalhe') || h.includes('texto')) mapping.description = i;
      if (h.includes('valor') || h.includes('amount') || h.includes('quantia') || h.includes('total')) mapping.amount = i;
    });

    // Fallbacks if heuristics fail (index based guessing)
    if (mapping.date === -1) mapping.date = 0;
    if (mapping.description === -1) mapping.description = 1;
    if (mapping.amount === -1) mapping.amount = headers.length - 1;

    return mapping;
  },

  parseAmount(value) {
    // Remove currency symbols, thousands separators and handle decimal comma
    const cleanValue = value.replace(/[R$\s.]/g, '').replace(',', '.');
    const amount = parseFloat(cleanValue);
    if (isNaN(amount)) throw new Error('Valor inválido');
    return amount;
  },

  parseDate(value) {
    // Support DD/MM/YYYY and YYYY-MM-DD
    if (value.includes('/')) {
      const parts = value.split('/');
      if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`; // YYYY/MM/DD
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`; // DD/MM/YYYY
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) throw new Error('Data inválida');
    return date.toISOString().split('T')[0];
  }
};
