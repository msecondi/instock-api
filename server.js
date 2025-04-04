<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (you'll add these later)
app.get('/', (req, res) => {
  res.send('InStock API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
=======
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const app = express();
const PORT = process.env.PORT || 8081;

import warehouseRouter from './routes/warehouse-routes.js';
import inventoryRouter from './routes/inventory-routes.js';

// Initialize environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Warehouses router
app.use('/warehouses', warehouseRouter);

// Inventories router
app.use('/inventories', inventoryRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
>>>>>>> d3d6266 (merged)
});