/**
 * PDF Text Extractor using pdf2json
 * Reliable PDF parsing for Node.js
 */

const PDFParser = require("pdf2json");
const fs = require('fs');

async function extractTextFromPDF(filePath) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`📄 Extracting text from: ${filePath}`);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return reject(new Error(`PDF file not found: ${filePath}`));
            }

            const pdfParser = new PDFParser();

            // Success handler
            pdfParser.on("pdfParser_dataReady", pdfData => {
                try {
                    let fullText = '';

                    // Extract text from all pages
                    if (pdfData.Pages) {
                        pdfData.Pages.forEach(page => {
                            if (page.Texts) {
                                page.Texts.forEach(text => {
                                    if (text.R) {
                                        text.R.forEach(r => {
                                            if (r.T) {
                                                // Decode URI component (text is URL encoded)
                                                fullText += decodeURIComponent(r.T) + ' ';
                                            }
                                        });
                                    }
                                });
                                fullText += '\n\n'; // Add spacing between pages
                            }
                        });
                    }

                    const cleanText = fullText.trim();
                    const extractedLength = cleanText.length;

                    console.log(`✅ Extracted ${extractedLength} characters from PDF`);

                    if (extractedLength === 0) {
                        return reject(new Error('PDF appears to be empty or contains only images'));
                    }

                    resolve(cleanText);

                } catch (error) {
                    reject(new Error(`Failed to parse PDF data: ${error.message}`));
                }
            });

            // Error handler
            pdfParser.on("pdfParser_dataError", errData => {
                console.error('❌ PDF parsing error:', errData.parserError);
                reject(new Error(`PDF parsing failed: ${errData.parserError}`));
            });

            // Load and parse the PDF
            pdfParser.loadPDF(filePath);

        } catch (error) {
            console.error('❌ PDF extraction error:', error.message);
            reject(new Error(`Failed to extract text from PDF: ${error.message}`));
        }
    });
}

module.exports = { extractTextFromPDF };
