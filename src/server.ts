import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { generateCode } from './codeGenerator';

// Load environment variables from .env file for local development
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// API endpoint for code generation
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Prompt is required and must be a string' 
      });
    }

    console.log(`🔄 Generating code for: "${prompt}"`);
    
    const result = await generateCode(prompt);
    
    // Save generated files to output directory
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const savedFiles = [];
    
    for (let i = 0; i < result.files.length; i++) {
      const file = result.files[i];
      const fileName = file.path || `generated-${Date.now()}-${i}.html`;
      const filePath = path.join(outputDir, fileName);
      
      fs.writeFileSync(filePath, file.content);
      
      savedFiles.push({
        ...file,
        path: fileName,
        url: `/output/${fileName}`
      });
    }

    console.log(`✅ Generated ${savedFiles.length} files`);

    res.json({
      ...result,
      files: savedFiles,
      timestamp: Date.now()
    });

  } catch (error: any) {
    console.error('❌ Generation error:', error);
    res.status(500).json({ 
      error: 'Code generation failed',
      message: error?.message || 'Unknown error occurred'
    });
  }
});

// Serve output files
app.use('/output', express.static(path.join(__dirname, '../output')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: Date.now(),
    claudeCodeSDK: 'ready'
  });
});

// Serve the main UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Lovable Clone server running at http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/generate`);
  console.log(`🎨 Web UI: http://localhost:${PORT}`);
});