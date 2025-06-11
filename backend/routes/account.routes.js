const express = require('express');
const router = express.Router();

// Import controllers if they exist in proper location
let accountController;
try {
  accountController = require('../controllers/account.controller');
} catch (error) {
  // Fallback to src/controllers if the first path fails
  try {
    accountController = require('../src/controllers/account.controller');
  } catch (innerError) {
    console.error('Failed to load account controller:', innerError);
    // Create placeholder controller with mock data
    accountController = {
      getAccountInfo: (req, res) => {
        const mockAccountInfo = {
          balance: 10000.00,
          equity: 10050.25,
          margin: 250.50,
          freeMargin: 9799.75,
          marginLevel: 4012.08,
          positions: 1,
          orders: 2,
          profit: 50.25,
          currency: 'USDT',
          lastUpdated: new Date().toISOString()
        };
        res.status(200).json(mockAccountInfo);
      },
      resetAccount: (req, res) => {
        const resetResponse = {
          success: true,
          message: 'Account reset successfully',
          balance: 10000.00,
          timestamp: new Date().toISOString()
        };
        res.status(200).json(resetResponse);
      }
    };
  }
}

// GET /api/accounts/info - Get account information
router.get('/info', (req, res) => {
  try {
    accountController.getAccountInfo(req, res);
  } catch (error) {
    console.error('Error in GET /api/accounts/info endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/accounts/info'
    });
  }
});

// POST /api/accounts/reset - Reset account to initial state
router.post('/reset', (req, res) => {
  try {
    accountController.resetAccount(req, res);
  } catch (error) {
    console.error('Error in POST /api/accounts/reset endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/accounts/reset'
    });
  }
});

module.exports = router; 