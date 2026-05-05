const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Product = require('../src/models/product.model');
const jwt = require('jsonwebtoken');

describe('Product Controller', () => {
  let token;
  let productId;

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
    // Mock admin user
    const adminUserId = new mongoose.Types.ObjectId();
    token = jwt.sign({ userId: adminUserId.toString(), role: 'admin' }, process.env.JWT_SECRET || 'test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/v1/products', () => {
    it('should return products list', async () => {
      await new Product({ name: 'Product 1', price: 100, stock: 10 }).save();
      const res = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create product', async () => {
      const productData = {
        name: 'New Product',
        description: 'Test desc',
        price: 99.99,
        stock: 50,
        category: 'Electronics'
      };

      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe('New Product');
      productId = res.body.product._id;
    });

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Invalid', price: -10 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    beforeEach(async () => {
      productId = (await new Product({ name: 'Update Me', price: 100 }).save())._id;
    });

    it('should update product', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Product', price: 150 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe('Updated Product');
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    beforeEach(async () => {
      productId = (await new Product({ name: 'Delete Me' }).save())._id;
    });

    it('should delete product', async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });
  });
});
