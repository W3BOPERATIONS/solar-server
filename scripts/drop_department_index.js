import mongoose from 'mongoose';

const URL = "mongodb+srv://w3bfranceoperations_db_user:BpXlfVpX5yF9eaeA@cluster0.p7gs1gy.mongodb.net/solarkit?appName=Cluster0";

const dropIndex = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Connected to MongoDB.");

        const db = mongoose.connection.db;

        console.log("Dropping name_1 index from departments collection...");
        try {
            await db.collection("departments").dropIndex("name_1");
            console.log("Successfully dropped name_1 from departments.");
        } catch (e) {
            console.log("Index name_1 not found or already dropped. Ignoring.");
        }

        try {
            // Also ensure we drop the old code_1 index if it existed to avoid conflicts based on our sparse change
            await db.collection("departments").dropIndex("code_1");
            console.log("Successfully dropped code_1 from departments.");
        } catch (e) {
            console.log("Index code_1 not found or already dropped. Ignoring.");
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error connecting to DB:", error);
        process.exit(1);
    }
};

dropIndex();
