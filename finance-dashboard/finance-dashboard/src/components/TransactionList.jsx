import React from 'react';
import { useFinance } from '../context/FinanceContext';

export default function TransactionList() {
  const { transactions } = useFinance();

  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3">Data</th>
              <th className="pb-3">Categoria</th>
              <th className="pb-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((t) => (
              <tr key={t.id} className="text-sm">
                <td className="py-4 text-gray-600">{t.date}</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
                    {t.category}
                  </span>
                </td>
                <td className={`py-4 text-right font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="3" className="py-8 text-center text-gray-400">
                  Nenhuma transação encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
