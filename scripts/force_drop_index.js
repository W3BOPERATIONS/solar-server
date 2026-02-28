import mongoose from 'mongoose';

const uri = 'mongodb+srv://admin:admin@solar-erp.p7gs1gy.mongodb.net/?retryWrites=true&w=majority&appName=solar-erp';

const dropIndex = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected.');

        const db = mongoose.connection.db;
        const collection = db.collection('deliverybenchmarkprices');

        try {
            await collection.dropIndex('deliveryType_1');
            console.log('Successfully dropped old unique index on deliveryType.');
        } catch (err) {
            console.log('Index might not exist or already dropped:', err.message);
        }

        try {
            await collection.dropIndex('deliveryType_1_location_1');
            console.log('Successfully dropped other indices');
        } catch (e) { }

        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        process.exit(0);
    } catch (err) {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    }
};

dropIndex();
