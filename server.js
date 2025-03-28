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
});