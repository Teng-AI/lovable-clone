import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateCode } from '../src/codeGenerator';

// CORS headers for the API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({}).end();
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Prompt is required and must be a string' 
      });
    }

    console.log(`🔄 Generating code for: "${prompt}"`);
    
    // Generate code using Claude Code SDK
    const result = await generateCode(prompt);
    
    console.log(`✅ Generated ${result.files.length} files`);

    // Return the result (files will be handled client-side for Vercel)
    return res.status(200).json({
      ...result,
      timestamp: Date.now()
    });

  } catch (error: any) {
    console.error('❌ Generation error:', error);
    return res.status(500).json({ 
      error: 'Code generation failed',
      message: error?.message || 'Unknown error occurred'
    });
  }
}