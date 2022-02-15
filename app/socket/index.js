const { Server } = require('socket.io');

function loadSocket(httpServer) {
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
}

module.exports = loadSocket;