
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function testExtraction() {
    try {
        // Find a PDF in the uploads directory
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            console.log('Uploads directory does not exist');
            return;
        }

        const files = fs.readdirSync(uploadsDir);
        const pdfFile = files.find(f => f.endsWith('.pdf'));

        if (!pdfFile) {
            console.log('No PDF file found in uploads directory to test');
            return;
        }

        const filePath = path.join(uploadsDir, pdfFile);
        console.log(`Testing extraction on: ${filePath}`);

        const dataBuffer = fs.readFileSync(filePath);
        console.log(`File read, size: ${dataBuffer.length} bytes`);

        try {
            const data = await pdf(dataBuffer);
            console.log('✅ Success!');
            console.log(`Text length: ${data.text.length}`);
            console.log('Preview:', data.text.substring(0, 100));
        } catch (parseError) {
            console.error('❌ Parse Error:', parseError);
        }

    } catch (err) {
        console.error('❌ General Error:', err);
    }
}

testExtraction();
