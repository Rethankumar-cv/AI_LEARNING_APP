/**
 * AI Service (Groq)
 * Provides AI-powered features using Groq API
 */

const Groq = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
    throw new Error("❌ GROQ_API_KEY is missing in environment variables");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const MODEL_NAME = "llama-3.3-70b-versatile";

/* -------------------- SUMMARY -------------------- */
async function generateSummary(documentText) {
    try {
        // Handle both text string and inline data object (for backward compatibility)
        let textContent = "";

        if (typeof documentText === 'string') {
            textContent = documentText;
        } else if (documentText && documentText.inlineData) {
            // PDF was passed as inline data, but Groq doesn't support this
            throw new Error("PDF inline data not supported. Please extract text first.");
        } else {
            throw new Error("Invalid document input");
        }

        // Use more content for comprehensive summaries (up to 100k characters)
        const contentToAnalyze = textContent.slice(0, 100000);
        const documentLength = textContent.length;

        const prompt = `You are an expert document analyst. Create a comprehensive, well-structured summary of the entire document provided below.

DOCUMENT (${documentLength} characters total):
${contentToAnalyze}

${documentLength > 100000 ? '\n[Note: Document is very long. Focus on capturing all major themes, concepts, and key information from the entire text.]' : ''}

REQUIREMENTS:
1. Read and analyze the ENTIRE document carefully
2. Create a clear, hierarchical summary that covers ALL major topics
3. Organize information logically with clear section headings
4. Include 6-10 main sections (depending on document complexity)
5. Each section should have 5-8 detailed key points
6. Capture important facts, concepts, definitions, and examples
7. Use clear, concise language
8. Ensure NO important information is missed

Return ONLY a valid JSON object with this EXACT structure:
{
  "title": "Clear, descriptive document title (max 10 words)",
  "sections": [
    {
      "heading": "Main Topic/Section Name",
      "points": [
        "Detailed key point 1 with context",
        "Detailed key point 2 with context",
        "Detailed key point 3 with context",
        "Detailed key point 4 with context",
        "Detailed key point 5 with context"
      ]
    }
  ],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8", "keyword9", "keyword10"]
}

CRITICAL: Return ONLY the JSON object, no markdown formatting, no explanations, no other text.`;

        const completion = await groq.chat.completions.create({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,  // Lower for more factual, structured output
            max_tokens: 5000    // Increased for comprehensive summaries
        });

        let responseText = completion.choices[0].message.content.trim();

        // Clean JSON response
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        const summary = JSON.parse(responseText);
        return summary;

    } catch (error) {
        console.error("Groq summary error:", error);

        // Return fallback structure
        return {
            title: "Summary Generation Failed",
            sections: [{
                heading: "Error",
                points: [`Failed to generate summary: ${error.message}`]
            }],
            keywords: ["error"]
        };
    }
}

/* -------------------- FLASHCARDS -------------------- */
async function generateFlashcards(documentText, count = 10) {
    try {
        const prompt = `Generate ${count} flashcards from this document:

${documentText.slice(0, 15000)}

Return ONLY a valid JSON array:
[
  {
    "front": "Question or term",
    "back": "Answer or definition"
  }
]

Generate exactly ${count} flashcards. Return ONLY the JSON array, no other text.`;

        const completion = await groq.chat.completions.create({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            max_tokens: 3000
        });

        let responseText = completion.choices[0].message.content.trim();
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        return JSON.parse(responseText);

    } catch (error) {
        console.error("Groq flashcards error:", error);
        throw new Error("Failed to generate flashcards: " + error.message);
    }
}

/* -------------------- QUIZ -------------------- */
async function generateQuiz(documentText, questionCount = 5) {
    try {
        const prompt = `Generate a ${questionCount}-question multiple choice quiz from this document:

${documentText.slice(0, 15000)}

Return ONLY a valid JSON array:
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

Rules:
- correctAnswer is the index (0-3) of the correct option
- Generate exactly ${questionCount} questions
- Return ONLY the JSON array, no other text`;

        const completion = await groq.chat.completions.create({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            max_tokens: 3000
        });

        let responseText = completion.choices[0].message.content.trim();
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        return JSON.parse(responseText);

    } catch (error) {
        console.error("Groq quiz error:", error);
        throw new Error("Failed to generate quiz: " + error.message);
    }
}

/* -------------------- CHAT -------------------- */
async function chatWithDocument(question, documentContext) {
    try {
        let contextText = "";

        // Handle both string and object contexts
        if (typeof documentContext === 'string') {
            contextText = documentContext;
        } else if (documentContext && documentContext.inlineData) {
            throw new Error("PDF inline data not supported. Please use extracted text.");
        } else {
            throw new Error('Invalid document context provided');
        }

        if (!contextText || contextText.length < 10) {
            throw new Error('Document content is empty or unavailable for chat');
        }

        const prompt = `You are a helpful assistant. Answer the question based ONLY on the provided context.

Context:
${contextText.slice(0, 10000)}

Question: ${question}

Answer:`;

        const completion = await groq.chat.completions.create({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000
        });

        return completion.choices[0].message.content.trim();

    } catch (error) {
        console.error("Groq chat error:", error);
        throw new Error("Failed to generate chat response: " + error.message);
    }
}

/* -------------------- EXPLAIN TEXT -------------------- */
async function explainText(selectedText, documentContext = '') {
    try {
        if (!selectedText || selectedText.trim().length === 0) {
            throw new Error('No text provided to explain');
        }

        // Limit selected text to reasonable length
        const textToExplain = selectedText.slice(0, 2000);

        let prompt = `You are an expert educator. Provide a clear, comprehensive explanation of the following text.

TEXT TO EXPLAIN:
"${textToExplain}"
`;

        // Add document context if available
        if (documentContext && documentContext.length > 100) {
            prompt += `\nDOCUMENT CONTEXT (for reference):
${documentContext.slice(0, 5000)}

`;
        }

        prompt += `
EXPLANATION REQUIREMENTS:
1. Explain the meaning and significance of the text
2. Break down complex concepts into simple terms
3. Provide relevant examples or analogies if helpful
4. Explain any technical terms or jargon
5. Add context about why this is important
6. Keep the explanation clear and educational

Provide a detailed but concise explanation (2-4 paragraphs):`;

        const completion = await groq.chat.completions.create({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            max_tokens: 1000
        });

        return completion.choices[0].message.content.trim();

    } catch (error) {
        console.error("Groq explain error:", error);
        throw new Error("Failed to generate explanation: " + error.message);
    }
}

module.exports = {
    generateSummary,
    generateFlashcards,
    generateQuiz,
    chatWithDocument,
    explainText,
};
