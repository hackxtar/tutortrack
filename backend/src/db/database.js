const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

let db = null;

/**
 * Returns the singleton SQLite database connection.
 * Initializes the database and runs schema on first call.
 */
function getDatabase() {
  if (db) return db;

  const dbPath = path.resolve(__dirname, '../../', config.db.path);
  db = new Database(dbPath);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Run schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  console.log(`✅ Database connected: ${dbPath}`);
  return db;
}

/**
 * Closes the database connection gracefully.
 */
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('🔒 Database connection closed.');
  }
}

module.exports = { getDatabase, closeDatabase };
