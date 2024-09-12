const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController.js');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Order routes
router.post('/orders', protect, createOrder);           // Place a new order (Users only)
router.get('/orders', protect, admin, getAllOrders);    // Get all orders (Admin only)
router.get('/orders/:id', protect, getOrder);           // Get a specific order (User/Admin)
router.put('/orders/:id', protect, admin, updateOrderStatus);  // Update order status (Admin only)
router.delete('/orders/:id', protect, admin, deleteOrder);     // Delete an order (Admin only)

module.exports = router;
