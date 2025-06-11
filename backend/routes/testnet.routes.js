/**
 * Testnet Routes for Bot Trading Simulator
 * Updated: 2023-09-01 12:34:56
 */
const express = require('express');
const router = express.Router();
const path = require('path');

// Import controllers if they exist in proper location
let testnetController;
try {
  testnetController = require('../controllers/testnet.controller');
} catch (error) {
  // Fallback to src/controllers if the first path fails
  try {
    testnetController = require('../src/controllers/testnet.controller');
  } catch (innerError) {
    console.error('Failed to load testnet controller:', innerError);
    // Create placeholder controller with error responses
    testnetController = {
      getConfig: (req, res) => {
        res.status(500).json({
          error: 'Testnet controller not properly loaded',
          message: 'Server configuration issue'
        });
      },
      runSimulation: (req, res) => {
        res.status(500).json({
          error: 'Testnet controller not properly loaded',
          message: 'Server configuration issue'
        });
      }
    };
  }
}

// GET /api/testnet/config
router.get('/config', (req, res) => {
  try {
    // For debugging purposes, send a simple response first to test the route
    const config = {
      exchangeId: 'binance',
      symbol: 'BTC/USDT',
      timeframe: '1m',
      limit: 100,
      apiKey: process.env.BINANCE_API_KEY || 'demo-api-key',
      secret: process.env.BINANCE_SECRET_KEY || 'demo-secret-key',
      testnet: true
    };
    
    res.status(200).json(config);
  } catch (error) {
    console.error('Error in /api/testnet/config endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/testnet/config'
    });
  }
});

// POST /api/testnet/run-simulation
router.post('/run-simulation', (req, res) => {
  try {
    // Parse the request body
    const { strategy, params, accountConfig } = req.body;
    
    if (!strategy || !params || !accountConfig) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Strategy, params, and accountConfig are required'
      });
    }
    
    // Return sample simulation results for testing
    const simulationResults = {
      success: true,
      orders: [
        { id: '1', symbol: 'BTC/USDT', side: 'buy', price: 50000, amount: 0.01, timestamp: Date.now() },
        { id: '2', symbol: 'BTC/USDT', side: 'sell', price: 52000, amount: 0.01, timestamp: Date.now() + 3600000 }
      ],
      balance: {
        initial: 10000,
        final: 10200,
        profit: 200,
        profitPercentage: 2
      },
      metrics: {
        trades: 2,
        winRate: 100,
        sharpeRatio: 1.2,
        maxDrawdown: 0.5
      }
    };
    
    res.status(200).json(simulationResults);
  } catch (error) {
    console.error('Error in /api/testnet/run-simulation endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/testnet/run-simulation'
    });
  }
});

module.exports = router; 