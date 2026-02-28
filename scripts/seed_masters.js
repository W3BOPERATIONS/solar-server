import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://w3bfranceoperations_db_user:BpXlfVpX5yF9eaeA@cluster0.p7gs1gy.mongodb.net/solarkit?appName=Cluster0');
  console.log('MongoDB connected');
};

const seed = async () => {
    await connectDB();
    const db = mongoose.connection.db;

    console.log("Clearing collections...");
    await db.collection('projecttypes').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('subcategories').deleteMany({});
    await db.collection('subprojecttypes').deleteMany({});

    const ObjectId = mongoose.Types.ObjectId;
    const adminId = new ObjectId("650000000000000000000000"); // Dummy admin ID

    console.log("Creating Project Types...");
    const p1 = { _id: new ObjectId(), name: '1 to 10 kW', createdBy: adminId, createdAt: new Date(), updatedAt: new Date(), status: true };
    const p2 = { _id: new ObjectId(), name: '11 to 20 kW', createdBy: adminId, createdAt: new Date(), updatedAt: new Date(), status: true };
    await db.collection('projecttypes').insertMany([p1, p2]);

    console.log("Creating Categories...");
    const c1 = { _id: new ObjectId(), name: 'Rooftop Solar', projectTypeId: p1._id, description: '', createdBy: adminId, createdAt: new Date(), updatedAt: new Date(), status: true };
    const c2 = { _id: new ObjectId(), name: 'Solar Pump', projectTypeId: p1._id, description: '', createdBy: adminId, createdAt: new Date(), updatedAt: new Date(), status: true };
    await db.collection('categories').insertMany([c1, c2]);

    console.log("Creating Sub Categories...");
    const subCats = [];
    [c1, c2].forEach(cat => {
        subCats.push({ _id: new ObjectId(), name: 'Residential', categoryId: cat._id, projectTypeId: p1._id, createdBy: adminId, createdAt: new Date(), updatedAt: new Date(), status: true });
        subCats.push({ _id: new ObjectId(), name: 'Commercial', categoryId: cat._id, projectTypeId: p1._id, createdBy: adminId, createdAt: new Date(), updatedAt: new Date(), status: true });
    });
    await db.collection('subcategories').insertMany(subCats);

    console.log("Creating Sub Project Types...");
    const subPTypes = [];
    [p1, p2].forEach(pt => {
        subPTypes.push({ _id: new ObjectId(), name: 'On-Grid', projectTypeId: pt._id, createdBy: adminId, createdAt: new Date(), updatedAt: new Date(), status: true });
        subPTypes.push({ _id: new ObjectId(), name: 'Off-Grid', projectTypeId: pt._id, createdBy: adminId, createdAt: new Date(), updatedAt: new Date(), status: true });
        subPTypes.push({ _id: new ObjectId(), name: 'Hybrid', projectTypeId: pt._id, createdBy: adminId, createdAt: new Date(), updatedAt: new Date(), status: true });
    });
    await db.collection('subprojecttypes').insertMany(subPTypes);

    console.log("Done!");
    process.exit(0);
};

seed().catch(console.error);
