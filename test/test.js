// Wrapping the test cases in an async function for dynamic import
(async () => {
    // Dynamically import chai and sinon
   // const //chai = await import('chai');
    const sinon = require('sinon');
    const chai=require('chai')
    // Destructure required chai methods
    const { expect } = chai;
  
    // Importing controller and model dynamically
    const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } = await import('../controllers/productController.js');
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
  
      // Test getProduct function
      describe('getProduct', () => {
        it('should return a single product by id', async () => {
          // Mock request and response objects
          const req = { params: { id: '60b8d295f10f4d3f8c6c84e5' } };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
          };
  
          const product = { name: 'Product 1', description: 'Description 1', price: 100 };
  
          // Stub the findById method on the Product model
          const productFindByIdStub = sinon.stub(Product.default, 'findById').resolves(product);
  
          // Call the getProduct controller function
          await getProduct(req, res);
  
          // Assertions
          expect(productFindByIdStub.calledOnce).to.be.true;
          expect(productFindByIdStub.calledWith(req.params.id)).to.be.true;
          expect(res.status.calledWith(200)).to.be.true;
          expect(res.json.calledWith(product)).to.be.true;
  
          // Restore the original method
          productFindByIdStub.restore();
        });

        it('should return 404 if product not found', async () => {
          // Mock request and response objects
          const req = { params: { id: 'nonexistentid' } };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
          };
  
          // Stub the findById method on the Product model
          const productFindByIdStub = sinon.stub(Product.default, 'findById').resolves(null);
  
          // Call the getProduct controller function
          await getProduct(req, res);
  
          // Assertions
          expect(productFindByIdStub.calledOnce).to.be.true;
          expect(productFindByIdStub.calledWith(req.params.id)).to.be.true;
          expect(res.status.calledWith(404)).to.be.true;
          expect(res.json.calledWith({ message: 'Product not found' })).to.be.true;
  
          // Restore the original method
          productFindByIdStub.restore();
        });
      });
  
      // Test updateProduct function
      describe('updateProduct', () => {
        it('should update a product and return it', async () => {
          // Mock request and response objects
          const req = {
            params: { id: '60b8d295f10f4d3f8c6c84e5' },
            body: {
              name: 'Updated Product',
              description: 'Updated Description',
              price: 150
            }
          };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
          };
  
          const updatedProduct = { ...req.body, _id: req.params.id };
  
          // Stub the findByIdAndUpdate method on the Product model
          const productFindByIdAndUpdateStub = sinon.stub(Product.default, 'findByIdAndUpdate').resolves(updatedProduct);
  
          // Call the updateProduct controller function
          await updateProduct(req, res);
  
          // Assertions
          expect(productFindByIdAndUpdateStub.calledOnce).to.be.true;
          expect(productFindByIdAndUpdateStub.calledWith(req.params.id, req.body, { new: true })).to.be.true;
          expect(res.status.calledWith(200)).to.be.true;
          expect(res.json.calledWith(updatedProduct)).to.be.true;
  
          // Restore the original method
          productFindByIdAndUpdateStub.restore();
        });

        it('should return 404 if product to update not found', async () => {
          // Mock request and response objects
          const req = {
            params: { id: 'nonexistentid' },
            body: {
              name: 'Updated Product',
              description: 'Updated Description',
              price: 150
            }
          };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
          };
  
          // Stub the findByIdAndUpdate method on the Product model
          const productFindByIdAndUpdateStub = sinon.stub(Product.default, 'findByIdAndUpdate').resolves(null);
  
          // Call the updateProduct controller function
          await updateProduct(req, res);
  
          // Assertions
          expect(productFindByIdAndUpdateStub.calledOnce).to.be.true;
          expect(productFindByIdAndUpdateStub.calledWith(req.params.id, req.body, { new: true })).to.be.true;
          expect(res.status.calledWith(404)).to.be.true;
          expect(res.json.calledWith({ message: 'Product not found' })).to.be.true;
  
          // Restore the original method
          productFindByIdAndUpdateStub.restore();
        });
      });
  
      // Test deleteProduct function
      describe('deleteProduct', () => {
        it('should delete a product by id', async () => {
          // Mock request and response objects
          const req = { params: { id: '60b8d295f10f4d3f8c6c84e5' } };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
          };
  
          // Stub the findByIdAndDelete method on the Product model
          const productFindByIdAndDeleteStub = sinon.stub(Product.default, 'findByIdAndDelete').resolves({ _id: req.params.id });
  
          // Call the deleteProduct controller function
          await deleteProduct(req, res);
  
          // Assertions
          expect(productFindByIdAndDeleteStub.calledOnce).to.be.true;
          expect(productFindByIdAndDeleteStub.calledWith(req.params.id)).to.be.true;
          expect(res.status.calledWith(200)).to.be.true;
          expect(res.json.calledWith({ message: 'Product deleted successfully' })).to.be.true;
  
          // Restore the original method
          productFindByIdAndDeleteStub.restore();
        });

        it('should return 404 if product to delete not found', async () => {
          // Mock request and response objects
          const req = { params: { id: 'nonexistentid' } };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
          };
  
          // Stub the findByIdAndDelete method on the Product model
          const productFindByIdAndDeleteStub = sinon.stub(Product.default, 'findByIdAndDelete').resolves(null);
  
          // Call the deleteProduct controller function
          await deleteProduct(req, res);
  
          // Assertions
          expect(productFindByIdAndDeleteStub.calledOnce).to.be.true;
          expect(productFindByIdAndDeleteStub.calledWith(req.params.id)).to.be.true;
          expect(res.status.calledWith(404)).to.be.true;
          expect(res.json.calledWith({ message: 'Product not found' })).to.be.true;
  
          // Restore the original method
          productFindByIdAndDeleteStub.restore();
        });
      });
  
      // Run the tests
      run();
    });
  })();
