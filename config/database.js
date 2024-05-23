const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/TMS';
    
    try {
        await mongoose.connect(mongoURI);
        console.log(`MongoDB connected successfull`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
