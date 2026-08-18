const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "salary.db");

function createDb(dbPath = DB_PATH) {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  return db;
}

function initializeSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      country TEXT NOT NULL,
      department TEXT NOT NULL,
      role TEXT NOT NULL,
      currency TEXT NOT NULL,
      base_salary REAL NOT NULL CHECK(base_salary >= 0),
      bonus_percent REAL NOT NULL CHECK(bonus_percent >= 0 AND bonus_percent <= 100),
      status TEXT NOT NULL CHECK(status IN ('active', 'inactive')),
      hire_date TEXT NOT NULL
    );
  `);
}

module.exports = {
  createDb,
  initializeSchema,
};
