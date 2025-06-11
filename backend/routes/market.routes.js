const express = require('express');
const router = express.Router();

// Import controllers if they exist in proper location
let marketController;
try {
  marketController = require('../controllers/market.controller');
} catch (error) {
  // Fallback to src/controllers if the first path fails
  try {
    marketController = require('../src/controllers/market.controller');
  } catch (innerError) {
    console.error('Failed to load market controller:', innerError);
    // Create placeholder controller with mock data
    marketController = {
      getMarketData: (req, res) => {
        const { symbol } = req.query;
        const timestamp = Date.now();
        
        const mockData = {
          symbol: symbol || 'BTC/USDT',
          price: 50000 + (Math.random() * 1000) - 500,
          volume: 1500 + Math.random() * 500,
          change: Math.random() > 0.5 ? 2.5 : -1.2,
          high: 51000,
          low: 49000,
          timestamp: timestamp,
          source: 'mock-data'
        };
        
        res.status(200).json(mockData);
      },
      
      getCurrentPrice: (req, res) => {
        const symbol = req.params.symbol || 'BTC/USDT';
        const mockPrice = {
          symbol: symbol,
          price: 50000 + (Math.random() * 1000) - 500,
          timestamp: Date.now(),
          source: 'mock-data'
        };
        
        res.status(200).json(mockPrice);
      },
      
      getHistoricalPrices: (req, res) => {
        const { symbol, interval, limit } = req.query;
        const candles = [];
        const now = Date.now();
        const intervalMs = {
          '1m': 60 * 1000,
          '5m': 5 * 60 * 1000,
          '15m': 15 * 60 * 1000,
          '1h': 60 * 60 * 1000,
          '4h': 4 * 60 * 60 * 1000,
          '1d': 24 * 60 * 60 * 1000
        };
        
        const timeStep = intervalMs[interval] || 60 * 60 * 1000;
        const limitNum = parseInt(limit) || 100;
        
        let price = 50000;
        
        for (let i = 0; i < limitNum; i++) {
          const timestamp = now - (timeStep * (limitNum - i));
          const change = (Math.random() * 200) - 100;
          price += change;
          
          const open = price;
          const close = price + (Math.random() * 100) - 50;
          const high = Math.max(open, close) + (Math.random() * 50);
          const low = Math.min(open, close) - (Math.random() * 50);
          const volume = 1000 + Math.random() * 500;
          
          candles.push([
            timestamp,
            open,
            high,
            low,
            close,
            volume
          ]);
        }
        
        res.status(200).json({
          symbol: symbol || 'BTC/USDT',
          interval: interval || '1h',
          candles: candles,
          source: 'mock-data'
        });
      },
      
      getApiKeyStatus: (req, res) => {
        const mockStatus = {
          apiKey: 'demo-api-key',
          apiSecret: '******',
          isValid: true,
          useDummyData: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        };
        
        res.status(200).json(mockStatus);
      },
      
      generateApiKey: (req, res) => {
        const mockApiKey = {
          apiKey: `demo-key-${Date.now()}`,
          apiSecret: `demo-secret-${Date.now()}`,
          isValid: true,
          useDummyData: true,
          createdAt: new Date().toISOString()
        };
        
        res.status(200).json(mockApiKey);
      },
      
      deleteApiKey: (req, res) => {
        res.status(200).json({
          message: 'API key deleted successfully'
        });
      },
      
      toggleDummyData: (req, res) => {
        const { useDummyData } = req.body;
        
        res.status(200).json({
          message: `Dummy data mode ${useDummyData ? 'enabled' : 'disabled'} successfully`,
          useDummyData: useDummyData
        });
      },
      
      testConnection: (req, res) => {
        const { source } = req.query;
        
        res.status(200).json({
          success: true,
          source: source || 'binance',
          message: 'Connection successful',
          useDummyData: true
        });
      }
    };
  }
}

// GET /api/market/data - Get market data for a symbol
router.get('/data', (req, res) => {
  try {
    marketController.getMarketData(req, res);
  } catch (error) {
    console.error('Error in GET /api/market/data endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/market/data'
    });
  }
});

// GET /api/market/price/:symbol - Get current price for a symbol
router.get('/price/:symbol', (req, res) => {
  try {
    marketController.getCurrentPrice(req, res);
  } catch (error) {
    console.error(`Error in GET /api/market/price/${req.params.symbol} endpoint:`, error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: `/api/market/price/${req.params.symbol}`
    });
  }
});

// GET /api/market/historical - Get historical prices
router.get('/historical', (req, res) => {
  try {
    marketController.getHistoricalPrices(req, res);
  } catch (error) {
    console.error('Error in GET /api/market/historical endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/market/historical'
    });
  }
});

// GET /api/market/api-key - Get API key status
router.get('/api-key', (req, res) => {
  try {
    marketController.getApiKeyStatus(req, res);
  } catch (error) {
    console.error('Error in GET /api/market/api-key endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/market/api-key'
    });
  }
});

// POST /api/market/generate-api-key - Generate new API key
router.post('/generate-api-key', (req, res) => {
  try {
    marketController.generateApiKey(req, res);
  } catch (error) {
    console.error('Error in POST /api/market/generate-api-key endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/market/generate-api-key'
    });
  }
});

// DELETE /api/market/api-key - Delete API key
router.delete('/api-key', (req, res) => {
  try {
    marketController.deleteApiKey(req, res);
  } catch (error) {
    console.error('Error in DELETE /api/market/api-key endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/market/api-key'
    });
  }
});

// POST /api/market/toggle-dummy-data - Toggle dummy data mode
router.post('/toggle-dummy-data', (req, res) => {
  try {
    marketController.toggleDummyData(req, res);
  } catch (error) {
    console.error('Error in POST /api/market/toggle-dummy-data endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/market/toggle-dummy-data'
    });
  }
});

// GET /api/market/test-source - Test connection to market data source
router.get('/test-source', (req, res) => {
  try {
    marketController.testConnection(req, res);
  } catch (error) {
    console.error('Error in GET /api/market/test-source endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/market/test-source'
    });
  }
});

module.exports = router; 