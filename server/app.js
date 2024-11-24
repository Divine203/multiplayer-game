const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8080', // Client URL
        methods: ['GET', 'POST']
    }
});
const port = 3000;

const rooms = {};

app.use(express.static(path.join(__dirname, '../client/public')));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('ping', (startTime) => {
        socket.emit('pong', startTime);
    });    

    socket.on('player-create-room', ({ playerName }) => {
        let newRoomId = uuidv4();
        rooms[newRoomId] = {
            roomId: newRoomId,
            isGameStarted: false,
            players: [{
                id: socket.id,
                name: playerName,
                isHost: true,
                roomId: newRoomId
            }],
        };
        socket.join(newRoomId);
        socket.emit('created-room', { roomId: newRoomId });
        socket.emit('initialize-players', rooms[newRoomId]);
    });

    socket.on('player-pick-gun', ({ roomId, gunMapIndex, isToCurrentGun }) => {
        socket.to(roomId).emit('player-pick-gun', { playerId: socket.id, gunMapIndex: gunMapIndex, isToCurrentGun: isToCurrentGun });
    });

    socket.on('player-switch-gun', ({ roomId }) => {
        socket.to(roomId).emit('player-switch-gun', { playerId: socket.id });
    });

    socket.on('player-drop-gun', ({ roomId, replaceWithSecondary }) => {
        socket.to(roomId).emit('player-drop-gun', { playerId: socket.id, replaceWithSecondary: replaceWithSecondary });
    });

    socket.on('player-shoot', ({ roomId }) => {
        io.in(roomId).emit('player-shoot', { playerId: socket.id });
    });

    socket.on('player-throw', ({ roomId, throwAngle }) => {
        socket.to(roomId).emit('player-throw', { playerId: socket.id, throwAngle: throwAngle });
    });

    socket.on('player-throwing', ({ roomId }) => {
        socket.to(roomId).emit('player-throwing', { playerId: socket.id });
    });

    socket.on('check-and-join-room', ({ playerName, roomId }) => {
        if (roomId in rooms) {
            rooms[roomId].players.push({
                id: socket.id,
                name: playerName,
                isHost: false,
                roomId: roomId
            });
            socket.join(roomId);
            io.in(roomId).emit('player-joined', { roomId: roomId });
            io.in(roomId).emit('initialize-players', rooms[roomId]);
        }
    });
 
    socket.on('start-game', ({ roomId }) => {
        rooms[roomId].isGameStarted = true;
        io.in(roomId).emit('start-game', {});
    }); 

    socket.on('player-move', ({ position, roomId, playerState, jumpCount, idleCount }) => {
        io.in(roomId).emit('player-move', { playerId: socket.id, position: position, playerState: playerState, jumpCount: jumpCount, idleCount });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);

        for (const roomId in rooms) {
            const room = rooms[roomId];
            const playerIndex = room.players.findIndex(player => player.id === socket.id);

            if (playerIndex !== -1) {
                const disconnectedPlayer = room.players[playerIndex];
                room.players.splice(playerIndex, 1);

                io.in(roomId).emit('player-leave', {
                    playerId: disconnectedPlayer.id,
                    name: disconnectedPlayer.name
                });

                if (room.players.length === 0) {
                    delete rooms[roomId];
                }
                break;
            }
        }
    });

});

server.listen(port, () => {
    console.log(`server listening at port ${port}`);
});

