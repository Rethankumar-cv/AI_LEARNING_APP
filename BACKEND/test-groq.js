require('dotenv').config();
const { generateSummary, generateFlashcards, generateQuiz, chatWithDocument } = require('./services/geminiService');

console.log('🧪 Testing Groq Integration...\n');

const sampleText = `
Artificial Intelligence (AI) is the simulation of human intelligence by machines.
Machine learning is a subset of AI that enables systems to learn from data.
Neural networks are computing systems inspired by biological neural networks.
Deep learning uses multiple layers of neural networks for complex pattern recognition.
Natural Language Processing (NLP) allows computers to understand human language.
`;

async function runTests() {
    try {
        // Test 1: Summary
        console.log('1️⃣ Testing Summary Generation...');
        const summary = await generateSummary(sampleText);
        console.log('✅ Summary:', JSON.stringify(summary, null, 2));

        // Test 2: Flashcards
        console.log('\n2️⃣ Testing Flashcard Generation...');
        const flashcards = await generateFlashcards(sampleText, 3);
        console.log('✅ Flashcards:', JSON.stringify(flashcards, null, 2));

        // Test 3: Quiz
        console.log('\n3️⃣ Testing Quiz Generation...');
        const quiz = await generateQuiz(sampleText, 2);
        console.log('✅ Quiz:', JSON.stringify(quiz, null, 2));

        // Test 4: Chat
        console.log('\n4️⃣ Testing Chat...');
        const answer = await chatWithDocument('What is machine learning?', sampleText);
        console.log('✅ Chat Answer:', answer);

        console.log('\n🎉 ALL TESTS PASSED! Groq is working perfectly.');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        console.error(error.stack);
    }
}

runTests();
