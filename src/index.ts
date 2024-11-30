import express from 'express';
import { createConnection } from 'typeorm';
import orderRoutes from './routes/orderRoutes';
import { createServer } from 'http'; // Import HTTP server from Node
import routes from './routes/index'; // Import routes

import 'reflect-metadata';
(async () => {
  try {
    // Establish database connection
    await createConnection();
    console.log('Database connected successfully');

    const PORT = process.env.PORT || 3000;

    // Initialize Express app
    const app = express();

    // Middleware
    app.use(express.json()); // JSON parser middleware
    app.use(express.urlencoded({ extended: true })); // URL-encoded parser

    // Register routes
    app.use(routes);

    // Create HTTP server
    const server = createServer(app);


    // Start listening on the provided port
    server.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during server startup:', error);
  }
})();