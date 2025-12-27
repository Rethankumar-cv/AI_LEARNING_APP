require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

console.log('='.repeat(50));
console.log('GEMINI_API_KEY Diagnostics');
console.log('='.repeat(50));

if (!apiKey) {
    console.error('❌ ERROR: GEMINI_API_KEY is missing or undefined!');
    process.exit(1);
}

console.log(`Length: ${apiKey.length}`);
console.log(`First 6 chars: ${apiKey.substring(0, 6)}`);
console.log(`Last 4 chars: ${apiKey.substring(apiKey.length - 4)}`);

// Check for placeholder pattern
if (apiKey.includes('GxQxGxQx')) {
    console.error('❌ ERROR: You are using the PLACEHOLDER key!');
    console.error('The key contains repeating patterns found in the example.');
    console.error('Please get a REAL key from https://aistudio.google.com/app/apikey');
} else if (!apiKey.startsWith('AIza')) {
    console.warn('⚠️ WARNING: Key does not start with "AIza". Valid Google API keys usually do.');
} else {
    console.log('✅ Key format looks valid (starts with AIza)');
}

console.log('='.repeat(50));
