const API_URL = 'http://localhost:5000/api/dealer-settings';
let stateId;

// Helper wrapper for fetch to mimic axios-like behavior
const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
    }
    return await res.json();
};

const runVerification = async () => {
    try {
        console.log('Starting Verification for Dealer Settings (using fetch)...');

        // 0. Get a State ID for Reference (Prerequisite)
        console.log('\n--- 0. Fetching State for Reference ---');
        try {
            const stateRes = await fetchJson('http://localhost:5000/api/locations/states');
            // Location API returns { success: true, data: [...] }
            const states = stateRes.data || stateRes;

            if (Array.isArray(states) && states.length > 0) {
                stateId = states[0]._id;
                console.log('Using State ID:', stateId);
            } else {
                console.error('CRITICAL: No states found. Cannot proceed with tests requiring State ID.');
                console.log('Response was:', JSON.stringify(stateRes).substring(0, 200));
                return;
            }
        } catch (e) {
            console.error('Error fetching states. Is the server running? Details:', e.message);
            return;
        }

        // 1. Dealer Plans
        console.log('\n--- 1. Testing Dealer Plans ---');
        // Create
        const planData = {
            name: 'Verification Plan',
            price: '9999',
            message: 'Test Plan',
            config: {
                kyc: { aadhar: true },
                eligibility: { kyc: true },
                coverage: { area: 'All India' },
                user: { userLimit: 5 },
                features: { adminApp: true },
                module: { lead: true },
                category: { solarPanel: true },
                quote: { quickQuote: true },
                fees: { signupFees: '500' },
                incentive: { totalIncentive: '1000' }
            }
        };
        const createPlanRes = await fetchJson(`${API_URL}/plans`, {
            method: 'POST',
            body: JSON.stringify(planData)
        });
        console.log('Create Plan: SUCCESS', createPlanRes._id);
        const planId = createPlanRes._id;

        // Get
        const getPlansRes = await fetchJson(`${API_URL}/plans`);
        console.log('Get Plans: SUCCESS', Array.isArray(getPlansRes) && getPlansRes.length > 0);

        // Update
        const updatePlanRes = await fetchJson(`${API_URL}/plans/${planId}`, {
            method: 'PUT',
            body: JSON.stringify({ ...planData, price: '8888' })
        });
        console.log('Update Plan: SUCCESS', updatePlanRes.price === '8888');

        // Delete
        await fetchJson(`${API_URL}/plans/${planId}`, { method: 'DELETE' });
        console.log('Delete Plan: SUCCESS');


        // 2. Dealer Rewards
        console.log('\n--- 2. Testing Dealer Rewards ---');
        // Create Product
        const rewardData = {
            type: 'product',
            name: 'Test Product',
            points: 500,
            description: 'Test Description'
        };
        const createRewardRes = await fetchJson(`${API_URL}/rewards`, {
            method: 'POST',
            body: JSON.stringify(rewardData)
        });
        console.log('Create Reward: SUCCESS', createRewardRes._id);
        const rewardId = createRewardRes._id;

        // Get
        const getRewardsRes = await fetchJson(`${API_URL}/rewards`);
        console.log('Get Rewards: SUCCESS', Array.isArray(getRewardsRes) && getRewardsRes.length > 0);

        // Update
        const updateRewardRes = await fetchJson(`${API_URL}/rewards/${rewardId}`, {
            method: 'PUT',
            body: JSON.stringify({ ...rewardData, points: 600 })
        });
        console.log('Update Reward: SUCCESS', updateRewardRes.points === 600);

        // Delete
        await fetchJson(`${API_URL}/rewards/${rewardId}`, { method: 'DELETE' });
        console.log('Delete Reward: SUCCESS');


        // 3. Dealer professions
        console.log('\n--- 3. Testing Dealer Professions ---');
        const profData = {
            state: stateId,
            name: 'Test Profession'
        };
        const createProfRes = await fetchJson(`${API_URL}/professions`, {
            method: 'POST',
            body: JSON.stringify(profData)
        });
        console.log('Create Profession: SUCCESS', createProfRes._id);
        const profId = createProfRes._id;

        // Get
        const getProfRes = await fetchJson(`${API_URL}/professions?stateId=${stateId}`);
        console.log('Get Professions: SUCCESS', Array.isArray(getProfRes) && getProfRes.length > 0);

        // Delete
        await fetchJson(`${API_URL}/professions/${profId}`, { method: 'DELETE' });
        console.log('Delete Profession: SUCCESS');


        // 4. Dealer Goals
        console.log('\n--- 4. Testing Dealer Goals ---');
        // Note: Need a district ID for valid goal, will fetch first if available or skip partial verify
        try {
            const districtsRes = await fetchJson(`http://localhost:5000/api/locations/districts?stateId=${stateId}`);
            // Location API returns object key 'data'
            const districts = districtsRes.data || districtsRes;

            if (Array.isArray(districts) && districts.length > 0) {
                const districtId = districts[0]._id;
                const goalData = {
                    name: 'Test Goal',
                    state: stateId,
                    district: districtId,
                    dealerCount: 5,
                    dueDate: '30 Days',
                    dealerType: 'District CPRM',
                    professions: [{ type: 'Electrician', goal: 2 }]
                };
                const createGoalRes = await fetchJson(`${API_URL}/goals`, {
                    method: 'POST',
                    body: JSON.stringify(goalData)
                });
                console.log('Create Goal: SUCCESS', createGoalRes._id);
                const goalId = createGoalRes._id;

                // Get
                const getGoalsRes = await fetchJson(`${API_URL}/goals`);
                console.log('Get Goals: SUCCESS', Array.isArray(getGoalsRes) && getGoalsRes.length > 0);

                // Delete
                await fetchJson(`${API_URL}/goals/${goalId}`, { method: 'DELETE' });
                console.log('Delete Goal: SUCCESS');
            } else {
                console.log('Skipping Goal creation: No districts found for state.');
            }
        } catch (e) {
            console.error('Error in Goal Verification:', e.message);
        }

        console.log('\n--- Verification Complete ---');

    } catch (error) {
        console.error('Verification Failed:', error.message);
    }
};

runVerification();
