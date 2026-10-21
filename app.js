const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User Management API is operational',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint for API discovery
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'UserFlow API',
    version: '1.0.0',
    message: 'User Management REST API is operational',
    endpoints: {
      health: '/api/health',
      users: '/api/users'
    }
  });
});

// Mount User Management routes
app.use('/api/users', userRoutes);

// Catch 404 for undefined routes
app.use(notFound);

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
