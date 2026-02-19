import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LoanApplication from '../models/LoanApplication.js';
import User from '../models/User.js';
import State from '../models/State.js';
import Cluster from '../models/Cluster.js';
import District from '../models/District.js';

dotenv.config();

const seedLoans = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solarkit');
        console.log('Connected to MongoDB');

        // Clear existing loans
        await LoanApplication.deleteMany({});

        let states = await State.find().limit(2);
        if (states.length === 0) {
            console.log('No states found, creating fallback Gujarat state...');
            const newState = await State.create({
                name: 'Gujarat',
                code: 'GJ'
            });
            states = [newState];
        }

        let franchisee = await User.findOne({ role: /franchisee/i });
        if (!franchisee) {
            console.log('No franchisee found, creating one...');
            franchisee = await User.create({
                name: 'Seed Franchisee',
                email: 'franchisee@seed.com',
                password: 'password123',
                role: 'franchisee',
                phone: '9988776655',
                state: states[0].name,
                status: 'approved'
            });
        }

        // Ensure at least one cluster and district exists for the first state
        let cluster = await Cluster.findOne({ state: states[0]._id });
        if (!cluster) {
            console.log('No cluster found, creating one...');
            cluster = await Cluster.create({
                name: 'Ahmedabad Cluster',
                state: states[0]._id
            });
        }

        let district = await District.findOne({ state: states[0]._id });
        if (!district) {
            console.log('No district found, creating one...');
            district = await District.create({
                name: 'Ahmedabad',
                state: states[0]._id
            });
        }

        const loans = [
            {
                franchisee: franchisee._id,
                customerName: 'Rajesh Kumar',
                customerPhone: '9876543210',
                loanType: 'bank',
                bankName: 'State Bank of India',
                loanAmount: 450000,
                disbursedAmount: 225000,
                applicationDate: '2024-01-15',
                status: 'Approved',
                projectType: 'Residential',
                category: 'Solar Rooftop',
                state: states[0]._id,
                cluster: cluster._id,
                district: district._id
            },
            {
                franchisee: franchisee._id,
                customerName: 'Priya Sharma',
                customerPhone: '9876543211',
                loanType: 'bank',
                bankName: 'HDFC Bank',
                loanAmount: 650000,
                disbursedAmount: 325000,
                applicationDate: '2024-02-20',
                status: 'Pending',
                projectType: 'Commercial',
                category: 'Solar Rooftop',
                state: states[0]._id,
                cluster: cluster._id,
                district: district._id
            },
            {
                franchisee: franchisee._id,
                customerName: 'Sanjay Gupta',
                customerPhone: '9876543212',
                loanType: 'private',
                lenderName: 'Bajaj Finance',
                lenderType: 'NBFC',
                loanAmount: 280000,
                disbursedAmount: 140000,
                interestRate: '12.5%',
                tenure: 36,
                applicationDate: '2024-01-20',
                status: 'Active',
                projectType: 'Residential',
                category: 'Solar Pump',
                state: states[0]._id,
                cluster: cluster._id,
                district: district._id
            }
        ];

        await LoanApplication.insertMany(loans);
        console.log('Successfully seeded loan applications');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedLoans();
