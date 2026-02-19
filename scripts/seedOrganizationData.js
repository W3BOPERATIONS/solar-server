import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import Country from '../models/Country.js';
import State from '../models/State.js';
import City from '../models/City.js';
import District from '../models/District.js';
import Cluster from '../models/Cluster.js';
import Department from '../models/Department.js';
import User from '../models/User.js';
import UserPerformance from '../models/UserPerformance.js';

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const DEPARTMENTS = [
    'HR Department',
    'CPRM Department',
    'Supplier Department',
    'Account Department',
    'Operations Department',
    'Marketing Department'
];

// Hierarchy: Country -> State -> City -> District -> Cluster
// We will map:
// State -> City (was Cluster in static) -> District (was District in static)
const LOCATIONS = {
    'India': {
        'Gujarat': {
            'Rajkot': ['Paddhari', 'Tankara', 'Upleta'],
            'Ahmedabad': ['Gandhinagar', 'Ahmedabad East'],
            'Surat': ['Vadodara', 'Surat North']
        },
        'Maharashtra': {
            'Mumbai': ['Mumbai Central', 'Thane'],
            'Pune': ['Pune City', 'Pimpri']
        },
        'Rajasthan': {
            'Udaypur': ['District A', 'District B']
        },
        'Punjab': {
            'Amritsir': ['District C', 'District D']
        },
        'Karnataka': {
            'Bengaluru': ['District E', 'District F']
        }
    }
};

const EMPLOYEES = [
    { name: "Rajesh Kumar", dept: "HR Department" },
    { name: "Priya Sharma", dept: "CPRM Department" },
    { name: "Amit Patel", dept: "Supplier Department" },
    { name: "Sneha Gupta", dept: "Account Department" },
    { name: "Vikram Singh", dept: "Operations Department" },
    { name: "Neha Reddy", dept: "Marketing Department" },
    { name: "Rahul Mehta", dept: "HR Department" },
    { name: "Anjali Joshi", dept: "CPRM Department" },
    { name: "Suresh Raina", dept: "Operations Department" },
    { name: "Deepak Chahar", dept: "Marketing Department" }
];

const connectDB = async () => {
    try {
        const rootEnvPath = path.resolve(__dirname, '../../.env');
        dotenv.config({ path: rootEnvPath });

        if (!process.env.MONGODB_URI) {
            const serverEnvPath = path.resolve(__dirname, '../.env');
            dotenv.config({ path: serverEnvPath });
        }

        const connStr = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!connStr) throw new Error('MongoDB URI not found');

        await mongoose.connect(connStr);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const seed = async () => {
    await connectDB();

    try {
        console.log('🌱 Starting Organization Data Seeder...');

        // 1. Departments
        console.log('--- Seeding Departments ---');
        const deptMap = {};
        for (const deptName of DEPARTMENTS) {
            let dept = await Department.findOne({ name: deptName });
            if (!dept) {
                dept = await Department.create({ name: deptName });
                console.log(`Created Department: ${deptName}`);
            }
            deptMap[deptName] = dept;
        }

        // 2. Locations (Country -> State -> City -> District -> Cluster)
        console.log('--- Seeding Locations ---');
        const countryName = 'India';
        let country = await Country.findOne({ name: countryName });
        if (!country) {
            country = await Country.create({ name: countryName, code: 'IN' });
            console.log(`Created Country: ${countryName}`);
        }

        const locationCache = {
            states: [],
            cities: [],
            districts: [],
            clusters: []
        };

        const stateData = LOCATIONS[countryName];
        for (const [stateName, cities] of Object.entries(stateData)) {
            let state = await State.findOne({ name: stateName, country: country._id });
            if (!state) {
                state = await State.create({ name: stateName, country: country._id });
                console.log(`Created State: ${stateName}`);
            }
            locationCache.states.push(state);

            for (const [cityName, districts] of Object.entries(cities)) {
                let city = await City.findOne({ name: cityName, state: state._id });
                if (!city) {
                    city = await City.create({
                        name: cityName,
                        state: state._id,
                        country: country._id
                    });
                    console.log(`Created City: ${cityName}`);
                }
                locationCache.cities.push(city);

                for (const districtName of districts) {
                    // Check by State because name must be unique per State
                    let district = await District.findOne({ name: districtName, state: state._id });
                    if (!district) {
                        district = await District.create({
                            name: districtName,
                            city: city._id,
                            state: state._id,
                            country: country._id
                        });
                        console.log(`Created District: ${districtName}`);
                    } else if (district.city.toString() !== city._id.toString()) {
                        console.log(`⚠️ District ${districtName} exists but under different city. Skipping move.`);
                    }
                    locationCache.districts.push(district);

                    // Create a dummy cluster for this district to satisfy hierarchy deep down
                    const clusterName = `${districtName} Cluster`;
                    let cluster = await Cluster.findOne({ name: clusterName, district: district._id });
                    if (!cluster) {
                        cluster = await Cluster.create({
                            name: clusterName,
                            district: district._id,
                            state: state._id,
                            country: country._id
                        });
                        console.log(`Created Cluster: ${clusterName}`);
                    }
                    locationCache.clusters.push(cluster);
                }
            }
        }

        // 3. Employees
        console.log('--- Seeding Employees ---');
        // Get Admin to set as createdBy if needed, or just null
        const admin = await User.findOne({ role: 'admin' });

        for (const empData of EMPLOYEES) {
            const email = `${empData.name.toLowerCase().replace(' ', '.')}@example.com`;
            let user = await User.findOne({ email });

            // Assign random location
            const randomState = locationCache.states[Math.floor(Math.random() * locationCache.states.length)];
            const citiesInState = locationCache.cities.filter(c => c.state.toString() === randomState._id.toString());
            const randomCity = citiesInState.length > 0 ? citiesInState[Math.floor(Math.random() * citiesInState.length)] : null;
            const districtsInCity = randomCity ? locationCache.districts.filter(d => d.city.toString() === randomCity._id.toString()) : [];
            const randomDistrict = districtsInCity.length > 0 ? districtsInCity[Math.floor(Math.random() * districtsInCity.length)] : null;
            const clustersInDistrict = randomDistrict ? locationCache.clusters.filter(c => c.district.toString() === randomDistrict._id.toString()) : [];
            const randomCluster = clustersInDistrict.length > 0 ? clustersInDistrict[Math.floor(Math.random() * clustersInDistrict.length)] : null;

            if (!user) {
                user = await User.create({
                    name: empData.name,
                    email,
                    password: 'password123', // Dummy password
                    role: 'employee',
                    phone: '1234567890',
                    state: randomState.name,
                    district: randomDistrict?.name || null,
                    cluster: randomCluster?.name || null, // Storing Name as per User Model
                    department: deptMap[empData.dept]._id,
                    status: 'active'
                });
                console.log(`Created Employee: ${empData.name}`);

                // Create Performance Record
                await UserPerformance.create({
                    userId: user._id,
                    role: 'employee',
                    countryId: country._id,
                    stateId: randomState._id,
                    districtId: randomDistrict?._id,
                    clusterId: randomCluster?._id,
                    workingDays: Math.floor(Math.random() * 300) + 100,
                    absentDays: Math.floor(Math.random() * 20),
                    efficiency: Math.floor(Math.random() * 30) + 70,
                    productivity: Math.floor(Math.random() * 30) + 70,
                    overdueTasks: Math.floor(Math.random() * 10)
                });
                console.log(`Created Performance for: ${empData.name}`);
            }
        }

        console.log('✅ Organization Data Seeding Completed!');

    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seed();
