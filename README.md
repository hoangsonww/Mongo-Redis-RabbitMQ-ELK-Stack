# Node.js, MongoDB, Redis, and RabbitMQ Test Project

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

---
   
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
---