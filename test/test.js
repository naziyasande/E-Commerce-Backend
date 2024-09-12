const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app'); // Make sure this points to your Express app
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

chai.use(chaiHttp);
const { expect } = chai;

describe('E-Commerce API Tests', function() {
  let authToken;
  let adminToken;
  let testProductId;
  let testOrderId;

  // Before running tests
  before(async function() {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/ecommerceDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create test users
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password',
      role: 'user',
    });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    });

    // Generate tokens for test users
    authToken = user.generateAuthToken(); // Assuming `generateAuthToken` method exists
    adminToken = admin.generateAuthToken();

    // Create a test product
    const product = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      category: 'Test Category',
      stock: 10,
    });
    testProductId = product._id;

    // Create a test order
    const order = await Order.create({
      user: user._id,
      product: product._id,
      quantity: 1,
      totalPrice: 100,
      status: 'pending',
    });
    testOrderId = order._id;
  });

  // After tests
  after(async function() {
    // Clean up
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  // Test authentication
  describe('Authentication', function() {
    it('should authenticate and return a token', function(done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com', password: 'password' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

  // Test product routes
  describe('Products', function() {
    it('should create a new product (Admin only)', function(done) {
      chai.request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Product',
          description: 'New Description',
          price: 200,
          category: 'New Category',
          stock: 5,
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('name', 'New Product');
          done();
        });
    });

    it('should get a list of products', function(done) {
      chai.request(app)
        .get('/api/products')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should update a product (Admin only)', function(done) {
      chai.request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 150 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('price', 150);
          done();
        });
    });

    it('should delete a product (Admin only)', function(done) {
      chai.request(app)
        .delete(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Product deleted');
          done();
        });
    });
  });

  // Test order routes
  describe('Orders', function() {
    it('should create a new order', function(done) {
      chai.request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: testProductId,
          quantity: 2,
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('quantity', 2);
          done();
        });
    });

    it('should get all orders (Admin only)', function(done) {
      chai.request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should get an order by ID', function(done) {
      chai.request(app)
        .get(`/api/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('quantity', 1);
          done();
        });
    });

    it('should update order status (Admin only)', function(done) {
      chai.request(app)
        .put(`/api/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'shipped' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status', 'shipped');
          done();
        });
    });

    it('should delete an order (Admin only)', function(done) {
      chai.request(app)
        .delete(`/api/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Order deleted successfully');
          done();
        });
    });
  });
});
