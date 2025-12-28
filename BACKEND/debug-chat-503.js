require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('🔍 Starting Gemini Diagnostic...');
console.log('--------------------------------');

// 1. Check API Key presence
const key = process.env.GEMINI_API_KEY;
console.log(`1️⃣ API Key Check: ${key ? 'Present (' + key.substring(0, 6) + '...)' : 'MISSING ❌'}`);

if (!key) process.exit(1);

const genAI = new GoogleGenerativeAI(key);

async function runTests() {
    // 2. Test Basic Model Availability (Text)
    console.log('\n2️⃣ Testing Text Generation (gemini-1.5-flash)...');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Ping');
        console.log(`   ✅ Success! Response: ${result.response.text().trim()}`);
    } catch (e) {
        console.error(`   ❌ Failed: ${e.message}`);
        if (e.message.includes('404')) console.log('      -> HINT: Generative Language API not enabled or model not found.');
        if (e.message.includes('400')) console.log('      -> HINT: Bad Request (Invalid API key details?)');
    }

    // 3. Test Chat with PDF Context (Mock)
    console.log('\n3️⃣ Testing Chat with Mock PDF Context...');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Create a tiny valid dummy PDF base64 (empty pdf header)
        // This likely won't contain text but checks if Gemini accepts the "inlineData" format
        const dummyPdfBase64 = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmogCjw8CiAgL1R5cGUgL1BhZ2VzCiAgL01lZGlhQm94IFsgMCAwIDIwMCAyMDAgXQogIC9Db3VudCAxCiAgL0tpZHMgWyAzIDAgUiBdCj4+CmVuZG9iagoKMyAwIG9iago8PAogIC9UeXBlIC9QYWdlCiAgL1BhcmVudCAyIDAgUHIKICAvUmVzb3VyY2VzIDw8CiAgICAvRm9udCA8PAogICAgICAvRjEgNCAwIFIKICAgID4+CiAgPj4KICAvQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCgo0IDAgb2JqCjw8CiAgL1R5cGUgL0ZvbnQKICAvU3VidHlwZSAvVHlwZTEKICAvQmFzZUZvbnQgL1RpbWVzLVJvbWFuCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDEwMTEgMDAwMDAgbiAKMDAwMDAwMDI3MSAwMDAwMCBuIAowMDAwMDAwMzY4IDAwMDAwIG4gCnRyYWlsZXIKPDwKICAvU2l6ZSA2CiAgL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ3NAolJUVPRgo=";

        const parts = [
            { text: "Answer ONLY using the context. Question: What does this document say?" },
            {
                inlineData: {
                    data: dummyPdfBase64,
                    mimeType: 'application/pdf',
                }
            }
        ];

        const result = await model.generateContent(parts);
        console.log(`   ✅ Success! Response: ${result.response.text().trim()}`);

    } catch (e) {
        console.error(`   ❌ Failed: ${e.message}`);
        console.error(`   Details: ${JSON.stringify(e)}`);
    }
}

runTests();
