# **Order Management System**

This project is an **Order Management System** designed to handle orders, products, and inventory seamlessly. It incorporates modern technologies and best practices, including **TypeORM**, **RabbitMQ**, and **Node.js**, to ensure efficient order processing and management. The system is modular, scalable, and designed to integrate with external services for real-time order processing.

---

## **Features**

### **Core Functionality**
1. **Order Management**:
   - Create new orders.
   - Update order status (e.g., pending, processed, shipped).
   - Validate and process orders using RabbitMQ for asynchronous task handling.

2. **Product Management**:
   - Create and manage products.
   - Maintain inventory levels.
   - Validate product availability during order creation.

3. **Order Processing**:
   - Uses RabbitMQ for queue-based asynchronous order processing.
   - Handles inventory updates and status changes efficiently.
   - Supports acknowledgment and re-queueing for failed or incomplete messages.

### **Technologies Used**
- **Node.js**: Backend runtime for handling business logic.
- **TypeORM**: ORM for database management and entity relationships.
- **RabbitMQ**: Messaging broker for order event handling and queue management.
- **PostgreSQL**: Relational database for storing orders, products, and other data.
- **TypeScript**: Type-safe programming for enhanced developer productivity.

---

## **System Components**

### **1. Order Service**
Handles the creation, retrieval, and status updates of orders.  
Key Methods:
- `addOrder(status, quantity, productId)`: Creates a new order and adjusts the product's inventory.
- `updateOrderStatus(orderId, status)`: Updates the status of an existing order and triggers processing.

### **2. Order Processing Service**
Manages the asynchronous processing of orders through RabbitMQ.  
Key Features:
- Listens to the `orders` queue.
- Processes incoming messages and updates orders and inventory.
- Handles retries for failed messages.

### **3. Product Service**
Facilitates product creation and inventory management.  
Key Methods:
- `createProduct(data)`: Adds new products with initial inventory and pricing.

---

## **Getting Started**

### **Prerequisites**
1. **Node.js** (v18 or later).
2. **PostgreSQL** (installed and running).
3. **RabbitMQ** (installed and running locally or on a remote server).

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/Rawan428/order-processing.git
   cd order-processing

2. Install dependencies:
   ```bash
   npm install

3. Install dependencies:
   ```bash
   npx ts-node src/index.ts


