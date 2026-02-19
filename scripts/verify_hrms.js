const API_URL = 'http://localhost:5000/api';
const EMAIL = 'admin@solarkits.com';
const PASSWORD = '123456';

async function verify() {
    try {
        console.log('1. Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful.');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Fetch Masters
        console.log('\n2. Fetching Masters...');
        const deptsRes = await fetch(`${API_URL}/masters/departments`, { headers });
        const depts = await deptsRes.json();
        const deptList = depts.data || depts;
        const departmentId = deptList[0]._id;
        console.log(`Department ID: ${departmentId}`);

        // 3. HRMS Settings (Payroll)
        console.log('\n3. Testing HRMS Settings (Payroll)...');
        const settingsPayload = {
            department: departmentId,
            position: 'Verification Manager',
            payroll: {
                payrollType: 'monthly',
                salary: '50000-60000', // Correct field name
                peCheck: true,
                peInput: '12',
                esicCheck: false,
                leaves: '2'
            },
            recruitment: { probation: '3' }
        };

        const settingsRes = await fetch(`${API_URL}/hrms-settings/settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify(settingsPayload)
        });
        console.log('Create Settings Status:', settingsRes.status);
        if (!settingsRes.ok) console.log(await settingsRes.text());

        // Verify Save
        const getSettingsUrl = new URL(`${API_URL}/hrms-settings/settings`);
        getSettingsUrl.searchParams.append('department', departmentId);
        getSettingsUrl.searchParams.append('position', 'Verification Manager');

        const getSettingsRes = await fetch(getSettingsUrl, { headers });
        const getSettingsData = await getSettingsRes.json();
        const settings = (getSettingsData.data && getSettingsData.data[0]) || getSettingsData[0];

        if (settings && settings.payroll && settings.payroll.salary === '50000-60000') {
            console.log('✅ Payroll Salary Saved Correctly:', settings.payroll.salary);
        } else {
            console.error('❌ Payroll Save Failed or Mismatch:', settings?.payroll);
        }

        // 4. Candidate Trainings (Fix Verification)
        console.log('\n4. Testing Candidate Trainings...');
        const trainingPayload = {
            department: departmentId,
            position: 'Verification Manager',
            sections: [
                {
                    // No 'id' field here, mimicking the sanitized frontend payload
                    name: 'Intro Section',
                    category: 'solarrooftop',
                    videos: [{ url: 'http://yt.com/123', type: 'youtube' }]
                }
            ]
        };

        const trainingRes = await fetch(`${API_URL}/hrms-settings/trainings`, {
            method: 'POST',
            headers,
            body: JSON.stringify(trainingPayload)
        });
        console.log('Create Training Status:', trainingRes.status);

        if (trainingRes.ok) {
            console.log('✅ Candidate Training Created Successfully (No ID cast error)');
        } else {
            console.error('❌ Candidate Training Failed:', await trainingRes.text());
        }

        console.log('\nVerification Complete!');

    } catch (error) {
        console.error('Verification Failed:', error.message);
    }
}

verify();
