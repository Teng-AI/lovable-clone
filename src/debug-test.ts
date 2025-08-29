import { generateCode } from "./codeGenerator";

async function debugTest() {
  console.log("🔍 Debugging Claude Code SDK response...\n");
  
  const prompt = "Create a simple HTML button that says 'Click Me' with CSS styling";
  
  try {
    const result = await generateCode(prompt);
    console.log("\n🎯 Final result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

debugTest();