// Vercel Serverless API handler
// File ini akan menangani semua route API dari Vercel ke backend
const app = require('../backend/server');

// Export handler function untuk Vercel serverless
module.exports = app; 