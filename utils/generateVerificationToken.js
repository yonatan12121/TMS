const crypto = require('crypto');

// Function to generate a random token
const generateVerificationToken = () => {
    const token = crypto.randomBytes(20).toString('hex'); // Generate a random token
    const expiration = Date.now() + 60 * 60 * 1000; // Set expiration time to 1 hour from now in milliseconds
    return { token, expiration };
  };
  

module.exports = { generateVerificationToken };
