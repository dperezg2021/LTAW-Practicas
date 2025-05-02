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
            switch (msg.trim().toLowerCase()) { // Convertimos a minúsculas para hacerlo case-insensitive
                case '/help':
                    response = 'Comandos disponibles: /help, /list, /hello, /date, /happy, /gato, /dado, /fiesta, /amor';
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
                case '/happy':
                    response = '😊🎉 ¡Estoy feliz! ¡Vamos a celebrarlo! 🎊😄';
                    break;
                case '/gato':
                    const gatos = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
                    const gatoRandom = gatos[Math.floor(Math.random() * gatos.length)];
                    response = `${gatoRandom} ¡Miau! Aquí tienes un gato aleatorio: ${gatoRandom}`;
                    break;
                case '/dado':
                    const dado = Math.floor(Math.random() * 6) + 1;
                    response = `🎲 Tiraste el dado y salió: ${dado} ${'⚀⚁⚂⚃⚄⚅'.split('')[dado-1]}`;
                    break;
                case '/fiesta':
                    response = '🎊🎉🎈 ¡FIESTA! 🎈🎉🎊\n¡Todos a bailar! 💃🕺\n┏(＾0＾)┛┗(＾0＾)┓';
                    break;
                case '/amor':
                    const porcentajeAmor = Math.floor(Math.random() * 101);
                    response = `💖 El nivel de amor en este chat es del ${porcentajeAmor}% ${porcentajeAmor > 50 ? '❤️' : '💔'}`;
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