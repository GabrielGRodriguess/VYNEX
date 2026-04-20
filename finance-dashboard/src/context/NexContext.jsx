import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { nexAgent } from '../services/agents/nexAgent';
import { useFinance } from './FinanceContext';
import { useUser } from './UserContext';

const NexContext = createContext(null);

const INITIAL_MESSAGE = {
  role: 'assistant',
  text: 'Oi! Sou o Nex, sua inteligência financeira na Vynex. Como posso ajudar você hoje?',
  mood: 'neutral',
  timestamp: new Date().toISOString()
};

export function NexProvider({ children }) {
  const { balance, transactions, analysisReport, isBankConnected } = useFinance();
  const { profile, isPremium, onboarding_completed } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [currentMood, setCurrentMood] = useState('idle'); // idle, thinking, guiding, result, neutral
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Callbacks provided by MainApp to execute UI actions
  const [externalActions, setExternalActions] = useState({
    setActiveSection: () => {},
    openManualWizard: () => {},
    openStatementWizard: () => {},
  });

  const registerActions = useCallback((actions) => {
    setExternalActions(prev => ({ ...prev, ...actions }));
  }, []);

  const executeNexAction = useCallback((action) => {
    console.log('[Nex] Executing action:', action);
    
    switch (action.type) {
      case 'GO_TO_DASHBOARD':
        externalActions.setActiveSection('dashboard');
        break;
      case 'GO_TO_CREDIT':
        externalActions.setActiveSection('credit');
        break;
      case 'GO_TO_HISTORY':
        externalActions.setActiveSection('history');
        break;
      case 'GO_TO_SETTINGS':
        externalActions.setActiveSection('settings');
        break;
      case 'GO_TO_ACCOUNT':
        externalActions.setActiveSection('account');
        break;
      case 'OPEN_MANUAL_WIZARD':
        externalActions.openManualWizard();
        break;
      case 'OPEN_STATEMENT_WIZARD':
        externalActions.openStatementWizard();
        break;
      case 'OPEN_ADD_TRANSACTION_MODAL':
        externalActions.openAddTransactionModal();
        break;
      default:
        console.warn('[Nex] Action type not supported or whitelisted:', action.type);
    }
  }, [externalActions]);

  const sendMessageToNex = useCallback(async (text) => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMsg = { role: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    
    // 2. Set thinking state
    setIsTyping(true);
    setCurrentMood('thinking');

    // 3. Prepare full context for NexAgent
    const context = {
      currentSection: activeSection,
      profile,
      isPremium,
      onboardingCompleted: onboarding_completed,
      isBankConnected,
      financialSummary: {
        balance,
        transactionsCount: transactions?.length || 0,
        analysisReport
      },
      // Here we could add creditSummary if available
    };

    try {
      // 4. Get response from orchestrator
      const response = await nexAgent.processMessage(text, context);
      
      // 5. standard reply
      const nexMsg = {
        role: 'assistant',
        text: response.reply,
        mood: response.mood || 'neutral',
        actions: response.actions || [],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, nexMsg]);
      setCurrentMood(response.mood || 'neutral');
      setSuggestions(response.suggestions || []);

      // 6. Auto-execute actions if they don't require confirmation
      if (response.actions && response.actions.length > 0) {
        response.actions.forEach(action => {
          if (!action.requiresConfirmation) {
            executeNexAction(action);
          }
        });
      }

    } catch (error) {
      console.error('[Nex] Error processing message:', error);
      const errorMsg = {
        role: 'assistant',
        text: 'Desculpe, tive um problema técnico para processar sua solicitação. Pode tentar novamente?',
        mood: 'neutral',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
      setCurrentMood('neutral');
    } finally {
      setIsTyping(false);
    }
  }, [activeSection, profile, isPremium, onboarding_completed, isBankConnected, balance, transactions, analysisReport, executeNexAction]);

  return (
    <NexContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      messages, 
      currentMood, 
      setCurrentMood,
      activeSection, 
      setActiveSection,
      isTyping,
      suggestions,
      sendMessageToNex,
      executeNexAction,
      registerActions
    }}>
      {children}
    </NexContext.Provider>
  );
}

export function useNex() {
  const context = useContext(NexContext);
  if (!context) throw new Error('useNex must be used within NexProvider');
  return context;
}
