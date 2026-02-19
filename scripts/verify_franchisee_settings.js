
async function verifyFranchiseeSettings() {
    const baseURL = 'http://localhost:5000/api/franchisee-manager-settings';

    // Test Data
    const testLocation = {
        state: 'TestState',
        cluster: 'TestCluster',
        district: 'TestDistrict'
    };

    const testSettings = {
        ...testLocation,
        traineeSettings: {
            appDemos: 15,
            ninetyDaysGoal: { target: 50, dueDays: 90 }
        },
        managerSettings: {
            appDemos: 20
        },
        videoSections: [
            { category: 'test', name: 'Test Section', videos: [] }
        ],
        examSettings: {
            passingMarks: 5,
            questions: [{ question: 'Q1?', options: { A: '1', B: '2', C: '3', D: '4' }, correctAnswer: 'A' }]
        }
    };

    try {
        console.log('1. Testing PUT (Update/Create Settings)...');
        const updateRes = await fetch(baseURL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testSettings)
        });

        if (updateRes.ok) {
            const data = await updateRes.json();
            console.log('✅ Settings updated successfully:', data.message || 'OK');
        } else {
            console.error('❌ Failed to update settings:', updateRes.status, await updateRes.text());
        }

        console.log('\n2. Testing GET (Fetch Settings)...');
        const queryParams = new URLSearchParams(testLocation).toString();
        const getRes = await fetch(`${baseURL}?${queryParams}`);

        if (getRes.ok) {
            const data = await getRes.json();
            console.log('✅ Settings fetched successfully');
            if (data.traineeSettings && data.traineeSettings.appDemos === 15) {
                console.log('✅ Data verification passed: appDemos = 15');
            } else {
                console.error('❌ Data verification failed: Expected 15, got', data.traineeSettings?.appDemos);
            }
        } else {
            console.error('❌ Failed to fetch settings:', getRes.status, await getRes.text());
        }

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}

verifyFranchiseeSettings();
