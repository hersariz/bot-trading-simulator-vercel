/**
 * Health Check Routes for Bot Trading Simulator
 * Dibuat pada: 2023-09-01 12:34:56
 */
const express = require('express');
const router = express.Router();

// GET /api/health/check - Basic health check
router.get('/check', (req, res) => {
  try {
    const healthData = {
      status: 'OK',
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.status(200).json(healthData);
  } catch (error) {
    console.error('Error in health check endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/health/check'
    });
  }
});

// GET /api/health/version - Version info
router.get('/version', (req, res) => {
  try {
    const versionInfo = {
      version: '1.0.0',
      name: 'Bot Trading Simulator',
      description: 'API untuk simulasi trading bot cryptocurrency',
      lastUpdated: '2023-09-01'
    };
    
    res.status(200).json(versionInfo);
  } catch (error) {
    console.error('Error in version endpoint:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      endpoint: '/api/health/version'
    });
  }
});

module.exports = router; 