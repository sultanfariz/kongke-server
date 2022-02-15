const express = require('express');
const authRoute = require('./authRoute');

const app = express();

app.use('/auth', authRoute);

module.exports = app;