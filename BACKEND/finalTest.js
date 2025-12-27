const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

console.log("Final Connectivity Test...");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Reply with 'System Operational'");
        console.log("✅ SUCCESS:", result.response.text());
    } catch (e) {
        console.error("❌ ERROR:", e.message);
    }
})();
