<<<<<<< HEAD
# Vendora - Modern Full-Stack Ecommerce Platform

A premium, feature-rich ecommerce platform built with modern web technologies. Vendora offers a responsive design, secure authentication, smooth animations, and high-performance architecture.

## 🌟 Features

- **Premium UI/UX** - Beautiful, responsive design with smooth animations
- **Secure Authentication** - JWT-based authentication with bcryptjs password hashing
- **Product Catalog** - Browse products with pagination and search
- **Shopping Cart** - Add/remove items with real-time updates
- **Payment Integration** - Razorpay payment gateway integration
- **Order Management** - Track orders with status updates
- **Admin Dashboard** - Manage products, orders, and customers
- **Email Notifications** - Order confirmations via email
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Docker Support** - Easy deployment with Docker and Docker Compose

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Token-based authentication
- **Razorpay** - Payment gateway

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and web server
- **Monitoring** - Prometheus, Grafana, cAdvisor, node-exporter

## 📋 Project Structure

```
vendora/
├── backend/                  # Node.js/Express API server
│   ├── src/
│   │   ├── config/          # Database and service configurations
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── middlewares/      # Authentication, validation, error handling
│   │   ├── validators/       # Input validation schemas (Joi)
│   │   ├── services/         # Business logic services
│   │   └── utils/            # Logger and utilities
│   ├── server.js             # Application entry point
│   └── package.json          # Backend dependencies
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # State management
│   │   ├── styles/           # Global styles
│   │   └── utils/            # Helper functions
│   └── package.json          # Frontend dependencies
├── nginx/                    # Nginx configuration
├── docker-compose.yml        # Multi-container setup
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Docker
- MongoDB (local or Docker)
- Git

### Installation & Setup

#### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/semmozhiyan-dev/Vendora.git
cd Vendora
```

2. Create environment file:
```bash
cp .env.example .env.development
```

3. Update `.env.development` with your configuration (especially Razorpay keys)

4. Start the application:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:8000`

#### Option 2: Manual Setup

1. Clone the repository:
```bash
git clone https://github.com/semmozhiyan-dev/Vendora.git
cd Vendora
```

2. Backend Setup:
```bash
cd backend
npm install
cp ../.env.example ../.env.development
npm run dev
```

3. Frontend Setup (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env.development` file based on `.env.example`:

```env
# Backend
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/vendora

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET=your_jwt_secret_here

# Razorpay (get test keys from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=your_email@gmail.com

# Frontend
VITE_API_URL=/api/v1
```

## 📝 API Documentation

The backend API includes Swagger documentation. After starting the server, visit:
```
http://localhost:5000/api-docs
```

### Key Endpoints

- `GET /api/products` - Get all products
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `POST /api/payments/verify` - Verify Razorpay payment

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run tests with coverage
npm run test:watch   # Run tests in watch mode
```

## 📦 Deployment

### Docker Deployment

The application is configured for Docker deployment:

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Monitoring

When running via Docker Compose, the following services are available:

- **Prometheus** (http://localhost:9090) - Metrics collection
- **Grafana** (http://localhost:3000) - Visualization dashboard
- **cAdvisor** (http://localhost:8081) - Container metrics

## 🔐 Security Features

- ✅ JWT authentication with expiration
- ✅ Password hashing with bcryptjs
- ✅ CORS configuration with whitelist
- ✅ Helmet.js for HTTP header security
- ✅ MongoDB injection protection
- ✅ Rate limiting on auth endpoints
- ✅ Input validation with Joi
- ✅ Environment variable protection

## 📚 Documentation

For detailed documentation, refer to:
- [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md) - Code quality analysis
- [ADMIN_DASHBOARD_SETUP.md](./ADMIN_DASHBOARD_SETUP.md) - Admin setup guide
- [API_ISSUES_AND_FIXES.md](./API_ISSUES_AND_FIXES.md) - Known issues and solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Authors

- **semmozhiyan-dev** - Initial work - [GitHub Profile](https://github.com/semmozhiyan-dev)

## 📧 Support

For support, email the maintainers or open an issue on the GitHub repository.
=======
csrf disabled test
http fix
>>>>>>> origin/main
