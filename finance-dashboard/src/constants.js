/**
 * VYNEX Platform Constants
 * Handles environment-specific API configurations
 */

const getApiBaseUrl = () => {
  // If we are on Vercel (Production), use relative paths to trigger Serverless Functions
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }

  // Local Development: Always fallback to local server or Vercel Dev
  // If VITE_API_URL is set (e.g. in .env), use it.
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

// For Serverless Migration, we handle the endpoints differently if needed
// but usually just appending the function name works.
export const API_BASE_URL = getApiBaseUrl();
