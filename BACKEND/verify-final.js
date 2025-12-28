const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

console.log("🚀 Final Verification...");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say 'System Operational'");
        console.log("✅ SUCCESS:", result.response.text());
    } catch (e) {
        console.error("❌ FAILED:", e.message);
    }
})();
