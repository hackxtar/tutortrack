const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const { getDatabase, closeDatabase } = require('./db/database');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const tutorRoutes = require('./routes/tutor.routes');
const studentsRoutes = require('./routes/students.routes');
const classNotesRoutes = require('./routes/classNotes.routes');
const followUpsRoutes = require('./routes/followUps.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// ── Core Middleware ──────────────────────────────────────────────
app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : (config.corsOrigin || true),
    credentials: true,
  })
);
app.use(express.json());

// ── Health Check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tutor', tutorRoutes);
app.use('/api/v1/students', studentsRoutes);
app.use('/api/v1/class-notes', classNotesRoutes);
app.use('/api/v1/follow-ups', followUpsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// ── 404 Handler ──────────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────
function startServer() {
  // Initialize database on startup
  getDatabase();

  const server = app.listen(config.port, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║    🎓 TutorTrack API Server                  ║
║    Port: ${String(config.port).padEnd(36)}║
║    CORS: ${config.corsOrigin.padEnd(36)}║
║    Endpoints: /api/v1/*                      ║
╚══════════════════════════════════════════════╝
    `);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n🔄 Shutting down gracefully...');
    server.close(() => {
      closeDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();

module.exports = app;
