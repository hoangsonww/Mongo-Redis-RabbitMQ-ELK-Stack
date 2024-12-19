# **Budget Management Backend API**

Welcome to the **Budget Management API**, a robust backend application designed to manage budgets, expenses, users, orders, notifications, and more. This API integrates cutting-edge technologies and supports advanced features like gRPC, GraphQL, WebSockets, Elasticsearch, PostgreSQL, MySQL, Redis, RabbitMQ, Kafka, and Docker. Below is a comprehensive guide to setting up, running, and utilizing this API.

## **Table of Contents**

1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Setup Instructions](#setup-instructions)
4. [Available Endpoints](#available-endpoints)
5. [Schemas](#schemas)
6. [Features and Integrations](#features-and-integrations)
7. [CLI Usage](#cli-usage)
8. [Swagger Documentation](#swagger-documentation)
9. [Environment Variables](#environment-variables)
10. [Running with Docker](#running-with-docker)
11. [Kubernetes Deployment](#kubernetes-deployment)
12. [GraphQL Integration](#graphql-integration)
13. [gRPC Integration](#grpc-integration)
14. [Testing](#testing)
15. [Contributing](#contributing)

## **Overview**

The Budget Management API is designed to handle complex budget management requirements, including:

- Budget and expense tracking.
- User management and authentication.
- Real-time notifications via WebSockets.
- Asynchronous task handling using RabbitMQ and Kafka.
- Advanced search capabilities with Elasticsearch.
- CLI operations for direct interaction with the system.
- Compatibility with modern cloud environments like Docker and Kubernetes.

## **Technologies Used**

| **Technology**      | **Purpose**                                               |
|---------------------|-----------------------------------------------------------|
| **Node.js**         | Core application framework.                               |
| **Express.js**      | Web application framework for building APIs.              |
| **MongoDB**         | Primary NoSQL database for managing budgets and expenses. |
| **PostgreSQL**      | Relational database for transaction logs.                 |
| **MySQL**           | Optional relational database support.                     |
| **Redis**           | In-memory database for caching.                           |
| **RabbitMQ**        | Message broker for task queuing.                          |
| **Kafka**           | Distributed event streaming platform.                     |
| **Elasticsearch**   | Advanced search engine for querying data.                 |
| **gRPC**            | High-performance remote procedure call framework.         |
| **GraphQL**         | Query language for fetching and manipulating data.        |
| **WebSocket**       | Real-time communication for notifications.                |
| **Swagger/OpenAPI** | API documentation and testing.                            |
| **Docker**          | Containerization for easy deployment.                     |
| **Kubernetes**      | Orchestrating containerized applications at scale.        |
| **Nginx**           | Reverse proxy and load balancer.                          |

## **Setup Instructions**

### Prerequisites

- Node.js (>= 16)
- Docker and Docker Compose (if using containerized setup)
- MongoDB, PostgreSQL, MySQL, RabbitMQ, Redis, and Elasticsearch services.

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/budget-manager-api.git
   cd budget-manager-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
  - Create a `.env` file in the root directory:
    ```env
    MONGO_DB_URI=mongodb://localhost:27017/budget_manager
    POSTGRES_URI=postgres://user:password@localhost:5432/budget_manager
    REDIS_URL=redis://localhost:6379
    RABBITMQ_URL=amqp://localhost
    KAFKA_BROKER=localhost:9092
    JWT_SECRET=your_secret_key
    ```
  - Replace placeholders with your actual configuration.

4. Start the application:
   ```bash
   npm start
   ```

5. Access the application:
  - API: `http://localhost:3000`
  - Swagger: `http://localhost:3000/docs`

## **Available Endpoints**

| **Endpoint**           | **Method** | **Description**                          |
|------------------------|------------|------------------------------------------|
| `/api/auth/register`   | POST       | Register a new user.                     |
| `/api/auth/login`      | POST       | Login and receive a JWT token.           |
| `/api/users/profile`   | GET        | Get the authenticated user's profile.    |
| `/api/budgets`         | GET        | Get all budgets.                         |
| `/api/budgets`         | POST       | Create a new budget.                     |
| `/api/expenses`        | GET        | Get all expenses.                        |
| `/api/expenses`        | POST       | Add a new expense.                       |
| `/api/orders`          | GET        | Get all orders.                          |
| `/api/orders`          | POST       | Create a new order.                      |
| `/api/graphql`         | POST       | Perform a GraphQL query.                 |
| `/api/notifications`   | POST       | Send a real-time notification.           |
| `/api/search/expenses` | POST       | Search for expenses using Elasticsearch. |

## **Schemas**

### **User**
| **Field**   | **Type** | **Description**             |
|-------------|----------|-----------------------------|
| `username`  | String   | Unique username.            |
| `email`     | String   | Unique email address.       |
| `password`  | String   | Hashed password.            |

### **Budget**
| **Field**   | **Type** | **Description**             |
|-------------|----------|-----------------------------|
| `name`      | String   | Budget name.                |
| `limit`     | Number   | Budget limit.               |

### **Expense**
| **Field**  | **Type** | **Description**              |
|------------|----------|------------------------------|
| `budgetId` | String   | ID of the associated budget. |
| `amount`   | Number   | Expense amount.              |

## **Features and Integrations**

### **gRPC**
- High-performance RPC framework.
- Start the gRPC server using:
  ```bash
  npm start
  ```

### **GraphQL**
- Flexible data queries and mutations.
- Access the GraphQL endpoint at `http://localhost:3000/graphql`.

### **WebSocket**
- Real-time notifications for clients.
- Notifications can be sent using the `/api/notifications` endpoint or CLI.

### **Docker**
- Build and run the app with Docker:
  ```bash
  docker-compose up --build
  ```

### **Elasticsearch**
- Advanced search for expenses.
- Search endpoint: `/api/search/expenses`.

### **RabbitMQ**
- Asynchronous task handling.
- Use the `budget-manager` CLI to add tasks.
- Tasks are processed in the background.

### **Kafka**
- Distributed event streaming platform.
- Kafka broker URL: `localhost:9092`.
- Kafka producer and consumer are integrated.

### **Redis**
- In-memory caching for improved performance.
- Redis URL: `redis://localhost:6379`.
- Caching is used for user sessions and other data.

### **PostgreSQL**
- Relational database for transaction logs.
- PostgreSQL URL: `postgres://user:password@localhost:5432/budget_manager`.
- Used for storing transaction logs and other relational data.
- MySQL is also supported as an alternative.

### **MongoDB**
- Primary NoSQL database for managing budgets and expenses.
- MongoDB URL: `mongodb://localhost:27017/budget_manager`.
- Used for storing budgets, expenses, and user data.

### **Nginx**
- Reverse proxy and load balancer.
- Nginx configuration is included in the `nginx` directory.
- Load balancing can be configured for multiple instances.
- SSL termination and caching can be added.

## **Environment Variables**

Ensure your `.env` file looks like this before getting started:

```env
# Server Configuration
PORT=

# MongoDB Configuration
MONGO_DB_URI=
MONGO_DB_USERNAME=
MONGO_DB_PASSWORD=

# Redis Configuration
REDIS_HOST=
REDIS_PORT=
REDIS_URL=

# RabbitMQ Configuration
RABBIT_MQ_HOST=
RABBITMQ_URL=

# Kafka Configuration
KAFKA_BROKER=

# JWT Secret Key
JWT_SECRET=

# Elasticsearch Configuration
ELASTIC_SEARCH_URL=

# PostgreSQL Configuration
POSTGRES_URL=
```

## **CLI Usage**

The `budget-manager` CLI provides a convenient way to interact with the application from the command line.

Follow these steps to use the CLI:

1. Install globally:
   ```bash
   npm link
   ```

2. Use commands:
   ```bash
   budget-manager seed
   budget-manager notify "Hello!"
   budget-manager add-task "Task description"
   ```
   
3. View available commands:
   ```bash
    budget-manager --help
    ```

## **Swagger Documentation**

- Comprehensive API documentation is available at `/docs`.
- Includes all endpoints, schemas, and examples.
- Use Swagger UI to test and interact with the API.
- The Swagger UI looks like this:

<p align="center">
  <img src="images/swagger.png" alt="Swagger UI" style="border-radius: 8px;">
</p>

## **Dockerization**

The Budget Management API can be run in a Docker container for easy deployment and scaling.

You can build and run the app using Docker Compose:

```bash
docker-compose up --build
```

## **Kubernetes Deployment**

1. Create Kubernetes manifests for the services.
2. Deploy to a cluster:
   ```bash
   kubectl apply -f k8s/
   ```

## **Contributing**

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

---

Thank you for using the **Budget Management API**. For questions, feedback, or support, please open an issue or contact me!

Created with ❤️ by [Son Nguyen](https://sonnguyenhoang.com) in 2024. All rights reserved.
