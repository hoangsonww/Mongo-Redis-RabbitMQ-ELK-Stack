const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const httpProxy = require('http-proxy');
const config = require('./config');

// MongoDB Connection
mongoose
    .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Redis Connection
const redisClient = redis.createClient({
    url: `redis://${config.redisHost}:${config.redisPort}`
});
redisClient.on('error', err => console.log('Redis Client Error', err));

// Round Robin Load Balancing
const serverInstances = [
    { url: 'http://localhost:5001' },
    { url: 'http://localhost:5002' },
    { url: 'http://localhost:5003' }
];

let currentInstanceIndex = 0;

function getNextServerInstance() {
    currentInstanceIndex = (currentInstanceIndex + 1) % serverInstances.length;
    return serverInstances[currentInstanceIndex];
}

// Express App Setup for Load Balancer
const loadBalancerApp = express();

// Create a proxy instance
const proxy = httpProxy.createProxyServer();

// Error handling for proxy
proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Internal Server Error');
});

// Load balancer middleware to route requests
loadBalancerApp.get('/', (req, res) => {
    const instance = getNextServerInstance();
    console.log(`Routing request to: ${instance.url}`);

    // Proxy the request to the selected server
    proxy.web(req, res, { target: instance.url });
});

// Start the load balancer
const loadBalancerPort = process.env.PORT || 3000;
loadBalancerApp.listen(loadBalancerPort, () => {
    console.log(`Load balancer listening on port ${loadBalancerPort}`);
});

// Simple Load Balancer Test
setInterval(() => {
    const instance = getNextServerInstance();
    console.log(`Sending test request to: ${instance.url}`);

    const http = require('http');
    http.get(instance.url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`Response from ${instance.url}:`, data);
        });
    });
}, 5000); // Send a request every 5 seconds
