const db = require('../db/database');

function handleGet(req, res) {
  // TODO: implement SQLi vulnerability
  // Concatenate req.query.categoria directly into the SQL query string
  // Example: SELECT id, nombre, precio FROM productos WHERE categoria = '${categoria}'
  // REMINDER: add inline comments explaining why each line is insecure

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify([]));
}

module.exports = { handleGet };
