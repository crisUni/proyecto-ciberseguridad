function errorHandler(err, req, res) {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: err.message, stack: err.stack }));
}

module.exports = errorHandler;
