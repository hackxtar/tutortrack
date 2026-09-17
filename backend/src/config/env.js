const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwt: {
    secret: process.env.JWT_SECRET || 'tutortrack-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  db: {
    path: process.env.DB_PATH || './tutortrack.db',
  },
};

// Validate required config
if (!config.jwt.secret || config.jwt.secret === 'your-secret-key-here') {
  console.warn('⚠️  WARNING: Using default JWT secret. Set JWT_SECRET in .env for production.');
}

module.exports = config;
