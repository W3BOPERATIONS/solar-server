import axios from 'axios';

const API_URL = 'http://localhost:5000/api/checklist';

async function verifyChecklist() {
    console.log('--- Starting Checklist API Verification ---');
    try {
        // 1. Create a checklist template
        console.log('Creating checklist template...');
        const createRes = await axios.post(API_URL, {
            name: "Test Checklist " + Date.now(),
            category: "Location Setting",
            items: [
                { itemName: "Item 1", required: true, order: 0 },
                { itemName: "Item 2", required: false, order: 1 }
            ]
        });
        const checklistId = createRes.data._id;
        console.log('✓ Created:', checklistId);

        // 2. Fetch all checklists
        console.log('Fetching all checklists...');
        const getAllRes = await axios.get(API_URL);
        console.log(`✓ Fetched ${getAllRes.data.length} checklists`);

        // 3. Update completion status
        console.log('Updating completion status...');
        await axios.put(`${API_URL}/${checklistId}`, {
            completionStatus: "completed"
        });
        console.log('✓ Updated structure');

        // 4. Update module completion
        console.log('Updating module completion registry...');
        await axios.post(`${API_URL}/completion/update`, {
            moduleName: createRes.data.name,
            completed: true,
            progressPercent: 100,
            category: "Location Setting"
        });
        console.log('✓ Updated registry');

        // 5. Delete checklist
        console.log('Deleting checklist...');
        await axios.delete(`${API_URL}/${checklistId}`);
        console.log('✓ Deleted');

        console.log('\n--- Verification Successful! ---');
    } catch (error) {
        console.error('✗ Verification Failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

verifyChecklist();
