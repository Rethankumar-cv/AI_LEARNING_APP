const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

console.log("Attempting to list models (Checking API Access)...");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
    try {
        // There isn't a simple "listModels" helper exposed directly on the top level class in safe way for all versions, 
        // but we can try to access the underlying API if needed, or just try a broad model.
        // A 404 on a specific model might mean THAT model is missing, but a 403/404 on everything means API is off.

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("test");
        console.log("✅ gemini-pro is accessible.");
    } catch (e) {
        console.log("❌ Error Details:");
        console.log(e.message);
        console.log(e.stack);
    }
})();
