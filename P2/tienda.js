const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url'); // Necesario para parsear parámetros de URL

const PORT = 8002;   
const PUBLIC_DIR = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json' 
};

// Cargamos los datos de productos una vez al iniciar el servidor
let productosData = [];
try {
    const data = fs.readFileSync(path.join(PUBLIC_DIR, 'tienda.json'), 'utf8');
    productosData = JSON.parse(data).productos;
} catch (err) {
    console.error('Error al cargar datos.json:', err);
}

const server = http.createServer((req, res) => {
    // Endpoint de búsqueda
    if (req.url.startsWith('/api/search')) {
        const queryParams = url.parse(req.url, true).query;
        const searchTerm = (queryParams.q || '').toLowerCase().trim();
        
        // Filtramos productos que coincidan con el término de búsqueda
        const results = productosData.filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm)
        );
        
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Para desarrollo local
        });
        res.end(JSON.stringify(results));
        return;
    }
    
    // Si se solicita el recurso /ls
    if (req.url === '/ls') {
        // Leer el contenido del directorio público
        fs.readdir(PUBLIC_DIR, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al leer el directorio');
            } else {
                // Generar la página HTML dinámicamente
                const fileList = files.map(file => `<li><a href="/${file}">${file}</a></li>`).join('');
                const html = `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Listado de Archivos</title>
                    </head>
                    <body>
                        <h1>Listado de Archivos en ${PUBLIC_DIR}</h1>
                        <ul>${fileList}</ul>
                    </body>
                    </html>
                `;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            }
        });
    } else {
        // Manejar las solicitudes normales (archivos estáticos)
        let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
        let extname = path.extname(filePath);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // Si el archivo no existe, servir la página 404
                    fs.readFile(path.join(PUBLIC_DIR, '404.html'), (err404, data404) => {
                        if (err404) {
                            // Si no se puede leer el archivo 404.html, enviar un mensaje simple
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('Página no encontrada');
                        } else {
                            // Servir la página 404 personalizada
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end(data404);
                        }
                    });
                } else {
                    // Otros errores del servidor
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error interno del servidor');
                }
            } else {
                // Servir el archivo solicitado
                res.writeHead(200, { 'Content-Type': mimeTypes[extname] || 'application/octet-stream' });
                res.end(data);
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});