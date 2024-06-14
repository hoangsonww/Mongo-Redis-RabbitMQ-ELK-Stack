const axios = require('axios');

async function testFlow() {
    try {
        // Test the case where user123 is not yet stored in Redis
        console.log('Fetching user123...');
        let response = await axios.get('http://localhost:3000/data/user123');
        console.log('Response (should be from MongoDB):', response.data);

        // Now user123 should be stored in Redis
        console.log('\nFetching user123 again...');
        response = await axios.get('http://localhost:3000/data/user123');
        console.log('Response (should be from Redis):', response.data);

        // Test the case where a key is non-existent in MongoDB (invalidKey)
        console.log('\nFetching non-existent key...');
        response = await axios.get('http://localhost:3000/data/invalidKey');
        console.log('Response (should be 404):', response.data);
    }
    catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testFlow();
