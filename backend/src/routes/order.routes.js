const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/order.validator');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/order.controller');

// All order routes are protected
router.use(auth);

router.post('/', validate(createOrderSchema), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
