
async function verifyLocation() {
    try {
        const response = await fetch('http://localhost:5000/api/locations/states?isActive=true');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('States fetched successfully:', data.data.length);
        if (data.data.length > 0) {
            console.log('Sample State:', data.data[0].name);
        }
    } catch (error) {
        console.error('Error fetching states:', error.message);
    }
}

verifyLocation();
