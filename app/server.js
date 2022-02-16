const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use('/api/v1', routes);

module.exports = app;
