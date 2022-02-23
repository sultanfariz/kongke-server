const { Server } = require('socket.io');
const socketioJwt = require('socketio-jwt');
const { parseJwtPayload } = require('../helpers/jwt');

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
      console.log(`User ${data.user} joined room ${data.room}`);
      io.to(data.room)
        .emit('chat', {
          user: "SYSTEM",
          text: `User ${data.user} joined room ${data.room}`,
          date: new Date().valueOf(),
        });
    });

    socket.on('chat', (data) => {
      console.log(data);
      if (data?.user && data?.text)
        io.to(data.room)
          .emit('chat', {
            user: data.user,
            text: data.text,
            date: new Date().valueOf(),
          });
    });

    socket.on("disconnecting", () => {
      console.log(socket.rooms); // the Set contains at least the socket ID
      const rooms = Array.from(socket.rooms);
      const token = socket.handshake.query.token;
      const parsed = parseJwtPayload(token);
      const { username } = parseJwtPayload(token);
      console.log("parsed", parsed);
      console.log("username", username);
      io.to(rooms[1])
        .emit('chat', {
          user: "SYSTEM",
          text: `User ${username} left room ${rooms[1]}`,
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