const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'tienda.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // TODO: Define schema — fill in the CREATE TABLE statement
  // db.run(`CREATE TABLE ...`);
});

module.exports = db;
