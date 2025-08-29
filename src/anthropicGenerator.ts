import { GeneratedCode, GeneratedFile } from "./types";

export async function generateCodeWithAnthropicAPI(prompt: string): Promise<GeneratedCode> {
  const apiKey = process.env.CLAUDE_API_KEY_1 || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Claude API key not found. Please set CLAUDE_API_KEY_1 or ANTHROPIC_API_KEY environment variable.');
  }
  
  if (!apiKey.startsWith('sk-ant-')) {
    throw new Error('Invalid API key format. Claude API keys should start with "sk-ant-"');
  }
  
  console.log(`🔄 Generating code for prompt: "${prompt}"`);
  console.log(`🔑 Using API key: ${apiKey.substring(0, 12)}...${apiKey.substring(apiKey.length - 8)}`);
  
  const systemPrompt = `You are a code generator that creates complete, working applications. 
IMPORTANT: Always provide the complete code in markdown code blocks in your response.

When generating code:
1. Always include the complete code in markdown code blocks (using triple backticks for html, css, javascript, etc.)
2. Include all necessary HTML, CSS, and JavaScript in single files when possible
3. Make the code functional and ready to run
4. List any dependencies needed
5. Provide clear instructions for running the code
6. NEVER just say "I'll create a file" - always show the actual code in your response

Generate a complete, working implementation based on the user's request and show all the code.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Anthropic API error:', response.status, errorData);
      throw new Error(`Anthropic API error: ${response.status} ${errorData}`);
    }

    const data: any = await response.json();
    console.log('📊 Received response from Anthropic API');
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from Anthropic API');
    }

    const responseText: string = data.content[0].text;
    console.log(`📝 Response length: ${responseText.length} characters`);
    
    return parseCodeFromText(responseText);
  } catch (error) {
    console.error('❌ Error generating code:', error);
    throw new Error(`Code generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function parseCodeFromText(text: string): GeneratedCode {
  console.log('📊 Parsing code from response text');
  
  const files: GeneratedFile[] = [];
  const dependencies: string[] = [];
  let instructions = '';
  
  // Extract code blocks from the response
  const codeBlocks = extractCodeBlocks(text);
  console.log(`📄 Found ${codeBlocks.length} code blocks`);
  files.push(...codeBlocks);
  
  const deps = extractDependencies(text);
  dependencies.push(...deps);
  
  if (text.includes('instructions') || text.includes('run') || text.includes('usage')) {
    instructions = text;
  }
  
  // Remove duplicates
  const uniqueDeps = [...new Set(dependencies)];
  
  console.log(`✅ Final result: ${files.length} files and ${uniqueDeps.length} dependencies`);
  
  return {
    files,
    dependencies: uniqueDeps,
    instructions: instructions.trim()
  };
}

function extractCodeBlocks(content: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  
  // Match code blocks with optional filename
  const codeBlockRegex = /```(?:([\w+]+))?(?:\s*\/\/\s*(.+?))?[\r\n]([\s\S]*?)```/g;
  let match;
  let fileIndex = 0;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'text';
    const possiblePath = match[2];
    const code = match[3].trim();
    
    if (code) {
      let path = possiblePath || `generated-file-${fileIndex}`;
      
      // Infer file extension from language
      if (!path.includes('.')) {
        switch (language.toLowerCase()) {
          case 'html':
            path += '.html';
            break;
          case 'css':
            path += '.css';
            break;
          case 'javascript':
          case 'js':
            path += '.js';
            break;
          case 'typescript':
          case 'ts':
            path += '.ts';
            break;
          case 'json':
            path += '.json';
            break;
          default:
            path += '.txt';
        }
      }
      
      files.push({
        path,
        content: code,
        language
      });
      
      fileIndex++;
    }
  }
  
  return files;
}

function extractDependencies(content: string): string[] {
  const deps: string[] = [];
  
  // Look for npm install commands
  const npmRegex = /npm install\s+([\w\-@\/\s]+)/g;
  let match;
  
  while ((match = npmRegex.exec(content)) !== null) {
    const packages = match[1].split(/\s+/).filter(pkg => pkg.trim());
    deps.push(...packages);
  }
  
  // Look for import statements
  const importRegex = /import\s+.+\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = importRegex.exec(content)) !== null) {
    const pkg = match[1];
    if (!pkg.startsWith('.') && !pkg.startsWith('/')) {
      deps.push(pkg);
    }
  }
  
  return deps;
}