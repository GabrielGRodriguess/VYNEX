/**
 * VYNEX Platform Constants
 * Handles environment-specific API configurations
 */

const getApiBaseUrl = () => {
  // Use VITE_API_URL from environment or fallback to localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

