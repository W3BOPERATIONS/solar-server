# Solar ERP API Endpoints

Use this list to verify that your deployed server is working correctly.

## Core Endpoints
- **Health Check**: \`GET /api/health\` (Should return "Server is running")
- **Root**: \`GET /\` (Should return "Welcome to Solar ERP API")

## Auth & Users
- \`POST /api/auth/login\`
- \`POST /api/auth/register\`
- \`GET /api/users\`

## Core Business Logic
- **Products**: \`GET /api/products\`
- **Orders**: \`GET /api/orders\`
- **Deliveries**: \`GET /api/deliveries\`
- **Installations**: \`GET /api/installations\`
- **Projects**: \`GET /api/projects\`
- **Leads**: \`GET /api/leads\`

## Settings & Config
- **Admin Config**: \`GET /api/admin-config\`
- **Locations**: \`GET /api/locations\`
- **Masters**: \`GET /api/masters\`
- **Sales Settings**: \`GET /api/sales-settings\`

## HR & Organization
- **HR**: \`GET /api/hr\`
- **Organization**: \`GET /api/organization\`
- **Employees**: \`GET /api/users/employees\` (if applicable)

## Other Modules
- **Dashboard**: \`GET /api/dashboard/stats\` (Check your specific route path)
- **Vendors**: \`GET /api/vendors\`
- **Procurement**: \`GET /api/procurement-orders\`
- **Campaigns**: \`GET /api/campaigns\`
- **Inventory**: \`GET /api/inventory\`

## Verification Steps
1. Open your Vercel URL (e.g., \`https://solar-server.vercel.app\`).
2. You should see `{"message": "Welcome to Solar ERP API", "status": "Running"}`.
3. Navigate to \`/api/health\`.
4. Test a protected route (like \`/api/users\`) using Postman or curl with a valid JWT token.
