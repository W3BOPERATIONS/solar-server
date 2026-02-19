
const API_URL = 'http://localhost:5000/api/projects';

// Mock data
const mockProject = {
    projectId: "TEST-" + Date.now(),
    projectName: "Test Verification Project Fetch " + Date.now(),
    category: "Residential",
    projectType: "On-Grid",
    totalKW: 15,
    status: "Consumer Registered",
    dueDate: new Date().toISOString()
};

async function verifyProjects() {
    console.log('--- Starting Project API Verification (Fetch) ---');
    try {
        // Helper wrappers
        const get = async (url) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`GET ${url} failed: ${res.statusText}`);
            return await res.json();
        };
        const post = async (url, body) => {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`POST ${url} failed: ${res.statusText}`);
            return await res.json();
        };
        const put = async (url, body) => {
            const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`PUT ${url} failed: ${res.statusText}`);
            return await res.json();
        };
        const del = async (url) => {
            const res = await fetch(url, { method: 'DELETE' });
            if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.statusText}`);
            return await res.json();
        };

        // 0. Fetch a valid state/cluster/district to use
        console.log('Fetching locations for valid references...');
        let stateId, clusterId, districtId;
        try {
            const states = await get('http://localhost:5000/api/locations/states');
            if (states.length > 0) {
                stateId = states[0]._id;
                console.log('Found State:', states[0].name);

                const clusters = await get(`http://localhost:5000/api/locations/clusters/${stateId}`);
                if (clusters.length > 0) {
                    clusterId = clusters[0]._id;
                    const districts = await get(`http://localhost:5000/api/locations/districts/${clusterId}`);
                    if (districts.length > 0) districtId = districts[0]._id;
                }
            }
        } catch (e) {
            console.log('Location fetch failed or empty, using fake IDs. Server might be down or empty.', e.message);
            // If server is down, everything will fail.
        }

        const projectPayload = {
            ...mockProject,
            state: stateId || "507f1f77bcf86cd799439011",
            cluster: clusterId || "507f1f77bcf86cd799439012",
            district: districtId || "507f1f77bcf86cd799439013"
        };

        // 1. Create Project
        console.log('Creating project...');
        const createRes = await post(API_URL, projectPayload);
        const projectId = createRes.data._id;
        console.log('✓ Created:', projectId);

        // 2. Fetch Projects
        console.log('Fetching all projects...');
        const getAllRes = await get(API_URL);
        const projects = getAllRes.data;
        console.log(`✓ Fetched ${projects.length} projects`);
        const found = projects.find(p => p._id === projectId);
        if (!found) throw new Error('Created project not found in list');

        // 3. Update Project
        console.log('Updating project status...');
        await put(`${API_URL}/${projectId}`, {
            status: "Work Start",
            statusStage: "work"
        });
        console.log('✓ Updated status');

        // 4. Get Stats
        console.log('Fetching stats...');
        const statsRes = await get(`${API_URL}/stats`);
        const stats = statsRes.data;
        console.log('✓ Stats:', stats);

        // 5. Delete Project
        console.log('Deleting project...');
        await del(`${API_URL}/${projectId}`);
        console.log('✓ Deleted');

        console.log('\n--- Verification Successful! ---');
    } catch (error) {
        console.error('✗ Verification Failed:', error.message);
        // If fetch fails, it throws TypeError
        if (error.cause) console.error('Cause:', error.cause);
    }
}

verifyProjects();
