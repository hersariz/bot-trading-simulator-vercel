const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import route files
const orderRoutes = require('./routes/order.routes');
const accountRoutes = require('./routes/account.routes');
const strategyRoutes = require('./routes/strategy.routes');
const testnetRoutes = require('./routes/testnet.routes');
const marketRoutes = require('./routes/market.routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Handle OPTIONS preflight requests
app.options('*', cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/strategies', strategyRoutes);
app.use('/api/testnet', testnetRoutes);
app.use('/api/market', marketRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Handle 404 errors
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      status: 404
    }
  });
});

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel serverless function
module.exports = app; 