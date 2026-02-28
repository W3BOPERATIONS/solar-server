import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnect = async () => {
    console.log('URI:', process.env.MONGODB_URI);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('SUCCESS');
        process.exit(0);
    } catch (e) {
        console.error('FAILED:', e.message);
        process.exit(1);
    }
};

testConnect();
