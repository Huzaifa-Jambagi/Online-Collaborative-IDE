const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const cors = require('cors');

app.use(cors());

const socketMap = {};
const socketRoomMap = {}; // Track which room each socket is in

const getAllClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
    socketId,
    username: socketMap[socketId],
  }));
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ roomid, username }) => {
    if (!roomid || !username) {
      console.log('Invalid join attempt:', { roomid, username });
      return;
    }

    socketMap[socket.id] = username;
    socketRoomMap[socket.id] = roomid; // Track the room
    socket.join(roomid);

    const clients = getAllClients(roomid);

    // Notify all clients in the room about the new user
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("user-joined", {
        clients,
        username,
        socketId: socket.id
      });
    });

    console.log(`${username} joined room ${roomid}`);
  });

  socket.on("code-change", ({ roomid, code }) => {
    socket.to(roomid).emit("receive-code", { code });
    console.log(`[SERVER] code-change in room ${roomid}:`, code);
  });

  socket.on('disconnect', () => {
    const username = socketMap[socket.id];// Getting username from our tracking
    const roomid = socketRoomMap[socket.id]; // Get room from our tracking

    console.log('User disconnecting:', { username, socketId: socket.id, roomid });

    if (roomid && username) {
      console.log(`Emitting user-disconnected to room ${roomid}`);
      socket.to(roomid).emit('user-disconnected', {
        socketId: socket.id,
        username: username
      });
    }

    console.log('User disconnected:', username);
    delete socketMap[socket.id];// Clean up id tracking
    delete socketRoomMap[socket.id]; // Clean up room tracking
  });

  // Optional: Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});