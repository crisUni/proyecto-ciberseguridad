function cargarProductos(categoria) {
  fetch(`/api/v1/productos?categoria=${encodeURIComponent(categoria)}`)
    .then(res => res.json())
    .then(data => {
      const ul = document.getElementById('lista-productos');
      ul.innerHTML = '';
      data.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.nombre} - $${p.precio}`;
        ul.appendChild(li);
      });
    })
    .catch(err => {
      document.getElementById('productos').innerHTML +=
        `<p style="color:red">Error al cargar productos: ${err.message}</p>`;
    });
}

document.getElementById('buscar-btn').addEventListener('click', () => {
  const categoria = document.getElementById('categoria-input').value;
  cargarProductos(categoria);
});

cargarProductos('electronica');
