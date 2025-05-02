const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 3000;

// Configuración CSP segura pero permisiva para el chat
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.socket.io; " +
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " + // Permite Font Awesome
        "img-src 'self' data: blob:; " +
        "font-src 'self' https://cdnjs.cloudflare.com; " + // Permite fuentes de Font Awesome
        "connect-src 'self' ws://localhost:3000 wss://localhost:3000; " +
        "frame-src 'none'; " +
        "object-src 'none'"
    );
    next();
});
// Ignora favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());

const server = http.createServer(app);
const io = new Server(server);

let connectedUsers = 0;

// Sirve archivos estáticos desde /public
app.use(express.static('public'));

io.on('connection', (socket) => {
    connectedUsers++;

    socket.emit('message', '👋 Bienvenido al chat');
    socket.broadcast.emit('message', '🔔 Un nuevo usuario se ha conectado');

    socket.on('chatMessage', (msg) => {
        if (msg.startsWith('/')) {
            let response = '';
            switch (msg.trim()) {
                case '/help':
                    response = 'Comandos disponibles: /help, /list, /hello, /date';
                    break;
                case '/list':
                    response = `👥 Usuarios conectados: ${connectedUsers}`;
                    break;
                case '/hello':
                    response = '👋 ¡Hola!';
                    break;
                case '/date':
                    response = `📅 Fecha actual: ${new Date().toLocaleString()}`;
                    break;
                default:
                    response = '❌ Comando no reconocido. Usa /help';
            }
            socket.emit('message', response);
        } else {
            io.emit('message', msg);
        }
    });

    socket.on('disconnect', () => {
        connectedUsers--;
        io.emit('message', '🚪 Un usuario ha salido del chat');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});