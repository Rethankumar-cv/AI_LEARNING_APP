/**
 * PDF Text Extraction Utility
 * Extracts text content from PDF files
 */

const pdf = require('pdf-parse');
const fs = require('fs');

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromPDF(filePath) {
    try {
        console.log(`📄 PDF Extractor: Reading file at ${filePath}`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        const dataBuffer = fs.readFileSync(filePath);
        console.log(`📄 PDF Extractor: File read, size: ${dataBuffer.length} bytes`);

        const data = await pdf(dataBuffer);
        console.log(`📄 PDF Extractor: Parsing complete, info:`, data.info);

        if (!data.text || data.text.trim().length === 0) {
            console.warn('⚠️ PDF Extractor: Extracted text is empty');
        } else {
            console.log(`✅ PDF Extractor: Successfully extracted ${data.text.length} chars`);
        }

        return data.text;
    } catch (error) {
        console.error('❌ PDF extraction error details:', error);
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
}

module.exports = { extractTextFromPDF };
