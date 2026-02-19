
const BASE_URL = 'http://localhost:5000/api';

const verify = async () => {
    try {
        console.log('--- Verifying Overdue Status Settings ---');

        // 1. Get Settings (should be default or empty initially)
        console.log('\n1. Fetching Settings for Cluster Department in Ahmedabad...');
        let response = await fetch(`${BASE_URL}/overdue-status-settings?department=Cluster Department&state=Gujarat&city=Ahmedabad`);

        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            console.log('Response text:', await response.text());
            return;
        }

        if (response.ok) {
            console.log('SUCCESS: Fetched settings:', data.modules ? data.modules.length + ' modules' : 'No modules');
        } else {
            console.error('FAILED: Fetch settings:', data);
        }

        // 2. Update Settings
        console.log('\n2. Updating Settings...');
        const newSettings = {
            department: 'Cluster Department',
            state: 'Gujarat',
            city: 'Ahmedabad',
            modules: [{
                id: 1,
                name: "Recruitment",
                overdueDays: 10, // Changed from default
                status: "Active",
                tasks: [{
                    id: 1,
                    name: "Recruit",
                    overdueDays: 5, // Changed from default
                    status: "Active"
                }]
            }]
        };

        response = await fetch(`${BASE_URL}/overdue-status-settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings)
        });

        try {
            data = await response.json();
        } catch (e) {
            console.error('Failed to parse JSON on PUT:', e);
            return;
        }

        if (response.ok) {
            console.log('SUCCESS: Updated settings. Modules:', data.modules && data.modules[0] ? data.modules[0].overdueDays : 'No modules returned');
        } else {
            console.error('FAILED: Update settings:', data);
        }

        // 3. Verify Persistence
        console.log('\n3. Verifying Persistence...');
        response = await fetch(`${BASE_URL}/overdue-status-settings?department=Cluster Department&state=Gujarat&city=Ahmedabad`);
        data = await response.json();

        if (response.ok && data.modules && data.modules[0] && data.modules[0].overdueDays === 10) {
            console.log('SUCCESS: Data persisted correctly!');
        } else {
            console.log('Expected 10, got:', data.modules ? data.modules[0].overdueDays : 'undefined');
            console.error('FAILED: Data persistence check failed.');
        }

    } catch (error) {
        console.error('ERROR:', error);
    }
};

verify();
