require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('Connecting to:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ SUCCESS! MongoDB connected!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ FAILED! MongoDB connection error:');
        console.error('Error:', error.message);
        console.error('\nPossible causes:');
        console.error('1. Password is incorrect');
        console.error('2. IP address not whitelisted in MongoDB Atlas');
        console.error('3. Cluster URL is wrong');
        console.error('4. Network/firewall blocking connection');
        process.exit(1);
    });
