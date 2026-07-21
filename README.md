# Proyecto Ciberseguridad

## Run

```bash
npm install
npm start
```

Server starts on `http://localhost:8080`.

## Plan

### Fase 1 — Aplicación vulnerable (branch `versión-vulnerable`)

- [ ] Frontend — `public/index.html`
- [ ] Base de datos (schema + datos) — `src/db/database.js`, `src/db/populate.js`
- [ ] SQLi — `src/routes/productos.js`
- [ ] SSRF — `src/routes/proveedor.js`

### Fase 2 — Aplicación segura (branch `versión-asegurada`)

- [ ] Parche SQLi (consultas parametrizadas) — `src/routes/productos.js`
- [ ] Parche SSRF (validación de URL) — `src/helpers/validateUrl.js`, `src/routes/proveedor.js`
