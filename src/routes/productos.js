const db = require('../db/database');
const errorHandler = require('../middleware/errorHandler');

function handleGet(req, res) {
  // (1) CWE-20 (Improper Input Validation). Lategoria sale del query string sin validar tipo, 
  // largo ni contenido, siendo la puerta de entrada a la vulnerabilidad sql.
  const categoria = req.query.categoria;

  // (2) CWE-89 (SQL Injection) / OWASP A05:2025-Injection. Pegamos el string
  // del usuario directo en el literal SQL. Lo correcto es usar
  // placeholder '?' y utilizar la variable categoria como parámetro:
  //   db.all('SELECT id, nombre, precio FROM productos WHERE categoria = ?', [categoria], cb)
  // así el driver lo trata como dato y no como SQL. Como no hacemos eso, una
  // comilla simple en categoria cierra el literal '...' y de ahí en adelante
  // es SQL que se ejecuta (UNION SELECT, OR 1=1, etc...).
  const sql = `SELECT id, nombre, precio FROM productos WHERE categoria = '${categoria}'`;

  // (3) sql va directo a db.all sin arreglo de parámetros. Debería ser
  // db.all(sql, [params], cb).
  db.all(sql, (err, rows) => {
    if (err) {
      // (4) No se oculta el mensaje de error. En esta rama el error
      // de sintaxis de SQLite "unrecognized token", al romper el query
      // con una comilla suelta, nos confirma que el endpoint es
      // inyectable. errorHandler.js lo expone.
      errorHandler(err, req, res);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows));
  });
}

module.exports = { handleGet };
