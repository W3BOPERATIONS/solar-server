
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getDealerPerformance } from '../controllers/performanceController.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import LoanApplication from '../models/LoanApplication.js';

dotenv.config();

const verifyDashboard = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Create a Test Dealer
        const testDealer = await User.create({
            name: 'Test Dealer ' + Date.now(),
            email: `testdealer${Date.now()}@example.com`,
            password: 'password123',
            role: 'dealer',
            phone: '1234567890',
            state: 'Gujarat', // String as per schema
            status: 'active'
        });
        console.log(`👤 Created Test Dealer: ${testDealer.name} (${testDealer._id})`);

        // 2. Create Test Data
        // Create 2 Orders
        await Order.create({
            orderNumber: 'ORD-' + Date.now() + '-1',
            user: testDealer._id,
            totalAmount: 50000,
            status: 'pending',
            items: [],
            subTotal: 50000,
            tax: 0
        });
        await Order.create({
            orderNumber: 'ORD-' + Date.now() + '-2',
            user: testDealer._id,
            totalAmount: 75000,
            status: 'delivered',
            items: [],
            subTotal: 75000,
            tax: 0
        });
        console.log('📦 Created 2 Orders');

        // Create 3 Leads (LoanApplications)
        // 1 Approved, 2 Pending
        await LoanApplication.create({
            franchisee: testDealer._id,
            customerName: 'Customer 1',
            loanType: 'bank',
            loanAmount: 100000,
            status: 'Approved'
        });
        await LoanApplication.create({
            franchisee: testDealer._id,
            customerName: 'Customer 2',
            loanType: 'bank',
            loanAmount: 200000,
            status: 'Pending'
        });
        await LoanApplication.create({
            franchisee: testDealer._id,
            customerName: 'Customer 3',
            loanType: 'bank',
            loanAmount: 150000,
            status: 'Pending'
        });
        console.log('📄 Created 3 Leads (1 Approved)');

        // 3. Mock Request/Response for Controller
        const req = {
            query: {
                roleFilter: 'dealer' // Ensure defaults are handled
            }
        };

        const res = {
            status: (code) => ({
                json: (data) => {
                    console.log(`\n📊 API Response Status: ${code}`);
                    if (data.success) {
                        console.log('✅ API Success');
                        console.log('Summary:', JSON.stringify(data.summary, null, 2));

                        // Validations
                        const s = data.summary;
                        if (s.totalOrders >= 2 && s.totalAmount >= 125000) {
                            console.log('✅ Total Orders & Revenue Verified');
                        } else {
                            console.error('❌ Orders/Revenue mismatch');
                        }

                        if (s.totalLeads >= 3) {
                            console.log('✅ Total Leads Verified');
                        } else {
                            console.error('❌ Total Leads mismatch');
                        }

                        if (s.totalQuotes >= 1) { // Approved leads are quotes
                            console.log('✅ Total Quotes Verified');
                        } else {
                            console.error('❌ Total Quotes mismatch');
                        }
                    } else {
                        console.error('❌ API Failed:', data.message);
                    }
                }
            })
        };

        // 4. Call Controller
        console.log('\n🔄 Calling getDealerPerformance...');
        await getDealerPerformance(req, res);

        // Cleanup
        await User.deleteOne({ _id: testDealer._id });
        await Order.deleteMany({ user: testDealer._id });
        await LoanApplication.deleteMany({ franchisee: testDealer._id });
        console.log('\n🧹 Cleanup Completed');

    } catch (error) {
        console.error('❌ Verification Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyDashboard();
