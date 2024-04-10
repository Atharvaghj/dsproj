const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map();

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received: %s', message);
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'join') {
            const roomName = parsedMessage.room;
            if (!rooms.has(roomName)) {
                rooms.set(roomName, new Set());
            }
            rooms.get(roomName).add(ws);
        } else if (parsedMessage.type === 'move' || parsedMessage.type === 'reset') {
            const roomName = parsedMessage.room;
            if (rooms.has(roomName)) {
                // Broadcast move/reset message to all clients in the room
                rooms.get(roomName).forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            }
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
