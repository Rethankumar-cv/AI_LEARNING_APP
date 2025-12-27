const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

console.log("Testing Gemini API connection...");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello to verify connection.");
        console.log("✅ Response received:", result.response.text());
    } catch (e) {
        console.error("❌ Gemini Error:", e);
    }
})();
