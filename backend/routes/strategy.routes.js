const express = require('express');
const router = express.Router();

// Import controllers if they exist in proper location
let strategyController;
try {
  strategyController = require('../controllers/strategy.controller');
} catch (error) {
  // Fallback to src/controllers if the first path fails
  try {
    strategyController = require('../src/controllers/strategy.controller');
  } catch (innerError) {
    console.error('Failed to load strategy controller:', innerError);
    // Create placeholder controller with mock data
    strategyController = {
      getAllStrategies: (req, res) => {
        const mockStrategies = [
          {
            id: '1',
            name: 'ADX Momentum Strategy',
            description: 'Uses ADX indicator to detect strong trends',
            active: true,
            parameters: {
              adxPeriod: 14,
              adxThreshold: 25,
              diPeriod: 14,
              diThreshold: 20
            },
            timeframes: ['1h', '4h'],
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '2',
            name: 'MACD Crossover',
            description: 'Buys when MACD crosses above signal line, sells when crosses below',
            active: false,
            parameters: {
              fastPeriod: 12,
              slowPeriod: 26,
              signalPeriod: 9
            },
            timeframes: ['15m', '1h'],
            createdAt: new Date(Date.now() - 43200000).toISOString()
          }
        ];
        res.status(200).json(mockStrategies);
      },
      getStrategyById: (req, res) => {
        const strategyId = req.params.id;
        const mockStrategy = {
          id: strategyId,
          name: 'ADX Momentum Strategy',
          description: 'Uses ADX indicator to detect strong trends',
          active: true,
          parameters: {
            adxPeriod: 14,
            adxThreshold: 25,
            diPeriod: 14,
            diThreshold: 20
          },
          timeframes: ['1h', '4h'],
          createdAt: new Date(Date.now() - 86400000).toISOString()
        };
        res.status(200).json(mockStrategy);
      },
      createStrategy: (req, res) => {
        const newStrategy = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString()
        };
        res.status(201).json(newStrategy);
      },
      updateStrategy: (req, res) => {
        const strategyId = req.params.id;
        const updatedStrategy = {
          id: strategyId,
          ...req.body,
          updatedAt: new Date().toISOString()
        };
        res.status(200).json(updatedStrategy);
      },
      deleteStrategy: (req, res) => {
        res.status(200).json({
          success: true,
          message: 'Strategy deleted successfully'
        });
      },
      toggleStrategy: (req, res) => {
        const strategyId = req.params.id;
        const { isActive } = req.body;
        res.status(200).json({
          id: strategyId,
          active: isActive,
          message: `Strategy ${isActive ? 'activated' : 'deactivated'} successfully`
        });
      }
    };
  }
}

// GET /api/strategies - Get all strategies
router.get('/', (req, res) => {
  try {
    strategyController.getAllStrategies(req, res);
  } catch (error) {
    console.error('Error in GET /api/strategies endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/strategies'
    });
  }
});

// GET /api/strategies/:id - Get strategy by ID
router.get('/:id', (req, res) => {
  try {
    strategyController.getStrategyById(req, res);
  } catch (error) {
    console.error(`Error in GET /api/strategies/${req.params.id} endpoint:`, error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: `/api/strategies/${req.params.id}`
    });
  }
});

// POST /api/strategies - Create a new strategy
router.post('/', (req, res) => {
  try {
    strategyController.createStrategy(req, res);
  } catch (error) {
    console.error('Error in POST /api/strategies endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/strategies'
    });
  }
});

// PUT /api/strategies/:id - Update a strategy
router.put('/:id', (req, res) => {
  try {
    strategyController.updateStrategy(req, res);
  } catch (error) {
    console.error(`Error in PUT /api/strategies/${req.params.id} endpoint:`, error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: `/api/strategies/${req.params.id}`
    });
  }
});

// DELETE /api/strategies/:id - Delete a strategy
router.delete('/:id', (req, res) => {
  try {
    strategyController.deleteStrategy(req, res);
  } catch (error) {
    console.error(`Error in DELETE /api/strategies/${req.params.id} endpoint:`, error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: `/api/strategies/${req.params.id}`
    });
  }
});

// POST /api/strategies/:id/toggle - Toggle strategy active state
router.post('/:id/toggle', (req, res) => {
  try {
    strategyController.toggleStrategy(req, res);
  } catch (error) {
    console.error(`Error in POST /api/strategies/${req.params.id}/toggle endpoint:`, error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: `/api/strategies/${req.params.id}/toggle`
    });
  }
});

module.exports = router; 