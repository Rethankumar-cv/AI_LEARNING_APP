const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

console.log("Testing Gemini 2.0 Flash...");

// Use the key provided in the curl command if getting it from env
const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.error("❌ API Key missing from .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);

(async () => {
    try {
        // Trying the specific model user mentioned
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // trying the exp suffix which is common, or just flash if updated
        // Actually, user said 'gemini-2.0-flash'. Let's try that exact string first.

        const modelExact = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("Sending request to gemini-2.0-flash...");
        const result = await modelExact.generateContent("Explain how AI works in a few words");
        console.log("✅ SUCCESS with gemini-2.0-flash:");
        console.log(result.response.text());
    } catch (e) {
        console.error("❌ Failed with gemini-2.0-flash:");
        console.error(e.message);

        // Fallback test to see if 'exp' version works if the main one fails
        try {
            console.log("...Attempting gemini-2.0-flash-exp...");
            const modelExp = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
            const resultExp = await modelExp.generateContent("Explain how AI works");
            console.log("✅ SUCCESS with gemini-2.0-flash-exp:");
            console.log(resultExp.response.text());
        } catch (e2) {
            console.error("❌ Failed with gemini-2.0-flash-exp as well.");
        }
    }
})();
