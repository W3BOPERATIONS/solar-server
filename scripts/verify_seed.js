import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Models - using relative paths assuming script run from server dir
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Lead from '../models/Lead.js';
import Project from '../models/Project.js';
import SKU from '../models/SKU.js';
import InventoryItem from '../models/InventoryItem.js';
import ProductPrice from '../models/ProductPrice.js';

dotenv.config();

const verifySeeding = async () => {
  try {
    // The new URI includes the database name 'solarkit'
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for verification');

    const counts = {
      Users: await User.countDocuments(),
      Products: await Product.countDocuments(),
      Orders: await Order.countDocuments(),
      Leads: await Lead.countDocuments(),
      Projects: await Project.countDocuments(),
      SKUs: await SKU.countDocuments(),
      InventoryItems: await InventoryItem.countDocuments(),
      ProductPrices: await ProductPrice.countDocuments()
    };

    console.table(counts);
    process.exit(0);
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
};

verifySeeding();
