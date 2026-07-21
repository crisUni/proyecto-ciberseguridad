function handleGet(req, res) {
  // TODO: implement SSRF vulnerability
  // Use req.query.url to make a direct HTTP request without validation
  // The internal admin server runs on http://127.0.0.1:9090/admin/delete?id=N
  // SSRF attack: call this endpoint with url=http://127.0.0.1:9090/admin/delete?id=1
  // NOTE: validateUrl.js is the fix — do NOT use it on the vulnerable branch
  // REMINDER: add inline comments explaining why each line is insecure

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
}

module.exports = { handleGet };
