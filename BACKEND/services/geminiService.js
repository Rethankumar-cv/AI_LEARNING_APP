
/**
 * Gemini AI Service
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("❌ GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-1.5-flash";

/* -------------------- SUMMARY -------------------- */
async function generateSummary(documentText) {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = `
You are an expert at summarizing educational content.

Return ONLY valid JSON (no markdown).

Format:
{
  "title": "Document Title",
  "sections": [
    {
      "heading": "Section Heading",
      "points": ["point 1", "point 2"]
    }
  ],
  "keywords": ["keyword1", "keyword2"]
}

Document:
${documentText.slice(0, 30000)}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        return JSON.parse(text.replace(/```json|```/g, ""));
    } catch (error) {
        console.error("Gemini summary error:", error);
        throw new Error("Failed to generate document summary");
    }
}

/* -------------------- FLASHCARDS -------------------- */
async function generateFlashcards(documentText, count = 10) {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = `
Create exactly ${count} flashcards from this document.

Return ONLY JSON array:
[
  {
    "question": "Question?",
    "answer": "Answer",
    "topic": "Topic",
    "difficulty": "easy|medium|hard"
  }
]

Document:
${documentText.slice(0, 15000)}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        return JSON.parse(text.replace(/```json|```/g, "")).slice(0, count);
    } catch (error) {
        console.error("Gemini flashcards error:", error);
        throw new Error("Failed to generate flashcards");
    }
}

/* -------------------- QUIZ -------------------- */
async function generateQuiz(documentText, questionCount = 10) {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = `
Create ${questionCount} MCQs.

Return ONLY JSON array:
[
  {
    "id": "q1",
    "question": "Question?",
    "options": ["A","B","C","D"],
    "correctAnswer": 0,
    "explanation": "Why"
  }
]

Document:
${documentText.slice(0, 20000)}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        return JSON.parse(text.replace(/```json|```/g, ""));
    } catch (error) {
        console.error("Gemini quiz error:", error);
        throw new Error("Failed to generate quiz");
    }
}

/* -------------------- CHAT -------------------- */
async function chatWithDocument(question, documentContext) {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = `
Answer ONLY using the context.

Question:
${question}
`;

        // Handle both text string and inline data part (PDF)
        const parts = [prompt];

        // Check if context is a string (text file content) or object (inline PDF data)
        if (typeof documentContext === 'string') {
            parts.push(`Context:\n${documentContext.slice(0, 10000)}`);
        } else if (documentContext && documentContext.inlineData) {
            // Pass the inline data object directly
            parts.push(documentContext);
        } else {
            throw new Error('Invalid document context provided');
        }

        const result = await model.generateContent(parts);
        return result.response.text();
    } catch (error) {
        console.error("Gemini chat error:", error);
        throw new Error("Failed to generate chat response: " + error.message);
    }
}

module.exports = {
    generateSummary,
    generateFlashcards,
    generateQuiz,
    chatWithDocument,
};
