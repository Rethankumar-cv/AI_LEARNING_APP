require('dotenv').config();
const uri = process.env.MONGODB_URI;
console.log('Raw URI:');
console.log(uri);
console.log('\nFirst 50 characters:');
console.log(JSON.stringify(uri.substring(0, 50)));
