const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
// const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8080', // Client URL
        methods: ['GET', 'POST']
    }
});
const port = 3000;
const players = {}; // Object to store players by socket ID

app.use(express.static(path.join(__dirname, '../client/public')));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // let newRoomId = uuidv4();
    // When a player joins, broadcast their join event to other players
    socket.on('player-join', (data) => { 
        console.log('joined');
        players[socket.id] = data.position;
        socket.emit('initialize-players', players);
        socket.broadcast.emit('player-join', { playerId: socket.id, position: data.position }); // Sends to everyone except the sender
    });

    // Listen for player movement data
    socket.on('player-move', (data) => {
        players[socket.id] = data.position;
        socket.broadcast.emit('player-move', { playerId: socket.id, position: data.position }); // Broadcast to other players
    });

    // Handle disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete players[socket.id];
        socket.broadcast.emit('player-leave', { id: socket.id });
    });
});


server.listen(port, () => {
    console.log(`server listening at port ${port}`);
});

