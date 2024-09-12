// Wrapping the test cases in an async function for dynamic import
(async () => {
    // Dynamically import chai and sinon
    const chai = await import('chai');
    const sinon = await import('sinon');
    
    // Destructure required chai methods
    const { expect } = chai;
  
    // Importing controller and model dynamically
    const { createProduct, getAllProducts, getProduct } = await import('../controllers/productController.js');
    const Product = await import('../models/productModel.js');
  
    // Mocha test cases
    describe('Product Controller', () => {
  
      // Test createProduct function
      describe('createProduct', () => {
        it('should create a new product and return it', async () => {
          // Mock request and response objects
          const req = {
            body: {
              name: 'Test Product',
              description: 'Test Description',
              price: 100,
              category: 'Test Category',
              stock: 10
            }
          };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
          };
  
          // Stub the save method on the Product model
          const productStub = sinon.stub(Product.default.prototype, 'save').resolves(req.body);
  
          // Call the createProduct controller function
          await createProduct(req, res);
  
          // Assertions
          expect(productStub.calledOnce).to.be.true;
          expect(res.status.calledWith(201)).to.be.true;
          expect(res.json.calledWith(req.body)).to.be.true;
  
          // Restore the original method
          productStub.restore();
        });
      });
  
      // Add other test cases similarly, for example:
  
      // Test getAllProducts function
      describe('getAllProducts', () => {
        it('should return all products', async () => {
          // Mock request and response objects
          const req = {};
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
          };
  
          const products = [
            { name: 'Product 1', description: 'Description 1', price: 100 },
            { name: 'Product 2', description: 'Description 2', price: 200 }
          ];
  
          // Stub the find method on the Product model
          const productFindStub = sinon.stub(Product.default, 'find').resolves(products);
  
          // Call the getAllProducts controller function
          await getAllProducts(req, res);
  
          // Assertions
          expect(productFindStub.calledOnce).to.be.true;
          expect(res.status.calledWith(200)).to.be.true;
          expect(res.json.calledWith(products)).to.be.true;
  
          // Restore the original method
          productFindStub.restore();
        });
      });
  
      // More tests like getProduct, updateProduct, deleteProduct can be added similarly
    });
  
    // Run the tests
    run();
  })();
  