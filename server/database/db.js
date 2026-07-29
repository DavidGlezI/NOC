const Database = require("better-sqlite3");

const db = new Database("database/expenses.db");


db.prepare(`
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT,
    date TEXT
)    
`).run();


module.exports = db; 