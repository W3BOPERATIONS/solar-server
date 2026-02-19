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
1. **Check Server & DB Status**:
   - Open your Vercel URL (e.g., \`https://solar-server.vercel.app\`).
   - You should see:
     \`\`\`json
     {
       "message": "Welcome to Solar ERP API",
       "status": "Running",
       "database": "Connected"
     }
     \`\`\`
   - If "database" says "Connected", your MongoDB connection is successful.
   - If it says "Disconnected" or "Connecting", check your `MONGODB_URI` environment variable in Vercel.

2. **Health Endpoint**:
   - Navigate to \`/api/health\`.
   - Response should include timestamp and DB status:
     \`\`\`json
     {
       "message": "Server is running",
       "database": "Connected",
       "timestamp": "2024-..."
     }
     \`\`\`

3. **Verify Data**:
   - To verify data is actually coming from the DB, test a **GET** route like \`/api/products\` or \`/api/users/employees\`.
   - **Note on Browser Testing**: Browsers always send **GET** requests when you type a URL.
     - \`/api/auth/login\` is a **POST** route. Accessing it in the browser will result in \`Cannot GET /api/auth/login\`. This is **expected behavior**.
     - To test login or other POST/PUT/DELETE methods, you must use a tool like **Postman**, **Thunder Client**, or your frontend application.
