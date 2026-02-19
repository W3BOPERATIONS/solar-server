

const BASE_URL = 'http://localhost:5000/api/buy-lead-settings';

const testBuyLeadSettings = async () => {
    console.log('Starting Buy Lead Settings Verification...');

    try {
        // 1. Create a new setting
        console.log('\n1. Testing Create Setting...');
        const newSetting = {
            name: "Test Setting " + Date.now(),
            category: "solar rooftop",
            subCategory: "residential",
            projectType: "3kw - 5kw",
            subProjectType: "on-grid",
            district: "north",
            areaType: "urban",
            numLeads: 10,
            totalKW: 50,
            totalRupees: 5000,
            perLeadRupees: 500
        };

        const createResponse = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSetting)
        });

        if (!createResponse.ok) {
            throw new Error(`Create failed: ${createResponse.statusText}`);
        }

        const createdSetting = await createResponse.json();
        console.log('✅ Create successful:', createdSetting._id);

        // 2. Get all settings
        console.log('\n2. Testing Get All Settings...');
        const getAllResponse = await fetch(BASE_URL);
        if (!getAllResponse.ok) {
            throw new Error(`Get All failed: ${getAllResponse.statusText}`);
        }
        const settings = await getAllResponse.json();
        console.log(`✅ Get All successful. Found ${settings.length} settings.`);

        // 3. Update the setting
        console.log('\n3. Testing Update Setting...');
        const updateData = {
            ...createdSetting,
            numLeads: 20,
            totalKW: 100,
            totalRupees: 10000
        };

        const updateResponse = await fetch(`${BASE_URL}/${createdSetting._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
            throw new Error(`Update failed: ${updateResponse.statusText}`);
        }

        const updatedSetting = await updateResponse.json();
        console.log('✅ Update successful. New numLeads:', updatedSetting.numLeads);

        // 4. Delete the setting
        console.log('\n4. Testing Delete Setting...');
        const deleteResponse = await fetch(`${BASE_URL}/${createdSetting._id}`, {
            method: 'DELETE'
        });

        if (!deleteResponse.ok) {
            throw new Error(`Delete failed: ${deleteResponse.statusText}`);
        }
        console.log('✅ Delete successful');

        console.log('\n🎉 All Buy Lead Settings tests passed!');

    } catch (error) {
        console.error('\n❌ Verification failed:', error.message);
    }
};

testBuyLeadSettings();
