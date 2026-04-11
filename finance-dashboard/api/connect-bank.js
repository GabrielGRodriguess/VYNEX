// Vercel Serverless Function: Bank Connection (Phase 2 Prep)
// Location: /api/connect-bank.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Phase 2 Structure (Not activated yet)
  // This will handle the creation of the Pluggy Connect Token on the server-side
  // for increased security in the future.
  
  res.status(200).json({ 
    message: "Pluggy Interface Prepared (Phase 2)", 
    status: "ready" 
  });
}
