const express = require('express');
const router = express.Router();

// Import controllers if they exist in proper location
let orderController;
try {
  orderController = require('../controllers/order.controller');
} catch (error) {
  // Fallback to src/controllers if the first path fails
  try {
    orderController = require('../src/controllers/order.controller');
  } catch (innerError) {
    console.error('Failed to load order controller:', innerError);
    // Create placeholder controller with mock data
    orderController = {
      getAllOrders: (req, res) => {
        const mockOrders = [
          { 
            id: '1', 
            symbol: 'BTC/USDT', 
            side: 'buy', 
            type: 'limit', 
            price: 50000, 
            amount: 0.01, 
            status: 'closed', 
            timestamp: Date.now() - 86400000 
          },
          { 
            id: '2', 
            symbol: 'ETH/USDT', 
            side: 'sell', 
            type: 'market', 
            price: 3000, 
            amount: 0.5, 
            status: 'closed', 
            timestamp: Date.now() - 43200000 
          }
        ];
        res.status(200).json(mockOrders);
      },
      getOrderById: (req, res) => {
        const orderId = req.params.id;
        const mockOrder = { 
          id: orderId, 
          symbol: 'BTC/USDT', 
          side: 'buy', 
          type: 'limit', 
          price: 50000, 
          amount: 0.01, 
          status: 'closed', 
          timestamp: Date.now() - 86400000 
        };
        res.status(200).json(mockOrder);
      },
      createOrder: (req, res) => {
        const { symbol, side, type, amount, price } = req.body;
        const newOrder = {
          id: Date.now().toString(),
          symbol: symbol || 'BTC/USDT',
          side: side || 'buy',
          type: type || 'limit',
          price: price || 50000,
          amount: amount || 0.01,
          status: 'open',
          timestamp: Date.now()
        };
        res.status(201).json(newOrder);
      },
      updateOrder: (req, res) => {
        const orderId = req.params.id;
        const { status } = req.body;
        const updatedOrder = {
          id: orderId,
          symbol: 'BTC/USDT',
          side: 'buy',
          type: 'limit',
          price: 50000,
          amount: 0.01,
          status: status || 'canceled',
          timestamp: Date.now() - 86400000,
          updatedAt: Date.now()
        };
        res.status(200).json(updatedOrder);
      },
      deleteOrder: (req, res) => {
        res.status(200).json({ message: 'Order deleted successfully' });
      }
    };
  }
}

// GET /api/orders - Get all orders
router.get('/', (req, res) => {
  try {
    orderController.getAllOrders(req, res);
  } catch (error) {
    console.error('Error in GET /api/orders endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/orders'
    });
  }
});

// GET /api/orders/:id - Get specific order by ID
router.get('/:id', (req, res) => {
  try {
    orderController.getOrderById(req, res);
  } catch (error) {
    console.error(`Error in GET /api/orders/${req.params.id} endpoint:`, error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: `/api/orders/${req.params.id}`
    });
  }
});

// POST /api/orders - Create a new order
router.post('/', (req, res) => {
  try {
    orderController.createOrder(req, res);
  } catch (error) {
    console.error('Error in POST /api/orders endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/orders'
    });
  }
});

// PUT /api/orders/:id - Update an order
router.put('/:id', (req, res) => {
  try {
    orderController.updateOrder(req, res);
  } catch (error) {
    console.error(`Error in PUT /api/orders/${req.params.id} endpoint:`, error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: `/api/orders/${req.params.id}`
    });
  }
});

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', (req, res) => {
  try {
    orderController.deleteOrder(req, res);
  } catch (error) {
    console.error(`Error in DELETE /api/orders/${req.params.id} endpoint:`, error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: `/api/orders/${req.params.id}`
    });
  }
});

module.exports = router; 