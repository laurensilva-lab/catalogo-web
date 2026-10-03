# Coqueta Indumentaria - Catálogo web

## Cambios simples (sin tocar código)
- **Nombre, logo, textos, pasos de "Cómo comprar" y WhatsApp:** `js/config.js`
- **Logo:** reemplazar `img/logo.png` por otra imagen con el mismo nombre
- **Colores:** `css/estilos.css`, variables del principio (todo explicado ahí)
- **Prendas iniciales:** `productos.json` (nombre, talles, precio, `sold:true` si se agotó, foto en `fotos/`)

## Editar desde el celular
Tocar 5 veces el logo (o abrir `tu-sitio.vercel.app/#admin`), poner la clave y tocar Editar. Al guardar desde ahí, el catálogo se lee del almacenamiento (Blob) y `productos.json` deja de usarse.

## Archivos
- `index.html` estructura · `css/estilos.css` diseño · `js/config.js` datos · `js/app.js` lógica · `api/catalog.js` guardado (Vercel Blob)
- Variables en Vercel: `BLOB_READ_WRITE_TOKEN` (al conectar Blob) y `ADMIN_PASSWORD`
