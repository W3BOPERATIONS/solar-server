import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import deliveryRoutes from './routes/deliveries.js';
import installationRoutes from './routes/installations.js';
import dashboardRoutes from './routes/dashboard.js';
import adminConfigRoutes from './routes/adminConfig.js';
import locationRoutes from './routes/locations.js';
import masterRoutes from './routes/masters.js';
import hrRoutes from './routes/hrRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import salesSettingsRoutes from './routes/salesSettingsRoutes.js';
import procurementRoutes from './routes/procurementRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import departmentModuleRoutes from './routes/departmentModuleRoutes.js';
import deliverySettingsRoutes from './routes/deliverySettingsRoutes.js';
import installerRoutes from './routes/installerRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import combokitRoutes from './routes/combokitRoutes.js';
import franchiseeRoutes from './routes/franchiseeRoutes.js';
import dealerSettingsRoutes from './routes/dealerSettingsRoutes.js';
import hrmsSettingsRoutes from './routes/hrmsSettingsRoutes.js';
import projectSettingsRoutes from './routes/projectSettingsRoutes.js';
import quoteSettingsRoutes from './routes/quoteSettingsRoutes.js';
import approvalOverdueRoutes from './routes/approvalOverdueRoutes.js';
import overdueTaskRoutes from './routes/overdueTaskRoutes.js';
import overdueStatusRoutes from './routes/overdueStatusRoutes.js';
import franchiseeManagerSettingRoutes from './routes/franchiseeManagerSettingRoutes.js';
import buyLeadSettingRoutes from './routes/buyLeadSettingRoutes.js';
import checklistRoutes from './routes/checklistRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import loanApplicationRoutes from './routes/loanApplicationRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import approvalsRoutes from './routes/approvalsRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';
import commissionRoutes from './routes/dealer/commissionRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import solarKitRoutes from './routes/solarKitRoutes.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/installations', installationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin-config', adminConfigRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/sales-settings', salesSettingsRoutes);
app.use('/api/procurement-orders', procurementRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/department-modules', departmentModuleRoutes);
app.use('/api/delivery-settings', deliverySettingsRoutes);
app.use('/api/installer', installerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/combokit', combokitRoutes);
app.use('/api/franchisee', franchiseeRoutes);
app.use('/api/dealer-settings', dealerSettingsRoutes);
app.use('/api/hrms-settings', hrmsSettingsRoutes);
app.use('/api/project-settings', projectSettingsRoutes);
app.use('/api/quote-settings', quoteSettingsRoutes);
app.use('/api/approval-overdue', approvalOverdueRoutes);
app.use('/api/overdue-task-settings', overdueTaskRoutes);
app.use('/api/overdue-status-settings', overdueStatusRoutes);
app.use('/api/franchisee-manager-settings', franchiseeManagerSettingRoutes);
app.use('/api/buy-lead-settings', buyLeadSettingRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/loan-applications', loanApplicationRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/approvals', approvalsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/dealer/commission', commissionRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/solar-kits', solarKitRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
