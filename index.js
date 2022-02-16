require('dotenv').config();
const { createServer } = require('http');
const app = require('./app/server');
const db = require('./database/models');
const loadSocket = require('./app/socket');

function normalizePort(port) {
  if (typeof port === 'string') {
    return parseInt(port);
  } else if (typeof port === 'undefined') {
    return 4000;
  }

  return port;
}

db.sequelize.sync();

const port = normalizePort(process.env.APP_PORT);

const httpServer = createServer(app);
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

loadSocket(httpServer);
