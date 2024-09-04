const config = require('./config');
const { Client } = require('pg');

// Create a new client instance
const client = new Client(config);

// Connect to the database
client
  .connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// Example query
client.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }
  client.end(); // Close the connection
});
