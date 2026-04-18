/**
 * VYNEX Mascot Nex - State System
 * Define todos os estados visuais do mascote, controlando qual asset,
 * mensagem e comportamento o Nex deve exibir em cada momento.
 */

import nexNeutral from '../../assets/mascot/nex-neutral.png';
import nexThinking from '../../assets/mascot/nex-thinking.png';
import nexGuiding from '../../assets/mascot/nex-guiding.png';
import nexResult from '../../assets/mascot/nex-result.png';
import nexIdle from '../../assets/mascot/nex-idle.png';

/**
 * Enum de estados do mascote
 */
export const MASCOT_STATES = {
  IDLE: 'idle',
  ONBOARDING: 'onboarding',
  CONNECTING_BANK: 'connectingBank',
  LOADING: 'loading',
  RESULT: 'result',
  ERROR: 'error',
  DASHBOARD: 'dashboard',
  NO_INTEGRATION: 'noIntegration',
};

/**
 * Configuração de cada estado:
 * - image: asset do mascote a ser exibido
 * - messageCategory: categoria no sistema de falas
 * - size: tamanho sugerido ('sm' | 'md' | 'lg')
 * - autoHide: se deve esconder automaticamente após delay
 * - autoHideDelay: tempo em ms antes de esconder (se autoHide = true)
 * - animation: tipo de animação CSS do mascote
 * - priority: prioridade para resolver conflitos (maior = mais importante)
 */
export const stateConfig = {
  [MASCOT_STATES.IDLE]: {
    image: nexIdle,
    messageCategory: 'idle',
    size: 'sm',
    autoHide: true,
    autoHideDelay: 8000,
    animation: 'breathe',
    priority: 1,
  },

  [MASCOT_STATES.ONBOARDING]: {
    image: nexGuiding,
    messageCategory: 'onboarding',
    size: 'lg',
    autoHide: false,
    autoHideDelay: 0,
    animation: 'float',
    priority: 10,
  },

  [MASCOT_STATES.CONNECTING_BANK]: {
    image: nexGuiding,
    messageCategory: 'connectingBank',
    size: 'md',
    autoHide: false,
    autoHideDelay: 0,
    animation: 'float',
    priority: 8,
  },

  [MASCOT_STATES.LOADING]: {
    image: nexThinking,
    messageCategory: 'loading',
    size: 'md',
    autoHide: false,
    autoHideDelay: 0,
    animation: 'pulse-glow',
    priority: 9,
  },

  [MASCOT_STATES.RESULT]: {
    image: nexResult,
    messageCategory: 'result',
    size: 'md',
    autoHide: true,
    autoHideDelay: 12000,
    animation: 'celebrate',
    priority: 7,
  },

  [MASCOT_STATES.ERROR]: {
    image: nexNeutral,
    messageCategory: 'error',
    size: 'sm',
    autoHide: true,
    autoHideDelay: 10000,
    animation: 'shake',
    priority: 6,
  },

  [MASCOT_STATES.DASHBOARD]: {
    image: nexIdle,
    messageCategory: 'dashboard',
    size: 'sm',
    autoHide: true,
    autoHideDelay: 10000,
    animation: 'breathe',
    priority: 2,
  },

  [MASCOT_STATES.NO_INTEGRATION]: {
    image: nexNeutral,
    messageCategory: 'noIntegration',
    size: 'sm',
    autoHide: true,
    autoHideDelay: 8000,
    animation: 'breathe',
    priority: 3,
  },
};

/**
 * Retorna a configuração de um estado.
 * @param {string} state - ID do estado
 * @returns {object} Configuração do estado
 */
export function getStateConfig(state) {
  return stateConfig[state] || stateConfig[MASCOT_STATES.IDLE];
}

/**
 * Retorna todos os assets para pré-carregamento.
 */
export function getAllAssets() {
  return [nexNeutral, nexThinking, nexGuiding, nexResult, nexIdle];
}
