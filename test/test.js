// Wrapping the test cases in an async function for dynamic import
(async () => {
  // Dynamically import chai and chaiHttp
  const chai = await import('chai');
  const chaiHttp = await import('chai-http');
  const app = (await import('../app.js')).default; // Assuming your Express app is in app.js

  chai.use(chaiHttp);
  const { expect } = chai;

  // User Authentication Tests
  describe('User Authentication', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'strongPassword',
          role: 'user',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.message).to.equal('User registered successfully');
          done();
        });
    });

    it('should login a user and return a JWT token', (done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com',
          password: 'strongPassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.token).to.be.a('string');
          done();
        });
    });
  });

  // Product API Tests (Admin-only)
  describe('Product API (Admin-only)', () => {
    let accessToken;
    let productId; // Store the ID of the created product

    before((done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          email: 'admin@example.com', // Use a valid admin email
          password: 'adminPassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          accessToken = res.body.token; // Store the token for later use
          done();
        });
    });

    it('should create a new product', (done) => {
      chai.request(app)
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Product',
          description: 'Product description',
          price: 19.99,
          category: 'Electronics',
          stock: 10,
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.message).to.equal('Product created successfully');
          productId = res.body.product._id; // Store product ID for later use
          done();
        });
    });

    it('should retrieve a single product by ID', (done) => {
      chai.request(app)
        .get(`/products/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('name', 'Test Product');
          done();
        });
    });

    it('should update a product by ID', (done) => {
      chai.request(app)
        .put(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Product',
          description: 'Updated description',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Product updated successfully');
          done();
        });
    });

    it('should delete a product by ID', (done) => {
      chai.request(app)
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Product deleted successfully');
          done();
        });
    });
  });

  // Order API Tests
  describe('Order API', () => {
    let userAccessToken;

    before((done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          email: 'user@example.com', // Use a valid user email
          password: 'userPassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          userAccessToken = res.body.token; // Store the user's token for later use
          done();
        });
    });

    it('should place an order', (done) => {
      chai.request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          product: productId, // Use the productId from previous tests
          quantity: 2,
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.message).to.equal('Order placed successfully');
          done();
        });
    });

    // You can add more tests for updating order status (admin-only) or retrieving orders
  });

  // Run the tests
  run();
})();
