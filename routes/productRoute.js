const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// Product routes
router.post('/products', createProduct);      // Create product (Admin only)
router.get('/products', getAllProducts);      // Get all products
router.get('/products/:id', getProduct);      // Get a single product by id
router.put('/products/:id', updateProduct);   // Update a product by id (Admin only)
router.delete('/products/:id', deleteProduct); // Delete a product by id (Admin only)

module.exports = router;
