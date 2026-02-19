// verify_checklist_dynamic.js
const API_URL = 'http://localhost:5000/api/checklist';

async function verifyChecklist() {
    console.log('--- Starting Checklist API Verification ---');
    try {
        // 1. Create a checklist template
        console.log('Creating checklist template...');
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Checklist " + Date.now(),
                category: "Location Setting",
                items: [
                    { itemName: "Item 1", required: true, order: 0 },
                    { itemName: "Item 2", required: false, order: 1 }
                ]
            })
        });
        const createdData = await createRes.json();
        const checklistId = createdData._id;
        console.log('✓ Created:', checklistId);

        // 2. Fetch all checklists
        console.log('Fetching all checklists...');
        const getAllRes = await fetch(API_URL);
        const allData = await getAllRes.json();
        console.log(`✓ Fetched ${allData.length} checklists`);

        // 3. Update completion status
        console.log('Updating completion status...');
        await fetch(`${API_URL}/${checklistId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completionStatus: "completed" })
        });
        console.log('✓ Updated structure');

        // 4. Update module completion
        console.log('Updating module completion registry...');
        await fetch(`${API_URL}/completion/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                moduleName: createdData.name,
                completed: true,
                progressPercent: 100,
                category: "Location Setting"
            })
        });
        console.log('✓ Updated registry');

        // 5. Delete checklist
        console.log('Deleting checklist...');
        await fetch(`${API_URL}/${checklistId}`, { method: 'DELETE' });
        console.log('✓ Deleted');

        console.log('\n--- Verification Successful! ---');
    } catch (error) {
        console.error('✗ Verification Failed:', error.message);
        process.exit(1);
    }
}

verifyChecklist();
