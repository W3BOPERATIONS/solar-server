import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Approval from '../models/Approval.js';
import connectDB from '../config/database.js';

dotenv.config();

const states = ['Gujarat', 'Maharashtra', 'Rajasthan', 'Punjab'];
const districtsMap = {
    'Gujarat': ['Rajkot', 'Ahmedabad', 'Surat'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur'],
    'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar']
};

const sampleData = [
    {
        type: 'recruitment',
        location: { state: 'Gujarat', district: 'Rajkot' },
        data: {
            name: 'Solar Technician Position',
            hiringPosition: 'Solar Technician',
            candidateName: 'Rahul Sharma',
            candidateMobile: '7654321098',
            candidateEmail: 'rahul@example.com',
            salaryBudget: '₹25,000 PM',
            ageCriteria: '25-35 years',
            gender: 'Male',
            education: 'Diploma in Electrical',
            experience: '3 years'
        },
        requestedBy: 'HR Mumbai',
        status: 'Pending'
    },
    {
        type: 'driver',
        location: { state: 'Maharashtra', district: 'Mumbai' },
        data: {
            driverName: 'Rajesh Kumar',
            licenseNo: 'GJ01-2020-123456',
            mobile: '9876543210',
            vehicleType: 'Light Commercial Vehicle',
            experience: '5 years',
            address: 'Mumbai, Maharashtra'
        },
        requestedBy: 'Logistics Manager',
        status: 'Pending'
    },
    {
        type: 'dealer',
        location: { state: 'Rajasthan', district: 'Jaipur' },
        data: {
            dealerName: 'Vikram Singh',
            businessName: 'Singh Solar Solutions',
            mobile: '7654321098',
            email: 'vikram@singhsolar.com',
            address: 'Jaipur, Rajasthan',
            gstNo: 'GSTIN-24ABCDE1234F1Z5'
        },
        requestedBy: 'Regional Manager',
        status: 'Pending'
    },
    {
        type: 'installer',
        location: { state: 'Punjab', district: 'Amritsar' },
        data: {
            installerName: 'Rohit Mehta',
            businessName: 'Mehta Solar Installations',
            mobile: '9876543210',
            email: 'rohit@mehtasolar.com',
            address: 'Amritsar, Punjab',
            certification: 'Solar Installation Certified',
            experience: '5 years'
        },
        requestedBy: 'Installation Manager',
        status: 'Pending'
    },
    {
        type: 'combokit',
        location: { state: 'Gujarat', district: 'Ahmedabad' },
        data: {
            name: 'Solar ComboKit A',
            solarpanelbrand: 'Adani Solar',
            panelsku: 'ADN-MP-450W',
            inverter: 'String Inverter',
            invertorsku: 'SMA-5KW',
            boskitbrand: 'Luminous',
            boskitsku: 'LUM-BOS-001',
            cptype: 'Enterprise',
            district: 'Ahmedabad'
        },
        requestedBy: 'Sales Team',
        status: 'Pending'
    }
];

const seedApprovals = async () => {
    try {
        await connectDB();
        console.log('Database connected successfully');

        await Approval.deleteMany({});
        console.log('Cleared existing approvals');

        await Approval.insertMany(sampleData);
        console.log('✅ Seeded approval data successfully');

        console.log('Fetched approvals records: ' + sampleData.length);

        process.exit();
    } catch (error) {
        console.error('Error seeding approvals:', error);
        process.exit(1);
    }
};

seedApprovals();
