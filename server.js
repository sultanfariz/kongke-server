const { createServer } = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
httpServer.listen(5000, () => {
    console.log('Server is running on port 5000');
});