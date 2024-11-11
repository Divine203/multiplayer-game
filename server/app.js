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
const players = {}; // Object to store players by socket ID

const rooms = {};
/**
 * {
 * roomId: string,
 * players: { id: string, name: string, isHost: boolean },
 * }
 */

app.use(express.static(path.join(__dirname, '../client/public')));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('player-create-room', (data) => {
        let newRoomId = uuidv4();
        console.log(data.playerName + ': ' + newRoomId);
        rooms[newRoomId] = { 
            roomId: newRoomId,
            players: [ { 
                id: data.playerId, 
                name: data.playerName, 
                isHost: true, 
                roomId: newRoomId
            } ], 
        };
        socket.join(newRoomId);
        socket.emit('created-room', { roomId: newRoomId });
        io.in(newRoomId).emit('initialize-players', rooms[newRoomId]);
    });

    // socket.on('joined-room', (data) => { 
      
    // });

    socket.on('check-and-join-room', (data) => {
        console.log('checking and joining room...');
        if(data.roomId in rooms) {
            console.log('yay the room exists!!');
            console.log(data);
            rooms[data.roomId].players.push({
                id: data.playerId,
                name: data.playerName,
                isHost: false, 
                roomId: data.roomId
            });
            socket.join(data.roomId);
            socket.emit('initialize-players', rooms[data.roomId]);
            io.in(data.roomId).emit('initialize-players', rooms[data.roomId]);
        }
    });


    socket.on('player-move', (data) => {
        players[socket.id] = data.position;
        socket.broadcast.emit('player-move', { playerId: socket.id, position: data.position }); // Broadcast to other players
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        // delete players[socket.id];

        // Find the room that contains this player
        // for (const room of rooms) {
        //     const playerIndex = room.players.findIndex(player => player.id === socket.id);
        //     if (playerIndex !== -1) {
        //         room.players.splice(playerIndex, 1); // Remove the player from the room's players list
        //         socket.to(room.roomId).emit('player-leave', { id: socket.id, roomId: room.roomId });

        //         // Remove the room if it's empty
        //         if (room.players.length === 0) {
        //             const roomIndex = rooms.findIndex(r => r.roomId === room.roomId);
        //             rooms.splice(roomIndex, 1);
        //         }
        //         break;
        //     }
        // }
    });
});


server.listen(port, () => {
    console.log(`server listening at port ${port}`);
});

