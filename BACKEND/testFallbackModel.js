const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

console.log("Listing available models...");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
    try {
        // There isn't a direct "listModels" on the instance easily in node SDK sometimes, 
        // but let's try a standard model query or just try a different known model.

        // Actually, let's just try 'gemini-pro' as a fallback to see if it's just the model name.
        console.log("Trying fallback model: gemini-pro");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test");
        console.log("✅ gemini-pro works!");
    } catch (e) {
        console.error("❌ gemini-pro failed:", e.message);
    }
})();
