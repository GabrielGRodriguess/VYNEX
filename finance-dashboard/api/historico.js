// Vercel Serverless Function for Credit History
// Location: /api/historico.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // NOTE: History is empty in serverless without a database like Supabase
  // We return an empty list for now to keep the UI clean
  res.status(200).json([]);
}
