require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('='.repeat(60));
console.log('MONGODB_URI Diagnosis:');
console.log('='.repeat(60));
console.log('Length:', uri ? uri.length : 'UNDEFINED');
console.log('First 20 chars:', uri ? JSON.stringify(uri.substring(0, 20)) : 'N/A');
console.log('Last 20 chars:', uri ? JSON.stringify(uri.substring(uri.length - 20)) : 'N/A');
console.log('Starts with mongodb+srv://?', uri ? uri.startsWith('mongodb+srv://') : false);
console.log('Starts with mongodb://?', uri ? uri.startsWith('mongodb://') : false);
console.log('\nFull URI (password masked):');
console.log(uri ? uri.replace(/:[^:@]+@/, ':****@') : 'UNDEFINED');
console.log('='.repeat(60));

// Check for common issues
if (uri) {
    if (uri.includes('\r') || uri.includes('\n')) {
        console.log('⚠️  WARNING: URI contains newline characters!');
    }
    if (uri.startsWith(' ') || uri.endsWith(' ')) {
        console.log('⚠️  WARNING: URI has leading/trailing spaces!');
    }
    if (uri.includes(' ')) {
        console.log('⚠️  WARNING: URI contains spaces!');
    }
}
