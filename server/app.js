const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8080', // Client URL
        methods: ['GET', 'POST']
    }
});
const port = 3000;

app.use(express.static(path.join(__dirname, '../client/public')));
// app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a player joins, broadcast their join event to other players
    socket.on('player-join', (data) => {
        socket.broadcast.emit('player-join', data); // Sends to everyone except the sender
    });

    // Listen for player movement data
    socket.on('player-move', (data) => {
        socket.broadcast.emit('player-move', data); // Broadcast to other players
    });

    // Handle disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        socket.broadcast.emit('player-leave', { id: socket.id });
    });
});


server.listen(port, () => {
    console.log(`server listening at port ${port}`);
});

