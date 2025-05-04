const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 3000;

const nicknames = {}; // Almacena los nicknames por socket.id
const typingUsers = new Set(); // Almacena los usuarios que están escribiendo

// CSP segura pero permisiva
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.socket.io; " +
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
        "img-src 'self' data: blob:; " +
        "font-src 'self' https://cdnjs.cloudflare.com; " +
        "connect-src 'self' ws://localhost:3000 wss://localhost:3000; " +
        "frame-src 'none'; object-src 'none'"
    );
    next();
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

const server = http.createServer(app);
const io = new Server(server);

let connectedUsers = 0;

app.use(express.static('public'));

// Emitir lista actual de nicknames a todos
function emitUserList() {
    const userList = Object.values(nicknames);
    io.emit('userList', userList);
}

io.on('connection', (socket) => {
    connectedUsers++;
    io.emit('updateUsers', connectedUsers);

    socket.on('setNickname', (nickname) => {
        nicknames[socket.id] = nickname;

        socket.emit('message', {
            type: 'system',
            text: `👋 Bienvenid@ ${nickname}!`
        });

        socket.broadcast.emit('message', {
            type: 'system',
            text: `🔔 ${nickname} se ha unido al chat`
        });

        emitUserList();
        io.emit('updateUsers', connectedUsers);
    });

    socket.on('typing', () => {
        const nickname = nicknames[socket.id];
        if (nickname && !typingUsers.has(nickname)) {
            typingUsers.add(nickname);
            socket.broadcast.emit('userTyping', nickname);
        }
    });

    socket.on('stopTyping', () => {
        const nickname = nicknames[socket.id];
        if (nickname && typingUsers.has(nickname)) {
            typingUsers.delete(nickname);
            socket.broadcast.emit('userStopTyping');
        }
    });

    socket.on('chatMessage', (msg) => {
        const nickname = nicknames[socket.id] || 'Anónimo';

        if (msg.startsWith('/')) {
            let response = '';
            switch (msg.trim().toLowerCase()) {
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
                    response = `🎲 Tiraste el dado y salió: ${dado} ${'⚀⚁⚂⚃⚄⚅'.split('')[dado - 1]}`;
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

            socket.emit('message', {
                type: 'system',
                text: response
            });
        } else {
            io.emit('message', {
                type: 'chat',
                sender: nickname,
                text: msg
            });
        }
    });

    socket.on('disconnect', () => {
        const nickname = nicknames[socket.id] || 'Un usuario';
        delete nicknames[socket.id];
        connectedUsers--;

        if (typingUsers.has(nickname)) {
            typingUsers.delete(nickname);
            io.emit('userStopTyping');
        }

        io.emit('message', {
            type: 'system',
            text: `🚪 ${nickname} ha salido del chat`
        });

        emitUserList();
        io.emit('updateUsers', connectedUsers);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
