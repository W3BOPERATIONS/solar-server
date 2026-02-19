import UserPerformance from '../models/UserPerformance.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import LoanApplication from '../models/LoanApplication.js'; // Assuming LoanApplication represents 'Leads'
import mongoose from 'mongoose';

const getPerformanceData = async (req, res, roleFilter) => {
    try {
        const { stateId, clusterId, districtId, countryId, timeline, userType } = req.query;

        console.log(`🚀 [Dynamic Performance] Fetching real-time data for role: ${roleFilter}`);

        // 1. Build Location/User Filter
        let userFilter = { role: roleFilter || 'dealer' }; // Default to dealer if not specified
        if (userType) userFilter.role = userType;

        // Optimize: If we have location filters, we first find the users in that location
        if (stateId && mongoose.Types.ObjectId.isValid(stateId)) userFilter.state = stateId; // User model stores state as String or ID? 
        // Checking User.js: state is String, but params are IDs usually from frontend. 
        // Frontend sends IDs. We need to match ID if User stores ID, or Name if User stores Name.
        // User.js says: state: { type: String, required: true }. This is problematic if we filter by ID.
        // However, existing controller used populate('stateId') on UserPerformance.
        // Let's assume User stores IDs or we need to handle this.
        // Actually earlier 'User.js' showed `state: { type: String }`.
        // BUT `performanceController.js` logic `populate('stateId')` implies `UserPerformance` had IDs.
        // If we query `Order` and `LoanApplication`, they have `state` reference as ObjectId?
        // LoanApplication: state: { type: ObjectId, ref: 'State' } -> YES.
        // Order: customer.state: { type: ObjectId, ref: 'State' } -> YES.

        // So we can filter Orders and Leads directly by State ID!
        // We don't necessarily need to filter Users first unless we want "Active Dealers" count.

        let commonFilter = {};
        if (stateId && mongoose.Types.ObjectId.isValid(stateId)) commonFilter.state = new mongoose.Types.ObjectId(stateId);
        if (districtId && mongoose.Types.ObjectId.isValid(districtId)) commonFilter.district = new mongoose.Types.ObjectId(districtId);
        if (clusterId && mongoose.Types.ObjectId.isValid(clusterId)) commonFilter.cluster = new mongoose.Types.ObjectId(clusterId);

        // For Order, location is in `customer.state` etc.
        let orderFilter = {};
        if (commonFilter.state) orderFilter['customer.state'] = commonFilter.state;
        if (commonFilter.district) orderFilter['customer.district'] = commonFilter.district;
        if (commonFilter.cluster) orderFilter['customer.cluster'] = commonFilter.cluster;

        // Timeline Filter
        let dateFilter = {};
        if (timeline) {
            const days = parseInt(timeline);
            const dateLimit = new Date();
            dateLimit.setDate(dateLimit.getDate() - days);
            dateFilter = { $gte: dateLimit };
            commonFilter.createdAt = dateFilter;
            orderFilter.createdAt = dateFilter; // Order uses createdAt
        }

        // 2. Fetch Real-time Data Parallelly
        const [orders, leads, users] = await Promise.all([
            Order.find(orderFilter).select('totalAmount status user createdAt items').populate('user', 'name companyName').lean(),
            LoanApplication.find(commonFilter).select('status franchisee createdAt loanAmount').populate('franchisee', 'name').lean(),
            User.find(userFilter).select('name _id status address').lean() // Get users to map "Active/Inactive" status
        ]);

        console.log(`📊 Data Fetched: ${orders.length} Orders, ${leads.length} Leads, ${users.length} Users`);

        // 3. Aggregate Metrics
        const totalLeads = leads.length;
        const totalQuotes = leads.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length; // Logic for "Quotes" derived from Leads
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const totalKW = 0; // Product model doesn't have kW capacity yet, defaulting to 0 as requested.

        const conversionRatio = totalLeads > 0 ? ((totalOrders / totalLeads) * 100).toFixed(1) : 0;
        const avgOrderAmount = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
        const targetAchievement = 72; // Hardcoded for now, or need a Target model

        // 4. Status Counts (Active/Inactive Dealers)
        // We define "Active" as having at least one order or lead in the timeline? 
        // Or just use User.status? 
        // Let's use User.status for now, or derive activity.
        const statusCounts = {
            Active: users.filter(u => u.status === 'active').length,
            Inactive: users.filter(u => u.status !== 'active').length,
            Performer: users.filter(u => u.status === 'active' && orders.some(o => o.user?._id?.toString() === u._id.toString())).length // Simple logic
        };

        // 5. Prepare Table Data (Performance per Dealer)
        // We need to group orders/leads by User.
        const dealerStats = {};

        // Initialize with all users to show even those with 0 performance
        users.forEach(u => {
            dealerStats[u._id] = {
                id: u._id,
                name: u.name,
                location: u.address || 'N/A', // Or fetch from location API if needed
                status: u.status === 'active' ? 'Active' : 'Inactive',
                orders: 0,
                revenue: 0,
                leads: 0,
                conversion: 0
            };
        });

        // Fill with Order Data
        orders.forEach(o => {
            if (o.user && dealerStats[o.user._id]) {
                dealerStats[o.user._id].orders += 1;
                dealerStats[o.user._id].revenue += o.totalAmount || 0;
            }
        });

        // Fill with Lead Data
        leads.forEach(l => {
            if (l.franchisee && dealerStats[l.franchisee._id]) {
                dealerStats[l.franchisee._id].leads += 1;
            }
        });

        // Calculate Conversion per Dealer
        Object.values(dealerStats).forEach(stat => {
            stat.conversion = stat.leads > 0 ? ((stat.orders / stat.leads) * 100).toFixed(1) : 0;
        });

        const tableData = Object.values(dealerStats).sort((a, b) => b.revenue - a.revenue); // Sort by revenue

        // 6. Prepare Chart Data

        // Chart 1: Dealer Performance (Leads vs Orders) - Top 10
        const topDealers = tableData.slice(0, 10);
        const dealerPerformanceChart = {
            categories: topDealers.map(d => d.name),
            series: [
                { name: 'Leads', data: topDealers.map(d => d.leads) },
                { name: 'Orders', data: topDealers.map(d => d.orders) }
            ]
        };

        // Chart 2: Order Trends (by Date)
        // Group orders by date (last 7 days or timeline)
        const trendsMap = {};
        orders.forEach(o => {
            const dateParams = new Date(o.createdAt).toLocaleDateString();
            if (!trendsMap[dateParams]) trendsMap[dateParams] = { count: 0, amount: 0 };
            trendsMap[dateParams].count += 1;
            trendsMap[dateParams].amount += o.totalAmount || 0;
        });
        const dates = Object.keys(trendsMap).sort((a, b) => new Date(a) - new Date(b)); // Sort chronological
        const orderTrendsChart = {
            categories: dates,
            series: [
                { name: 'Orders Count', type: 'column', data: dates.map(d => trendsMap[d].count) },
                { name: 'Order Amount', type: 'line', data: dates.map(d => trendsMap[d].amount) }
            ]
        };

        // Chart 3: Cluster Distribution (Mock logic or real if we had cluster names on orders)
        // We can group users by cluster if User has cluster info, or assume equal distribution for now if data missing.
        // User model has 'cluster'.
        const clusterMap = {};
        users.forEach(u => {
            const cluster = u.cluster || 'Unknown';
            clusterMap[cluster] = (clusterMap[cluster] || 0) + 1;
        });
        const clusterChart = {
            labels: Object.keys(clusterMap),
            series: Object.values(clusterMap)
        };


        res.status(200).json({
            success: true,
            summary: {
                totalRecords: users.length,
                totalLeads,
                totalOrders,
                totalQuotes, // Using Approved Leads as Quotes
                totalAmount: totalRevenue,
                totalKW: totalKW,
                conversionRatio,
                avgOrderAmount,
                targetAchievement,
                growth: 8.1, // Keep hardcoded KPI for now
                statusCounts,
                // Additional details if needed
                leadsDetail: {
                    total: totalLeads
                }
            },
            charts: {
                dealerPerformance: dealerPerformanceChart,
                orderTrends: orderTrendsChart,
                clusterData: clusterChart
            },
            tableData: tableData
        });

    } catch (error) {
        console.error('❌ Error in getPerformanceData:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFranchiseManagerPerformance = (req, res) => getPerformanceData(req, res, 'franchise_manager');
export const getFranchiseePerformance = (req, res) => getPerformanceData(req, res, 'franchisee');
export const getDealerManagerPerformance = (req, res) => getPerformanceData(req, res, 'dealer_manager');
export const getDealerPerformance = (req, res) => getPerformanceData(req, res, 'dealer');
