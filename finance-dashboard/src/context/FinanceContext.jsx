import { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { financialService } from '../services/financialService';
import { INITIAL_ANALYSIS_REPORT, SOURCE_TYPES } from '../constants/models';

export const FinanceContext = createContext();

export function FinanceProvider({ user, children }) {
  // --- CORE SOURCE OF TRUTH ---
  const [normalizedTransactions, setNormalizedTransactions] = useState([]);
  const [activeSources, setActiveSources] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  // --- COMPATIBILITY STATES ---
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  // --- DERIVED INTELLIGENCE LAYER ---
  
  // 1. MANUAL ADJUSTMENT LIMIT STATUS
  const manualAdjustmentStatus = useMemo(() => {
    const manualTxs = normalizedTransactions.filter(t => t.source === SOURCE_TYPES.MANUAL || !t.fromBank);
    if (manualTxs.length === 0) return { canAdd: true, daysRemaining: 0 };

    const sorted = [...manualTxs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const lastTx = new Date(sorted[0].createdAt);
    const now = new Date();
    
    // Normalize to midnight for accurate day counting
    const lastDate = new Date(lastTx.getFullYear(), lastTx.getMonth(), lastTx.getDate());
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = currentDate - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      canAdd: diffDays >= 7,
      daysRemaining: Math.max(0, 7 - diffDays),
      lastDate: sorted[0].createdAt
    };
  }, [normalizedTransactions]);

  const analysisReport = useMemo(() => {
    try {
      return financialService.generateAnalysisReport(normalizedTransactions);
    } catch (err) {
      console.error("[VYNEX] Error generating analysis report:", err);
      return INITIAL_ANALYSIS_REPORT;
    }
  }, [normalizedTransactions]);

  // Compatibility Alias: analytics points to the new report
  const analytics = useMemo(() => ({
    ...analysisReport, // Include full structure (summary, assessment, score, etc.)
    ...analysisReport.summary, // Flat for legacy support
    ...analysisReport.assessment, // Flat for legacy support
    categoryDistribution: analysisReport.categoryBreakdown,
    transactionCount: normalizedTransactions.length,
    score: analysisReport.score // Keep score object
  }), [analysisReport, normalizedTransactions.length]);

  // 1. INITIAL LOAD (Hydration)
  useEffect(() => {
    async function loadAllData() {
      if (!user) {
        setNormalizedTransactions([]);
        setConnections([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Load bank connections
        const { data: connData } = await supabase
          .from('bank_connections')
          .select('*')
          .eq('user_id', user.id);

        const currentConnections = connData || [];
        setConnections(currentConnections);

        // Load manual transactions from DB
        const { data: txData } = await supabase
          .from('finance_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        const manualTxs = txData || [];

        // Ingest and Normalize
        // Note: For now, we still use financialService.getAggregatedData to maintain backward logic
        // but we store the result in our new normalized state
        const aggregated = await financialService.getAggregatedData(currentConnections, manualTxs);
        
        setBalance(aggregated.balance);
        setNormalizedTransactions(aggregated.transactions);
        
        // Track sources
        const sources = [];
        if (currentConnections.length > 0) sources.push({ type: SOURCE_TYPES.PLUGGY, count: currentConnections.length });
        if (manualTxs.length > 0) sources.push({ type: SOURCE_TYPES.MANUAL, count: manualTxs.length });
        setActiveSources(sources);

      } catch (err) {
        console.error("[VYNEX] Error hydrating finance data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, [user]);

  // --- PIPELINE FUNCTIONS ---

  const refreshAnalysis = useCallback(async () => {
    setProcessing(true);
    try {
      // Re-trigger analysis based on current normalized transactions
      // In Phase 1, the useMemo for analysisReport already does this automatically
      // but this function provides an explicit hook for UI feedback
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulated processing feel
    } finally {
      setProcessing(false);
    }
  }, []);

  const ingestFinancialData = useCallback(async (rawData, source) => {
    setProcessing(true);
    try {
      const normalized = financialService.normalizeInputData(rawData, source);
      setNormalizedTransactions(prev => [...normalized, ...prev]);
      // Update balance locally (simplistic for now)
      const delta = normalized.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
      setBalance(prev => prev + delta);
      
      // Update sources metadata
      setActiveSources(prev => {
        const existing = prev.find(s => s.type === source);
        if (existing) {
          return prev.map(s => s.type === source ? { ...s, count: s.count + normalized.length } : s);
        }
        return [...prev, { type: source, count: normalized.length }];
      });
      
      return normalized;
    } catch (err) {
      console.error("[VYNEX] Ingestion error:", err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, []);

  const clearFinancialSession = useCallback(() => {
    setNormalizedTransactions([]);
    setBalance(0);
    setActiveSources([]);
  }, []);

  // --- COMPATIBILITY FUNCTIONS (Mapped to DB + Local State) ---

  const addConnection = async (itemId, provider) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bank_connections')
        .insert([{ user_id: user.id, itemId, provider }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setConnections(prev => [...prev, data]);
        // Trigger global re-sync
        const aggregated = await financialService.getAggregatedData([...connections, data], normalizedTransactions.filter(t => !t.fromBank));
        setBalance(aggregated.balance);
        setNormalizedTransactions(aggregated.transactions);
      }
    } catch (err) {
      console.error('[VYNEX] addConnection Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    if (!user) return;

    if (!manualAdjustmentStatus.canAdd) {
      throw new Error(`Limite de 1 exceção por semana atingido. Disponível em ${manualAdjustmentStatus.daysRemaining} dias.`);
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('finance_transactions')
        .insert([{
          user_id: user.id,
          type: transaction.type,
          amount: Number(transaction.amount),
          category: transaction.category,
          date: transaction.date || new Date().toISOString().split('T')[0],
          description: transaction.description || '(Ajuste Manual)',
          from_bank: false
        }])
        .select();

      if (error) throw error;

      if (data) {
        // Use normalization service to maintain consistency
        const normalized = financialService.normalizeInputData(data, SOURCE_TYPES.MANUAL);
        setNormalizedTransactions(prev => [...normalized, ...prev]);
        setBalance(prev => transaction.type === 'income' ? prev + Number(transaction.amount) : prev - Number(transaction.amount));
      }
    } catch (err) {
      console.error("[VYNEX] addTransaction Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    const tx = normalizedTransactions.find(t => t.id === id);
    if (!tx || tx.fromBank || tx.source === SOURCE_TYPES.PLUGGY) return;

    const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
    if (!error) {
      setNormalizedTransactions(prev => prev.filter(t => t.id !== id));
      setBalance(prev => tx.type === 'income' ? prev - Number(tx.amount) : prev + Number(tx.amount));
    }
  };

  return (
    <FinanceContext.Provider value={{
      // New Core State
      normalizedTransactions,
      analysisReport,
      activeSources,
      processing,
      manualAdjustmentStatus,
      
      // Compatibility State
      transactions: normalizedTransactions, // Aliased
      analytics, // Aliased
      balance,
      connections,
      loading,
      isBankConnected: connections.length > 0,
      
      // Pipeline Functions
      ingestFinancialData,
      refreshAnalysis,
      clearFinancialSession,
      
      // Compatibility Functions
      addTransaction,
      deleteTransaction,
      addConnection
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}


