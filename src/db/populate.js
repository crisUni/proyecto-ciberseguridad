const db = require('./database');

const seedData = () => {
  db.serialize(() => {
    db.run('DELETE FROM productos');
    db.run('DELETE FROM usuarios');

    const stmtProductos = db.prepare('INSERT INTO productos (nombre, categoria, precio) VALUES (?, ?, ?)');
    stmtProductos.run('Laptop', 'electronica', 1250.00);
    stmtProductos.run('Monitor 67"', 'electronica', 67.67);
    stmtProductos.run('Silla', 'oficina', 185.00);
    stmtProductos.run('Escritorio', 'oficina', 210.00);
    stmtProductos.run('Teclado', 'electronica', 85.99);
    stmtProductos.finalize();

    const stmtUsuarios = db.prepare('INSERT INTO usuarios (username, password_hash, rol) VALUES (?, ?, ?)');
    
    stmtUsuarios.run('admin_ucab', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'administrador'); 
    stmtUsuarios.run('juancho', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'editor');
    stmtUsuarios.finalize();

    console.log('Base de datos poblada exitosamente con productos y usuarios.');
  });
};

seedData();

db.close();
