"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
exports.getDb = getDb;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const DATA_DIR = path_1.default.join(__dirname, '../../data');
const DB_PATH = path_1.default.join(DATA_DIR, 'app.db');
let db;
function initDb() {
    fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
    db = new better_sqlite3_1.default(DB_PATH);
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
function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call initDb() first.');
    }
    return db;
}
