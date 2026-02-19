import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Models
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Delivery from '../models/Delivery.js';
import Installation from '../models/Installation.js';
import Statistics from '../models/Statistics.js';

// Master Models
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Unit from '../models/Unit.js';
import ProjectType from '../models/ProjectType.js';
import ProductPrice from '../models/ProductPrice.js';
import Department from '../models/Department.js'; // Added
import Designation from '../models/Designation.js'; // Added

// Location Models
import Country from '../models/Country.js';
import State from '../models/State.js';
import District from '../models/District.js';
import Cluster from '../models/Cluster.js';
import Area from '../models/Area.js';
import Zone from '../models/Zone.js';
import City from '../models/City.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const pad = (n, w = 2) => String(n).padStart(w, '0');
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    const models = [
      User, Product, Order, Delivery, Installation, Statistics,
      Category, Brand, Unit, ProjectType, ProductPrice,
      Country, State, City, District, Cluster, Area, Zone,
      Department, Designation // Added
    ];

    for (const model of models) {
      try {
        await model.collection.drop();
      } catch (error) {
        if (error.code !== 26) {
          console.log(`Note: Could not drop collection for model ${model.modelName}: ${error.message}`);
        }
      }
    }

    console.log('Data cleared. Starting seeding...');

    // 1. Locations
    const india = await Country.create({ name: 'India', code: 'IN', phoneCode: '+91', currency: 'INR', currencySymbol: '₹' });

    const stateData = [
      { name: 'Gujarat', code: 'GJ' },
      { name: 'Maharashtra', code: 'MH' },
      { name: 'Rajasthan', code: 'RJ' },
      { name: 'Madhya Pradesh', code: 'MP' }
    ];

    const states = [];
    for (const s of stateData) {
      states.push(await State.create({ ...s, country: india._id }));
    }

    const districts = [];
    const clusters = [];
    const cities = [];

    // Gujarat Districts
    const gj = states.find(s => s.code === 'GJ');
    const gjDistricts = ['Ahmedabad', 'Rajkot', 'Surat', 'Vadodara'];

    for (const dName of gjDistricts) {
      const city = await City.create({
        name: `${dName} City`,
        code: `${dName.substring(0, 3).toUpperCase()}-CT`,
        state: gj._id,
        country: india._id
      });
      cities.push(city);

      const dist = await District.create({
        name: dName,
        code: dName.substring(0, 3).toUpperCase(),
        city: city._id,
        state: gj._id,
        country: india._id
      });
      districts.push(dist);

      for (let i = 1; i <= 2; i++) {
        const clus = await Cluster.create({
          name: `${dName} Cluster ${i}`,
          code: `${dName.substring(0, 3).toUpperCase()}-C${i}`,
          district: dist._id,
          state: gj._id,
          country: india._id
        });
        clusters.push(clus);
      }
    }

    // Maharashtra Districts
    const mh = states.find(s => s.code === 'MH');
    const mhDistricts = ['Pune', 'Mumbai', 'Nashik'];
    for (const dName of mhDistricts) {
      const city = await City.create({
        name: `${dName} City`,
        code: `${dName.substring(0, 3).toUpperCase()}-CT`,
        state: mh._id,
        country: india._id
      });
      cities.push(city);

      const dist = await District.create({
        name: dName,
        code: dName.substring(0, 3).toUpperCase(),
        city: city._id,
        state: mh._id,
        country: india._id
      });
      districts.push(dist);

      for (let i = 1; i <= 2; i++) {
        const clus = await Cluster.create({
          name: `${dName} Cluster ${i}`,
          code: `${dName.substring(0, 3).toUpperCase()}-C${i}`,
          district: dist._id,
          state: mh._id,
          country: india._id
        });
        clusters.push(clus);
      }
    }

    console.log(`Created Locations`);

    // 2. Masters
    // Units 
    const units = await Unit.insertMany([
      { unitName: 'Watt', symbol: 'W' },
      { unitName: 'Kilowatt', symbol: 'kW' },
      { unitName: 'Piece', symbol: 'pc' },
      { unitName: 'Set', symbol: 'set' },
      { unitName: 'Meter', symbol: 'm' }
    ]);

    // Project Types
    const residentialPT = await ProjectType.create({ name: 'Residential' });
    const commercialPT = await ProjectType.create({ name: 'Commercial' });

    // Categories
    const categoryData = [
      { name: 'Solar Panel', projectTypeId: residentialPT._id, description: 'PV Modules' },
      { name: 'Inverter', projectTypeId: residentialPT._id, description: 'Solar Inverters' },
      { name: 'Battery', projectTypeId: residentialPT._id, description: 'Energy Storage' },
      { name: 'Structure', projectTypeId: residentialPT._id, description: 'Mounting Structures' },
      { name: 'Accessories', projectTypeId: residentialPT._id, description: 'Cables and Connectors' }
    ];
    const categories = await Category.insertMany(categoryData);

    // Brands
    const brandData = [
      { brandName: 'Adani Solar' },
      { brandName: 'Waaree' },
      { brandName: 'Tata Power' },
      { brandName: 'Goldi' },
      { brandName: 'Luminous' },
      { brandName: 'Havells' }
    ];
    const brands = await Brand.insertMany(brandData);

    console.log('Created Masters');

    // Departments & Designations
    const deptData = {
      "HR Department": ["HR Manager", "HR Executive", "Recruiter"],
      "CPRM Department": ["CPRM Manager", "CPRM Executive"],
      "Marketing Department": ["Marketing Manager", "Marketing Executive"],
      "Account Manager": ["Account Manager", "Senior Account Manager"],
      "Operation Manager": ["Operations Head", "Operations Manager"],
      "Supplier Department": ["Supplier Manager", "Procurement Officer"]
    };

    for (const [deptName, designations] of Object.entries(deptData)) {
      const dept = await Department.create({ name: deptName });
      for (const desigName of designations) {
        await Designation.create({
          name: desigName,
          department: dept._id
        });
      }
    }
    console.log('Created Departments & Designations');


    // 3. Users
    // Admin
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@solarkits.com',
      password: '123456',
      role: 'admin',
      state: gj._id,
      phone: '9999999999',
      status: 'active'
    });

    console.log('Created Admin User');

    // Dealer
    const dealer = await User.create({
      name: 'Demo Dealer',
      email: 'dealer@solarkits.com',
      password: '123456',
      role: 'dealer',
      state: gj._id,
      city: cities[0]._id, // Added city
      district: districts[0]._id, // Added district
      phone: '8888888888',
      status: 'active',
      companyName: 'Solar Solutions Ltd',
      address: '123 Solar Street, Ahmedabad',
      gstin: '24AAAAA0000A1Z5'
    });

    console.log('Created Dealer User');

    // Franchisee
    const franchisee = await User.create({
      name: 'Demo Franchisee',
      email: 'franchise@solarkits.com', // Corrected email to match plan
      password: '123456',
      role: 'franchisee',
      state: mh._id,
      city: cities[4]._id, // Added city (Pune)
      district: districts[3]._id, // Added district (Pune)
      phone: '7777777777',
      status: 'active',
      companyName: 'Pune Solar Franchise',
      address: '456 Power Lane, Pune',
      gstin: '27AAAAA0000A1Z5'
    });

    console.log('Created Franchisee User');

    // 4. Products - COMMENTED OUT TO AVOID SCHEMA ISSUES
    /*
    const products = [];
    const panelCat = categories.find(c => c.name === 'Solar Panel');
    const invCat = categories.find(c => c.name === 'Inverter');
    const wUnit = units.find(u => u.symbol === 'W');
    const kwUnit = units.find(u => u.symbol === 'kW');

    // Create some panels
    for (let i = 0; i < 10; i++) {
        // ... previous code ...
    }
    console.log(`Created ${products.length} Products with Pricing`);
    */

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    process.exit(1);
  }
};

seedDatabase();
