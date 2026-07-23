const http = require('http');
const https = require('https');
const url = require('url');
const { validateUrl } = require('../helpers/validateUrl');

function handleGet(req, res) {
  const targetUrl = req.query.url || '';

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'url parameter is required' }));
    return;
  }

  // Se pasa la entrada del usuario por la funcion de validacion estricta que verifica protocolos permitidos y contrasta el dominio contra una lista blanca predefinida, bloqueando resoluciones locales
  const safeUrl = validateUrl(targetUrl);

  if (!safeUrl) {
    // Si la URL es invalida o peligrosa, se aborta la peticion externa
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Acceso denegado: SSRF prevenido. La URL no está permitida.' }));
    return;
  }
  

  // A partir de aqui usamos 'safeUrl' con la tranquilidad de que esta limpia
  const parsed = url.parse(safeUrl);
  
  // El protocolo ya fue validado en validateUrl por lo que esto es seguro
  const client = parsed.protocol === 'https:' ? https : http;

  client.get(safeUrl, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => { data += chunk; });
    proxyRes.on('end', () => {
      res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }).on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  });
}

module.exports = { handleGet };
