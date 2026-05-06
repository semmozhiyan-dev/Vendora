# Vendora Backend API

Production-ready e-commerce backend with Razorpay payment integration.

## 🚀 Features

- ✅ JWT Authentication with rate limiting
- ✅ Product CRUD with stock management
- ✅ Shopping cart management
- ✅ Order processing with payment integration
- ✅ Razorpay payment gateway (create order, verify payment, webhooks)
- ✅ Request logging with Winston
- ✅ Input validation with Joi
- ✅ Security headers with Helmet
- ✅ NoSQL injection protection
- ✅ CORS configuration
- ✅ Rate limiting (global + auth-specific)
- ✅ Swagger API documentation
- ✅ Unit & integration tests with Jest

## 📋 Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x
- Razorpay account (for payment integration)

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env
```

## 🔐 Environment Variables

```env
PORT=8000
JWT_SECRET=your_super_secret_jwt_key_here

DB_URL=mongodb://localhost:27017/vendora

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:8000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## 🏃 Running the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/api-docs
- **Health Check**: http://localhost:8000/health

## 🛣️ API Routes

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Register new user |
| POST | `/api/v1/auth/login` | ❌ | Login user |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/products` | ❌ | List all products (paginated) |
| GET | `/api/v1/products/:id` | ❌ | Get product by ID |
| POST | `/api/v1/products` | ✅ | Create new product |
| PUT | `/api/v1/products/:id` | ✅ | Update product |
| DELETE | `/api/v1/products/:id` | ✅ | Delete product |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/cart` | ✅ | Add item to cart |
| GET | `/api/v1/cart` | ✅ | Get user's cart |
| PUT | `/api/v1/cart/:productId` | ✅ | Update cart item quantity |
| DELETE | `/api/v1/cart/:productId` | ✅ | Remove item from cart |
| DELETE | `/api/v1/cart/clear` | ✅ | Clear entire cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/orders` | ✅ | Create order from cart |
| GET | `/api/v1/orders` | ✅ | Get user's orders (paginated) |
| GET | `/api/v1/orders/:id` | ✅ | Get order by ID |
| PUT | `/api/v1/orders/:id/status` | ✅ | Update order status |
| PUT | `/api/v1/orders/:id/cancel` | ✅ | Cancel order |

### Payments (Razorpay)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/payments/create-order` | ✅ | Create Razorpay order |
| POST | `/api/v1/payments/verify` | ✅ | Verify payment signature |
| POST | `/api/v1/payments/webhook` | ❌ | Razorpay webhook (server-to-server) |

## 🔄 Payment Flow

```
1. User adds items to cart
   POST /api/v1/cart

2. User creates order (status: PENDING)
   POST /api/v1/orders

3. Frontend creates Razorpay order
   POST /api/v1/payments/create-order
   Body: { "orderId": "mongodb_order_id" }

4. User completes payment on Razorpay UI

5. Frontend verifies payment
   POST /api/v1/payments/verify
   Body: {
     "razorpay_order_id": "...",
     "razorpay_payment_id": "...",
     "razorpay_signature": "..."
   }

6. Order status → PAID, stock deducted

7. (Backup) Razorpay webhook confirms payment
   POST /api/v1/payments/webhook
```

## 🔒 Security Features

- **Helmet**: Security headers (XSS, clickjacking, etc.)
- **CORS**: Whitelist-based origin control
- **Rate Limiting**: 
  - Global: 100 requests per 15 minutes
  - Auth routes: 5 requests per 15 minutes
- **NoSQL Injection Protection**: express-mongo-sanitize
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt
- **Input Validation**: Joi schemas on all routes
- **Request Size Limit**: 10MB max body size

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # DB, Razorpay, Swagger config
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Auth, validation, logging, rate limiting
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Reusable business logic
│   ├── utils/           # Logger, helpers
│   ├── validators/      # Joi validation schemas
│   └── app.js           # Express app setup
├── __tests__/           # Jest tests
├── logs/                # Winston log files
├── server.js            # Entry point
├── jest.config.js       # Test configuration
└── package.json
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npx jest __tests__/auth.test.js
```

## 📊 Order Status Flow

```
PENDING → PAID → SHIPPED → DELIVERED
   ↓
CANCELLED (only from PENDING/PAID)
   ↓
FAILED (payment failure)
```

## 🐛 Debugging

Logs are stored in:
- `logs/app.log` - All logs
- `logs/error.log` - Error logs only

Each request has a unique ID for tracing:
```
[REQ-uuid] GET /api/v1/products
[REQ-uuid] 200 GET /api/v1/products - 45ms
```

## 🚨 Common Issues

### Webhook signature verification fails
- Ensure payment routes are registered BEFORE `express.json()` in `app.js`
- Webhook route uses `express.raw()` to preserve raw body for HMAC verification

### CORS errors
- Add your frontend URL to `allowedOrigins` in `app.js`
- Or set `FRONTEND_URL` in `.env`

### Rate limit too strict
- Adjust `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS` in `.env`
- Auth routes have separate stricter limits (5 per 15 min)

## 📝 License

ISC

## 👥 Support

For issues or questions, contact: support@vendora.com
