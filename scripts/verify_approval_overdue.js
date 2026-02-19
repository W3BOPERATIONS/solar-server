const API_URL = 'http://localhost:5000/api/approval-overdue';

const runVerification = async () => {
    try {
        console.log('--- Starting Verification for Approval Overdue Rules ---');

        const headers = { 'Content-Type': 'application/json' };

        // 1. Seed Rules
        console.log('\n1. Seeding/Fetching Rules...');
        try {
            const seedRes = await fetch(`${API_URL}/seed`, { method: 'POST' });
            if (seedRes.ok) console.log('Seeded rules.');
            else console.log('Seeding skipped/failed:', seedRes.statusText);
        } catch (e) {
            console.log('Seeding error:', e.message);
        }

        let response = await fetch(API_URL);
        let rules = await response.json();
        console.log(`Fetched ${rules.length} rules.`);

        if (rules.length === 0) {
            console.error('FAILED: No rules found after seeding.');
            return;
        }

        // 2. Create a new rule
        console.log('\n2. Creating a new rule...');
        const testRule = {
            ruleName: 'Test Verification Rule',
            type: 'onboarding',
            key: `test_rule_${Date.now()}`,
            overdueDays: 7,
            status: 'Active'
        };
        response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(testRule)
        });

        if (!response.ok) throw new Error(`Create failed: ${response.statusText}`);
        const createdRule = await response.json();
        console.log('Created rule:', createdRule.ruleName);

        // 3. Update the rule
        console.log('\n3. Updating the rule...');
        response = await fetch(`${API_URL}/${createdRule._id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ overdueDays: 10, status: 'Inactive' })
        });

        if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
        const updatedRule = await response.json();
        console.log('Updated rule:', updatedRule.overdueDays === 10 && updatedRule.status === 'Inactive' ? 'SUCCESS' : 'FAILED');

        // 4. Delete the rule
        console.log('\n4. Deleting the rule...');
        response = await fetch(`${API_URL}/${createdRule._id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Delete failed: ${response.statusText}`);
        console.log('Deleted rule.');

        // 5. Verify deletion
        console.log('\n5. Verifying deletion...');
        response = await fetch(API_URL);
        const currentRules = await response.json();
        const exists = currentRules.find(r => r._id === createdRule._id);
        if (!exists) {
            console.log('SUCCESS: Rule successfully deleted.');
        } else {
            console.error('FAILED: Rule still exists.');
        }

        console.log('\n--- Verification Completed Successfully ---');

    } catch (error) {
        console.error('\nVERIFICATION FAILED:', error.message);
    }
};

runVerification();
