const express = require('express');
const requestIdMiddleware = require('./middlewares/requestId.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// ========== MIDDLEWARE CHAIN ORDER ==========

// 1. Body Parser (parse incoming request bodies)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Request ID (attach unique ID to every request)
app.use(requestIdMiddleware);

// 3. Logger (log all requests with ID and response time)
app.use(loggerMiddleware);

// ========== ROUTES ==========
// TODO: Uncomment and integrate your routes here
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/products', require('./routes/product.routes'));
// app.use('/api/cart', require('./routes/cart.routes'));
// app.use('/api/orders', require('./routes/order.routes'));

// ========== ERROR HANDLING (MUST BE LAST) ==========
// 4. Error Handler (catches all errors from controllers and routes)
app.use(errorMiddleware);

module.exports = app;
