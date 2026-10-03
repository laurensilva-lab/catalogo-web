# Catálogo de ofertas

## Cambios simples (sin tocar código)
- **Título, subtítulo y WhatsApp:** `js/config.js`
- **Colores:** `css/estilos.css`, variables del principio
- **Prendas iniciales:** `productos.json` (nombre, talles, precio, `sold:true` si se agotó, foto en `fotos/`)
- **Fotos:** subir el .jpg a la carpeta `fotos/` y poner `"img":"fotos/nombre.jpg"` en `productos.json`

## Editar desde el celular
Abrir `tu-sitio.vercel.app/#admin`, poner la clave y tocar Editar. Cuando se guarda desde ahí, el catálogo pasa a leerse del almacenamiento (Blob) y `productos.json` deja de usarse.

## Archivos
- `index.html` estructura · `css/estilos.css` diseño · `js/app.js` lógica · `api/catalog.js` guardado (Vercel Blob)
- Variables en Vercel: `BLOB_READ_WRITE_TOKEN` (al conectar Blob) y `ADMIN_PASSWORD`
