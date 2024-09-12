const Product = require('../models/productModel'); // Import the Product model
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController.js');
const { isAdmin, protect } = require('../middleware/authMiddleware'); // Authentication middleware

// Admin-only route to create a new product
router.post('/', protect, isAdmin, createProduct);

// Product routes
router.get('/', getAllProducts);      // Get all products
router.get('/:id', getProduct);      // Get a single product by id
router.put('/:id', protect, isAdmin, updateProduct);   // Update a product by id (Admin only)
router.delete('/:id', protect, isAdmin, deleteProduct); // Delete a product by id (Admin only)

// Create a new product
const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a single product by id
const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a product by id
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      category,
      stock,
    }, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a product by id
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
