import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateCodeWithAnthropicAPI } from '../src/anthropicGenerator';

// CORS headers for the API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  // Ensure JSON response
  res.setHeader('Content-Type', 'application/json');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 API function started');
    console.log('📋 Request method:', req.method);
    console.log('📦 Request body type:', typeof req.body);
    
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      console.log('❌ Invalid prompt provided');
      return res.status(400).json({ 
        error: 'Prompt is required and must be a string',
        received: typeof prompt
      });
    }

    console.log(`🔄 Generating code for: "${prompt.substring(0, 100)}..."`);
    
    // Check API key availability
    const apiKey = process.env.CLAUDE_API_KEY_1 || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('❌ No API key found in environment');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Claude API key not configured'
      });
    }
    
    console.log('🔑 API key available:', apiKey.substring(0, 8) + '...');
    
    // Generate code using Anthropic API directly (for Vercel compatibility)
    const result = await generateCodeWithAnthropicAPI(prompt);
    
    console.log(`✅ Generated ${result.files.length} files`);

    // Return the result
    return res.status(200).json({
      ...result,
      timestamp: Date.now(),
      success: true
    });

  } catch (error: any) {
    console.error('❌ Generation error:', error);
    console.error('❌ Error stack:', error?.stack);
    
    // Ensure we always return valid JSON
    const errorResponse = {
      error: 'Code generation failed',
      message: error?.message || 'Unknown error occurred',
      success: false,
      timestamp: Date.now()
    };
    
    return res.status(500).json(errorResponse);
  }
}