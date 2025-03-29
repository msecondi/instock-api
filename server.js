import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const app = express();
const PORT = process.env.PORT || 8081;

import warehouseRouter from './routes/warehouse-routes.js';

// Initialize environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Warehouses router
app.use('/warehouses', warehouseRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});