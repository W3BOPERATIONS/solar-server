import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.MONGO_URI || "mongodb+srv://w3bfranceoperations_db_user:BpXlfVpX5yF9eaeA@cluster0.p7gs1gy.mongodb.net/solarkit?appName=Cluster0";

const listModules = async () => {
    try {
        await mongoose.connect(URL);
        const db = mongoose.connection.db;
        const modules = await db.collection("modules").find({}).toArray();
        console.log(JSON.stringify(modules, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

listModules();
