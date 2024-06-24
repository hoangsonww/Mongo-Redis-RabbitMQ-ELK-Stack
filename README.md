# Node.js, MongoDB, Redis, Postgres, ELK, and RabbitMQ Sample Project

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
  - [MongoDB](#mongodb)
  - [Redis-Mongo-Flow](#redis-mongo-flow)
  - [RabbitMQ](#rabbitmq)
  - [Round-Robin Load Balancing Algorithm](#round-robin-load-balancing-algorithm)
  - [ELK Stack](#elk-stack)
- [Getting Started](#getting-started)
- [Special Notes](#special-notes)
- [Recommended GUI Tools](#recommended-gui-tools)
- [License](#license)
- [Author](#author)

## Introduction

This project is a sample Node.js Backend project that demonstrates how to connect to MongoDB, Redis, PostgreSQL, and RabbitMQ. It also demonstrates how these services can be used and interact with each other in a Node.js application.

## Features

### MongoDB
- **MongoDB**: The project connects to a MongoDB database and performs CRUD operations.
  - **Aggregation**: The project demonstrates how to use MongoDB's aggregation framework to perform complex queries, such as:
    - Grouping data by a field.
    - Filtering data based on a condition (lookup, match, project, etc.)
    - Sorting data.
    - Unwinding arrays.

### Redis-Mongo-Flow
- **Redis-Mongo-Flow**: The project also demonstrates how to use Redis as a cache layer for MongoDB.
  - This is done by first checking if the data exists in Redis. 
  - If it does, the data is retrieved from Redis. 
  - If it doesn't, the data is retrieved from MongoDB and stored in Redis.
  - This is done to reduce the number of queries to the database, thereby reducing the load on the database.

### RabbitMQ
- **RabbitMQ**: The project also demonstrates how to connect to RabbitMQ and publish and consume messages.
  - The project uses RabbitMQ to publish a message and consume it.
  - The message is published to a queue and consumed by a consumer.
  - This is done to demonstrate how to use RabbitMQ for asynchronous communication between services.

### Round-Robin Load Balancing Algorithm
- **Round-Robin Load Balancing Algorithm**: The project also demonstrates how to use Redis to implement round-robin load balancing.
  - The project has two routes, `/api/test/route1` and `/api/test/route2`.
  - The project uses Redis to store the number of requests to each route.
  - The project uses round-robin load balancing to distribute the requests evenly between the two routes.

### ELK Stack
- **ELK Stack**: The project also demonstrates how to use the ELK stack (Elasticsearch, Logstash, Kibana) for logging.
  - The project uses Logstash to parse the log messages and send them to Elasticsearch.
  - Elasticsearch will then index the log messages for searching and analysis.
  - (Optional) You can also enhance the project by using Kibana to visualize the log data.

## Project Structure

The project has the following structure:

```
node-mongo-redis-project
├── index.js         # Main entry point for the project for testing the connections
├── config.js        # Configuration file for the project
├── package.json     # NPM package file
├── publish.js       # Script to publish a message to RabbitMQ
├── README.md
├── round-robin
│   ├── index.js     # Core logic for round-robin load balancing & for testing the algorithm
│   └── config.js    # Configuration file for Redis
├── routes
│   └── test.js      # Sample routes for the project
├── redis-mongo-flow
│   ├── app.js       # Core logic of the Redis-Mongo flow
│   ├── config.js    # Configuration file for Redis and MongoDB         
│   ├── seed.js      # Script to populate MongoDB with sample data
│   └── test.js      # Script to test the Redis-Mongo flow
├── elk-stack
│   ├── index.js     # Core logic for logging using the ELK stack & testing the stack
└── postgresql
    └── app.js       # Core logic for PostgreSQL
    └── config.js    # Configuration file for PostgreSQL
```

## Getting Started
To **get started**, run the following commands:

1. Start the MongoDB service:
    ```bash
    brew services start mongodb/brew/mongodb-community
    ```

2. Start the Redis service:
    ```bash
    redis-server
    ```
   
3. `cd` into the project directory:
    ```bash
   cd node-mongo-redis-project
   ```
   
4. Start the Node.js server:
    ```bash
    node index.js
    ```
   
5. (Optional) Test the RabbitMQ service by publishing a message (go to another terminal window):
    ```bash
    node publish.js
    ```
   Verify that the message is received by the consumer by going to the terminal that is running the Node.js server (the one you started the index.js script).
   You should receive the following messages in the terminal:
   ```bash
    Server running on port 5000
    Visit http://localhost:5000/ to test the connection.
    Redis Connected
    MongoDB Connected
    Redis Test: Hello from Redis
    RabbitMQ Connected
    [*] Waiting for messages in task_queue. To exit press CTRL+C
    [x] Received 'This is a test message!'
    ```
   
6. Visit [http://localhost:5000/](http://localhost:5000/) to test the connection. Also test the routes by visiting the following URLs: [http://localhost:5000/api/test/route1](http://localhost:5000/api/test/route1) and [http://localhost:5000/api/test/route2](http://localhost:5000/api/test/route2).

7. (Optional) Test the Round-Robin Load Balancing Algorithm:
    ```bash
    cd round-robin
    node index.js
    ```
   
8. (Optional) Test the ELK Stack:
    ```bash
    cd elk-stack
    node index.js
    ```

## Special Notes

**Note:** Before you get started, be sure to have the following installed on your machine by running the following commands (MacOS):

1. Install Homebrew:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
   
2. Install MongoDB:
    ```bash
    brew tap mongodb/brew
    brew install mongodb-community
    ```
   
3. Install Redis:
    ```bash
    brew install redis
    ```
   
4. Install RabbitMQ:
    ```bash
    brew install rabbitmq
    ```
   
5. Install Node.js:
    ```bash
    brew install node
    ```
   
6. Install NPM:
    ```bash
    brew install npm
    ```
   Then `cd` into the project directory and run:
    ```bash
    npm init -y
    ```
   
7. Install the required packages:
    ```bash
    npm install
    ```
 
## Recommended GUI Tools

- **MongoDB Compass**: A GUI tool for MongoDB that allows you to interact with your MongoDB databases.
- **RedisInsight**: A GUI tool for Redis that allows you to interact with your Redis databases.
- **RabbitMQ Management Plugin**: A plugin for RabbitMQ that provides a web-based management interface for RabbitMQ.
- **Postico**: A GUI tool for PostgreSQL that allows you to interact with your PostgreSQL databases.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Feel free to use this project for your own learning purposes or as a reference for your own projects!

## Author

- **Son Nguyen** - [GitHub](https://github.com/hoangsonww)
- **Email**: [info@movie-verse.com](mailto:info@movie-verse.com)

---
