const { createServer } = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
httpServer.listen(5000, () => {
  console.log('Server is running on port 5000');
});

const io = new Server(httpServer, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chat', (data) => {
    console.log(data);
    io.emit('chat', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
