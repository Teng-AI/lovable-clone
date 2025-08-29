import { query, SDKMessage } from "@anthropic-ai/claude-code";
import { GeneratedCode, GeneratedFile } from "./types";

export async function generateCode(prompt: string): Promise<GeneratedCode> {
  // Ensure the API key is available for the Claude Code SDK
  const apiKey = process.env.CLAUDE_API_KEY_1 || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Claude API key not found. Please set CLAUDE_API_KEY_1 or ANTHROPIC_API_KEY environment variable.');
  }
  
  // Validate API key format
  if (!apiKey.startsWith('sk-ant-')) {
    throw new Error('Invalid API key format. Claude API keys should start with "sk-ant-"');
  }
  
  // Set the API key for the SDK - this is required for Vercel deployment
  process.env.ANTHROPIC_API_KEY = apiKey;
  console.log(`🔄 Generating code for prompt: "${prompt}"`);
  console.log(`🔑 Using API key: ${apiKey.substring(0, 12)}...${apiKey.substring(apiKey.length - 8)}`);
  console.log(`🔑 API key length: ${apiKey.length}`);
  
  const systemPrompt = `You are a code generator that creates complete, working applications. 
IMPORTANT: Since you may not have write permissions, always provide the complete code in markdown code blocks in your response.

When generating code:
1. Always include the complete code in markdown code blocks (using triple backticks for html, css, javascript, etc.)
2. Include all necessary HTML, CSS, and JavaScript in single files when possible
3. Make the code functional and ready to run
4. List any dependencies needed
5. Provide clear instructions for running the code
6. NEVER just say "I'll create a file" - always show the actual code in your response

Generate a complete, working implementation based on the user's request and show all the code.`;

  const messages: SDKMessage[] = [];
  
  try {
    const queryOptions = {
      prompt,
      options: { 
        customSystemPrompt: systemPrompt
        // Using default model instead of specifying one
      }
    };
    
    console.log(`🚀 Starting Claude Code SDK query...`);
    
    for await (const message of query(queryOptions)) {
      console.log(`📝 Received message type: ${message.type}`);
      messages.push(message);
    }
    
    console.log(`📊 Query completed, parsing messages...`);
    return parseCodeFromMessages(messages);
  } catch (error) {
    console.error('❌ Error generating code:', error);
    
    // More specific error messages for debugging
    if (error instanceof Error) {
      if (error.message.includes('process exited with code 1')) {
        throw new Error('Claude Code SDK authentication failed. Please check your API key configuration.');
      } else if (error.message.includes('ECONNREFUSED')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please try again with a shorter prompt.');
      }
    }
    
    throw new Error(`Code generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function parseCodeFromMessages(messages: SDKMessage[]): GeneratedCode {
  console.log(`📊 Total messages received: ${messages.length}`);
  
  const files: GeneratedFile[] = [];
  const dependencies: string[] = [];
  let instructions = '';
  let resultMessageCount = 0;
  
  for (const message of messages) {
    console.log(`📋 Message type: ${message.type}`);
    
    // ONLY process the final result message - ignore assistant messages to avoid duplicates
    if (message.type === 'result' && 'result' in message) {
      resultMessageCount++;
      console.log(`🔍 Processing result message #${resultMessageCount}:`, message.result.substring(0, 200) + '...');
      
      // Extract code blocks from the final result
      const codeBlocks = extractCodeBlocks(message.result);
      console.log(`📄 Found ${codeBlocks.length} code blocks in this message`);
      files.push(...codeBlocks);
      
      const deps = extractDependencies(message.result);
      dependencies.push(...deps);
      
      if (message.result.includes('instructions') || message.result.includes('run') || message.result.includes('usage')) {
        instructions += message.result + '\n';
      }
    } else {
      console.log(`⏭️  Skipping ${message.type} message to avoid duplicates`);
    }
  }
  
  console.log(`📈 Found ${resultMessageCount} result messages total`);
  
  // Remove duplicate files based on content
  const uniqueFiles = files.filter((file, index, arr) => {
    const firstIndex = arr.findIndex(f => f.content === file.content);
    return firstIndex === index;
  });
  
  console.log(`🔄 Removed ${files.length - uniqueFiles.length} duplicate files`);
  
  // Remove duplicates
  const uniqueDeps = [...new Set(dependencies)];
  
  console.log(`✅ Final result: ${uniqueFiles.length} files and ${uniqueDeps.length} dependencies`);
  
  return {
    files: uniqueFiles,
    dependencies: uniqueDeps,
    instructions: instructions.trim()
  };
}

function extractCodeBlocks(content: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  
  // Match code blocks with optional filename
  const codeBlockRegex = /```(?:(\w+))?\s*(?:\/\/\s*(.+?))?\n([\s\S]*?)```/g;
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