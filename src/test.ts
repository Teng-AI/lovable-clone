import { generateCode } from "./codeGenerator";
import * as fs from "fs";
import * as path from "path";

async function testTicTacToe() {
  console.log("🎮 Testing code generation with tic-tac-toe game...\n");
  
  const prompt = "Create a complete HTML tic-tac-toe game with CSS styling and JavaScript functionality. Make it responsive and include a reset button. Put everything in a single HTML file.";
  
  try {
    const result = await generateCode(prompt);
    
    console.log("\n📊 Generation Results:");
    console.log(`- Generated ${result.files.length} files`);
    console.log(`- Found ${result.dependencies.length} dependencies`);
    
    if (result.files.length > 0) {
      console.log("\n📁 Generated Files:");
      result.files.forEach(file => {
        console.log(`  - ${file.path} (${file.content.length} chars)`);
      });
      
      // Save files to output directory
      const outputDir = path.join(__dirname, "../output");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      result.files.forEach(file => {
        const filePath = path.join(outputDir, file.path);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, file.content);
        console.log(`✅ Saved: ${filePath}`);
      });
    }
    
    if (result.dependencies.length > 0) {
      console.log("\n📦 Dependencies:");
      result.dependencies.forEach(dep => console.log(`  - ${dep}`));
    }
    
    if (result.instructions) {
      console.log("\n📋 Instructions:");
      console.log(result.instructions);
    }
    
    console.log("\n🎉 Test completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testTicTacToe();