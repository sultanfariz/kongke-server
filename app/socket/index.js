const { Server } = require('socket.io');
const socketioJwt = require('socketio-jwt');

function loadSocket(httpServer) {
  const io = new Server(httpServer, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
    cors: {
      origin: '*',
    },
  });

  io.use(socketioJwt.authorize({
    secret: process.env.ACCESS_JWT_SECRET,
    handshake: true,
  }));

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join', (data) => {
      socket.join(data.room);
      console.log(`User ${data.username} joined room ${data.room}`);
      io.emit('chat', {
        user: "SYSTEM",
        text: `User ${data.username} joined room ${data.room}`,
        date: new Date().valueOf(),
      });
    });

    socket.on('chat', (data) => {
      console.log(data);
      if (data?.user && data?.text)
        io.emit('chat', {
          user: data.user,
          text: data.text,
          date: new Date().valueOf(),
        });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  }).on('authenticated', function (socket) {
    //this socket is authenticated, we are good to handle more events from it.
    console.log(`Hello! ${socket.decoded_token.name}`);
  });
}

module.exports = loadSocket;