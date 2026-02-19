import Country from '../models/Country.js';
import State from '../models/State.js';
import Cluster from '../models/Cluster.js';
import District from '../models/District.js';
import User from '../models/User.js';
import Department from '../models/Department.js';

// Helper to format node for Google Charts
const formatNode = (v, f, type) => {
    let color = 'black';
    if (type === 'Country') color = 'green';
    if (type === 'State') color = 'blue';
    if (type === 'Cluster') color = 'orange';
    if (type === 'District') color = 'red';

    return {
        v: v,
        f: `${f}<div style="color:${color}; font-style:italic">${type}</div>`
    };
};

export const getChartData = async (req, res, next) => {
    try {
        const { countryId } = req.query;

        // 1. Fetch all hierarchy data
        // If countryId is provided, filter States by it.
        // If not, maybe just show all or default to first country?
        // For now, let's fetch everything linked to the selected Country (or all if none).

        const countryQuery = countryId ? { _id: countryId } : {};
        const countries = await Country.find(countryQuery).lean();

        if (countries.length === 0) {
            return res.json({ success: true, data: [['Name', 'Manager', 'ToolTip']] });
        }

        const selectedCountryIds = countries.map(c => c._id);
        const states = await State.find({ country: { $in: selectedCountryIds } }).lean();
        const stateIds = states.map(s => s._id);

        // Hierarchy: State -> District -> Cluster
        // Note: DB has State -> City -> District -> Cluster, but we skip City for the chart to keep it clean/match original UI depth if desired.
        // Or we can just link District to State directly since District has stateId.

        const districts = await District.find({ state: { $in: stateIds } }).lean();

        // Fetch clusters for these districts
        // Cluster has district field.
        const districtIds = districts.map(d => d._id);
        const clusters = await Cluster.find({ district: { $in: districtIds } }).lean();

        // 2. Build Chart Data Array
        // Format: ['Name', 'Manager', 'ToolTip']
        const chartData = [['Name', 'Manager', 'ToolTip']];

        // Add Countries
        countries.forEach(country => {
            chartData.push([
                formatNode(country.name, country.name, 'Country'),
                '',
                'Country'
            ]);
        });

        // Add States
        states.forEach(state => {
            const parentConfig = countries.find(c => c._id.toString() === state.country.toString());
            if (parentConfig) {
                chartData.push([
                    formatNode(state.name, state.name, 'State'),
                    parentConfig.name,
                    'State'
                ]);
            }
        });

        // Add Districts (Parent: State)
        districts.forEach(district => {
            // District has state field.
            const parentConfig = states.find(s => s._id.toString() === district.state.toString());
            if (parentConfig) {
                chartData.push([
                    formatNode(district.name, district.name, 'District'),
                    parentConfig.name,
                    'District'
                ]);
            }
        });

        // Add Clusters (Parent: District)
        clusters.forEach(cluster => {
            const parentConfig = districts.find(d => d._id.toString() === cluster.district.toString());
            if (parentConfig) {
                chartData.push([
                    formatNode(cluster.name, cluster.name, 'Cluster'),
                    parentConfig.name,
                    'Cluster'
                ]);
            }
        });
        console.log(`Backend: Fetched ${chartData.length} records for Org Chart`);

        res.json({
            success: true,
            data: chartData
        });

    } catch (err) {
        next(err);
    }
};

export const getEmployees = async (req, res, next) => {
    try {
        const { department, cluster, district, country } = req.query;

        const query = { role: { $in: ['employee', 'dealer', 'franchisee'] } }; // Fetch relevant roles. Currently 'employee' was added to enum.

        if (department) {
            // Need to find department ID by Name if passed as name, or pass ID from frontend
            // Assuming frontend passes Name to match current filter logic, or we update frontend to pass ID.
            // Let's try to match by name if it's a string, or ID.
            // For now, let's assume the frontend will be refactored to use names or we lookup.
            // Simpler: Frontend filters by string name in UI.
            // If we want DB filtering, we need to match User's department field.
            // The User model has `department` as ObjectId ref.
            // So we need to look up the Department ID first.
            const deptDoc = await Department.findOne({ name: department });
            if (deptDoc) {
                query.department = deptDoc._id;
            }
        }

        if (cluster) query.cluster = cluster; // User model has string for now? Check User.js
        // User.js: cluster: { type: String, default: null } -> It is a String!
        // User.js: district: { type: String, default: null } -> It is a String!
        // This makes it easy.

        if (district) query.district = district;
        if (country) {
            // User doesn't have country field directly usually, or state?
            // User has `state`. We might need to filter by state -> country.
            // For now, ignore country filter on employees or implement if needed.
        }

        const employees = await User.find(query).populate('department').lean();

        // Transform to required format if needed, or send as is and map in frontend.
        // Frontend expects: joiningDate, workingDays, absentDays, efficiency, productivity, overdueTasks
        // User model has: totalOrders, etc.
        // We might need to calculate or mock these "performance" metrics if they don't exist in DB, 
        // OR we should have a `UserPerformance` model?
        // Checked file list: `UserPerformance.js` exists!

        // Let's fetch performance for these users.
        const employeeIds = employees.map(e => e._id);
        const performances = await import('../models/UserPerformance.js').then(m => m.default.find({ user: { $in: employeeIds } }).lean());

        const data = employees.map(emp => {
            const perf = performances.find(p => p.user.toString() === emp._id.toString()) || {};

            return {
                name: emp.name,
                department: emp.department?.name || 'N/A',
                cluster: emp.cluster || 'N/A',
                district: emp.district || 'N/A',
                joiningDate: emp.createdAt ? new Date(emp.createdAt).toISOString().split('T')[0] : 'N/A',
                workingDays: perf.workingDays || 0,
                absentDays: perf.absentDays || 0,
                efficiency: perf.efficiency || 0,
                productivity: perf.productivity || 0,
                overdueTasks: perf.overdueTasks || 0
            };
        });

        console.log(`Backend: Fetched ${data.length} employees`);

        res.json({
            success: true,
            data
        });

    } catch (err) {
        next(err);
    }
};

export const getStats = async (req, res, next) => {
    try {
        const states = await State.find().lean();
        // We need counts of clusters and districts per state.

        const stats = await Promise.all(states.map(async (state) => {
            const clusterCount = await Cluster.countDocuments({ state: state._id });
            // District is linked to Cluster usually, or can be linked to State directly?
            // Model: District has state field? YES.
            const districtCount = await District.countDocuments({ state: state._id });

            return {
                name: state.name,
                clusters: clusterCount,
                districts: districtCount
            };
        }));

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        next(err);
    }
};
