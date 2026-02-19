import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const clusterId = '65ca3a8c5e6f3a1d4c8e9b2a';

async function verifyLoanDynamic() {
    console.log('--- Starting Loan Setting Verification ---');

    try {
        // First check if server is reachable
        try {
            await axios.get('http://localhost:5000/api/health');
            console.log('Server is reachable');
        } catch (e) {
            console.error('SERVER NOT REACHABLE. Please ensure it is running on port 5000.');
            return;
        }

        // 1. Create a Loan Rule
        console.log('1. Creating Loan Rule...');
        const createRes = await axios.post(`${API_URL}/loan`, {
            clusterId,
            projectType: 'residential',
            interestRate: 8.5,
            tenureMonths: 60,
            maxAmount: 500000,
            fields: [{ name: 'min_cibil', selected: true }]
        });
        console.log('Rule created:', createRes.data._id);

        // 2. Fetch Loan Rules
        console.log('2. Fetching Loan Rules...');
        const fetchRes = await axios.get(`${API_URL}/loan?clusterId=${clusterId}`);
        console.log('Fetched rules count:', fetchRes.data.length);

        // 3. Update Loan Rule
        console.log('3. Updating Loan Rule...');
        const updateRes = await axios.put(`${API_URL}/loan/${createRes.data._id}`, {
            interestRate: 9.0
        });
        console.log('Updated interest rate:', updateRes.data.interestRate);

        // 4. Delete Loan Rule
        console.log('4. Deleting Loan Rule...');
        await axios.delete(`${API_URL}/loan/${createRes.data._id}`);
        console.log('Rule deleted successfully');

        console.log('--- Verification Complete ---');
    } catch (error) {
        console.error('Verification failed:', error.response?.data || error.message);
    }
}

verifyLoanDynamic();
