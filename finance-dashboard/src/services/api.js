/**
 * api.js
 * Centralized API caller for VYNEX.
 * Removed all mock data logic to ensure state truth.
 */

export async function fetchBankData(itemId) {
  try {
    const response = await fetch(`/api/accounts?itemId=${itemId}`);
    if (!response.ok) throw new Error('Falha ao buscar dados do banco');
    return await response.json();
  } catch (err) {
    console.error('[VYNEX] api.js error:', err);
    throw err;
  }
}
