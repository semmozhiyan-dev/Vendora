const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Order = require('../src/models/order.model');
const jwt = require('jsonwebtoken');

describe('Order Controller', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
    userId = new mongoose.Types.ObjectId();
    token = jwt.sign({ userId: userId.toString(), role: 'user' }, process.env.JWT_SECRET || 'test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Order.deleteMany({});
  });

  describe('POST /api/v1/orders', () => {
    it('should create order from cart/items', async () => {
      const orderData = {
        items: [{ productId: new mongoose.Types.ObjectId(), quantity: 2 }],
        shippingAddress: { street: 'Test St' }
      };

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order.items).toHaveLength(1);
      expect(res.body.order.status).toBe('PENDING');
    });
  });

  describe('GET /api/v1/orders', () => {
    beforeEach(async () => {
      await new Order({ 
        user: userId, 
        items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }], 
        totalAmount: 100 
      }).save();
    });

    it('should return paginated orders', async () => {
      const res = await request(app)
        .get('/api/v1/orders?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.items).toHaveLength(1);
    });
  });
});
