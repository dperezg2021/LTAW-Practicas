const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8001;
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

// Cargamos los datos de productos al iniciar
let productosData = [];
try {
    const data = fs.readFileSync(path.join(PUBLIC_DIR, 'tienda.json'), 'utf8');
    productosData = JSON.parse(data).productos;
} catch (err) {
    console.error('Error al cargar tienda.json:', err);
}

const server = http.createServer((req, res) => {
    // Configuración CORS para desarrollo
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    // Endpoint de búsqueda
    if (req.url.startsWith('/api/search')) {
        const queryParams = url.parse(req.url, true).query;
        const searchTerm = (queryParams.q || '').toLowerCase().trim();
        
        const results = productosData.filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm)
        );
        
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            ...corsHeaders
        });
        res.end(JSON.stringify(results));
        return;
    }

    // Ruta especial para listar archivos (solo desarrollo)
    if (req.url === '/ls') {
        fs.readdir(PUBLIC_DIR, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al leer directorio');
            } else {
                const fileList = files.map(file => `<li><a href="/${file}">${file}</a></li>`).join('');
                const html = `
                    <!DOCTYPE html>
                    <html>
                    <head><title>Listado de Archivos</title></head>
                    <body>
                        <h1>Archivos en ${PUBLIC_DIR}</h1>
                        <ul>${fileList}</ul>
                    </body>
                    </html>
                `;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            }
        });
        return;
    }

    // Manejo especial para páginas de producto
    if (req.url.startsWith('/producto.html')) {
        const queryParams = url.parse(req.url, true).query;
        const productId = queryParams.id;
        
        const producto = productosData.find(p => p.id == productId);
        
        if (producto) {
            fs.readFile(path.join(PUBLIC_DIR, 'producto.html'), 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error al cargar producto.html');
                } else {
                    res.writeHead(200, { 
                        'Content-Type': 'text/html',
                        'Cache-Control': 'no-cache'
                    });
                    res.end(data);
                }
            });
            return;
        } else {
            serve404(res);
            return;
        }
    }

    // Manejo de archivos estáticos
    let filePath = path.join(
        PUBLIC_DIR,
        req.url === '/' ? 'index.html' : req.url.split('?')[0]
    );
    
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            serve404(res);
            return;
        }
        
        const extname = path.extname(filePath);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            } else {
                res.writeHead(200, { 
                    'Content-Type': mimeTypes[extname] || 'application/octet-stream',
                    'Cache-Control': 'no-cache'
                });
                res.end(data);
            }
        });
    });
});

// Función para servir página 404
function serve404(res) {
    const notFoundPath = path.join(PUBLIC_DIR, '404.html');
    fs.readFile(notFoundPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Página no encontrada');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});