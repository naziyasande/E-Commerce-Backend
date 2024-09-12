const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const connectDB = require('./config/db');

// Import route files
const authRoutes = require('./routes/authRoute.js');
const productRoutes = require('./routes/productRoute');
const orderRoutes = require('./routes/orderRoute.js');

const app = express();
const port = process.env.PORT || 5000; // Use the port from environment variables or default to 5000

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // For parsing application/json

// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Application is running successfully!</h1>');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
