import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'app.db');

let db: Database.Database;

export function initDb(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS saved_searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      keyword TEXT,
      naics TEXT,
      email TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notice_id TEXT UNIQUE,
      title TEXT,
      agency TEXT,
      naics_code TEXT,
      posted_date TEXT,
      response_deadline TEXT,
      base_contract_type TEXT,
      description TEXT,
      saved_search_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (saved_search_id) REFERENCES saved_searches(id)
    );
  `);

  console.log('Database initialized at', DB_PATH);
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}