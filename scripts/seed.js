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
import Lead from '../models/Lead.js';
import Project from '../models/Project.js';
import SKU from '../models/SKU.js';
import InventoryItem from '../models/InventoryItem.js';

// Master Models
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Unit from '../models/Unit.js';
import ProjectType from '../models/ProjectType.js';
import ProductPrice from '../models/ProductPrice.js';
import Department from '../models/Department.js';
import Designation from '../models/Designation.js';

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
      Department, Designation, Lead, Project, SKU, InventoryItem
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

    console.log(`Created Locations (GJ)`);

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

    console.log(`Created Locations (MH)`);

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
    const industrialPT = await ProjectType.create({ name: 'Industrial' });

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
      city: cities[0]._id, 
      district: districts[0]._id, 
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
      email: 'franchise@solarkits.com',
      password: '123456',
      role: 'franchisee',
      state: mh._id,
      city: cities[4]._id, 
      district: districts[3]._id, 
      phone: '7777777777',
      status: 'active',
      companyName: 'Pune Solar Franchise',
      address: '456 Power Lane, Pune',
      gstin: '27AAAAA0000A1Z5'
    });

    console.log('Created Franchisee User');

    // 4. Products, SKUs, and Inventory
    const products = [];
    const panelCat = categories.find(c => c.name === 'Solar Panel');
    const invCat = categories.find(c => c.name === 'Inverter');
    const wUnit = units.find(u => u.symbol === 'W');
    const kwUnit = units.find(u => u.symbol === 'kW');
    const pcUnit = units.find(u => u.symbol === 'pc');

    // Generate SKUs and Products
    const skuList = [
      { name: 'Adani 540W Mono Perc', brand: brands[0], cat: panelCat, unit: wUnit, price: 12000, tech: 'Mono Perc', watt: 540 },
      { name: 'Waaree 550W Bifacial', brand: brands[1], cat: panelCat, unit: wUnit, price: 13500, tech: 'Bifacial', watt: 550 },
      { name: 'Tata Power 5kW Inverter', brand: brands[2], cat: invCat, unit: kwUnit, price: 45000, tech: 'String Inverter', watt: 5000 },
      { name: 'Havells 3kW Inverter', brand: brands[5], cat: invCat, unit: kwUnit, price: 28000, tech: 'String Inverter', watt: 3000 }
    ];

    for (const item of skuList) {
      const skuCode = `SKU-${Math.floor(Math.random() * 10000)}`;
      
      const sku = await SKU.create({
        skuCode: skuCode,
        description: item.name,
        brand: item.brand._id,
        category: item.cat.name,
        projectType: 'Residential',
        technology: item.tech,
        wattage: item.watt,
        status: true,
        createdBy: admin._id
      });

      // Create Product for this SKU (Available in Gujarat and Maharashtra)
      const locs = [
          { state: gj._id, city: cities[0]._id, district: districts[0]._id, cluster: clusters[0]._id }, // Ahmedabad
          { state: mh._id, city: cities[4]._id, district: districts[3]._id, cluster: clusters[6]._id }  // Pune
      ];

      for (const loc of locs) {
          const product = await Product.create({
            name: item.name,
            categoryId: item.cat._id,
            unitId: item.unit._id,
            skuId: sku._id,
            stateId: loc.state,
            cityId: loc.city,
            districtId: loc.district,
            description: `High quality ${item.name}`,
            status: true,
            createdBy: admin._id
          });
          products.push(product);

          // Create Product Price
          await ProductPrice.create({
              product: product._id,
              state: loc.state,
              cluster: loc.cluster,
              price: item.price,
              gst: 12, // 12% GST
              basePrice: item.price / 1.12,
              createdBy: admin._id
          });

          // Create Inventory/Stock
          await InventoryItem.create({
              itemName: item.name,
              brand: item.brand._id,
              category: item.cat.name,
              sku: sku.skuCode,
              quantity: rand(10, 100),
              price: item.price,
              state: loc.state,
              cluster: loc.cluster,
              district: loc.district,
              city: loc.city,
              minLevel: 5,
              maxLevel: 200,
              createdBy: admin._id
          });
      }
    }
    console.log(`Created SKUs, Products, Prices and Inventory`);

    // 5. Leads
    const leads = [];
    for (let i = 1; i <= 5; i++) {
        const lead = await Lead.create({
            name: `Lead Customer ${i}`,
            mobile: `987650000${i}`,
            email: `lead${i}@gmail.com`,
            district: districts[0]._id, // Ahmedabad
            city: clusters[0]._id, // Using Cluster ID as city per frontend logic comment
            solarType: 'Residential',
            kw: '3kW',
            billAmount: rand(2000, 5000),
            status: pick(['New', 'SurveyPending', 'SurveyCompleted', 'QuoteGenerated']),
            dealer: dealer._id,
            history: [{ action: 'Created', by: dealer._id }]
        });
        leads.push(lead);
    }
    console.log('Created Leads');

    // 6. Orders
    const orders = [];
    const orderStatuses = ['pending', 'confirmed', 'processing', 'delivered'];
    for (let i = 1; i <= 3; i++) {
        const orderedProduct = products[0]; // Just pick the first available product
        const qty = rand(1, 5);
        const price = 12000;
        const total = qty * price;

        const order = await Order.create({
            orderNumber: `ORD-${Date.now()}-${i}`,
            user: dealer._id,
            customer: {
                name: `Customer ${i}`,
                phone: `900000000${i}`,
                address: `Some Address ${i}`,
                state: gj._id,
                district: districts[0]._id,
                cluster: clusters[0]._id
            },
            items: [{
                product: orderedProduct._id,
                quantity: qty,
                price: price,
                total: total
            }],
            subTotal: total,
            totalAmount: total,
            status: pick(orderStatuses),
            paymentStatus: 'paid',
            deliveryStatus: 'assigned',
            installationStatus: 'pending'
        });
        orders.push(order);
    }
    console.log('Created Orders');

    // 7. Projects
    for (let i = 1; i <= 3; i++) {
        await Project.create({
            projectId: `PRJ-${Date.now()}-${i}`,
            projectName: `Project Solar ${i}`,
            category: 'Residential',
            projectType: 'On-Grid',
            totalKW: rand(3, 10),
            totalAmount: rand(150000, 500000),
            status: 'Work Start',
            dueDate: new Date(Date.now() + 86400000 * 30), // 30 days from now
            state: gj._id,
            district: districts[0]._id,
            cluster: clusters[0]._id,
            mobile: `910000000${i}`,
            consumerNumber: `CONS-${i}`,
            createdBy: dealer._id
        });
    }
    console.log('Created Projects');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error Details:');
      for (const field in error.errors) {
        console.error(`- ${field}: ${error.errors[field].message}`);
        console.error(`  Value: ${error.errors[field].value}`);
      }
    } else {
      console.error('Error seeding database:', error);
    }
    process.exit(1);
  }
};

seedDatabase();
