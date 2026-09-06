const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/env');

const app = express();

// Middlewares
app.use(cors({
  origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(',').map((o) => o.trim()),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static test client
app.use(express.static(path.join(__dirname, '../public')));


module.exports = app;
