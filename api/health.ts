import { VercelRequest, VercelResponse } from '@vercel/node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  try {
    const apiKey = process.env.CLAUDE_API_KEY_1 || process.env.ANTHROPIC_API_KEY;
    
    return res.status(200).json({
      status: 'healthy',
      timestamp: Date.now(),
      environment: process.env.NODE_ENV || 'development',
      apiKeyConfigured: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}